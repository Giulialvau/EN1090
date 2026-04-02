import { UnauthorizedException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import * as bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

import { AuthService } from "../../../src/auth/auth.service";
import { UsersService } from "../../../src/users/users.service";

describe("AuthService (unit)", () => {
  let service: AuthService;
  const usersService = {
    create: jest.fn(),
    findByEmail: jest.fn(),
    updateRefreshToken: jest.fn(),
  } as unknown as UsersService;
  const jwtService = {
    signAsync: jest.fn(),
  } as unknown as JwtService;
  const configService = {
    getOrThrow: jest.fn(),
  } as unknown as ConfigService;

  beforeEach(async () => {
    jest.resetAllMocks();
    (configService.getOrThrow as jest.Mock).mockImplementation((k: string) => {
      if (k === "JWT_ACCESS_SECRET") return "a";
      if (k === "JWT_REFRESH_SECRET") return "b";
      if (k === "JWT_ACCESS_EXPIRES_IN") return "15m";
      if (k === "JWT_REFRESH_EXPIRES_IN") return "7d";
      return "x";
    });

    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = moduleRef.get(AuthService);
  });

  it("validateUser: throws UnauthorizedException if user not found", async () => {
    (usersService.findByEmail as jest.Mock).mockResolvedValue(null);
    await expect(service.validateUser("a@b.com", "pw")).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it("validateUser: throws UnauthorizedException if password mismatch", async () => {
    (usersService.findByEmail as jest.Mock).mockResolvedValue({
      id: "u1",
      email: "a@b.com",
      role: Role.USER,
      passwordHash: "hash",
    });
    (jest.spyOn(bcrypt, "compare") as any).mockResolvedValue(false);

    await expect(service.validateUser("a@b.com", "pw")).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it("login: returns tokens and updates refresh token", async () => {
    (usersService.findByEmail as jest.Mock).mockResolvedValue({
      id: "u1",
      email: "admin@example.com",
      role: Role.ADMIN,
      passwordHash: "hash",
    });
    (jest.spyOn(bcrypt, "compare") as any).mockResolvedValue(true);
    (jwtService.signAsync as jest.Mock)
      .mockResolvedValueOnce("access")
      .mockResolvedValueOnce("refresh");

    const res = await service.login({
      email: "admin@example.com",
      password: "admin1234",
    } as any);

    expect(res).toEqual(
      expect.objectContaining({
        access_token: "access",
        refresh_token: "refresh",
      }),
    );
    expect(usersService.updateRefreshToken).toHaveBeenCalledWith(
      "u1",
      "refresh",
    );
  });

  it("refresh: throws UnauthorizedException if refresh hash missing", async () => {
    (usersService.findByEmail as jest.Mock).mockResolvedValue({
      id: "u1",
      email: "admin@example.com",
      role: Role.ADMIN,
      refreshTokenHash: null,
    });
    await expect(
      service.refresh("u1", "admin@example.com", Role.ADMIN, "rt"),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});

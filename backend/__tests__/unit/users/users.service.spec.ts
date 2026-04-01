import { ConflictException, NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import * as bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

import { UsersService } from "../../../src/users/users.service";
import { PrismaService } from "../../../src/prisma/prisma.service";
import { createPrismaMock } from "../../mocks/prisma.mock";

describe("UsersService (unit)", () => {
  let service: UsersService;
  const prisma = createPrismaMock() as unknown as PrismaService;

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [UsersService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = moduleRef.get(UsersService);
  });

  it("create: throws ConflictException if email exists", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: "u1" });
    await expect(
      service.create({
        email: "a@b.com",
        password: "password1",
        firstName: "A",
        lastName: "B",
        role: Role.USER,
      } as any),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it("create: hashes password and calls prisma.user.create", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (jest.spyOn(bcrypt, "hash") as any).mockResolvedValue("HASH");
    (prisma.user.create as jest.Mock).mockResolvedValue({
      id: "u1",
      email: "a@b.com",
      firstName: "A",
      lastName: "B",
      role: Role.USER,
      passwordHash: "HASH",
    });

    const res = await service.create({
      email: "a@b.com",
      password: "password1",
      firstName: "A",
      lastName: "B",
      role: Role.USER,
    } as any);

    expect(prisma.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        email: "a@b.com",
        passwordHash: "HASH",
      }),
    });
    expect((res as any).passwordHash).toBeUndefined();
  });

  it("findOne: throws NotFoundException when missing", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(service.findOne("nope")).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("update: updates passwordHash when password provided", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({ id: "u1" });
    (jest.spyOn(bcrypt, "hash") as any).mockResolvedValue("HASH2");
    (prisma.user.update as jest.Mock).mockResolvedValue({
      id: "u1",
      email: "x@y.com",
      firstName: "X",
      lastName: "Y",
      role: Role.USER,
      passwordHash: "HASH2",
    });
    await service.update("u1", { password: "password2" } as any);
    expect(prisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "u1" },
        data: expect.objectContaining({ passwordHash: "HASH2" }),
      }),
    );
  });

  it("remove: calls prisma.user.delete", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({ id: "u1" });
    (prisma.user.delete as jest.Mock).mockResolvedValue({ id: "u1" });
    const res = await service.remove("u1");
    expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: "u1" } });
    expect(res).toEqual({ deleted: true });
  });
});

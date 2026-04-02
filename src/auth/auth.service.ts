import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

import { UsersService } from "../users/users.service";

import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { JwtPayload } from "./types/jwt-payload.type";

@Injectable()
export class AuthService {
  private readonly logger = new Logger("AUDIT");

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const user = await this.usersService.create({ ...dto, role: Role.USER });
    const tokens = await this.signTokens(
      user.id,
      user.email,
      user.role,
      user.aziendaId,
    );
    await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);

    this.logger.log(
      JSON.stringify({
        level: "info",
        timestamp: new Date().toISOString(),
        action: "register",
        userId: user.id,
        userEmail: user.email,
      }),
    );

    return {
      user,
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password);

    const tokens = await this.signTokens(
      user.id,
      user.email,
      user.role,
      user.aziendaId,
    );
    await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);

    this.logger.log(
      JSON.stringify({
        level: "info",
        timestamp: new Date().toISOString(),
        action: "login",
        userId: user.id,
        userEmail: user.email,
      }),
    );

    return {
      user,
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
    };
  }

  async validateUser(email: string, password: string) {
    const normalizedEmail = email.trim();
    const user = await this.usersService.findByEmail(normalizedEmail);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return user;
  }

  async refresh(
    userId: string,
    email: string,
    role: Role,
    refreshToken: string,
  ) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException("Access denied");
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshTokenHash,
    );
    if (!refreshTokenMatches || user.id !== userId) {
      throw new UnauthorizedException("Access denied");
    }

    const tokens = await this.signTokens(
      user.id,
      user.email,
      user.role,
      user.aziendaId,
    );
    await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);

    this.logger.log(
      JSON.stringify({
        level: "info",
        timestamp: new Date().toISOString(),
        action: "refresh",
        userId: user.id,
        userEmail: user.email,
        role,
      }),
    );

    return {
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
    };
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
    this.logger.log(
      JSON.stringify({
        level: "info",
        timestamp: new Date().toISOString(),
        action: "logout",
        userId,
      }),
    );
    return { loggedOut: true };
  }

  private async signTokens(
    userId: string,
    email: string,
    role: Role,
    aziendaId?: string | null,
  ) {
    const payload: JwtPayload = { sub: userId, email, role, aziendaId };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>("JWT_ACCESS_SECRET"),
        expiresIn: this.configService.getOrThrow<string>(
          "JWT_ACCESS_EXPIRES_IN",
        ),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>("JWT_REFRESH_SECRET"),
        expiresIn: this.configService.getOrThrow<string>(
          "JWT_REFRESH_EXPIRES_IN",
        ),
      }),
    ]);

    return { accessToken, refreshToken };
  }
}

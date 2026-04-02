import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { Role } from "@prisma/client";

import { JwtPayload } from "../types/jwt-payload.type";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh",
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>("JWT_REFRESH_SECRET"),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload) {
    const authHeader = req.get("authorization") ?? "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (!token) {
      throw new UnauthorizedException("Missing refresh token");
    }

    const { sub, email, role } = payload;
    if (typeof sub !== "string" || sub.length === 0) {
      throw new UnauthorizedException("Invalid token");
    }
    if (typeof email !== "string" || email.length === 0) {
      throw new UnauthorizedException("Invalid token");
    }
    if (!Object.values(Role).includes(role)) {
      throw new UnauthorizedException("Invalid token");
    }

    return { ...payload, refreshToken: token };
  }
}

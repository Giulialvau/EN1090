import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Role } from "@prisma/client";

import { JwtPayload } from "../types/jwt-payload.type";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>("JWT_ACCESS_SECRET"),
    });
  }

  validate(payload: JwtPayload) {
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

    return payload;
  }
}

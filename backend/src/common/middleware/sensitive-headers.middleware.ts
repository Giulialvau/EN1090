import { Injectable, NestMiddleware } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";

@Injectable()
export class SensitiveHeadersMiddleware implements NestMiddleware {
  use(_req: Request, res: Response, next: NextFunction): void {
    // Riduce fingerprinting / caching accidentale di risposte contenenti token.
    res.setHeader("cache-control", "no-store");
    res.setHeader("pragma", "no-cache");
    next();
  }
}

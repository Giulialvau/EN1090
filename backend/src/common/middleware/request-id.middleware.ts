import { randomUUID } from "crypto";

import { Injectable, NestMiddleware } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";

declare global {
  // eslint-disable-next-line no-var
  var __en1090RequestCounter: number | undefined;
}

function fallbackRequestId(): string {
  global.__en1090RequestCounter = (global.__en1090RequestCounter ?? 0) + 1;
  return `req_${Date.now()}_${global.__en1090RequestCounter}`;
}

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const incoming = req.header("x-request-id")?.trim();
    const requestId = incoming && incoming.length <= 128 ? incoming : undefined;

    const id =
      requestId ??
      (typeof randomUUID === "function" ? randomUUID() : fallbackRequestId());
    req.requestId = id;
    res.setHeader("x-request-id", id);

    next();
  }
}

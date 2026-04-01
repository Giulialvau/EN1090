import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger("HTTP");

  use(req: Request, res: Response, next: NextFunction): void {
    const startedAt = Date.now();
    const { method, originalUrl } = req;

    res.on("finish", () => {
      const duration = Date.now() - startedAt;
      const requestId = req.requestId;

      const log = {
        level:
          res.statusCode >= 500
            ? "error"
            : res.statusCode >= 400
              ? "warn"
              : "info",
        timestamp: new Date().toISOString(),
        requestId,
        method,
        url: originalUrl,
        statusCode: res.statusCode,
        durationMs: duration,
      };

      if (log.level === "error") this.logger.error(JSON.stringify(log));
      else if (log.level === "warn") this.logger.warn(JSON.stringify(log));
      else this.logger.log(JSON.stringify(log));
    });

    next();
  }
}

import { ExecutionContext, Injectable } from "@nestjs/common";
import { ThrottlerGuard } from "@nestjs/throttler";
import type { Request } from "express";

@Injectable()
export class SecurityThrottlerGuard extends ThrottlerGuard {
  protected async shouldSkip(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const url = req.originalUrl ?? req.url ?? "";

    if (url.startsWith("/health")) {
      return true;
    }

    return super.shouldSkip(context);
  }
}

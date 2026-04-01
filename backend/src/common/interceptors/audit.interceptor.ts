import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, tap } from "rxjs";
import type { Request, Response } from "express";

type RequestUser = { sub?: string; email?: string; role?: string };
type RequestWithAudit = Request & { user?: RequestUser };

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger("AUDIT");

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const req = http.getRequest<RequestWithAudit>();
    const res = http.getResponse<Response>();

    const method = req?.method as string | undefined;
    const url = (req?.originalUrl ?? req?.url) as string | undefined;
    const requestId = req?.requestId as string | undefined;
    const user = req?.user;

    return next.handle().pipe(
      tap(() => {
        const statusCode = res?.statusCode as number | undefined;
        if (!method || !url || !statusCode) return;

        const isWrite =
          method.toUpperCase() === "POST" ||
          method.toUpperCase() === "PUT" ||
          method.toUpperCase() === "PATCH" ||
          method.toUpperCase() === "DELETE";

        if (!isWrite) return;

        // Evita doppio logging per /auth (gestito in AuthService per login/logout/refresh/register).
        if (url.startsWith("/auth")) return;

        // Logga solo operazioni riuscite (evita rumore su 4xx/5xx già coperti dal filtro errori).
        if (statusCode >= 400) return;

        this.logger.log(
          JSON.stringify({
            level: "info",
            timestamp: new Date().toISOString(),
            requestId,
            action: "resource_write",
            method,
            url,
            userId: user?.sub,
            userEmail: user?.email,
            userRole: user?.role,
            statusCode,
          }),
        );
      }),
    );
  }
}

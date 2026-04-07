import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";
import type { NextFunction, Request, Response } from "express";

import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { AuditInterceptor } from "./common/interceptors/audit.interceptor";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";
import { SanitizeInputPipe } from "./common/pipes/sanitize-input.pipe";
import { PrismaService } from "./prisma/prisma.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = new Logger("Bootstrap");
  app.useLogger(logger);
  const configService = app.get(ConfigService);

  // Helmet: CSP “strict” per API, esclusione per Swagger UI (/docs) per non rompere gli asset inline.
  app.use((req: Request, res: Response, next: NextFunction) => {
    const url = req.originalUrl ?? req.url ?? "";
    const isDocs = url.startsWith("/docs");

    const mw = helmet({
      contentSecurityPolicy: isDocs
        ? false
        : {
            useDefaults: true,
            directives: {
              defaultSrc: ["'self'"],
              baseUri: ["'self'"],
              frameAncestors: ["'none'"],
              objectSrc: ["'none'"],
              imgSrc: ["'self'", "data:"],
              styleSrc: ["'self'"],
              scriptSrc: ["'self'"],
              connectSrc: ["'self'"],
              upgradeInsecureRequests: [],
            },
          },
      frameguard: { action: "deny" },
      hsts: { maxAge: 15552000, includeSubDomains: true, preload: true },
      noSniff: true,
      xssFilter: true,
    });

    return mw(req, res, next);
  });

  app.useGlobalPipes(
    new SanitizeInputPipe(),
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new AuditInterceptor(), new ResponseInterceptor());

  const swaggerConfig = new DocumentBuilder()
    .setTitle("EN1090 Backend API")
    .setDescription(
      "API NestJS per workflow EN1090: commesse, materiali, documenti, checklist, audit, non conformità, WPS/WPQR, tracciabilità.",
    )
    .setVersion("1.0.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        in: "header",
      },
      "bearer",
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("docs", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
    },
  });

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  const frontendOrigin = configService.get<string>(
    "FRONTEND_ORIGIN",
    "http://localhost:3000",
  );
  const corsOrigins = frontendOrigin
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
  app.enableCors({
    origin: corsOrigins.length ? corsOrigins : "http://localhost:3000",
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  });

  const port = process.env.PORT || configService.get<number>("PORT") || 3001;
  await app.listen(port, "0.0.0.0");
  logger.log(`API listening on 0.0.0.0:${port}`);
  logger.log(`Swagger: /docs`);
}

void bootstrap();

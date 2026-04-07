import { Logger, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import type { INestApplication } from "@nestjs/common";

import "../../e2e/test-env";

import { AppModule } from "../../../src/app.module";
import { HttpExceptionFilter } from "../../../src/common/filters/http-exception.filter";
import { ResponseInterceptor } from "../../../src/common/interceptors/response.interceptor";
import { PrismaService } from "../../../src/prisma/prisma.service";
import { createE2EPrismaMock } from "../mocks/prisma.e2e-mock";

export async function createE2EApp(): Promise<INestApplication> {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(PrismaService)
    .useValue(createE2EPrismaMock())
    .compile();

  const app = moduleFixture.createNestApplication({ bufferLogs: true });
  app.useLogger(new Logger("E2E"));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.init();
  return app;
}

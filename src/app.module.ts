import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { ThrottlerModule } from "@nestjs/throttler";

import { AttrezzatureModule } from "./attrezzature/attrezzature.module";
import { AuditModule } from "./audit/audit.module";
import { AuthModule } from "./auth/auth.module";
import { ChecklistModule } from "./checklist/checklist.module";
import { CommesseModule } from "./commesse/commesse.module";
import { SecurityThrottlerGuard } from "./common/guards/security-throttler.guard";
import { LoggerMiddleware } from "./common/middleware/logger.middleware";
import { RequestIdMiddleware } from "./common/middleware/request-id.middleware";
import { SensitiveHeadersMiddleware } from "./common/middleware/sensitive-headers.middleware";
import { validate } from "./config/env.validation";
import { DocumentiModule } from "./documenti/documenti.module";
import { En1090Module } from "./en1090/en1090.module";
import { HealthController } from "./health/health.controller";
import { MaterialiModule } from "./materiali/materiali.module";
import { NonConformitaModule } from "./non-conformita/non-conformita.module";
import { PianiControlloModule } from "./piani-controllo/piani-controllo.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ReportModule } from "./report/report.module";
import { TracciabilitaModule } from "./tracciabilita/tracciabilita.module";
import { UsersModule } from "./users/users.module";
import { WpqrModule } from "./wpqr/wpqr.module";
import { WpsModule } from "./wps/wps.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // In produzione (Railway) le variabili arrivano dall'ambiente.
      // In locale continuiamo a supportare `.env`.
      envFilePath: process.env.NODE_ENV === "production" ? undefined : ".env",
      validate,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 15 * 60 * 1000,
        limit: 100,
      },
    ]),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    UsersModule,
    CommesseModule,
    MaterialiModule,
    DocumentiModule,
    En1090Module,
    ChecklistModule,
    WpsModule,
    WpqrModule,
    AttrezzatureModule,
    NonConformitaModule,
    AuditModule,
    PianiControlloModule,
    TracciabilitaModule,
    ReportModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: SecurityThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(RequestIdMiddleware, SensitiveHeadersMiddleware, LoggerMiddleware)
      .forRoutes("*");
  }
}

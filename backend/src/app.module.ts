import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AttrezzatureModule } from './attrezzature/attrezzature.module';
import { AuditModule } from './audit/audit.module';
import { AuthModule } from './auth/auth.module';
import { ChecklistModule } from './checklist/checklist.module';
import { CommesseModule } from './commesse/commesse.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { validate } from './config/env.validation';
import { DocumentiModule } from './documenti/documenti.module';
import { HealthController } from './health/health.controller';
import { MaterialiModule } from './materiali/materiali.module';
import { NonConformitaModule } from './non-conformita/non-conformita.module';
import { PianiControlloModule } from './piani-controllo/piani-controllo.module';
import { PrismaModule } from './prisma/prisma.module';
import { QualificheModule } from './qualifiche/qualifiche.module';
import { ReportModule } from './report/report.module';
import { TracciabilitaModule } from './tracciabilita/tracciabilita.module';
import { UsersModule } from './users/users.module';
import { WpqrModule } from './wpqr/wpqr.module';
import { WpsModule } from './wps/wps.module';

import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CommesseModule } from './commesse/commesse.module';
import { MaterialiModule } from './materiali/materiali.module';
import { DocumentiModule } from './documenti/documenti.module';
import { ChecklistModule } from './checklist/checklist.module';
import { WpsModule } from './wps/wps.module';
import { WpqrModule } from './wpqr/wpqr.module';
import { QualificheModule } from './qualifiche/qualifiche.module';
import { AttrezzatureModule } from './attrezzature/attrezzature.module';
import { NonConformitaModule } from './non-conformita/non-conformita.module';
import { AuditModule } from './audit/audit.module';
import { PianiControlloModule } from './piani-controllo/piani-controllo.module';
import { TracciabilitaModule } from './tracciabilita/tracciabilita.module';
import { ReportModule } from './report/report.module';

import { En1090Module } from './en1090/en1090.module'; // <--- IMPORT CORRETTO

import { HealthController } from './health/health.controller';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { validate } from './config/env.validation';

import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CommesseModule } from './commesse/commesse.module';
import { MaterialiModule } from './materiali/materiali.module';
import { DocumentiModule } from './documenti/documenti.module';
import { ChecklistModule } from './checklist/checklist.module';
import { WpsModule } from './wps/wps.module';
import { WpqrModule } from './wpqr/wpqr.module';
import { QualificheModule } from './qualifiche/qualifiche.module';
import { AttrezzatureModule } from './attrezzature/attrezzature.module';
import { NonConformitaModule } from './non-conformita/non-conformita.module';
import { AuditModule } from './audit/audit.module';
import { PianiControlloModule } from './piani-controllo/piani-controllo.module';
import { TracciabilitaModule } from './tracciabilita/tracciabilita.module';
import { ReportModule } from './report/report.module';

import { En1090Module } from './en1090/en1090.module'; // <--- IMPORT CORRETTO

import { HealthController } from './health/health.controller';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { validate } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'production' ? undefined : '.env',
      validate,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CommesseModule,
    MaterialiModule,
    DocumentiModule,
    ChecklistModule,
    WpsModule,
    WpqrModule,
    QualificheModule,
    AttrezzatureModule,
    NonConformitaModule,
    AuditModule,
    PianiControlloModule,
    TracciabilitaModule,
    ReportModule,

    En1090Module, // <--- AGGIUNTO QUI
  ],
  controllers: [HealthController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}




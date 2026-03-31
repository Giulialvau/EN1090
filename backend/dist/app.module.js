"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const attrezzature_module_1 = require("./attrezzature/attrezzature.module");
const audit_module_1 = require("./audit/audit.module");
const auth_module_1 = require("./auth/auth.module");
const checklist_module_1 = require("./checklist/checklist.module");
const commesse_module_1 = require("./commesse/commesse.module");
const logger_middleware_1 = require("./common/middleware/logger.middleware");
const env_validation_1 = require("./config/env.validation");
const documenti_module_1 = require("./documenti/documenti.module");
const health_controller_1 = require("./health/health.controller");
const materiali_module_1 = require("./materiali/materiali.module");
const non_conformita_module_1 = require("./non-conformita/non-conformita.module");
const piani_controllo_module_1 = require("./piani-controllo/piani-controllo.module");
const prisma_module_1 = require("./prisma/prisma.module");
const qualifiche_module_1 = require("./qualifiche/qualifiche.module");
const report_module_1 = require("./report/report.module");
const tracciabilita_module_1 = require("./tracciabilita/tracciabilita.module");
const users_module_1 = require("./users/users.module");
const wpqr_module_1 = require("./wpqr/wpqr.module");
const wps_module_1 = require("./wps/wps.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(logger_middleware_1.LoggerMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
                validate: env_validation_1.validate,
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            commesse_module_1.CommesseModule,
            materiali_module_1.MaterialiModule,
            documenti_module_1.DocumentiModule,
            checklist_module_1.ChecklistModule,
            wps_module_1.WpsModule,
            wpqr_module_1.WpqrModule,
            qualifiche_module_1.QualificheModule,
            attrezzature_module_1.AttrezzatureModule,
            non_conformita_module_1.NonConformitaModule,
            audit_module_1.AuditModule,
            piani_controllo_module_1.PianiControlloModule,
            tracciabilita_module_1.TracciabilitaModule,
            report_module_1.ReportModule,
        ],
        controllers: [health_controller_1.HealthController],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
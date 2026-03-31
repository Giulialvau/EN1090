"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommesseModule = void 0;
const common_1 = require("@nestjs/common");
const checklist_module_1 = require("../checklist/checklist.module");
const materiali_module_1 = require("../materiali/materiali.module");
const tracciabilita_module_1 = require("../tracciabilita/tracciabilita.module");
const wps_module_1 = require("../wps/wps.module");
const wpqr_module_1 = require("../wpqr/wpqr.module");
const non_conformita_module_1 = require("../non-conformita/non-conformita.module");
const audit_module_1 = require("../audit/audit.module");
const piani_controllo_module_1 = require("../piani-controllo/piani-controllo.module");
const documenti_module_1 = require("../documenti/documenti.module");
const commesse_controller_1 = require("./commesse.controller");
const commesse_service_1 = require("./commesse.service");
let CommesseModule = class CommesseModule {
};
exports.CommesseModule = CommesseModule;
exports.CommesseModule = CommesseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            materiali_module_1.MaterialiModule,
            checklist_module_1.ChecklistModule,
            tracciabilita_module_1.TracciabilitaModule,
            wps_module_1.WpsModule,
            wpqr_module_1.WpqrModule,
            non_conformita_module_1.NonConformitaModule,
            audit_module_1.AuditModule,
            piani_controllo_module_1.PianiControlloModule,
            documenti_module_1.DocumentiModule,
        ],
        controllers: [commesse_controller_1.CommesseController],
        providers: [commesse_service_1.CommesseService],
        exports: [commesse_service_1.CommesseService],
    })
], CommesseModule);
//# sourceMappingURL=commesse.module.js.map
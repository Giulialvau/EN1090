"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QualificheModule = void 0;
const common_1 = require("@nestjs/common");
const qualifiche_controller_1 = require("./qualifiche.controller");
const qualifiche_service_1 = require("./qualifiche.service");
let QualificheModule = class QualificheModule {
};
exports.QualificheModule = QualificheModule;
exports.QualificheModule = QualificheModule = __decorate([
    (0, common_1.Module)({
        controllers: [qualifiche_controller_1.QualificheController],
        providers: [qualifiche_service_1.QualificheService],
        exports: [qualifiche_service_1.QualificheService],
    })
], QualificheModule);
//# sourceMappingURL=qualifiche.module.js.map
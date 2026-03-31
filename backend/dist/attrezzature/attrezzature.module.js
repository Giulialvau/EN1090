"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttrezzatureModule = void 0;
const common_1 = require("@nestjs/common");
const attrezzature_controller_1 = require("./attrezzature.controller");
const attrezzature_service_1 = require("./attrezzature.service");
let AttrezzatureModule = class AttrezzatureModule {
};
exports.AttrezzatureModule = AttrezzatureModule;
exports.AttrezzatureModule = AttrezzatureModule = __decorate([
    (0, common_1.Module)({
        controllers: [attrezzature_controller_1.AttrezzatureController],
        providers: [attrezzature_service_1.AttrezzatureService],
        exports: [attrezzature_service_1.AttrezzatureService],
    })
], AttrezzatureModule);
//# sourceMappingURL=attrezzature.module.js.map
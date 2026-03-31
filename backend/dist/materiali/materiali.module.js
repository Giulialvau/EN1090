"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaterialiModule = void 0;
const common_1 = require("@nestjs/common");
const materiali_controller_1 = require("./materiali.controller");
const materiali_service_1 = require("./materiali.service");
let MaterialiModule = class MaterialiModule {
};
exports.MaterialiModule = MaterialiModule;
exports.MaterialiModule = MaterialiModule = __decorate([
    (0, common_1.Module)({
        controllers: [materiali_controller_1.MaterialiController],
        providers: [materiali_service_1.MaterialiService],
        exports: [materiali_service_1.MaterialiService],
    })
], MaterialiModule);
//# sourceMappingURL=materiali.module.js.map
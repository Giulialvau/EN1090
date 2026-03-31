"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WpqrModule = void 0;
const common_1 = require("@nestjs/common");
const wpqr_controller_1 = require("./wpqr.controller");
const wpqr_service_1 = require("./wpqr.service");
let WpqrModule = class WpqrModule {
};
exports.WpqrModule = WpqrModule;
exports.WpqrModule = WpqrModule = __decorate([
    (0, common_1.Module)({
        controllers: [wpqr_controller_1.WpqrController],
        providers: [wpqr_service_1.WpqrService],
        exports: [wpqr_service_1.WpqrService],
    })
], WpqrModule);
//# sourceMappingURL=wpqr.module.js.map
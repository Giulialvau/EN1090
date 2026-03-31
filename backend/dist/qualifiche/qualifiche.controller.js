"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QualificheController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const create_qualifica_dto_1 = require("./dto/create-qualifica.dto");
const update_qualifica_dto_1 = require("./dto/update-qualifica.dto");
const qualifiche_service_1 = require("./qualifiche.service");
let QualificheController = class QualificheController {
    constructor(qualificheService) {
        this.qualificheService = qualificheService;
    }
    create(dto) {
        return this.qualificheService.create(dto);
    }
    findAll() {
        return this.qualificheService.findAll();
    }
    findOne(id) {
        return this.qualificheService.findOne(id);
    }
    update(id, dto) {
        return this.qualificheService.update(id, dto);
    }
    remove(id) {
        return this.qualificheService.remove(id);
    }
};
exports.QualificheController = QualificheController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_qualifica_dto_1.CreateQualificaDto]),
    __metadata("design:returntype", void 0)
], QualificheController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], QualificheController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QualificheController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_qualifica_dto_1.UpdateQualificaDto]),
    __metadata("design:returntype", void 0)
], QualificheController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QualificheController.prototype, "remove", null);
exports.QualificheController = QualificheController = __decorate([
    (0, common_1.Controller)('qualifiche'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [qualifiche_service_1.QualificheService])
], QualificheController);
//# sourceMappingURL=qualifiche.controller.js.map
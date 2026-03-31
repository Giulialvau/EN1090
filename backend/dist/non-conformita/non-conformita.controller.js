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
exports.NonConformitaController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const create_non_conformita_dto_1 = require("./dto/create-non-conformita.dto");
const update_non_conformita_dto_1 = require("./dto/update-non-conformita.dto");
const non_conformita_service_1 = require("./non-conformita.service");
let NonConformitaController = class NonConformitaController {
    constructor(nonConformitaService) {
        this.nonConformitaService = nonConformitaService;
    }
    create(dto) {
        return this.nonConformitaService.create(dto);
    }
    findAll() {
        return this.nonConformitaService.findAll();
    }
    findOne(id) {
        return this.nonConformitaService.findOne(id);
    }
    update(id, dto) {
        return this.nonConformitaService.update(id, dto);
    }
    remove(id) {
        return this.nonConformitaService.remove(id);
    }
};
exports.NonConformitaController = NonConformitaController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_non_conformita_dto_1.CreateNonConformitaDto]),
    __metadata("design:returntype", void 0)
], NonConformitaController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NonConformitaController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NonConformitaController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_non_conformita_dto_1.UpdateNonConformitaDto]),
    __metadata("design:returntype", void 0)
], NonConformitaController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NonConformitaController.prototype, "remove", null);
exports.NonConformitaController = NonConformitaController = __decorate([
    (0, common_1.Controller)('non-conformita'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [non_conformita_service_1.NonConformitaService])
], NonConformitaController);
//# sourceMappingURL=non-conformita.controller.js.map
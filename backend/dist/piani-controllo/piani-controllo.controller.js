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
exports.PianiControlloController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const create_piano_controllo_dto_1 = require("./dto/create-piano-controllo.dto");
const update_piano_controllo_dto_1 = require("./dto/update-piano-controllo.dto");
const piani_controllo_service_1 = require("./piani-controllo.service");
let PianiControlloController = class PianiControlloController {
    constructor(pianiControlloService) {
        this.pianiControlloService = pianiControlloService;
    }
    create(dto) {
        return this.pianiControlloService.create(dto);
    }
    findAll() {
        return this.pianiControlloService.findAll();
    }
    findOne(id) {
        return this.pianiControlloService.findOne(id);
    }
    update(id, dto) {
        return this.pianiControlloService.update(id, dto);
    }
    remove(id) {
        return this.pianiControlloService.remove(id);
    }
};
exports.PianiControlloController = PianiControlloController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_piano_controllo_dto_1.CreatePianoControlloDto]),
    __metadata("design:returntype", void 0)
], PianiControlloController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PianiControlloController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PianiControlloController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_piano_controllo_dto_1.UpdatePianoControlloDto]),
    __metadata("design:returntype", void 0)
], PianiControlloController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PianiControlloController.prototype, "remove", null);
exports.PianiControlloController = PianiControlloController = __decorate([
    (0, common_1.Controller)('piani-controllo'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [piani_controllo_service_1.PianiControlloService])
], PianiControlloController);
//# sourceMappingURL=piani-controllo.controller.js.map
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateNonConformitaDto = void 0;
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class CreateNonConformitaDto {
}
exports.CreateNonConformitaDto = CreateNonConformitaDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateNonConformitaDto.prototype, "commessaId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNonConformitaDto.prototype, "titolo", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNonConformitaDto.prototype, "descrizione", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.NcTipo),
    __metadata("design:type", String)
], CreateNonConformitaDto.prototype, "tipo", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.NcGravita),
    __metadata("design:type", String)
], CreateNonConformitaDto.prototype, "gravita", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.NcStato),
    __metadata("design:type", String)
], CreateNonConformitaDto.prototype, "stato", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNonConformitaDto.prototype, "azioniCorrettive", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreateNonConformitaDto.prototype, "dataApertura", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreateNonConformitaDto.prototype, "dataChiusura", void 0);
//# sourceMappingURL=create-non-conformita.dto.js.map
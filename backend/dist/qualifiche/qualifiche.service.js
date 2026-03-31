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
exports.QualificheService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let QualificheService = class QualificheService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(dto) {
        return this.prisma.qualifica.create({ data: dto });
    }
    findAll() {
        return this.prisma.qualifica.findMany({ orderBy: { nome: 'asc' } });
    }
    async findOne(id) {
        const row = await this.prisma.qualifica.findUnique({ where: { id } });
        if (!row) {
            throw new common_1.NotFoundException(`Qualifica ${id} non trovata`);
        }
        return row;
    }
    async update(id, dto) {
        await this.ensureExists(id);
        return this.prisma.qualifica.update({ where: { id }, data: dto });
    }
    async remove(id) {
        await this.ensureExists(id);
        await this.prisma.qualifica.delete({ where: { id } });
        return { deleted: true, id };
    }
    async ensureExists(id) {
        const q = await this.prisma.qualifica.findUnique({ where: { id } });
        if (!q) {
            throw new common_1.NotFoundException(`Qualifica ${id} non trovata`);
        }
    }
};
exports.QualificheService = QualificheService;
exports.QualificheService = QualificheService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QualificheService);
//# sourceMappingURL=qualifiche.service.js.map
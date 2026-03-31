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
exports.AttrezzatureService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AttrezzatureService = class AttrezzatureService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const dup = await this.prisma.attrezzatura.findUnique({
            where: { matricola: dto.matricola },
        });
        if (dup) {
            throw new common_1.ConflictException(`Matricola ${dto.matricola} già registrata`);
        }
        return this.prisma.attrezzatura.create({ data: dto });
    }
    findAll() {
        return this.prisma.attrezzatura.findMany({ orderBy: { nome: 'asc' } });
    }
    async findOne(id) {
        const row = await this.prisma.attrezzatura.findUnique({ where: { id } });
        if (!row) {
            throw new common_1.NotFoundException(`Attrezzatura ${id} non trovata`);
        }
        return row;
    }
    async update(id, dto) {
        await this.ensureExists(id);
        if (dto.matricola) {
            const clash = await this.prisma.attrezzatura.findFirst({
                where: { matricola: dto.matricola, NOT: { id } },
            });
            if (clash) {
                throw new common_1.ConflictException(`Matricola ${dto.matricola} già in uso`);
            }
        }
        return this.prisma.attrezzatura.update({ where: { id }, data: dto });
    }
    async remove(id) {
        await this.ensureExists(id);
        await this.prisma.attrezzatura.delete({ where: { id } });
        return { deleted: true, id };
    }
    async ensureExists(id) {
        const a = await this.prisma.attrezzatura.findUnique({ where: { id } });
        if (!a) {
            throw new common_1.NotFoundException(`Attrezzatura ${id} non trovata`);
        }
    }
};
exports.AttrezzatureService = AttrezzatureService;
exports.AttrezzatureService = AttrezzatureService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AttrezzatureService);
//# sourceMappingURL=attrezzature.service.js.map
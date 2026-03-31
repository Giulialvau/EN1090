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
exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AuditService = class AuditService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        await this.ensureCommessa(dto.commessaId);
        return this.prisma.audit.create({ data: dto });
    }
    findAll() {
        return this.prisma.audit.findMany({
            orderBy: { data: 'desc' },
            include: {
                commessa: { select: { id: true, codice: true, cliente: true } },
            },
        });
    }
    async findByCommessa(commessaId) {
        await this.ensureCommessa(commessaId);
        return this.prisma.audit.findMany({
            where: { commessaId },
            orderBy: { data: 'desc' },
            include: {
                commessa: { select: { id: true, codice: true, cliente: true } },
            },
        });
    }
    async findOne(id) {
        const row = await this.prisma.audit.findUnique({
            where: { id },
            include: { commessa: true },
        });
        if (!row) {
            throw new common_1.NotFoundException(`Audit ${id} non trovato`);
        }
        return row;
    }
    async update(id, dto) {
        await this.ensureExists(id);
        if (dto.commessaId) {
            await this.ensureCommessa(dto.commessaId);
        }
        return this.prisma.audit.update({ where: { id }, data: dto });
    }
    async remove(id) {
        await this.ensureExists(id);
        await this.prisma.audit.delete({ where: { id } });
        return { deleted: true, id };
    }
    async ensureCommessa(commessaId) {
        const c = await this.prisma.commessa.findUnique({ where: { id: commessaId } });
        if (!c) {
            throw new common_1.NotFoundException(`Commessa ${commessaId} non trovata`);
        }
    }
    async ensureExists(id) {
        const a = await this.prisma.audit.findUnique({ where: { id } });
        if (!a) {
            throw new common_1.NotFoundException(`Audit ${id} non trovato`);
        }
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditService);
//# sourceMappingURL=audit.service.js.map
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
exports.ChecklistService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const checklistInclude = {
    commessa: { select: { id: true, codice: true, cliente: true } },
};
let ChecklistService = class ChecklistService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        if (dto.commessaId) {
            await this.ensureCommessa(dto.commessaId);
        }
        const elementi = dto.elementi ?? [];
        return this.prisma.checklist.create({
            data: {
                titolo: dto.titolo,
                categoria: dto.categoria,
                fase: dto.fase,
                dataCompilazione: dto.dataCompilazione,
                esito: dto.esito,
                note: dto.note,
                operatore: dto.operatore,
                allegati: dto.allegati === undefined
                    ? undefined
                    : dto.allegati,
                stato: dto.stato,
                elementi: elementi,
                commessaId: dto.commessaId,
            },
            include: checklistInclude,
        });
    }
    findAll() {
        return this.prisma.checklist.findMany({
            orderBy: [{ dataCompilazione: 'desc' }, { titolo: 'asc' }],
            include: checklistInclude,
        });
    }
    async findByCommessa(commessaId) {
        await this.ensureCommessa(commessaId);
        return this.prisma.checklist.findMany({
            where: { commessaId },
            orderBy: [{ dataCompilazione: 'desc' }, { titolo: 'asc' }],
            include: checklistInclude,
        });
    }
    async findOne(id) {
        const row = await this.prisma.checklist.findUnique({
            where: { id },
            include: { commessa: true },
        });
        if (!row) {
            throw new common_1.NotFoundException(`Checklist ${id} non trovata`);
        }
        return row;
    }
    async update(id, dto) {
        await this.ensureExists(id);
        if (dto.commessaId) {
            await this.ensureCommessa(dto.commessaId);
        }
        const data = {
            titolo: dto.titolo,
            categoria: dto.categoria,
            fase: dto.fase,
            dataCompilazione: dto.dataCompilazione,
            esito: dto.esito,
            note: dto.note,
            operatore: dto.operatore,
            stato: dto.stato,
        };
        if (dto.allegati !== undefined) {
            data.allegati = dto.allegati;
        }
        if (dto.commessaId !== undefined) {
            data.commessa = dto.commessaId
                ? { connect: { id: dto.commessaId } }
                : { disconnect: true };
        }
        if (dto.elementi !== undefined) {
            data.elementi = dto.elementi;
        }
        return this.prisma.checklist.update({
            where: { id },
            data,
            include: checklistInclude,
        });
    }
    async remove(id) {
        await this.ensureExists(id);
        await this.prisma.checklist.delete({ where: { id } });
        return { deleted: true, id };
    }
    async ensureCommessa(commessaId) {
        const c = await this.prisma.commessa.findUnique({ where: { id: commessaId } });
        if (!c) {
            throw new common_1.NotFoundException(`Commessa ${commessaId} non trovata`);
        }
    }
    async ensureExists(id) {
        const x = await this.prisma.checklist.findUnique({ where: { id } });
        if (!x) {
            throw new common_1.NotFoundException(`Checklist ${id} non trovata`);
        }
    }
};
exports.ChecklistService = ChecklistService;
exports.ChecklistService = ChecklistService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChecklistService);
//# sourceMappingURL=checklist.service.js.map
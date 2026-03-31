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
exports.WpsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const wpsInclude = {
    commessa: { select: { id: true, codice: true, cliente: true } },
    materiale: {
        select: { id: true, codice: true, descrizione: true, lotto: true, norma: true },
    },
    wpqr: { orderBy: { codice: 'asc' } },
};
let WpsService = class WpsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const exists = await this.prisma.wps.findUnique({ where: { codice: dto.codice } });
        if (exists) {
            throw new common_1.ConflictException(`WPS con codice ${dto.codice} già esistente`);
        }
        if (dto.commessaId) {
            await this.ensureCommessa(dto.commessaId);
        }
        await this.validateMaterialeForWps(dto.materialeId, dto.commessaId);
        return this.prisma.wps.create({
            data: {
                codice: dto.codice,
                descrizione: dto.descrizione,
                processo: dto.processo,
                spessore: dto.spessore,
                materialeBase: dto.materialeBase,
                scadenza: dto.scadenza,
                note: dto.note,
                commessaId: dto.commessaId,
                materialeId: dto.materialeId,
            },
            include: wpsInclude,
        });
    }
    findAll() {
        return this.prisma.wps.findMany({
            orderBy: { codice: 'asc' },
            include: wpsInclude,
        });
    }
    async findByCommessa(commessaId) {
        await this.ensureCommessa(commessaId);
        return this.prisma.wps.findMany({
            where: { commessaId },
            orderBy: { codice: 'asc' },
            include: wpsInclude,
        });
    }
    async findOne(id) {
        const row = await this.prisma.wps.findUnique({
            where: { id },
            include: wpsInclude,
        });
        if (!row) {
            throw new common_1.NotFoundException(`WPS ${id} non trovato`);
        }
        return row;
    }
    async update(id, dto) {
        await this.ensureExists(id);
        if (dto.codice) {
            const clash = await this.prisma.wps.findFirst({
                where: { codice: dto.codice, NOT: { id } },
            });
            if (clash) {
                throw new common_1.ConflictException(`Codice WPS ${dto.codice} già in uso`);
            }
        }
        if (dto.commessaId) {
            await this.ensureCommessa(dto.commessaId);
        }
        const current = await this.prisma.wps.findUnique({ where: { id } });
        if (!current) {
            throw new common_1.NotFoundException(`WPS ${id} non trovato`);
        }
        const cur = current;
        const nextMaterialeId = dto.materialeId !== undefined
            ? dto.materialeId || undefined
            : cur.materialeId ?? undefined;
        const nextCommessaId = dto.commessaId !== undefined
            ? dto.commessaId || undefined
            : current.commessaId ?? undefined;
        await this.validateMaterialeForWps(nextMaterialeId, nextCommessaId);
        const data = {};
        if (dto.codice !== undefined)
            data.codice = dto.codice;
        if (dto.descrizione !== undefined)
            data.descrizione = dto.descrizione;
        if (dto.processo !== undefined)
            data.processo = dto.processo;
        if (dto.spessore !== undefined)
            data.spessore = dto.spessore;
        if (dto.materialeBase !== undefined)
            data.materialeBase = dto.materialeBase;
        if (dto.scadenza !== undefined)
            data.scadenza = dto.scadenza;
        if (dto.note !== undefined)
            data.note = dto.note;
        if (dto.commessaId !== undefined) {
            data.commessaId = dto.commessaId || null;
        }
        if (dto.materialeId !== undefined) {
            data.materialeId = dto.materialeId || null;
        }
        return this.prisma.wps.update({
            where: { id },
            data,
            include: wpsInclude,
        });
    }
    async remove(id) {
        await this.ensureExists(id);
        try {
            await this.prisma.wps.delete({ where: { id } });
        }
        catch (e) {
            const pe = e;
            if (pe?.code === 'P2003' || pe?.code === 'P2014') {
                throw new common_1.BadRequestException('Impossibile eliminare: esistono WPQR collegati a questa WPS. Rimuovi prima i record WPQR.');
            }
            throw e;
        }
        return { deleted: true, id };
    }
    async ensureCommessa(commessaId) {
        const c = await this.prisma.commessa.findUnique({ where: { id: commessaId } });
        if (!c) {
            throw new common_1.NotFoundException(`Commessa ${commessaId} non trovata`);
        }
    }
    async ensureExists(id) {
        const w = await this.prisma.wps.findUnique({ where: { id } });
        if (!w) {
            throw new common_1.NotFoundException(`WPS ${id} non trovato`);
        }
    }
    async validateMaterialeForWps(materialeId, commessaId) {
        if (!materialeId)
            return;
        const m = await this.prisma.materiale.findUnique({ where: { id: materialeId } });
        if (!m) {
            throw new common_1.NotFoundException(`Materiale ${materialeId} non trovato`);
        }
        if (commessaId && m.commessaId !== commessaId) {
            throw new common_1.BadRequestException('Il materiale selezionato non appartiene alla commessa della WPS.');
        }
    }
};
exports.WpsService = WpsService;
exports.WpsService = WpsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WpsService);
//# sourceMappingURL=wps.service.js.map
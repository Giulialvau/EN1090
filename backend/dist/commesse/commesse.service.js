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
var CommesseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommesseService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
function normalizeQueryString(v) {
    if (v == null)
        return undefined;
    if (typeof v === 'string') {
        const t = v.trim();
        return t.length ? t : undefined;
    }
    if (Array.isArray(v)) {
        const first = v[0];
        if (typeof first === 'string') {
            const t = first.trim();
            return t.length ? t : undefined;
        }
    }
    return undefined;
}
function parseDateBoundStart(s) {
    if (typeof s !== 'string' || !s.trim())
        return undefined;
    const d = new Date(s);
    return Number.isNaN(d.getTime()) ? undefined : d;
}
function parseDateBoundEndInclusive(s) {
    if (typeof s !== 'string' || !s.trim())
        return undefined;
    const d = new Date(s);
    if (Number.isNaN(d.getTime()))
        return undefined;
    d.setHours(23, 59, 59, 999);
    return d;
}
const commessaIncludeFull = {
    materiali: true,
    documenti: true,
    pianiControllo: true,
    nonConformita: true,
    audits: true,
    wps: true,
    wpqr: true,
    checklists: true,
    tracciabilita: {
        include: {
            materiale: { select: { id: true, codice: true, lotto: true, descrizione: true } },
        },
    },
};
let CommesseService = CommesseService_1 = class CommesseService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(CommesseService_1.name);
    }
    async create(dto) {
        const exists = await this.prisma.commessa.findUnique({
            where: { codice: dto.codice },
        });
        if (exists) {
            throw new common_1.ConflictException(`Commessa con codice ${dto.codice} già esistente`);
        }
        return this.prisma.commessa.create({
            data: {
                codice: dto.codice,
                titolo: dto.titolo,
                cliente: dto.cliente,
                descrizione: dto.descrizione,
                responsabile: dto.responsabile,
                luogo: dto.luogo,
                note: dto.note,
                dataInizio: dto.dataInizio,
                dataFine: dto.dataFine,
                stato: dto.stato,
            },
        });
    }
    buildCommessaWhere(query) {
        const where = {};
        if (query?.stato) {
            where.stato = query.stato;
        }
        const cliente = normalizeQueryString(query?.cliente);
        if (cliente) {
            where.cliente = {
                contains: cliente,
                mode: 'insensitive',
            };
        }
        const dataInizioDa = parseDateBoundStart(query?.dataInizioDa);
        const dataInizioA = parseDateBoundEndInclusive(query?.dataInizioA);
        if (dataInizioDa || dataInizioA) {
            const di = {};
            if (dataInizioDa)
                di.gte = dataInizioDa;
            if (dataInizioA)
                di.lte = dataInizioA;
            where.dataInizio = di;
        }
        return where;
    }
    async findAll(query) {
        try {
            return await this.prisma.commessa.findMany({
                where: this.buildCommessaWhere(query),
                orderBy: { codice: 'asc' },
            });
        }
        catch (err) {
            this.logger.error('commesse.findAll: operazione fallita', err instanceof Error ? err.stack : err);
            return [];
        }
    }
    async findOne(id) {
        const row = await this.prisma.commessa.findUnique({
            where: { id },
            include: commessaIncludeFull,
        });
        if (!row) {
            throw new common_1.NotFoundException(`Commessa ${id} non trovata`);
        }
        return row;
    }
    async update(id, dto) {
        await this.ensureExists(id);
        if (dto.codice) {
            const clash = await this.prisma.commessa.findFirst({
                where: { codice: dto.codice, NOT: { id } },
            });
            if (clash) {
                throw new common_1.ConflictException(`Codice commessa ${dto.codice} già in uso`);
            }
        }
        return this.prisma.commessa.update({
            where: { id },
            data: dto,
        });
    }
    async remove(id) {
        await this.ensureExists(id);
        await this.prisma.commessa.delete({ where: { id } });
        return { deleted: true, id };
    }
    async ensureExists(id) {
        const c = await this.prisma.commessa.findUnique({ where: { id } });
        if (!c) {
            throw new common_1.NotFoundException(`Commessa ${id} non trovata`);
        }
    }
};
exports.CommesseService = CommesseService;
exports.CommesseService = CommesseService = CommesseService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CommesseService);
//# sourceMappingURL=commesse.service.js.map
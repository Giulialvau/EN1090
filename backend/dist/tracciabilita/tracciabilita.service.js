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
exports.TracciabilitaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const tracciabilitaInclude = {
    materiale: {
        select: {
            id: true,
            codice: true,
            descrizione: true,
            lotto: true,
            certificato31: true,
        },
    },
    commessa: { select: { id: true, codice: true, cliente: true } },
};
let TracciabilitaService = class TracciabilitaService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        await this.ensureMaterialeCommessaCoherent(dto.materialeId, dto.commessaId);
        return this.prisma.tracciabilita.create({
            data: {
                materialeId: dto.materialeId,
                commessaId: dto.commessaId,
                posizione: dto.posizione,
                quantita: new client_1.Prisma.Decimal(dto.quantita),
                descrizioneComponente: dto.descrizioneComponente,
                riferimentoDisegno: dto.riferimentoDisegno,
                note: dto.note,
            },
            include: tracciabilitaInclude,
        });
    }
    findAll() {
        return this.prisma.tracciabilita.findMany({
            orderBy: [{ posizione: 'asc' }, { id: 'asc' }],
            include: tracciabilitaInclude,
        });
    }
    async findByCommessa(commessaId) {
        await this.ensureCommessaExists(commessaId);
        return this.prisma.tracciabilita.findMany({
            where: { commessaId },
            orderBy: [{ posizione: 'asc' }, { id: 'asc' }],
            include: tracciabilitaInclude,
        });
    }
    async findOne(id) {
        const row = await this.prisma.tracciabilita.findUnique({
            where: { id },
            include: tracciabilitaInclude,
        });
        if (!row) {
            throw new common_1.NotFoundException(`Tracciabilità ${id} non trovata`);
        }
        return row;
    }
    async update(id, dto) {
        await this.ensureExists(id);
        const mid = dto.materialeId;
        const cid = dto.commessaId;
        if (mid !== undefined || cid !== undefined) {
            const current = await this.prisma.tracciabilita.findUnique({
                where: { id },
            });
            if (!current) {
                throw new common_1.NotFoundException(`Tracciabilità ${id} non trovata`);
            }
            await this.ensureMaterialeCommessaCoherent(mid ?? current.materialeId, cid ?? current.commessaId);
        }
        const data = {
            posizione: dto.posizione,
            descrizioneComponente: dto.descrizioneComponente,
            riferimentoDisegno: dto.riferimentoDisegno,
            note: dto.note,
        };
        if (dto.materialeId !== undefined) {
            data.materiale = { connect: { id: dto.materialeId } };
        }
        if (dto.commessaId !== undefined) {
            data.commessa = { connect: { id: dto.commessaId } };
        }
        if (dto.quantita !== undefined) {
            data.quantita = new client_1.Prisma.Decimal(dto.quantita);
        }
        return this.prisma.tracciabilita.update({
            where: { id },
            data,
            include: tracciabilitaInclude,
        });
    }
    async remove(id) {
        await this.ensureExists(id);
        await this.prisma.tracciabilita.delete({ where: { id } });
        return { deleted: true, id };
    }
    async ensureCommessaExists(commessaId) {
        const c = await this.prisma.commessa.findUnique({ where: { id: commessaId } });
        if (!c) {
            throw new common_1.NotFoundException(`Commessa ${commessaId} non trovata`);
        }
    }
    async ensureMaterialeCommessaCoherent(materialeId, commessaId) {
        const m = await this.prisma.materiale.findUnique({
            where: { id: materialeId },
        });
        if (!m) {
            throw new common_1.NotFoundException(`Materiale ${materialeId} non trovato`);
        }
        const c = await this.prisma.commessa.findUnique({
            where: { id: commessaId },
        });
        if (!c) {
            throw new common_1.NotFoundException(`Commessa ${commessaId} non trovata`);
        }
        if (m.commessaId !== commessaId) {
            throw new common_1.BadRequestException('Il materiale non appartiene alla commessa indicata: tracciabilità incoerente');
        }
    }
    async ensureExists(id) {
        const t = await this.prisma.tracciabilita.findUnique({ where: { id } });
        if (!t) {
            throw new common_1.NotFoundException(`Tracciabilità ${id} non trovata`);
        }
    }
};
exports.TracciabilitaService = TracciabilitaService;
exports.TracciabilitaService = TracciabilitaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TracciabilitaService);
//# sourceMappingURL=tracciabilita.service.js.map
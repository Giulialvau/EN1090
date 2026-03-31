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
exports.WpqrService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const wpqrInclude = {
    wps: {
        select: {
            id: true,
            codice: true,
            processo: true,
            descrizione: true,
        },
    },
    commessa: { select: { id: true, codice: true, cliente: true } },
    qualifica: { select: { id: true, nome: true, ruolo: true, scadenza: true } },
};
let WpqrService = class WpqrService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const wps = await this.prisma.wps.findUnique({ where: { id: dto.wpsId } });
        if (!wps) {
            throw new common_1.NotFoundException(`WPS ${dto.wpsId} non trovato`);
        }
        if (dto.commessaId) {
            await this.ensureCommessa(dto.commessaId);
            if (wps.commessaId && wps.commessaId !== dto.commessaId) {
                throw new common_1.BadRequestException('La WPS selezionata è associata a un’altra commessa.');
            }
        }
        if (dto.qualificaId) {
            await this.ensureQualifica(dto.qualificaId);
        }
        return this.prisma.wpqr.create({
            data: {
                codice: dto.codice,
                saldatore: dto.saldatore,
                wpsId: dto.wpsId,
                dataQualifica: dto.dataQualifica,
                scadenza: dto.scadenza,
                note: dto.note,
                commessaId: dto.commessaId,
                qualificaId: dto.qualificaId,
            },
            include: wpqrInclude,
        });
    }
    findAll() {
        return this.prisma.wpqr.findMany({
            orderBy: [{ dataQualifica: 'desc' }, { codice: 'asc' }],
            include: wpqrInclude,
        });
    }
    async findByCommessa(commessaId) {
        await this.ensureCommessa(commessaId);
        return this.prisma.wpqr.findMany({
            where: { commessaId },
            orderBy: [{ dataQualifica: 'desc' }, { codice: 'asc' }],
            include: wpqrInclude,
        });
    }
    async findOne(id) {
        const row = await this.prisma.wpqr.findUnique({
            where: { id },
            include: wpqrInclude,
        });
        if (!row) {
            throw new common_1.NotFoundException(`WPQR ${id} non trovato`);
        }
        return row;
    }
    async update(id, dto) {
        const current = await this.prisma.wpqr.findUnique({ where: { id } });
        if (!current) {
            throw new common_1.NotFoundException(`WPQR ${id} non trovato`);
        }
        const nextWpsId = dto.wpsId ?? current.wpsId;
        const nextCommessa = dto.commessaId !== undefined ? dto.commessaId : current.commessaId;
        if (dto.wpsId) {
            const wps = await this.prisma.wps.findUnique({ where: { id: dto.wpsId } });
            if (!wps) {
                throw new common_1.NotFoundException(`WPS ${dto.wpsId} non trovato`);
            }
            if (nextCommessa && wps.commessaId && wps.commessaId !== nextCommessa) {
                throw new common_1.BadRequestException('La WPS selezionata è associata a un’altra commessa.');
            }
        }
        else {
            const wps = await this.prisma.wps.findUnique({ where: { id: nextWpsId } });
            if (wps && nextCommessa && wps.commessaId && wps.commessaId !== nextCommessa) {
                throw new common_1.BadRequestException('La WPS corrente è associata a un’altra commessa.');
            }
        }
        if (dto.commessaId) {
            await this.ensureCommessa(dto.commessaId);
        }
        if (dto.qualificaId) {
            await this.ensureQualifica(dto.qualificaId);
        }
        const data = {};
        if (dto.codice !== undefined)
            data.codice = dto.codice;
        if (dto.saldatore !== undefined)
            data.saldatore = dto.saldatore;
        if (dto.wpsId !== undefined)
            data.wpsId = dto.wpsId;
        if (dto.dataQualifica !== undefined)
            data.dataQualifica = dto.dataQualifica;
        if (dto.scadenza !== undefined)
            data.scadenza = dto.scadenza;
        if (dto.note !== undefined)
            data.note = dto.note;
        if (dto.commessaId !== undefined)
            data.commessaId = dto.commessaId;
        if (dto.qualificaId !== undefined)
            data.qualificaId = dto.qualificaId;
        return this.prisma.wpqr.update({
            where: { id },
            data,
            include: wpqrInclude,
        });
    }
    async remove(id) {
        await this.ensureExists(id);
        await this.prisma.wpqr.delete({ where: { id } });
        return { deleted: true, id };
    }
    async ensureCommessa(commessaId) {
        const c = await this.prisma.commessa.findUnique({ where: { id: commessaId } });
        if (!c) {
            throw new common_1.NotFoundException(`Commessa ${commessaId} non trovata`);
        }
    }
    async ensureQualifica(qualificaId) {
        const q = await this.prisma.qualifica.findUnique({ where: { id: qualificaId } });
        if (!q) {
            throw new common_1.NotFoundException(`Qualifica ${qualificaId} non trovata`);
        }
    }
    async ensureExists(id) {
        const x = await this.prisma.wpqr.findUnique({ where: { id } });
        if (!x) {
            throw new common_1.NotFoundException(`WPQR ${id} non trovato`);
        }
    }
};
exports.WpqrService = WpqrService;
exports.WpqrService = WpqrService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WpqrService);
//# sourceMappingURL=wpqr.service.js.map
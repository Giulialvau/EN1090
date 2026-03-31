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
exports.MaterialiService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const materialeInclude = {
    commessa: { select: { id: true, codice: true, cliente: true } },
    certificatoDocumento: {
        select: { id: true, nome: true, tipo: true, versione: true, percorsoFile: true },
    },
};
let MaterialiService = class MaterialiService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        await this.ensureCommessa(dto.commessaId);
        await this.validateCertificatoDocumento(dto.commessaId, dto.certificatoDocumentoId);
        const dup = await this.prisma.materiale.findUnique({
            where: {
                commessaId_codice: { commessaId: dto.commessaId, codice: dto.codice },
            },
        });
        if (dup) {
            throw new common_1.ConflictException(`Materiale ${dto.codice} già presente per questa commessa`);
        }
        return this.prisma.materiale.create({
            data: dto,
            include: materialeInclude,
        });
    }
    findAll() {
        return this.prisma.materiale.findMany({
            orderBy: [{ commessaId: 'asc' }, { codice: 'asc' }],
            include: materialeInclude,
        });
    }
    async findByCommessa(commessaId) {
        await this.ensureCommessa(commessaId);
        return this.prisma.materiale.findMany({
            where: { commessaId },
            orderBy: { codice: 'asc' },
            include: materialeInclude,
        });
    }
    async findOne(id) {
        const row = await this.prisma.materiale.findUnique({
            where: { id },
            include: {
                ...materialeInclude,
                tracciabilita: true,
            },
        });
        if (!row) {
            throw new common_1.NotFoundException(`Materiale ${id} non trovato`);
        }
        return row;
    }
    async update(id, dto) {
        const current = await this.prisma.materiale.findUnique({ where: { id } });
        if (!current) {
            throw new common_1.NotFoundException(`Materiale ${id} non trovato`);
        }
        const targetCommessaId = dto.commessaId ?? current.commessaId;
        const prevCertId = current
            .certificatoDocumentoId;
        await this.validateCertificatoDocumento(targetCommessaId, dto.certificatoDocumentoId !== undefined ? dto.certificatoDocumentoId : prevCertId);
        if (dto.commessaId && dto.codice) {
            const clash = await this.prisma.materiale.findFirst({
                where: {
                    commessaId: dto.commessaId,
                    codice: dto.codice,
                    NOT: { id },
                },
            });
            if (clash) {
                throw new common_1.ConflictException('Codice materiale duplicato per la commessa');
            }
        }
        else if (dto.codice && dto.codice !== current.codice) {
            const clash = await this.prisma.materiale.findFirst({
                where: {
                    commessaId: current.commessaId,
                    codice: dto.codice,
                    NOT: { id },
                },
            });
            if (clash) {
                throw new common_1.ConflictException('Codice materiale duplicato per la commessa');
            }
        }
        return this.prisma.materiale.update({
            where: { id },
            data: dto,
            include: materialeInclude,
        });
    }
    async remove(id) {
        await this.ensureExists(id);
        await this.prisma.materiale.delete({ where: { id } });
        return { deleted: true, id };
    }
    async validateCertificatoDocumento(commessaId, documentoId) {
        if (!documentoId)
            return;
        const doc = await this.prisma.documento.findUnique({
            where: { id: documentoId },
        });
        if (!doc) {
            throw new common_1.NotFoundException(`Documento certificato ${documentoId} non trovato`);
        }
        if (doc.commessaId !== commessaId) {
            throw new common_1.BadRequestException('Il documento certificato deve appartenere alla stessa commessa del materiale');
        }
    }
    async ensureCommessa(commessaId) {
        const c = await this.prisma.commessa.findUnique({ where: { id: commessaId } });
        if (!c) {
            throw new common_1.NotFoundException(`Commessa ${commessaId} non trovata`);
        }
    }
    async ensureExists(id) {
        const m = await this.prisma.materiale.findUnique({ where: { id } });
        if (!m) {
            throw new common_1.NotFoundException(`Materiale ${id} non trovato`);
        }
    }
};
exports.MaterialiService = MaterialiService;
exports.MaterialiService = MaterialiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MaterialiService);
//# sourceMappingURL=materiali.service.js.map
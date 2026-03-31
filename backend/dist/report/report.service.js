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
exports.ReportService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let ReportService = class ReportService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async dashboard() {
        const [commesseTotal, commesseAttive, materialiTotal, documentiTotal, ncAperte, ncChiuse, auditTotal, auditNonConformi, wpsTotal, wpqrInScadenza,] = await Promise.all([
            this.prisma.commessa.count(),
            this.prisma.commessa.count({
                where: { stato: { in: ['IN_CORSO', 'SOSPESA'] } },
            }),
            this.prisma.materiale.count(),
            this.prisma.documento.count(),
            this.prisma.nonConformita.count({
                where: { stato: { not: client_1.NcStato.CHIUSA } },
            }),
            this.prisma.nonConformita.count({
                where: { stato: client_1.NcStato.CHIUSA },
            }),
            this.prisma.audit.count(),
            this.prisma.audit.count({ where: { esito: 'NON_CONFORME' } }),
            this.prisma.wps.count(),
            this.prisma.wpqr.count({
                where: {
                    scadenza: {
                        lte: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                        gte: new Date(),
                    },
                },
            }),
        ]);
        const ultimeNc = await this.prisma.nonConformita.findMany({
            take: 5,
            orderBy: { dataApertura: 'desc' },
            include: {
                commessa: { select: { codice: true, cliente: true } },
            },
        });
        const ultimiAudit = await this.prisma.audit.findMany({
            take: 5,
            orderBy: { data: 'desc' },
            include: {
                commessa: { select: { codice: true, cliente: true } },
            },
        });
        return {
            generatedAt: new Date().toISOString(),
            riepilogo: {
                commesseTotal,
                commesseAttive,
                materialiTotal,
                documentiTotal,
                nonConformitaAperte: ncAperte,
                nonConformitaChiuse: ncChiuse,
                auditTotal,
                auditNonConformi,
                wpsTotal,
                wpqrInScadenza90gg: wpqrInScadenza,
            },
            ultimeNonConformita: ultimeNc,
            ultimiAudit,
        };
    }
    async commessaReport(commessaId) {
        const commessa = await this.prisma.commessa.findUnique({
            where: { id: commessaId },
            include: {
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
                        materiale: { select: { codice: true, lotto: true } },
                    },
                },
            },
        });
        if (!commessa) {
            throw new common_1.NotFoundException(`Commessa ${commessaId} non trovata`);
        }
        const aggregati = await this.prisma.nonConformita.groupBy({
            by: ['stato'],
            where: { commessaId },
            _count: { _all: true },
        });
        return {
            commessa,
            nonConformitaPerStato: aggregati,
        };
    }
    async materialiPerFornitore() {
        const rows = await this.prisma.materiale.groupBy({
            by: ['fornitore'],
            where: {
                fornitore: { not: null },
            },
            _count: { _all: true },
        });
        return rows.map((r) => ({
            fornitore: r.fornitore,
            conteggio: r._count._all,
        }));
    }
};
exports.ReportService = ReportService;
exports.ReportService = ReportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportService);
//# sourceMappingURL=report.service.js.map
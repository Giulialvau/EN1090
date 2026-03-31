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
exports.PianiControlloService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PianiControlloService = class PianiControlloService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        await this.ensureCommessa(dto.commessaId);
        return this.prisma.pianoControllo.create({
            data: {
                commessaId: dto.commessaId,
                fase: dto.fase,
                controlliRichiesti: dto.controlliRichiesti,
                esito: dto.esito,
            },
        });
    }
    findAll() {
        return this.prisma.pianoControllo.findMany({
            orderBy: { fase: 'asc' },
            include: {
                commessa: { select: { id: true, codice: true, cliente: true } },
            },
        });
    }
    async findByCommessa(commessaId) {
        await this.ensureCommessa(commessaId);
        return this.prisma.pianoControllo.findMany({
            where: { commessaId },
            orderBy: { fase: 'asc' },
            include: {
                commessa: { select: { id: true, codice: true, cliente: true } },
            },
        });
    }
    async findOne(id) {
        const row = await this.prisma.pianoControllo.findUnique({
            where: { id },
            include: { commessa: true },
        });
        if (!row) {
            throw new common_1.NotFoundException(`Piano di controllo ${id} non trovato`);
        }
        return row;
    }
    async update(id, dto) {
        await this.ensureExists(id);
        if (dto.commessaId) {
            await this.ensureCommessa(dto.commessaId);
        }
        const data = {
            fase: dto.fase,
            esito: dto.esito,
        };
        if (dto.commessaId !== undefined) {
            data.commessa = { connect: { id: dto.commessaId } };
        }
        if (dto.controlliRichiesti !== undefined) {
            data.controlliRichiesti =
                dto.controlliRichiesti;
        }
        return this.prisma.pianoControllo.update({ where: { id }, data });
    }
    async remove(id) {
        await this.ensureExists(id);
        await this.prisma.pianoControllo.delete({ where: { id } });
        return { deleted: true, id };
    }
    async ensureCommessa(commessaId) {
        const c = await this.prisma.commessa.findUnique({ where: { id: commessaId } });
        if (!c) {
            throw new common_1.NotFoundException(`Commessa ${commessaId} non trovata`);
        }
    }
    async ensureExists(id) {
        const x = await this.prisma.pianoControllo.findUnique({ where: { id } });
        if (!x) {
            throw new common_1.NotFoundException(`Piano di controllo ${id} non trovato`);
        }
    }
};
exports.PianiControlloService = PianiControlloService;
exports.PianiControlloService = PianiControlloService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PianiControlloService);
//# sourceMappingURL=piani-controllo.service.js.map
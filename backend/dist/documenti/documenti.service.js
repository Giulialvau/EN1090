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
exports.DocumentiService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const fs_1 = require("fs");
const path_1 = require("path");
const prisma_service_1 = require("../prisma/prisma.service");
const UPLOAD_SUBDIR = (0, path_1.join)('uploads', 'documenti');
function mimeFromExt(extension) {
    switch (extension.toLowerCase()) {
        case '.pdf':
            return 'application/pdf';
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        case '.png':
            return 'image/png';
        case '.gif':
            return 'image/gif';
        case '.webp':
            return 'image/webp';
        default:
            return 'application/octet-stream';
    }
}
let DocumentiService = class DocumentiService {
    constructor(prisma) {
        this.prisma = prisma;
        this.ensureUploadDir();
    }
    ensureUploadDir() {
        const abs = (0, path_1.join)(process.cwd(), UPLOAD_SUBDIR);
        if (!(0, fs_1.existsSync)(abs)) {
            (0, fs_1.mkdirSync)(abs, { recursive: true });
        }
    }
    async create(dto) {
        await this.ensureCommessa(dto.commessaId);
        return this.prisma.documento.create({ data: dto });
    }
    async uploadFromFile(file, dto) {
        this.ensureUploadDir();
        await this.ensureCommessa(dto.commessaId);
        const relativePath = (0, path_1.join)(UPLOAD_SUBDIR, file.filename).replace(/\\/g, '/');
        const tipo = dto.tipo?.trim() || 'modulo';
        const versione = dto.versione?.trim() || '1.0';
        return this.prisma.documento.create({
            data: {
                commessaId: dto.commessaId,
                nome: dto.title,
                tipo,
                versione,
                percorsoFile: relativePath,
                statoApprovazione: client_1.DocumentoStatoApprovazione.BOZZA,
            },
            include: {
                commessa: { select: { id: true, codice: true, cliente: true } },
            },
        });
    }
    absolutePathFromStored(percorsoFile) {
        return (0, path_1.join)(process.cwd(), percorsoFile);
    }
    async getReadStreamForDocumento(id) {
        const row = await this.prisma.documento.findUnique({
            where: { id },
            select: { percorsoFile: true, nome: true },
        });
        if (!row) {
            throw new common_1.NotFoundException(`Documento ${id} non trovato`);
        }
        const abs = this.absolutePathFromStored(row.percorsoFile);
        if (!(0, fs_1.existsSync)(abs)) {
            throw new common_1.NotFoundException(`File non trovato su disco per documento ${id}`);
        }
        const ext = (0, path_1.extname)(row.percorsoFile) || '.pdf';
        const safeName = `${row.nome.replace(/[^\w.\-]+/g, '_')}${ext}`;
        return {
            stream: (0, fs_1.createReadStream)(abs),
            filename: safeName,
            mimeType: mimeFromExt(ext),
        };
    }
    findAll() {
        return this.prisma.documento.findMany({
            orderBy: { nome: 'asc' },
            include: {
                commessa: { select: { id: true, codice: true, cliente: true } },
            },
        });
    }
    async findByCommessa(commessaId) {
        await this.ensureCommessa(commessaId);
        return this.prisma.documento.findMany({
            where: { commessaId },
            orderBy: { nome: 'asc' },
            include: {
                commessa: { select: { id: true, codice: true, cliente: true } },
            },
        });
    }
    async findOne(id) {
        const row = await this.prisma.documento.findUnique({
            where: { id },
            include: { commessa: true },
        });
        if (!row) {
            throw new common_1.NotFoundException(`Documento ${id} non trovato`);
        }
        return row;
    }
    async update(id, dto) {
        await this.ensureExists(id);
        if (dto.commessaId) {
            await this.ensureCommessa(dto.commessaId);
        }
        return this.prisma.documento.update({ where: { id }, data: dto });
    }
    async remove(id) {
        const row = await this.prisma.documento.findUnique({
            where: { id },
            select: { percorsoFile: true },
        });
        if (!row) {
            throw new common_1.NotFoundException(`Documento ${id} non trovato`);
        }
        await this.prisma.documento.delete({ where: { id } });
        const abs = this.absolutePathFromStored(row.percorsoFile);
        if ((0, fs_1.existsSync)(abs)) {
            try {
                (0, fs_1.unlinkSync)(abs);
            }
            catch {
            }
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
        const d = await this.prisma.documento.findUnique({ where: { id } });
        if (!d) {
            throw new common_1.NotFoundException(`Documento ${id} non trovato`);
        }
    }
};
exports.DocumentiService = DocumentiService;
exports.DocumentiService = DocumentiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DocumentiService);
//# sourceMappingURL=documenti.service.js.map
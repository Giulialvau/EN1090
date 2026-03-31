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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentiController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const crypto_1 = require("crypto");
const multer_1 = require("multer");
const path_1 = require("path");
const fs_1 = require("fs");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const documenti_service_1 = require("./documenti.service");
const create_documento_dto_1 = require("./dto/create-documento.dto");
const update_documento_dto_1 = require("./dto/update-documento.dto");
const upload_documento_dto_1 = require("./dto/upload-documento.dto");
const UPLOAD_DEST = (0, path_1.join)(process.cwd(), 'uploads', 'documenti');
const documentiUpload = {
    storage: (0, multer_1.diskStorage)({
        destination: (_req, _file, cb) => {
            (0, fs_1.mkdirSync)(UPLOAD_DEST, { recursive: true });
            cb(null, UPLOAD_DEST);
        },
        filename: (_req, file, cb) => {
            cb(null, `${(0, crypto_1.randomUUID)()}${(0, path_1.extname)(file.originalname) || '.pdf'}`);
        },
    }),
    limits: { fileSize: 25 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const name = (file.originalname ?? '').toLowerCase();
        const ext = (0, path_1.extname)(name);
        const mt = (file.mimetype ?? '').toLowerCase();
        const pdf = ext === '.pdf' || mt === 'application/pdf';
        const imgExt = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const img = imgExt.includes(ext) &&
            (mt.startsWith('image/') ||
                mt === 'application/octet-stream' ||
                mt === '');
        if (pdf || img) {
            cb(null, true);
            return;
        }
        cb(new common_1.BadRequestException('Accettati solo PDF o immagini (JPEG, PNG, GIF, WebP)'), false);
    },
};
let DocumentiController = class DocumentiController {
    constructor(documentiService) {
        this.documentiService = documentiService;
    }
    upload(file, body) {
        if (!file) {
            throw new common_1.BadRequestException('File obbligatorio');
        }
        return this.documentiService.uploadFromFile(file, body);
    }
    create(dto) {
        return this.documentiService.create(dto);
    }
    findAll() {
        return this.documentiService.findAll();
    }
    async download(id) {
        const { stream, filename, mimeType } = await this.documentiService.getReadStreamForDocumento(id);
        return new common_1.StreamableFile(stream, {
            type: mimeType,
            disposition: `inline; filename="${encodeURIComponent(filename)}"`,
        });
    }
    findOne(id) {
        return this.documentiService.findOne(id);
    }
    update(id, dto) {
        return this.documentiService.update(id, dto);
    }
    remove(id) {
        return this.documentiService.remove(id);
    }
};
exports.DocumentiController = DocumentiController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', documentiUpload)),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, upload_documento_dto_1.UploadDocumentoDto]),
    __metadata("design:returntype", void 0)
], DocumentiController.prototype, "upload", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_documento_dto_1.CreateDocumentoDto]),
    __metadata("design:returntype", void 0)
], DocumentiController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DocumentiController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id/download'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DocumentiController.prototype, "download", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DocumentiController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_documento_dto_1.UpdateDocumentoDto]),
    __metadata("design:returntype", void 0)
], DocumentiController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DocumentiController.prototype, "remove", null);
exports.DocumentiController = DocumentiController = __decorate([
    (0, common_1.Controller)('documenti'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [documenti_service_1.DocumentiService])
], DocumentiController);
//# sourceMappingURL=documenti.controller.js.map
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
exports.ReportController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const report_pdf_service_1 = require("./report-pdf.service");
const report_service_1 = require("./report.service");
let ReportController = class ReportController {
    constructor(reportService, reportPdfService) {
        this.reportService = reportService;
        this.reportPdfService = reportPdfService;
    }
    pdfResponse(bytes, filename) {
        return new common_1.StreamableFile(Buffer.from(bytes), {
            type: 'application/pdf',
            disposition: `attachment; filename="${encodeURIComponent(filename)}"`,
        });
    }
    requireCommessaId(commessaId) {
        const id = commessaId?.trim();
        if (!id) {
            throw new common_1.BadRequestException('commessaId richiesto');
        }
        return id;
    }
    getDashboard() {
        return this.reportService.dashboard();
    }
    async commessaPdf(commessaId) {
        const id = this.requireCommessaId(commessaId);
        const bytes = await this.reportPdfService.commessaCompletoPdf(id);
        return this.pdfResponse(bytes, `report-commessa-${id.slice(0, 8)}.pdf`);
    }
    getCommessaReport(id) {
        return this.reportService.commessaReport(id);
    }
    getMaterialiPerFornitore() {
        return this.reportService.materialiPerFornitore();
    }
    async dopPdf(commessaId) {
        const id = this.requireCommessaId(commessaId);
        const bytes = await this.reportPdfService.dopPdf(id);
        return this.pdfResponse(bytes, `dop-${id.slice(0, 8)}.pdf`);
    }
    async cePdf(commessaId) {
        const id = this.requireCommessaId(commessaId);
        const bytes = await this.reportPdfService.cePdf(id);
        return this.pdfResponse(bytes, `marcatura-ce-${id.slice(0, 8)}.pdf`);
    }
    async fascicoloTecnicoPdf(commessaId) {
        const id = this.requireCommessaId(commessaId);
        const bytes = await this.reportPdfService.fascicoloTecnicoPdf(id);
        return this.pdfResponse(bytes, `fascicolo-tecnico-${id.slice(0, 8)}.pdf`);
    }
    async materialiPdf(commessaId) {
        const id = this.requireCommessaId(commessaId);
        const bytes = await this.reportPdfService.materialiPdf(id);
        return this.pdfResponse(bytes, `report-materiali-${id.slice(0, 8)}.pdf`);
    }
    async tracciabilitaPdf(commessaId) {
        const id = this.requireCommessaId(commessaId);
        const bytes = await this.reportPdfService.tracciabilitaPdf(id);
        return this.pdfResponse(bytes, `report-tracciabilita-${id.slice(0, 8)}.pdf`);
    }
};
exports.ReportController = ReportController;
__decorate([
    (0, common_1.Get)('dashboard'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('commessa'),
    __param(0, (0, common_1.Query)('commessaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "commessaPdf", null);
__decorate([
    (0, common_1.Get)('commessa/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReportController.prototype, "getCommessaReport", null);
__decorate([
    (0, common_1.Get)('materiali/fornitori'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportController.prototype, "getMaterialiPerFornitore", null);
__decorate([
    (0, common_1.Get)('dop'),
    __param(0, (0, common_1.Query)('commessaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "dopPdf", null);
__decorate([
    (0, common_1.Get)('ce'),
    __param(0, (0, common_1.Query)('commessaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "cePdf", null);
__decorate([
    (0, common_1.Get)('fascicolo-tecnico'),
    __param(0, (0, common_1.Query)('commessaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "fascicoloTecnicoPdf", null);
__decorate([
    (0, common_1.Get)('materiali'),
    __param(0, (0, common_1.Query)('commessaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "materialiPdf", null);
__decorate([
    (0, common_1.Get)('tracciabilita'),
    __param(0, (0, common_1.Query)('commessaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "tracciabilitaPdf", null);
exports.ReportController = ReportController = __decorate([
    (0, common_1.Controller)('report'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [report_service_1.ReportService,
        report_pdf_service_1.ReportPdfService])
], ReportController);
//# sourceMappingURL=report.controller.js.map
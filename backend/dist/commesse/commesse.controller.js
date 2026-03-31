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
exports.CommesseController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const checklist_service_1 = require("../checklist/checklist.service");
const materiali_service_1 = require("../materiali/materiali.service");
const tracciabilita_service_1 = require("../tracciabilita/tracciabilita.service");
const wps_service_1 = require("../wps/wps.service");
const wpqr_service_1 = require("../wpqr/wpqr.service");
const non_conformita_service_1 = require("../non-conformita/non-conformita.service");
const audit_service_1 = require("../audit/audit.service");
const piani_controllo_service_1 = require("../piani-controllo/piani-controllo.service");
const documenti_service_1 = require("../documenti/documenti.service");
const commesse_service_1 = require("./commesse.service");
const create_commessa_dto_1 = require("./dto/create-commessa.dto");
const query_commessa_dto_1 = require("./dto/query-commessa.dto");
const update_commessa_dto_1 = require("./dto/update-commessa.dto");
let CommesseController = class CommesseController {
    constructor(commesseService, materialiService, checklistService, tracciabilitaService, wpsService, wpqrService, nonConformitaService, auditService, pianiControlloService, documentiService) {
        this.commesseService = commesseService;
        this.materialiService = materialiService;
        this.checklistService = checklistService;
        this.tracciabilitaService = tracciabilitaService;
        this.wpsService = wpsService;
        this.wpqrService = wpqrService;
        this.nonConformitaService = nonConformitaService;
        this.auditService = auditService;
        this.pianiControlloService = pianiControlloService;
        this.documentiService = documentiService;
    }
    create(dto) {
        return this.commesseService.create(dto);
    }
    findAll(query) {
        return this.commesseService.findAll(query);
    }
    listMateriali(id) {
        return this.materialiService.findByCommessa(id);
    }
    listChecklist(id) {
        return this.checklistService.findByCommessa(id);
    }
    listTracciabilita(id) {
        return this.tracciabilitaService.findByCommessa(id);
    }
    listWps(id) {
        return this.wpsService.findByCommessa(id);
    }
    listWpqr(id) {
        return this.wpqrService.findByCommessa(id);
    }
    listDocumenti(id) {
        return this.documentiService.findByCommessa(id);
    }
    listNonConformita(id) {
        return this.nonConformitaService.findByCommessa(id);
    }
    listAudit(id) {
        return this.auditService.findByCommessa(id);
    }
    listPianiControllo(id) {
        return this.pianiControlloService.findByCommessa(id);
    }
    findOne(id) {
        return this.commesseService.findOne(id);
    }
    update(id, dto) {
        return this.commesseService.update(id, dto);
    }
    remove(id) {
        return this.commesseService.remove(id);
    }
};
exports.CommesseController = CommesseController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_commessa_dto_1.CreateCommessaDto]),
    __metadata("design:returntype", void 0)
], CommesseController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_commessa_dto_1.QueryCommessaDto]),
    __metadata("design:returntype", void 0)
], CommesseController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id/materiali'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CommesseController.prototype, "listMateriali", null);
__decorate([
    (0, common_1.Get)(':id/checklist'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CommesseController.prototype, "listChecklist", null);
__decorate([
    (0, common_1.Get)(':id/tracciabilita'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CommesseController.prototype, "listTracciabilita", null);
__decorate([
    (0, common_1.Get)(':id/wps'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CommesseController.prototype, "listWps", null);
__decorate([
    (0, common_1.Get)(':id/wpqr'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CommesseController.prototype, "listWpqr", null);
__decorate([
    (0, common_1.Get)(':id/documenti'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CommesseController.prototype, "listDocumenti", null);
__decorate([
    (0, common_1.Get)(':id/non-conformita'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CommesseController.prototype, "listNonConformita", null);
__decorate([
    (0, common_1.Get)(':id/audit'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CommesseController.prototype, "listAudit", null);
__decorate([
    (0, common_1.Get)(':id/piani-controllo'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CommesseController.prototype, "listPianiControllo", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CommesseController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_commessa_dto_1.UpdateCommessaDto]),
    __metadata("design:returntype", void 0)
], CommesseController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CommesseController.prototype, "remove", null);
exports.CommesseController = CommesseController = __decorate([
    (0, common_1.Controller)('commesse'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [commesse_service_1.CommesseService,
        materiali_service_1.MaterialiService,
        checklist_service_1.ChecklistService,
        tracciabilita_service_1.TracciabilitaService,
        wps_service_1.WpsService,
        wpqr_service_1.WpqrService,
        non_conformita_service_1.NonConformitaService,
        audit_service_1.AuditService,
        piani_controllo_service_1.PianiControlloService,
        documenti_service_1.DocumentiService])
], CommesseController);
//# sourceMappingURL=commesse.controller.js.map
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Body,
  Patch,
  Req,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Role } from "@prisma/client";
import { createReadStream } from "fs";
import { join } from "path";
import { FileInterceptor } from "@nestjs/platform-express";

import {
  CreateEn1090CommessaDto,
  CreateEn1090MaterialeDto,
  CreateEn1090QualificaDto,
  CreateEn1090SaldatoreDto,
  CreateEn1090SaldaturaDto,
  CreateEn1090WpsDto,
  CreateEn1090WpqrDto,
  En1090CertificatoPathDto,
  En1090CreaMaterialeDaCertificatoDto,
  En1090VerificaSaldaturaDto,
  GenerateEn1090DocDto,
  GeneratePdfDto,
  PatchEn1090CommessaDto,
  SaveEn1090ModuloDto,
  UpdateEn1090FileDto,
  UpdateEn1090MaterialeDto,
  AssociaMaterialeCommessaDto,
} from "./dto/en1090.dto";
import { En1090BusinessService } from "./en1090-business.service";
import { En1090CertificatiService } from "./en1090-certificati.service";
import { En1090DopCeAiService } from "./en1090-dopce-ai.service";
import { En1090NotificheService } from "./en1090-notifiche.service";
import { En1090PdfService } from "./en1090-pdf.service";
import { En1090QrcodeService } from "./en1090-qrcode.service";
import { En1090Service } from "./en1090.service";
import { En1090VerificaSaldatureService } from "./en1090-verifica-saldature.service";

@Controller("api/en1090")
@ApiTags("en1090")
@ApiBearerAuth("bearer")
@ApiUnauthorizedResponse({ description: "Unauthorized" })
@UseGuards(JwtAuthGuard)
export class En1090Controller {
  constructor(
    private readonly en1090Service: En1090Service,
    private readonly en1090BusinessService: En1090BusinessService,
    private readonly en1090CertificatiService: En1090CertificatiService,
    private readonly en1090DopCeAiService: En1090DopCeAiService,
    private readonly en1090QrcodeService: En1090QrcodeService,
    private readonly en1090NotificheService: En1090NotificheService,
    private readonly en1090PdfService: En1090PdfService,
    private readonly en1090VerificaSaldatureService: En1090VerificaSaldatureService,
  ) {}

  private tenant(req: { user?: { aziendaId?: string | null } }): string {
    return req.user?.aziendaId ?? "";
  }

  private userId(req: { user?: { sub?: string } }): string {
    return req.user?.sub ?? "";
  }

  @Get("files")
  @ApiOkResponse({ description: "Struttura cartelle/file EN1090" })
  getFiles() {
    return this.en1090Service.getFilesTree();
  }

  @Get("file")
  @ApiOkResponse({ description: "Contenuto markdown file EN1090" })
  async getFile(@Query("path") path: string | undefined) {
    if (!path?.trim()) {
      throw new BadRequestException("Query param 'path' obbligatorio");
    }
    const content = await this.en1090Service.getMarkdownFileContent(path);
    return {
      path,
      content,
    };
  }

  @Post("file/update")
  @ApiOkResponse({ description: "Aggiornamento file markdown EN1090" })
  updateFile(
    @Body() body: UpdateEn1090FileDto,
    @Req() req: { user?: { aziendaId?: string | null; sub?: string } },
  ) {
    return this.en1090Service.updateMarkdownFile(body.path, body.content, {
      aziendaId: this.tenant(req),
      userId: this.userId(req),
    });
  }

  @Post("commesse")
  createCommessa(
    @Body() body: CreateEn1090CommessaDto,
    @Req() req: { user?: { aziendaId?: string | null } },
  ) {
    return this.en1090BusinessService.createCommessa(this.tenant(req), body);
  }

  @Get("commesse")
  listCommesse(@Req() req: { user?: { aziendaId?: string | null } }) {
    return this.en1090BusinessService.listCommesse(this.tenant(req));
  }

  @Get("commesse/:id")
  getCommessa(
    @Param("id", ParseIntPipe) id: number,
    @Req() req: { user?: { aziendaId?: string | null } },
  ) {
    return this.en1090BusinessService.getCommessa(this.tenant(req), id);
  }

  @Patch("commesse/:id")
  patchCommessa(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: PatchEn1090CommessaDto,
    @Req() req: { user?: { aziendaId?: string | null } },
  ) {
    return this.en1090BusinessService.patchCommessa(this.tenant(req), id, {
      stato: body.stato,
      descrizione: body.descrizione,
      dataChiusura: body.data_chiusura ? new Date(body.data_chiusura) : undefined,
    });
  }

  @Post("moduli")
  saveModulo(
    @Body() body: SaveEn1090ModuloDto,
    @Req() req: { user?: { aziendaId?: string | null } },
  ) {
    return this.en1090BusinessService.saveModulo({
      aziendaId: this.tenant(req),
      commessaId: body.commessa_id,
      tipo: body.tipo,
      contenutoJson: body.contenuto_json,
    });
  }

  @Get("moduli/:id")
  getModulo(
    @Param("id", ParseIntPipe) id: number,
    @Req() req: { user?: { aziendaId?: string | null } },
  ) {
    return this.en1090BusinessService.getModulo(this.tenant(req), id);
  }

  @Post("pdf")
  generatePdf(@Body() body: GeneratePdfDto) {
    return this.en1090PdfService.markdownToPdf(
      body.markdown,
      body.filename ?? `en1090-${Date.now()}.pdf`,
    );
  }

  @Get("pdf/:filename")
  getPdf(@Param("filename") filename: string) {
    const safe = filename.replace(/[^\w\-.]/g, "");
    const path = join(process.cwd(), "pdf", "en1090", safe);
    return new StreamableFile(createReadStream(path), {
      type: "application/pdf",
      disposition: `inline; filename="${encodeURIComponent(safe)}"`,
    });
  }

  @Post("dop/generate")
  generateDop(
    @Body() body: GenerateEn1090DocDto,
    @Req() req: { user?: { aziendaId?: string | null } },
  ) {
    return this.en1090BusinessService.generateDop(
      this.tenant(req),
      body.commessa_id,
      body.campi_specifici ?? {},
    );
  }

  @Post("ce/etichetta")
  generateEtichetta(
    @Body() body: GenerateEn1090DocDto,
    @Req() req: { user?: { aziendaId?: string | null } },
  ) {
    return this.en1090BusinessService.generateCe(
      this.tenant(req),
      body.commessa_id,
      "etichetta",
      body.campi_specifici ?? {},
    );
  }

  @Post("ce/marcatura")
  generateMarcatura(
    @Body() body: GenerateEn1090DocDto,
    @Req() req: { user?: { aziendaId?: string | null } },
  ) {
    return this.en1090BusinessService.generateCe(
      this.tenant(req),
      body.commessa_id,
      "marcatura",
      body.campi_specifici ?? {},
    );
  }

  @Post("dop/auto/:commessaId")
  autoDop(
    @Param("commessaId", ParseIntPipe) commessaId: number,
    @Req() req: { user?: { aziendaId?: string | null } },
  ) {
    return this.en1090DopCeAiService.creaDoPAuto(commessaId, req.user ?? {});
  }

  @Post("ce/auto/:commessaId")
  autoCe(
    @Param("commessaId", ParseIntPipe) commessaId: number,
    @Body() body: { tipo?: "etichetta" | "marcatura" },
    @Req() req: { user?: { aziendaId?: string | null } },
  ) {
    return this.en1090DopCeAiService.creaCeAuto(
      commessaId,
      body.tipo ?? "etichetta",
      req.user ?? {},
    );
  }

  @Get("dop/:id/pdf")
  async dopPdf(@Param("id", ParseIntPipe) id: number) {
    const row = await this.en1090BusinessService.getDopById(id);
    return new StreamableFile(createReadStream(row.pdfPath ?? ""), {
      type: "application/pdf",
      disposition: `inline; filename="dop-${id}.pdf"`,
    });
  }

  @Get("ce/:id/pdf")
  async cePdf(@Param("id", ParseIntPipe) id: number) {
    const row = await this.en1090BusinessService.getCeById(id);
    return new StreamableFile(createReadStream(row.pdfPath ?? ""), {
      type: "application/pdf",
      disposition: `inline; filename="ce-${id}.pdf"`,
    });
  }

  @Get("file/versions")
  getVersions(
    @Query("path") path: string,
    @Req() req: { user?: { aziendaId?: string | null } },
  ) {
    return this.en1090Service.getFileVersions(path, this.tenant(req));
  }

  @Get("file/version/:id")
  getVersion(
    @Param("id") id: string,
    @Req() req: { user?: { aziendaId?: string | null } },
  ) {
    return this.en1090Service.getFileVersionById(id, this.tenant(req));
  }

  @Post("materiali")
  createMateriale(
    @Body() body: CreateEn1090MaterialeDto,
    @Req() req: { user?: { aziendaId?: string | null } },
  ) {
    return this.en1090BusinessService.createMateriale(this.tenant(req), {
      ...body,
      dataIngresso: new Date(body.dataIngresso),
    });
  }

  @Get("materiali")
  listMateriali(@Req() req: { user?: { aziendaId?: string | null } }) {
    return this.en1090BusinessService.listMateriali(this.tenant(req));
  }

  @Get("materiali/:id")
  getMateriale(
    @Param("id") id: string,
    @Req() req: { user?: { aziendaId?: string | null } },
  ) {
    return this.en1090BusinessService.getMateriale(this.tenant(req), id);
  }

  @Patch("materiali/:id")
  patchMateriale(
    @Param("id") id: string,
    @Body() body: UpdateEn1090MaterialeDto,
    @Req() req: { user?: { aziendaId?: string | null } },
  ) {
    return this.en1090BusinessService.patchMateriale(
      this.tenant(req),
      id,
      body as Record<string, unknown>,
    );
  }

  @Post("commesse/:id/materiali")
  associaMateriale(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: AssociaMaterialeCommessaDto,
    @Req() req: { user?: { aziendaId?: string | null } },
  ) {
    return this.en1090BusinessService.linkMaterialeToCommessa(
      this.tenant(req),
      id,
      body.materialeId,
      body.quantita,
      body.note,
    );
  }

  @Post("saldatori")
  createSaldatore(
    @Body() body: CreateEn1090SaldatoreDto,
    @Req() req: { user?: { aziendaId?: string | null } },
  ) {
    return this.en1090BusinessService.createSaldatore(this.tenant(req), body);
  }

  @Get("saldatori")
  listSaldatori(@Req() req: { user?: { aziendaId?: string | null } }) {
    return this.en1090BusinessService.listSaldatori(this.tenant(req));
  }

  @Post("wps")
  createWps(
    @Body() body: CreateEn1090WpsDto,
    @Req() req: { user?: { aziendaId?: string | null } },
  ) {
    return this.en1090BusinessService.createWps(
      this.tenant(req),
      body as unknown as Record<string, unknown>,
    );
  }

  @Get("wps")
  listWps(@Req() req: { user?: { aziendaId?: string | null } }) {
    return this.en1090BusinessService.listWps(this.tenant(req));
  }

  @Post("wpqr")
  createWpqr(
    @Body() body: CreateEn1090WpqrDto,
    @Req() req: { user?: { aziendaId?: string | null } },
  ) {
    return this.en1090BusinessService.createWpqr(this.tenant(req), {
      ...body,
      dataProva: body.dataProva ? new Date(body.dataProva) : undefined,
      dataScadenza: body.dataScadenza ? new Date(body.dataScadenza) : undefined,
    });
  }

  @Get("wpqr")
  listWpqr(@Req() req: { user?: { aziendaId?: string | null } }) {
    return this.en1090BusinessService.listWpqr(this.tenant(req));
  }

  @Post("qualifiche")
  createQualifica(
    @Body() body: CreateEn1090QualificaDto,
    @Req() req: { user?: { aziendaId?: string | null } },
  ) {
    return this.en1090BusinessService.createQualifica(this.tenant(req), {
      ...body,
      dataQualifica: body.dataQualifica ? new Date(body.dataQualifica) : undefined,
      dataScadenza: body.dataScadenza ? new Date(body.dataScadenza) : undefined,
    });
  }

  @Post("saldature")
  createSaldatura(
    @Body() body: CreateEn1090SaldaturaDto,
    @Req() req: { user?: { aziendaId?: string | null } },
  ) {
    return this.en1090BusinessService.createSaldatura(this.tenant(req), {
      ...body,
      dataSaldatura: new Date(body.dataSaldatura),
    });
  }

  @Post("saldature/tablet")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SALDATORE, Role.RGQ, Role.SUPER_ADMIN)
  createSaldaturaTablet(
    @Body() body: CreateEn1090SaldaturaDto & { qrScanData?: Record<string, unknown> },
    @Req() req: { user?: { aziendaId?: string | null } },
  ) {
    return this.en1090BusinessService.createSaldatura(this.tenant(req), {
      ...body,
      dataSaldatura: new Date(body.dataSaldatura),
      qrScanData: body.qrScanData,
    });
  }

  @Post("saldature/tablet/foto")
  @UseInterceptors(FileInterceptor("file"))
  uploadSaldaturaFoto(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { saldaturaId: string },
    @Req() req: { user?: { aziendaId?: string | null } },
  ) {
    return this.en1090BusinessService.patchSaldaturaMedia(
      this.tenant(req),
      body.saldaturaId,
      "fotoPath",
      file.buffer,
      ".jpg",
    );
  }

  @Post("saldature/tablet/firma")
  @UseInterceptors(FileInterceptor("file"))
  uploadSaldaturaFirma(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { saldaturaId: string },
    @Req() req: { user?: { aziendaId?: string | null } },
  ) {
    return this.en1090BusinessService.patchSaldaturaMedia(
      this.tenant(req),
      body.saldaturaId,
      "firmaPath",
      file.buffer,
      ".png",
    );
  }

  @Get("saldature")
  listSaldature(@Req() req: { user?: { aziendaId?: string | null } }) {
    return this.en1090BusinessService.listSaldature(this.tenant(req));
  }

  @Get("commesse/:id/saldature")
  listSaldatureCommessa(
    @Param("id", ParseIntPipe) id: number,
    @Req() req: { user?: { aziendaId?: string | null } },
  ) {
    return this.en1090BusinessService.listSaldatureByCommessa(this.tenant(req), id);
  }

  @Get("dashboard")
  dashboard(@Req() req: { user?: { aziendaId?: string | null } }) {
    return this.en1090BusinessService.getDashboard(this.tenant(req));
  }

  @Get("commesse/:id/export")
  async exportCommessa(
    @Param("id", ParseIntPipe) id: number,
    @Req() req: { user?: { aziendaId?: string | null } },
  ) {
    return {
      zipUrl: await this.en1090BusinessService.exportCommessaZip(this.tenant(req), id),
    };
  }

  @Get("exports/:filename")
  getExportZip(@Param("filename") filename: string) {
    const safe = filename.replace(/[^\w\-.]/g, "");
    const path = join(process.cwd(), "exports", "en1090", safe);
    return new StreamableFile(createReadStream(path), {
      type: "application/zip",
      disposition: `attachment; filename="${encodeURIComponent(safe)}"`,
    });
  }

  @Post("commesse/:id/close")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DIREZIONE, Role.SUPER_ADMIN, Role.ADMIN_AZIENDA)
  closeCommessa(
    @Param("id", ParseIntPipe) id: number,
    @Req() req: { user?: { aziendaId?: string | null } },
  ) {
    return this.en1090BusinessService.closeCommessa(this.tenant(req), id);
  }

  @Post("verifiche-saldature")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.RGQ, Role.DIREZIONE, Role.ADMIN_AZIENDA, Role.SUPER_ADMIN)
  createVerificaSaldatura(
    @Body() body: En1090VerificaSaldaturaDto,
    @Req() req: { user?: { aziendaId?: string | null; sub?: string } },
  ) {
    return this.en1090VerificaSaldatureService.verifyWeld(body, req.user ?? {});
  }

  @Get("verifiche-saldature/:id")
  getVerificaSaldatura(
    @Param("id") id: string,
    @Req() req: { user?: { aziendaId?: string | null } },
  ) {
    return this.en1090VerificaSaldatureService.getOne(id, req.user ?? {});
  }

  @Get("commesse/:id/verifiche-saldature")
  listVerificheSaldatureCommessa(
    @Param("id", ParseIntPipe) id: number,
    @Req() req: { user?: { aziendaId?: string | null } },
  ) {
    return this.en1090VerificaSaldatureService.listByCommessa(id, req.user ?? {});
  }

  @Post("verifiche-saldature/:id/pdf")
  async generateVerificaSaldaturaPdf(
    @Param("id") id: string,
    @Req() req: { user?: { aziendaId?: string | null; email?: string } },
  ) {
    return this.en1090PdfService.generateVerificaSaldaturaPdf(
      id,
      this.tenant(req),
      req.user?.email ?? "RGQ",
    );
  }

  @Get("verifiche-saldature/:id/pdf")
  async getVerificaSaldaturaPdf(
    @Param("id") id: string,
    @Req() req: { user?: { aziendaId?: string | null; email?: string } },
  ) {
    const generated = await this.en1090PdfService.generateVerificaSaldaturaPdf(
      id,
      this.tenant(req),
      req.user?.email ?? "RGQ",
    );
    return new StreamableFile(createReadStream(generated.pdfPath), {
      type: "application/pdf",
      disposition: `inline; filename="${encodeURIComponent(id)}.pdf"`,
    });
  }

  @Post("certificati/upload")
  @UseInterceptors(FileInterceptor("file"))
  uploadCertificato(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: { user?: { aziendaId?: string | null } },
  ) {
    return this.en1090CertificatiService.uploadCertificato(file, req.user ?? {});
  }

  @Post("certificati/estrai")
  estraiCertificato(@Body() body: En1090CertificatoPathDto) {
    return this.en1090CertificatiService.estraiDatiCertificato(body.path);
  }

  @Post("certificati/crea-materiale")
  creaMaterialeDaCertificato(
    @Body() body: En1090CreaMaterialeDaCertificatoDto,
    @Req() req: { user?: { aziendaId?: string | null } },
  ) {
    return this.en1090CertificatiService.creaMaterialeDaCertificato(
      body,
      req.user ?? {},
    );
  }

  @Get("qrcode/:entity/:id")
  async qrcode(
    @Param("entity") entity: "materiale" | "saldatura" | "commessa",
    @Param("id") id: string,
    @Req() req: { user?: { aziendaId?: string | null } },
  ) {
    const created = await this.en1090QrcodeService.generaQr(
      this.tenant(req),
      entity,
      id,
    );
    return {
      ...created,
      fileUrl: `/api/en1090/qrcode/file/${encodeURIComponent(created.path)}`,
    };
  }

  @Get("qrcode/file/:encodedPath")
  getQrFile(@Param("encodedPath") encodedPath: string) {
    const rel = decodeURIComponent(encodedPath);
    const abs = join(process.cwd(), "EN1090", rel);
    return new StreamableFile(createReadStream(abs), { type: "image/png" });
  }

  @Get("notifiche")
  notifiche(@Req() req: { user?: { aziendaId?: string | null } }) {
    return this.en1090NotificheService.list(this.tenant(req));
  }

  @Post("notifiche/:id/segna-letta")
  segnaNotificaLetta(
    @Param("id") id: string,
    @Req() req: { user?: { aziendaId?: string | null } },
  ) {
    return this.en1090NotificheService.markRead(this.tenant(req), id);
  }
}

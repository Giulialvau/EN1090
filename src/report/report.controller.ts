import {
  BadRequestException,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  StreamableFile,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

import { ReportPdfService } from "./report-pdf.service";
import { ReportService } from "./report.service";

@Controller("report")
@ApiTags("Report")
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: "Unauthorized" })
@ApiBadRequestResponse({ description: "Bad Request" })
@UseGuards(JwtAuthGuard)
export class ReportController {
  constructor(
    private readonly reportService: ReportService,
    private readonly reportPdfService: ReportPdfService,
  ) {}

  private pdfResponse(bytes: Uint8Array, filename: string) {
    return new StreamableFile(Buffer.from(bytes), {
      type: "application/pdf",
      disposition: `attachment; filename="${encodeURIComponent(filename)}"`,
    });
  }

  private requireCommessaId(commessaId: string | undefined): number {
    const raw = commessaId?.trim();
    if (!raw) throw new BadRequestException("commessaId richiesto");
    const n = Number(raw);
    if (!Number.isInteger(n) || n <= 0) {
      throw new BadRequestException(
        "commessaId deve essere un intero positivo",
      );
    }
    return n;
  }

  @Get("dashboard")
  @ApiOkResponse({ description: "Dashboard report" })
  getDashboard() {
    return this.reportService.dashboard();
  }

  /** PDF: report commessa completo — GET /report/commessa?commessaId= (prima di commessa/:id) */
  @Get("commessa")
  @ApiOkResponse({ description: "PDF report commessa" })
  async commessaPdf(@Query("commessaId") commessaId: string) {
    const id = this.requireCommessaId(commessaId);
    const bytes = await this.reportPdfService.commessaCompletoPdf(id);
    return this.pdfResponse(bytes, `report-commessa-${id}.pdf`);
  }

  @Get("commessa/:id")
  @ApiOkResponse({ description: "Report JSON commessa" })
  getCommessaReport(@Param("id", ParseIntPipe) id: number) {
    return this.reportService.commessaReport(id);
  }

  @Get("materiali/fornitori")
  @ApiOkResponse({ description: "Aggregazione materiali per fornitore" })
  getMaterialiPerFornitore() {
    return this.reportService.materialiPerFornitore();
  }

  @Get("dop")
  @ApiOkResponse({ description: "PDF DoP" })
  async dopPdf(@Query("commessaId") commessaId: string) {
    const id = this.requireCommessaId(commessaId);
    const bytes = await this.reportPdfService.dopPdf(id);
    return this.pdfResponse(bytes, `dop-${id}.pdf`);
  }

  @Get("ce")
  @ApiOkResponse({ description: "PDF Marcatura CE" })
  async cePdf(@Query("commessaId") commessaId: string) {
    const id = this.requireCommessaId(commessaId);
    const bytes = await this.reportPdfService.cePdf(id);
    return this.pdfResponse(bytes, `marcatura-ce-${id}.pdf`);
  }

  @Get("fascicolo-tecnico")
  @ApiOkResponse({ description: "PDF Fascicolo tecnico" })
  async fascicoloTecnicoPdf(@Query("commessaId") commessaId: string) {
    const id = this.requireCommessaId(commessaId);
    const bytes = await this.reportPdfService.fascicoloTecnicoPdf(id);
    return this.pdfResponse(bytes, `fascicolo-tecnico-${id}.pdf`);
  }

  @Get("materiali")
  @ApiOkResponse({ description: "PDF report materiali" })
  async materialiPdf(@Query("commessaId") commessaId: string) {
    const id = this.requireCommessaId(commessaId);
    const bytes = await this.reportPdfService.materialiPdf(id);
    return this.pdfResponse(bytes, `report-materiali-${id}.pdf`);
  }

  @Get("tracciabilita")
  @ApiOkResponse({ description: "PDF report tracciabilità" })
  async tracciabilitaPdf(@Query("commessaId") commessaId: string) {
    const id = this.requireCommessaId(commessaId);
    const bytes = await this.reportPdfService.tracciabilitaPdf(id);
    return this.pdfResponse(bytes, `report-tracciabilita-${id}.pdf`);
  }
}

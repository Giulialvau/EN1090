import { PrismaService } from '../prisma/prisma.service';
export declare class ReportPdfService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private commessaOrThrow;
    private commessaVars;
    private renderTemplate;
    dopPdf(commessaId: string): Promise<Uint8Array>;
    cePdf(commessaId: string): Promise<Uint8Array>;
    fascicoloTecnicoPdf(commessaId: string): Promise<Uint8Array>;
    private buildMaterialiRows;
    private buildTracciabilitaRows;
    private elementiTableRows;
    private fascicoloChecklistSectionsHtml;
    private buildNcRows;
    private buildAuditRows;
    private buildWpsRows;
    private buildWpqrRows;
    private buildQualificheDistinctRows;
    materialiPdf(commessaId: string): Promise<Uint8Array>;
    tracciabilitaPdf(commessaId: string): Promise<Uint8Array>;
    private checklistRowsHtml;
    private elementiSummary;
    commessaCompletoPdf(commessaId: string): Promise<Uint8Array>;
    private buildWorkflowBarChartSvg;
    private buildMaterialiRowsReport;
    private buildTracciabilitaRowsShort;
    private checklistRowsReportShort;
}

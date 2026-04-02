import { Injectable } from "@nestjs/common";
import { mkdir, readFile, writeFile } from "fs/promises";
import { join } from "path";

import { marked } from "marked";

import { PrismaService } from "../prisma/prisma.service";
import { renderHtmlToPdf } from "../report/report-pdf.renderer";

@Injectable()
export class En1090PdfService {
  private readonly outputDir = join(process.cwd(), "pdf", "en1090");
  constructor(private readonly prisma: PrismaService) {}

  async markdownToPdf(
    markdown: string,
    filename = `en1090-${Date.now()}.pdf`,
  ): Promise<{ pdfPath: string; pdfUrl: string }> {
    const safeName = filename.toLowerCase().endsWith(".pdf")
      ? filename
      : `${filename}.pdf`;
    const htmlBody = await marked.parse(markdown ?? "");
    const html = `<!doctype html><html><head><meta charset="utf-8"/><style>body{font-family:Arial,Helvetica,sans-serif;padding:24px;font-size:12px;line-height:1.45} h1,h2,h3{margin-top:18px} table{border-collapse:collapse;width:100%} td,th{border:1px solid #ddd;padding:6px}</style></head><body>${htmlBody}</body></html>`;
    const bytes = await renderHtmlToPdf(html, {
      footerNote: `EN1090 - ${new Date().toLocaleString("it-IT")}`,
    });
    await mkdir(this.outputDir, { recursive: true });
    const filePath = join(this.outputDir, safeName);
    await writeFile(filePath, Buffer.from(bytes));
    return { pdfPath: filePath, pdfUrl: `/api/en1090/pdf/${safeName}` };
  }

  async generateVerificaSaldaturaPdf(
    verificaId: string,
    aziendaId: string,
    generatedByName: string,
  ): Promise<{ pdfPath: string; pdfUrl: string }> {
    const verifica = await this.prisma.en1090VerificaSaldatura.findFirst({
      where: { id: verificaId, aziendaId },
      include: { commessa: true, saldatura: true, wps: true, materiale: true },
    });
    if (!verifica) throw new Error("Verifica saldatura non trovata");
    const md = [
      `# Verifica Saldatura ${verifica.id}`,
      "",
      `- Commessa: ${verifica.commessa.codice} / ${verifica.commessa.cliente}`,
      `- Giunto: ${verifica.tipoGiunto}`,
      `- Sollecitazione: ${verifica.tipoSollecitazione}`,
      `- WPS: ${verifica.wps?.codice ?? "-"}`,
      `- Materiale: ${verifica.materiale?.codice ?? "-"}`,
      `- Saldatura: ${verifica.saldatura?.id ?? "-"}`,
      "",
      "## Input",
      `- t [mm]: ${verifica.spessoreElemento ?? "-"}`,
      `- a [mm]: ${verifica.golaEffettiva ?? "-"}`,
      `- L [mm]: ${verifica.lunghezza ?? "-"}`,
      `- N_Ed [kN]: ${verifica.forzaNormaleEd ?? 0}`,
      `- V_parallel_Ed [kN]: ${verifica.taglioParalleloEd ?? 0}`,
      `- V_perp_Ed [kN]: ${verifica.taglioPerpendicolareEd ?? 0}`,
      `- M_Ed [kNm]: ${verifica.momentoEd ?? 0}`,
      "",
      "## Formule",
      "- fvw,Rd = betaW * fvwk / gammaM2",
      "- sigma_eq,Ed = sqrt(sigma_perp,Ed^2 + tau_parallel,Ed^2 + tau_perp,Ed^2)",
      "- verifica: sigma_eq,Ed <= fvw,Rd",
      "",
      "## Risultati",
      `- sigmaPerpEd [MPa]: ${verifica.sigmaPerpEd ?? "-"}`,
      `- tauParallelaEd [MPa]: ${verifica.tauParallelaEd ?? "-"}`,
      `- tauPerpEd [MPa]: ${verifica.tauPerpEd ?? "-"}`,
      `- sigmaEqEd [MPa]: ${verifica.sigmaEqEd ?? "-"}`,
      `- fvwRd [MPa]: ${verifica.fvwRd ?? "-"}`,
      `- a_min [mm]: ${verifica.golaMinimaRichiesta ?? "-"}`,
      `- L_min [mm]: ${verifica.lunghezzaMinimaRichiesta ?? "-"}`,
      `- Esito: **${verifica.esito}**`,
      "",
      `Firma RGQ: ${generatedByName} - ${new Date().toLocaleString("it-IT")}`,
    ].join("\n");
    const dir = join(process.cwd(), "EN1090", "VERIFICHE", verifica.commessa.codice);
    await mkdir(dir, { recursive: true });
    const filename = `${verifica.id}.pdf`;
    const out = await this.markdownToPdf(md, filename);
    const target = join(dir, filename);
    await writeFile(target, await readFile(out.pdfPath));
    await this.prisma.en1090VerificaSaldatura.update({
      where: { id: verifica.id },
      data: { pdfPath: target },
    });
    return { pdfPath: target, pdfUrl: `/api/en1090/verifiche-saldature/${verifica.id}/pdf` };
  }
}

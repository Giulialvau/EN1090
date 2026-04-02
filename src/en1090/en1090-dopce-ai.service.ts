import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, type En1090CeTipo } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";

import { En1090PdfService } from "./en1090-pdf.service";

type JwtLike = { aziendaId?: string | null };

@Injectable()
export class En1090DopCeAiService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pdf: En1090PdfService,
  ) {}

  async generaDatiDoP(commessaId: number, user: JwtLike) {
    const aziendaId = user.aziendaId ?? "";
    const commessa = await this.prisma.en1090Commessa.findFirst({
      where: { id: commessaId, aziendaId },
      include: {
        materialiLink: { include: { materiale: true } },
        saldature: true,
      },
    });
    if (!commessa) throw new NotFoundException("Commessa non trovata");
    const wps = await this.prisma.en1090Wps.findMany({ where: { aziendaId } });
    const wpqr = await this.prisma.en1090Wpqr.findMany({ where: { aziendaId } });
    return {
      commessa: {
        id: commessa.id,
        codice: commessa.codice,
        cliente: commessa.cliente,
      },
      materiali: commessa.materialiLink.map((m) => ({
        codice: m.materiale.codice,
        norma: m.materiale.norma,
        certificatoPath: m.materiale.certificatoPath,
        acciaio: m.materiale.acciaio,
      })),
      saldature: commessa.saldature.map((s) => ({
        id: s.id,
        giunto: s.giunto,
        esito: s.esito,
      })),
      wps: wps.map((w) => ({ codice: w.codice, processo: w.processo })),
      wpqr: wpqr.map((w) => ({ codice: w.codice, dataScadenza: w.dataScadenza })),
    };
  }

  async generaDatiCE(commessaId: number, user: JwtLike) {
    const base = await this.generaDatiDoP(commessaId, user);
    return {
      ...base,
      caratteristicheEssenziali: [
        "Resistenza meccanica",
        "Saldabilita",
        "Durabilita",
      ],
      norme: ["EN 1090-1", "EN 1090-2", "EN 10204"],
      identificazioneProdotto: base.commessa.codice,
    };
  }

  async generaDocumentoAI(tipo: "dop" | "ce", dati: Record<string, unknown>) {
    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey) {
      return {
        numero: `${tipo.toUpperCase()}-${Date.now()}`,
        data: new Date().toISOString().slice(0, 10),
        prodotto: (dati.commessa as { codice?: string })?.codice ?? "N/A",
        norma: tipo === "dop" ? "EN 1090-1" : "EN 1090-1 / EN 1090-2",
        materiali: dati.materiali ?? [],
        prestazioni: "Conforme ai dati raccolti",
        firma: "Da validare",
        note: "Generazione fallback senza LLM",
      };
    }
    const prompt = `Genera una ${tipo.toUpperCase()} conforme EN 1090 basata su questi dati e rispondi SOLO JSON con campi {numero,data,prodotto,norma,materiali,prestazioni,firma,note}. DATI: ${JSON.stringify(
      dati,
    ).slice(0, 12000)}`;
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0,
        messages: [
          { role: "system", content: "Rispondi con JSON valido." },
          { role: "user", content: prompt },
        ],
      }),
    });
    if (!res.ok) throw new Error("Errore generazione AI DoP/CE");
    const raw = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = raw.choices?.[0]?.message?.content ?? "{}";
    return JSON.parse(content.replace(/```json|```/g, "").trim()) as Record<
      string,
      unknown
    >;
  }

  async creaDoPAuto(commessaId: number, user: JwtLike) {
    const aziendaId = user.aziendaId ?? "";
    const datiSorgente = await this.generaDatiDoP(commessaId, user);
    const generated = await this.generaDocumentoAI("dop", datiSorgente);
    const markdown = this.toMarkdown("DoP", generated);
    const pdf = await this.pdf.markdownToPdf(markdown, `dop-auto-${commessaId}.pdf`);
    const row = await this.prisma.en1090Dop.create({
      data: {
        aziendaId,
        commessaId,
        contenutoMarkdown: markdown,
        pdfPath: pdf.pdfPath,
        autoGenerata: true,
        datiSorgente: datiSorgente as Prisma.InputJsonValue,
        stato: "DRAFT",
      },
    });
    return { id: row.id, pdfUrl: pdf.pdfUrl, stato: row.stato };
  }

  async creaCeAuto(commessaId: number, tipo: En1090CeTipo, user: JwtLike) {
    const aziendaId = user.aziendaId ?? "";
    const datiSorgente = await this.generaDatiCE(commessaId, user);
    const generated = await this.generaDocumentoAI("ce", datiSorgente);
    const markdown = this.toMarkdown(`CE ${tipo}`, generated);
    const pdf = await this.pdf.markdownToPdf(markdown, `ce-auto-${tipo}-${commessaId}.pdf`);
    const row = await this.prisma.en1090Ce.create({
      data: {
        aziendaId,
        commessaId,
        tipo,
        contenutoMarkdown: markdown,
        pdfPath: pdf.pdfPath,
        autoGenerata: true,
        datiSorgente: datiSorgente as Prisma.InputJsonValue,
        stato: "DRAFT",
      },
    });
    return { id: row.id, pdfUrl: pdf.pdfUrl, stato: row.stato };
  }

  private toMarkdown(title: string, data: Record<string, unknown>) {
    return [`# ${title}`, "", "## Dati generati AI", "", "```json", JSON.stringify(data, null, 2), "```"].join("\n");
  }
}

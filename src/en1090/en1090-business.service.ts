import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { En1090CeTipo, En1090ModuloTipo, Prisma } from "@prisma/client";
import { copyFile, mkdir, writeFile } from "fs/promises";
import { join } from "path";
import archiver from "archiver";
import { createWriteStream } from "fs";

import { PrismaService } from "../prisma/prisma.service";

import { En1090PdfService } from "./en1090-pdf.service";
import { En1090Service } from "./en1090.service";

type Dict = Record<string, unknown>;

@Injectable()
export class En1090BusinessService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly files: En1090Service,
    private readonly pdf: En1090PdfService,
  ) {}

  createCommessa(
    aziendaId: string,
    data: {
    codice: string;
    cliente: string;
    descrizione?: string;
  },
  ) {
    return this.prisma.en1090Commessa.create({
      data: {
        aziendaId,
        codice: data.codice.trim(),
        cliente: data.cliente.trim(),
        descrizione: data.descrizione?.trim(),
        stato: "aperta",
      },
    });
  }

  listCommesse(aziendaId: string) {
    return this.prisma.en1090Commessa.findMany({
      where: { aziendaId },
      orderBy: { id: "desc" },
    });
  }

  async getCommessa(aziendaId: string, id: number) {
    const commessa = await this.prisma.en1090Commessa.findUnique({
      where: { id },
      include: {
        moduli: true,
        dop: true,
        ce: true,
        materialiLink: { include: { materiale: true } },
        saldature: true,
      },
    });
    if (!commessa || commessa.aziendaId !== aziendaId) {
      throw new NotFoundException("Commessa EN1090 non trovata");
    }
    return commessa;
  }

  async patchCommessa(
    aziendaId: string,
    id: number,
    data: { stato?: "aperta" | "chiusa"; descrizione?: string; dataChiusura?: Date },
  ) {
    await this.getCommessa(aziendaId, id);
    return this.prisma.en1090Commessa.update({
      where: { id },
      data: {
        stato: data.stato,
        descrizione: data.descrizione,
        dataChiusura: data.dataChiusura,
      },
    });
  }

  async saveModulo(input: {
    aziendaId: string;
    commessaId: number;
    tipo: En1090ModuloTipo;
    contenutoJson: Dict;
  }) {
    const commessa = await this.getCommessa(input.aziendaId, input.commessaId);
    const contenutoJson = input.contenutoJson as Prisma.InputJsonValue;
    const modulo = await this.prisma.en1090Modulo.upsert({
      where: {
        commessaId_tipo: { commessaId: input.commessaId, tipo: input.tipo },
      },
      update: { contenutoJson, aziendaId: input.aziendaId },
      create: {
        aziendaId: input.aziendaId,
        commessaId: input.commessaId,
        tipo: input.tipo,
        contenutoJson,
      },
    });
    const markdown = this.moduloToMarkdown(
      input.tipo,
      input.contenutoJson,
      commessa.codice,
      modulo.id,
    );
    const markdownPath = `COMPILATI/${commessa.codice}/${input.tipo}_${modulo.id}.md`;
    await this.files.writeMarkdownUnderRoot(markdownPath, markdown);
    const updated = await this.prisma.en1090Modulo.update({
      where: { id: modulo.id },
      data: { markdownPath },
    });
    return { ...updated, markdownPath };
  }

  async getModulo(aziendaId: string, id: number) {
    const modulo = await this.prisma.en1090Modulo.findFirst({
      where: { id, aziendaId },
    });
    if (!modulo) throw new NotFoundException("Modulo EN1090 non trovato");
    return modulo;
  }

  async generateDop(aziendaId: string, commessaId: number, campi: Dict = {}) {
    const commessa = await this.getCommessa(aziendaId, commessaId);
    const template = await this.files.readMarkdownUnderRoot("ALLEGATI/DoP_template.md");
    const markdown = this.applyTemplate(template, {
      COMMESSA: commessa.codice,
      EXC: "—",
      ...campi,
    });
    const pdf = await this.pdf.markdownToPdf(markdown, `dop-${commessa.codice}-${Date.now()}.pdf`);
    const row = await this.prisma.en1090Dop.create({
      data: {
        aziendaId,
        commessaId,
        contenutoMarkdown: markdown,
        pdfPath: pdf.pdfPath,
      },
    });
    return { dopId: row.id, pdfUrl: pdf.pdfUrl };
  }

  async generateCe(
    aziendaId: string,
    commessaId: number,
    tipo: En1090CeTipo,
    campi: Dict = {},
  ) {
    const commessa = await this.getCommessa(aziendaId, commessaId);
    const templateName =
      tipo === "etichetta"
        ? "ALLEGATI/Etichetta_CE_template.md"
        : "ALLEGATI/Marcatura_CE_template.md";
    const template = await this.files.readMarkdownUnderRoot(templateName);
    const markdown = this.applyTemplate(template, {
      COMMESSA: commessa.codice,
      EXC: "—",
      ...campi,
    });
    const pdf = await this.pdf.markdownToPdf(
      markdown,
      `${tipo}-${commessa.codice}-${Date.now()}.pdf`,
    );
    const row = await this.prisma.en1090Ce.create({
      data: {
        aziendaId,
        commessaId,
        tipo,
        contenutoMarkdown: markdown,
        pdfPath: pdf.pdfPath,
      },
    });
    return { ceId: row.id, pdfUrl: pdf.pdfUrl };
  }

  async getDopById(id: number) {
    const row = await this.prisma.en1090Dop.findUnique({ where: { id } });
    if (!row) throw new NotFoundException("DoP non trovata");
    return row;
  }

  async getCeById(id: number) {
    const row = await this.prisma.en1090Ce.findUnique({ where: { id } });
    if (!row) throw new NotFoundException("CE non trovata");
    return row;
  }

  private applyTemplate(md: string, fields: Dict): string {
    let out = md;
    for (const [k, v] of Object.entries(fields)) {
      const value = String(v ?? "");
      out = out.split(`{{${k}}}`).join(value);
    }
    return out;
  }

  private moduloToMarkdown(
    tipo: En1090ModuloTipo,
    json: Dict,
    commessaCodice: string,
    id: number,
  ): string {
    const lines: string[] = [
      `# ${tipo} compilato`,
      "",
      `- Commessa: ${commessaCodice}`,
      `- ID modulo: ${id}`,
      `- Tipo: ${tipo}`,
      `- Data: ${new Date().toISOString()}`,
      "",
      "## Contenuto",
      "",
    ];
    for (const [k, v] of Object.entries(json)) {
      lines.push(`- ${k}: ${typeof v === "object" ? JSON.stringify(v) : String(v)}`);
    }
    lines.push("", "## Collegamenti", "", "- Dati aziendali: `../../MQ/Dati_Aziendali.md`");
    return lines.join("\n");
  }

  createMateriale(
    aziendaId: string,
    data: {
      codice: string;
      descrizione: string;
      norma?: string;
      certificatoPath?: string;
      fornitore?: string;
      lotto?: string;
      dataIngresso: Date;
    },
  ) {
    return this.prisma.en1090Materiale.create({
      data: { aziendaId, ...data },
    });
  }

  listMateriali(aziendaId: string) {
    return this.prisma.en1090Materiale.findMany({
      where: { aziendaId },
      orderBy: { createdAt: "desc" },
    });
  }

  getMateriale(aziendaId: string, id: string) {
    return this.prisma.en1090Materiale.findFirst({ where: { id, aziendaId } });
  }

  patchMateriale(aziendaId: string, id: string, data: Dict) {
    return this.prisma.en1090Materiale.updateMany({
      where: { id, aziendaId },
      data,
    });
  }

  async linkMaterialeToCommessa(
    aziendaId: string,
    commessaId: number,
    materialeId: string,
    quantita?: number,
    note?: string,
  ) {
    await this.getCommessa(aziendaId, commessaId);
    return this.prisma.en1090CommessaMateriale.create({
      data: { aziendaId, commessaId, materialeId, quantita, note },
    });
  }

  createSaldatore(aziendaId: string, data: { nome: string; matricola?: string }) {
    return this.prisma.en1090Saldatore.create({ data: { aziendaId, ...data } });
  }
  listSaldatori(aziendaId: string) {
    return this.prisma.en1090Saldatore.findMany({
      where: { aziendaId },
      include: { qualifiche: true },
      orderBy: { nome: "asc" },
    });
  }
  createWps(aziendaId: string, data: Dict) {
    return this.prisma.en1090Wps.create({ data: { aziendaId, ...data } as never });
  }
  listWps(aziendaId: string) {
    return this.prisma.en1090Wps.findMany({ where: { aziendaId }, include: { wpqr: true } });
  }
  createWpqr(aziendaId: string, data: Dict) {
    return this.prisma.en1090Wpqr.create({ data: { aziendaId, ...data } as never });
  }
  listWpqr(aziendaId: string) {
    return this.prisma.en1090Wpqr.findMany({ where: { aziendaId } });
  }
  createQualifica(aziendaId: string, data: Dict) {
    return this.prisma.en1090QualificaSaldatore.create({
      data: { aziendaId, ...data } as never,
    });
  }
  createSaldatura(aziendaId: string, data: Dict) {
    return this.prisma.en1090Saldatura.create({ data: { aziendaId, ...data } as never });
  }

  async patchSaldaturaMedia(
    aziendaId: string,
    saldaturaId: string,
    field: "fotoPath" | "firmaPath",
    bytes: Buffer,
    ext: ".jpg" | ".png",
  ) {
    const dir = join(process.cwd(), "EN1090", "TABLET", aziendaId, "saldature");
    await mkdir(dir, { recursive: true });
    const rel = `TABLET/${aziendaId}/saldature/${saldaturaId}-${field}${ext}`;
    await writeFile(join(process.cwd(), "EN1090", rel), bytes);
    const updated = await this.prisma.en1090Saldatura.updateMany({
      where: { id: saldaturaId, aziendaId },
      data: { [field]: rel },
    });
    if (updated.count === 0) throw new NotFoundException("Saldatura non trovata");
    return { saldaturaId, [field]: rel };
  }
  listSaldature(aziendaId: string) {
    return this.prisma.en1090Saldatura.findMany({
      where: { aziendaId },
      include: { saldatore: true, wps: true, commessa: true },
      orderBy: { dataSaldatura: "desc" },
    });
  }
  listSaldatureByCommessa(aziendaId: string, commessaId: number) {
    return this.prisma.en1090Saldatura.findMany({
      where: { aziendaId, commessaId },
      include: { saldatore: true, wps: true },
      orderBy: { dataSaldatura: "desc" },
    });
  }

  async getDashboard(aziendaId: string) {
    const [aperte, chiuse, commesse, dopMancanti, scadenzeQualifiche, ingressi] =
      await Promise.all([
        this.prisma.en1090Commessa.count({ where: { aziendaId, stato: "aperta" } }),
        this.prisma.en1090Commessa.count({ where: { aziendaId, stato: "chiusa" } }),
        this.prisma.en1090Commessa.findMany({
          where: { aziendaId },
          include: { moduli: true, dop: true },
        }),
        this.prisma.en1090Commessa.findMany({
          where: { aziendaId, dop: { none: {} } },
          select: { id: true, codice: true, cliente: true },
        }),
        this.prisma.en1090QualificaSaldatore.findMany({
          where: {
            aziendaId,
            dataScadenza: { lte: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) },
          },
          include: { saldatore: true },
        }),
        this.prisma.en1090Materiale.findMany({
          where: {
            aziendaId,
            dataIngresso: { gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30) },
          },
          orderBy: { dataIngresso: "desc" },
          take: 20,
        }),
      ]);
    const moduliMancanti = commesse.map((c) => ({
      commessaId: c.id,
      codice: c.codice,
      mancanti: ["Mod04", "Mod14", "PFC"].filter(
        (m) => !c.moduli.some((x) => x.tipo === m),
      ),
    }));
    return {
      commesseAperte: aperte,
      commesseChiuse: chiuse,
      moduliMancanti,
      dopMancanti,
      qualificheInScadenza: scadenzeQualifiche,
      materialiRecenti: ingressi,
    };
  }

  async closeCommessa(aziendaId: string, commessaId: number) {
    const c = await this.getCommessa(aziendaId, commessaId);
    const missing: string[] = [];
    if (!c.moduli.some((m) => m.tipo === "Mod04")) missing.push("Mod.04");
    if (!c.moduli.some((m) => m.tipo === "PFC")) missing.push("PFC");
    if (!c.moduli.some((m) => m.tipo === "Mod14")) missing.push("Mod.14");
    if (c.dop.length === 0) missing.push("DoP");
    if (!c.ce.some((x) => x.tipo === "etichetta")) missing.push("Etichetta CE");
    if (!c.ce.some((x) => x.tipo === "marcatura")) missing.push("Marcatura CE");
    if (missing.length) {
      throw new BadRequestException({
        message: "Commessa non chiudibile",
        missing,
      });
    }
    await this.prisma.en1090Commessa.update({
      where: { id: commessaId },
      data: { stato: "chiusa", dataChiusura: new Date() },
    });
    const zipUrl = await this.exportCommessaZip(aziendaId, commessaId);
    return { closed: true, zipUrl };
  }

  async exportCommessaZip(aziendaId: string, commessaId: number): Promise<string> {
    const c = await this.getCommessa(aziendaId, commessaId);
    const exportRoot = join(process.cwd(), "exports", "en1090");
    const workDir = join(exportRoot, `${c.codice}-${Date.now()}`);
    await mkdir(workDir, { recursive: true });
    const readme = [
      `Commessa: ${c.codice}`,
      `Cliente: ${c.cliente}`,
      `Stato: ${c.stato}`,
      "",
      "Contenuti inclusi: Moduli, DoP, CE, saldature, materiali.",
    ].join("\n");
    await writeFile(join(workDir, "README.txt"), readme, "utf8");
    const mods = await this.prisma.en1090Modulo.findMany({
      where: { aziendaId, commessaId },
    });
    await mkdir(join(workDir, "moduli"), { recursive: true });
    for (const m of mods) {
      if (m.markdownPath) {
        const abs = join(this.files.getRootDir(), m.markdownPath);
        await copyFile(abs, join(workDir, "moduli", `${m.tipo}_${m.id}.md`)).catch(() => null);
      }
    }
    const zipName = `${c.codice}_export.zip`;
    const zipAbs = join(exportRoot, zipName);
    await mkdir(exportRoot, { recursive: true });
    await new Promise<void>((resolvePromise, reject) => {
      const output = createWriteStream(zipAbs);
      const archive = archiver("zip", { zlib: { level: 9 } });
      output.on("close", () => resolvePromise());
      archive.on("error", (err: unknown) => reject(err));
      archive.pipe(output);
      archive.directory(workDir, false);
      void archive.finalize();
    });
    return `/api/en1090/exports/${encodeURIComponent(zipName)}`;
  }
}

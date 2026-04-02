import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import { join } from "path";

import { Prisma } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";

type JwtLike = { aziendaId?: string | null };

@Injectable()
export class En1090CertificatiService {
  constructor(private readonly prisma: PrismaService) {}

  async uploadCertificato(file: Express.Multer.File, user: JwtLike) {
    const aziendaId = user.aziendaId ?? "tenant";
    const dir = join(process.cwd(), "EN1090", "CERTIFICATI", aziendaId);
    await mkdir(dir, { recursive: true });
    const filename = `${randomUUID()}.pdf`;
    const absPath = join(dir, filename);
    await writeFile(absPath, file.buffer);
    return {
      path: `CERTIFICATI/${aziendaId}/${filename}`,
      filename,
    };
  }

  async estraiDatiCertificato(path: string) {
    const absPath = join(process.cwd(), "EN1090", path.replace(/^\/+/, ""));
    const bytes = await readFile(absPath);
    const pdfParseModule = await import("pdf-parse");
    const parser = (pdfParseModule as unknown as { default?: (b: Buffer) => Promise<{ text?: string }> }).default ??
      (pdfParseModule as unknown as (b: Buffer) => Promise<{ text?: string }>);
    const parsed = await parser(bytes);
    const text = this.clean(parsed.text ?? "");

    const base = this.regexExtract(text);
    const ai = await this.tryAiParse(text);
    return {
      path,
      rawTextSample: text.slice(0, 2000),
      ...base,
      ...ai,
      analisiChimica: { ...(base.analisiChimica ?? {}), ...(ai.analisiChimica ?? {}) },
      proprietaMeccaniche: {
        ...(base.proprietaMeccaniche ?? {}),
        ...(ai.proprietaMeccaniche ?? {}),
      },
    };
  }

  async creaMaterialeDaCertificato(
    dto: {
      path: string;
      codice?: string;
      descrizione?: string;
      norma?: string;
      fornitore?: string;
      lotto?: string;
      colata?: string;
      acciaio?: string;
      analisiChimica?: Record<string, unknown>;
      proprietaMeccaniche?: Record<string, unknown>;
    },
    user: JwtLike,
  ) {
    const aziendaId = user.aziendaId ?? "";
    const codiceFallback = dto.colata || dto.lotto || randomUUID().slice(0, 8);
    const material = await this.prisma.en1090Materiale.create({
      data: {
        aziendaId,
        codice: dto.codice?.trim() || `MAT-${codiceFallback}`,
        descrizione: dto.descrizione?.trim() || "Materiale da certificato 3.1",
        norma: dto.norma?.trim(),
        certificatoPath: dto.path,
        fornitore: dto.fornitore?.trim(),
        lotto: dto.lotto?.trim(),
        colata: dto.colata?.trim(),
        acciaio: dto.acciaio?.trim(),
        analisiChimica: dto.analisiChimica as Prisma.InputJsonValue | undefined,
        proprietaMeccaniche:
          dto.proprietaMeccaniche as Prisma.InputJsonValue | undefined,
        dataIngresso: new Date(),
      },
    });
    return material;
  }

  private clean(t: string): string {
    return t.replace(/\r/g, "\n").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n");
  }

  private regexExtract(text: string) {
    const find = (re: RegExp) => text.match(re)?.[1]?.trim() ?? null;
    const asNum = (v: string | null) => {
      if (!v) return null;
      const n = Number(v.replace(",", "."));
      return Number.isFinite(n) ? n : null;
    };

    const acciaio = text.match(/\b(S[0-9]{3}[A-Z0-9]*)\b/i)?.[1] ?? null;
    const colata =
      text.match(/(?:Heat|Colata|Melt)\s*[:\-]?\s*([A-Za-z0-9\-]+)/i)?.[1] ?? null;
    const fornitore =
      find(/(?:Fornitore|Supplier)\s*[:\-]?\s*([^\n]+)/i) ??
      find(/(?:Producer|Mill)\s*[:\-]?\s*([^\n]+)/i);
    const lotto = find(/(?:Lotto|Lot)\s*[:\-]?\s*([A-Za-z0-9\-]+)/i);
    const norma =
      text.match(/\b(EN\s*10(?:025|204)[^\n,;]*)/i)?.[1]?.trim() ??
      text.match(/\b(EN\s*10[0-9]{3}[^\n,;]*)/i)?.[1]?.trim() ??
      null;

    const analisiChimica = {
      C: asNum(find(/\bC\s*[:=]?\s*([0-9]+[.,]?[0-9]*)\s*%?/i)),
      Mn: asNum(find(/\bMn\s*[:=]?\s*([0-9]+[.,]?[0-9]*)\s*%?/i)),
      Si: asNum(find(/\bSi\s*[:=]?\s*([0-9]+[.,]?[0-9]*)\s*%?/i)),
      P: asNum(find(/\bP\s*[:=]?\s*([0-9]+[.,]?[0-9]*)\s*%?/i)),
      S: asNum(find(/\bS\s*[:=]?\s*([0-9]+[.,]?[0-9]*)\s*%?/i)),
    };

    const proprietaMeccaniche = {
      ReH: asNum(find(/(?:ReH|Yield)\s*[:=]?\s*([0-9]+[.,]?[0-9]*)/i)),
      Rm: asNum(find(/\bRm\s*[:=]?\s*([0-9]+[.,]?[0-9]*)/i)),
      A: asNum(find(/\bA(?:5|%)?\s*[:=]?\s*([0-9]+[.,]?[0-9]*)\s*%?/i)),
    };

    return { acciaio, colata, fornitore, lotto, norma, analisiChimica, proprietaMeccaniche };
  }

  private async tryAiParse(text: string): Promise<Record<string, unknown>> {
    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey) return {};
    try {
      const prompt =
        "Analizza testo certificato EN 10204 3.1. Restituisci SOLO JSON: " +
        "{ acciaio, colata, analisiChimica:{C,Mn,Si,P,S}, proprietaMeccaniche:{ReH,Rm,A}, fornitore, lotto, norma }";
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
            { role: "user", content: `${prompt}\n\nTESTO:\n${text.slice(0, 12000)}` },
          ],
        }),
      });
      if (!res.ok) return {};
      const raw = (await res.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const content = raw.choices?.[0]?.message?.content ?? "{}";
      const cleaned = content.replace(/```json|```/g, "").trim();
      return JSON.parse(cleaned) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
}

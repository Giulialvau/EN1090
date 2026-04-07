import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { Commessa, Prisma } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";

import { CreateCommessaDto } from "./dto/create-commessa.dto";
import { QueryCommessaDto } from "./dto/query-commessa.dto";
import { UpdateCommessaDto } from "./dto/update-commessa.dto";

/** Evita .trim su valori non-stringa (es. query duplicati → array) */
function normalizeQueryString(v: unknown): string | undefined {
  if (v == null) return undefined;
  if (typeof v === "string") {
    const t = v.trim();
    return t.length ? t : undefined;
  }
  if (Array.isArray(v)) {
    const first = v[0];
    if (typeof first === "string") {
      const t = first.trim();
      return t.length ? t : undefined;
    }
  }
  return undefined;
}

function parseDateBoundStart(s: unknown): Date | undefined {
  if (typeof s !== "string" || !s.trim()) return undefined;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

function parseDateBoundEndInclusive(s: unknown): Date | undefined {
  if (typeof s !== "string" || !s.trim()) return undefined;
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return undefined;
  d.setHours(23, 59, 59, 999);
  return d;
}

const commessaIncludeFull = {
  materiali: true,
  documenti: true,
  pianiControllo: true,
  nonConformita: true,
  audits: true,
  wps: true,
  wpqr: true,
  checklist: true,
  tracciabilita: {
    include: {
      materiale: {
        select: { id: true, codice: true, lotto: true, descrizione: true },
      },
    },
  },
} satisfies Prisma.CommessaInclude;

@Injectable()
export class CommesseService {
  private readonly logger = new Logger(CommesseService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCommessaDto) {
    const exists = await this.prisma.commessa.findUnique({
      where: { codice: dto.codice },
    });
    if (exists) {
      throw new ConflictException(
        `Commessa con codice ${dto.codice} già esistente`,
      );
    }
    return this.prisma.commessa.create({
      data: {
        codice: dto.codice,
        titolo: dto.titolo,
        cliente: dto.cliente,
        descrizione: dto.descrizione,
        responsabile: dto.responsabile,
        luogo: dto.luogo,
        note: dto.note,
        dataInizio: dto.dataInizio,
        dataFine: dto.dataFine,
        stato: dto.stato ?? "BOZZA",
      },
    });
  }

  private buildCommessaWhere(
    query?: QueryCommessaDto,
  ): Prisma.CommessaWhereInput {
    const where: Prisma.CommessaWhereInput = {};

    if (query?.stato) {
      where.stato = query.stato;
    }

    const cliente = normalizeQueryString(query?.cliente);
    if (cliente) {
      where.cliente = {
        contains: cliente,
        mode: "insensitive",
      };
    }

    const dataInizioDa = parseDateBoundStart(query?.dataInizioDa);
    const dataInizioA = parseDateBoundEndInclusive(query?.dataInizioA);
    if (dataInizioDa || dataInizioA) {
      const di: Prisma.DateTimeNullableFilter = {};
      if (dataInizioDa) di.gte = dataInizioDa;
      if (dataInizioA) di.lte = dataInizioA;
      where.dataInizio = di;
    }

    return where;
  }

  /**
   * Elenco commesse: nessuna relazione inclusa.
   * In caso di errore Prisma o query non valida non propaga 500: ritorna [].
   */
  async findAll(query?: QueryCommessaDto): Promise<Commessa[]> {
    try {
      return await this.prisma.commessa.findMany({
        where: this.buildCommessaWhere(query),
        orderBy: { codice: "asc" },
      });
    } catch (err) {
      this.logger.error(
        "commesse.findAll: operazione fallita",
        err instanceof Error ? err.stack : err,
      );
      return [];
    }
  }

  async findOne(id: number) {
    const row = await this.prisma.commessa.findUnique({
      where: { id },
      include: commessaIncludeFull,
    });
    if (!row) {
      throw new NotFoundException(`Commessa ${id} non trovata`);
    }
    return row;
  }

  async update(id: number, dto: UpdateCommessaDto) {
    const current = await this.ensureExists(id);
    if (dto.stato && dto.stato !== current.stato) {
      await this.validateStateTransition(id, current.stato, dto.stato, {
        dataInizio: dto.dataInizio ?? current.dataInizio ?? undefined,
      });
    }
    if (dto.codice) {
      const clash = await this.prisma.commessa.findFirst({
        where: { codice: dto.codice, NOT: { id } },
      });
      if (clash) {
        throw new ConflictException(`Codice commessa ${dto.codice} già in uso`);
      }
    }
    const {
      codice,
      titolo,
      cliente,
      descrizione,
      responsabile,
      luogo,
      note,
      dataInizio,
      dataFine,
      stato,
    } = dto;
    return this.prisma.commessa.update({
      where: { id },
      data: {
        codice,
        titolo,
        cliente,
        descrizione,
        responsabile,
        luogo,
        note,
        dataInizio,
        dataFine,
        stato,
      },
    });
  }

  async remove(id: number) {
    await this.ensureExists(id);
    await this.prisma.commessa.delete({ where: { id } });
    return { deleted: true, id };
  }

  private async ensureExists(id: number) {
    const c = await this.prisma.commessa.findUnique({ where: { id } });
    if (!c) {
      throw new NotFoundException(`Commessa ${id} non trovata`);
    }
    return c;
  }

  private async validateStateTransition(
    commessaId: number,
    current: string,
    next: string,
    context: { dataInizio?: Date },
  ): Promise<void> {
    if (current === "CHIUSA" && next !== "CHIUSA") {
      throw new BadRequestException(
        "Una commessa chiusa non puo tornare in stato precedente.",
      );
    }
    if (next === "IN_CORSO") {
      if (!context.dataInizio) {
        throw new BadRequestException(
          "Per passare IN_CORSO e obbligatoria la data inizio.",
        );
      }
      const [materiali, piani] = await Promise.all([
        this.prisma.materiale.count({ where: { commessaId } }),
        this.prisma.pianoControllo.count({ where: { commessaId } }),
      ]);
      if (materiali === 0 || piani === 0) {
        throw new BadRequestException(
          "Per passare IN_CORSO servono almeno un materiale e un piano di controllo.",
        );
      }
    }
    if (next === "CHIUSA") {
      const [openNc, incompleteAudit, incompleteChecklist, noTrace, missingWpsWpqr] =
        await Promise.all([
          this.prisma.nonConformita.count({
            where: { commessaId, stato: { not: "CHIUSA" } },
          }),
          this.prisma.audit.count({
            where: {
              commessaId,
              OR: [{ note: null }, { note: "" }],
            },
          }),
          this.prisma.checklist.count({
            where: {
              commessaId,
              OR: [{ stato: { in: ["APERTA", "IN_CORSO"] } }, { esito: null }],
            },
          }),
          this.prisma.tracciabilita.count({ where: { commessaId } }),
          this.prisma.wps.count({
            where: { commessaId, wpqr: { none: { scadenza: { gt: new Date() } } } },
          }),
        ]);
      if (openNc > 0) {
        throw new BadRequestException(
          "Impossibile chiudere commessa: sono presenti non conformita aperte.",
        );
      }
      if (incompleteAudit > 0) {
        throw new BadRequestException(
          "Impossibile chiudere commessa: audit incompleti (note mancanti).",
        );
      }
      if (incompleteChecklist > 0) {
        throw new BadRequestException(
          "Impossibile chiudere commessa: checklist non completate o senza esito.",
        );
      }
      if (noTrace === 0) {
        throw new BadRequestException(
          "Impossibile chiudere commessa senza almeno un record di tracciabilita.",
        );
      }
      if (missingWpsWpqr > 0) {
        throw new BadRequestException(
          "Impossibile chiudere commessa: ogni WPS deve avere almeno un WPQR valido.",
        );
      }
    }
  }
}

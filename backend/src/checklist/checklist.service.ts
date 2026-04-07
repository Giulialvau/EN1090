import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";

import { CreateChecklistDto } from "./dto/create-checklist.dto";
import { UpdateChecklistDto } from "./dto/update-checklist.dto";

const checklistInclude = {
  commessa: { select: { id: true, codice: true, cliente: true } },
} as const;

@Injectable()
export class ChecklistService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateChecklistDto) {
    await this.ensureCommessa(dto.commessaId);
    this.validateChecklistRules(dto.stato, dto.esito, dto.fase, dto.note, dto.allegati);
    const elementi = dto.elementi ?? [];
    return this.prisma.checklist.create({
      data: {
        titolo: dto.titolo,
        categoria: dto.categoria,
        fase: dto.fase,
        dataCompilazione: dto.dataCompilazione,
        esito: dto.esito,
        note: dto.note,
        operatore: dto.operatore,
        allegati:
          dto.allegati === undefined
            ? undefined
            : (dto.allegati as Prisma.InputJsonValue),
        stato: dto.stato,
        elementi: elementi as unknown as Prisma.InputJsonValue,
        commessa: { connect: { id: dto.commessaId } },
      },
      include: checklistInclude,
    });
  }

  findAll() {
    return this.prisma.checklist.findMany({
      orderBy: [{ dataCompilazione: "desc" }, { titolo: "asc" }],
      include: checklistInclude,
    });
  }

  async findByCommessa(commessaId: number) {
    await this.ensureCommessa(commessaId);
    return this.prisma.checklist.findMany({
      where: { commessaId },
      orderBy: [{ dataCompilazione: "desc" }, { titolo: "asc" }],
      include: checklistInclude,
    });
  }

  async findOne(id: number) {
    const row = await this.prisma.checklist.findUnique({
      where: { id },
      include: { commessa: true },
    });
    if (!row) {
      throw new NotFoundException(`Checklist ${id} non trovata`);
    }
    return row;
  }

  async update(id: number, dto: UpdateChecklistDto) {
    const current = await this.ensureExists(id);
    if (dto.commessaId) {
      await this.ensureCommessa(dto.commessaId);
    }
    this.validateChecklistRules(
      dto.stato ?? current.stato,
      dto.esito ?? current.esito ?? undefined,
      dto.fase ?? current.fase ?? undefined,
      dto.note ?? current.note ?? undefined,
      dto.allegati !== undefined ? dto.allegati : current.allegati,
    );
    const data: Prisma.ChecklistUpdateInput = {
      titolo: dto.titolo,
      categoria: dto.categoria,
      fase: dto.fase,
      dataCompilazione: dto.dataCompilazione,
      esito: dto.esito,
      note: dto.note,
      operatore: dto.operatore,
      stato: dto.stato,
    };
    if (dto.allegati !== undefined) {
      data.allegati = dto.allegati as Prisma.InputJsonValue;
    }
    if (dto.commessaId !== undefined) {
      // commessa è obbligatoria nello schema: non supportiamo disconnect.
      data.commessa = { connect: { id: dto.commessaId } };
    }
    if (dto.elementi !== undefined) {
      data.elementi = dto.elementi as unknown as Prisma.InputJsonValue;
    }
    return this.prisma.checklist.update({
      where: { id },
      data,
      include: checklistInclude,
    });
  }

  async remove(id: number) {
    await this.ensureExists(id);
    await this.prisma.checklist.delete({ where: { id } });
    return { deleted: true, id };
  }

  private async ensureCommessa(commessaId: number): Promise<void> {
    const c = await this.prisma.commessa.findUnique({
      where: { id: commessaId },
    });
    if (!c) {
      throw new NotFoundException(`Commessa ${commessaId} non trovata`);
    }
  }

  private async ensureExists(id: number) {
    const x = await this.prisma.checklist.findUnique({ where: { id } });
    if (!x) {
      throw new NotFoundException(`Checklist ${id} non trovata`);
    }
    return x;
  }

  private validateChecklistRules(
    stato: string,
    esito: string | undefined,
    fase: string | undefined,
    note: string | undefined,
    allegati: unknown,
  ): void {
    if (!fase?.trim()) {
      throw new BadRequestException("Il campo fase e obbligatorio.");
    }
    if (stato === "COMPLETATA") {
      if (!esito) {
        throw new BadRequestException(
          "Non puoi completare la checklist senza esito.",
        );
      }
      if (!note?.trim()) {
        throw new BadRequestException(
          "Per checklist completata le note sono obbligatorie.",
        );
      }
      if (!Array.isArray(allegati) || allegati.length === 0) {
        throw new BadRequestException(
          "Per checklist completata serve almeno un allegato.",
        );
      }
    }
  }
}

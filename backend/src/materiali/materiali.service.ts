import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";

import { CreateMaterialeDto } from "./dto/create-materiale.dto";
import { UpdateMaterialeDto } from "./dto/update-materiale.dto";

const materialeInclude = {
  commessa: { select: { id: true, codice: true, cliente: true } },
  certificatoDocumento: {
    select: {
      id: true,
      nome: true,
      tipo: true,
      versione: true,
      percorsoFile: true,
    },
  },
} as const;

@Injectable()
export class MaterialiService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateMaterialeDto) {
    await this.ensureCommessa(dto.commessaId);
    await this.validateCertificatoDocumento(
      dto.commessaId,
      dto.certificatoDocumentoId,
    );

    const dup = await this.prisma.materiale.findUnique({
      where: {
        commessaId_codice: { commessaId: dto.commessaId, codice: dto.codice },
      },
    });
    if (dup) {
      throw new ConflictException(
        `Materiale ${dto.codice} già presente per questa commessa`,
      );
    }
    return this.prisma.materiale.create({
      data: {
        codice: dto.codice,
        descrizione: dto.descrizione,
        tipo: dto.tipo,
        norma: dto.norma,
        certificato31: dto.certificato31,
        heatNumber: undefined,
        lotto: dto.lotto,
        fornitore: dto.fornitore,
        dataCarico: dto.dataCarico,
        commessa: { connect: { id: dto.commessaId } },
        certificatoDocumento: dto.certificatoDocumentoId
          ? { connect: { id: dto.certificatoDocumentoId } }
          : undefined,
      },
      include: materialeInclude,
    });
  }

  findAll() {
    return this.prisma.materiale.findMany({
      orderBy: [{ commessaId: "asc" }, { codice: "asc" }],
      include: materialeInclude,
    });
  }

  /** Materiali di una commessa (per GET /commesse/:id/materiali) */
  async findByCommessa(commessaId: number) {
    await this.ensureCommessa(commessaId);
    return this.prisma.materiale.findMany({
      where: { commessaId },
      orderBy: { codice: "asc" },
      include: materialeInclude,
    });
  }

  async findOne(id: number) {
    const row = await this.prisma.materiale.findUnique({
      where: { id },
      include: {
        ...materialeInclude,
        tracciabilita: true,
      },
    });
    if (!row) {
      throw new NotFoundException(`Materiale ${id} non trovato`);
    }
    return row;
  }

  async update(id: number, dto: UpdateMaterialeDto) {
    const current = await this.prisma.materiale.findUnique({ where: { id } });
    if (!current) {
      throw new NotFoundException(`Materiale ${id} non trovato`);
    }

    const targetCommessaId = dto.commessaId ?? current.commessaId;
    const prevCertId = current.certificatoDocumentoId;
    await this.validateCertificatoDocumento(
      targetCommessaId,
      dto.certificatoDocumentoId !== undefined
        ? dto.certificatoDocumentoId
        : prevCertId,
    );

    if (dto.commessaId && dto.codice) {
      const clash = await this.prisma.materiale.findFirst({
        where: {
          commessaId: dto.commessaId,
          codice: dto.codice,
          NOT: { id },
        },
      });
      if (clash) {
        throw new ConflictException(
          "Codice materiale duplicato per la commessa",
        );
      }
    } else if (dto.codice && dto.codice !== current.codice) {
      const clash = await this.prisma.materiale.findFirst({
        where: {
          commessaId: current.commessaId,
          codice: dto.codice,
          NOT: { id },
        },
      });
      if (clash) {
        throw new ConflictException(
          "Codice materiale duplicato per la commessa",
        );
      }
    }

    return this.prisma.materiale.update({
      where: { id },
      data: {
        codice: dto.codice,
        descrizione: dto.descrizione,
        tipo: dto.tipo,
        norma: dto.norma,
        certificato31: dto.certificato31,
        lotto: dto.lotto,
        fornitore: dto.fornitore,
        dataCarico: dto.dataCarico,
        ...(dto.commessaId !== undefined
          ? { commessa: { connect: { id: dto.commessaId } } }
          : {}),
        ...(dto.certificatoDocumentoId !== undefined
          ? {
              certificatoDocumento: dto.certificatoDocumentoId
                ? { connect: { id: dto.certificatoDocumentoId } }
                : { disconnect: true },
            }
          : {}),
      },
      include: materialeInclude,
    });
  }

  async remove(id: number) {
    await this.ensureExists(id);
    await this.prisma.materiale.delete({ where: { id } });
    return { deleted: true, id };
  }

  private async validateCertificatoDocumento(
    commessaId: number,
    documentoId: number | null | undefined,
  ): Promise<void> {
    if (!documentoId) return;
    const doc = await this.prisma.documento.findUnique({
      where: { id: documentoId },
    });
    if (!doc) {
      throw new NotFoundException(
        `Documento certificato ${documentoId} non trovato`,
      );
    }
    if (doc.commessaId !== commessaId) {
      throw new BadRequestException(
        "Il documento certificato deve appartenere alla stessa commessa del materiale",
      );
    }
  }

  private async ensureCommessa(commessaId: number): Promise<void> {
    const c = await this.prisma.commessa.findUnique({
      where: { id: commessaId },
    });
    if (!c) {
      throw new NotFoundException(`Commessa ${commessaId} non trovata`);
    }
  }

  private async ensureExists(id: number): Promise<void> {
    const m = await this.prisma.materiale.findUnique({ where: { id } });
    if (!m) {
      throw new NotFoundException(`Materiale ${id} non trovato`);
    }
  }
}

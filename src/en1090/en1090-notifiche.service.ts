import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";

import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class En1090NotificheService {
  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async generaNotificheGiornaliere() {
    const aziende = await this.prisma.azienda.findMany({ select: { id: true } });
    for (const a of aziende) {
      await Promise.all([
        this.controllaScadenzeQualifiche(a.id),
        this.controllaScadenzeMateriali(a.id),
        this.controllaCertificatiMancanti(a.id),
        this.controllaCommesseDaChiudere(a.id),
      ]);
    }
  }

  async controllaScadenzeQualifiche(aziendaId: string) {
    const soon = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    const rows = await this.prisma.en1090QualificaSaldatore.findMany({
      where: { aziendaId, dataScadenza: { lte: soon } },
      include: { saldatore: true },
    });
    await Promise.all(
      rows.map((r) =>
        this.create(aziendaId, {
          tipo: "QUALIFICA_SCADENZA",
          messaggio: `Qualifica saldatore ${r.saldatore.nome} in scadenza`,
          entityId: r.id,
          entityType: "qualifica",
        }),
      ),
    );
  }

  async controllaScadenzeMateriali(aziendaId: string) {
    const old = new Date(Date.now() - 1000 * 60 * 60 * 24 * 180);
    const rows = await this.prisma.en1090Materiale.findMany({
      where: { aziendaId, dataIngresso: { lte: old } },
      take: 50,
    });
    await Promise.all(
      rows.map((m) =>
        this.create(aziendaId, {
          tipo: "MATERIALE_SCADENZA",
          messaggio: `Materiale ${m.codice} in archivio da oltre 180 giorni`,
          entityId: m.id,
          entityType: "materiale",
        }),
      ),
    );
  }

  async controllaCertificatiMancanti(aziendaId: string) {
    const rows = await this.prisma.en1090Materiale.findMany({
      where: { aziendaId, certificatoPath: null },
      take: 100,
    });
    await Promise.all(
      rows.map((m) =>
        this.create(aziendaId, {
          tipo: "CERTIFICATO_MANCANTE",
          messaggio: `Materiale ${m.codice} senza certificato 3.1`,
          entityId: m.id,
          entityType: "materiale",
        }),
      ),
    );
  }

  async controllaCommesseDaChiudere(aziendaId: string) {
    const rows = await this.prisma.en1090Commessa.findMany({
      where: { aziendaId, stato: "aperta" },
      include: { dop: true, ce: true, moduli: true },
    });
    for (const c of rows) {
      const missing = [
        c.dop.length === 0 ? "DoP" : null,
        !c.ce.some((x) => x.tipo === "etichetta") ? "Etichetta CE" : null,
        !c.ce.some((x) => x.tipo === "marcatura") ? "Marcatura CE" : null,
        !c.moduli.some((m) => m.tipo === "Mod04") ? "Mod.04" : null,
        !c.moduli.some((m) => m.tipo === "Mod14") ? "Mod.14" : null,
        !c.moduli.some((m) => m.tipo === "PFC") ? "PFC" : null,
      ].filter(Boolean);
      if (missing.length) {
        await this.create(aziendaId, {
          tipo: "MODULO_MANCANTE",
          messaggio: `Commessa ${c.codice} incompleta: ${missing.join(", ")}`,
          entityId: String(c.id),
          entityType: "commessa",
          commessaId: c.id,
        });
      }
    }
  }

  list(aziendaId: string) {
    return this.prisma.en1090Notifica.findMany({
      where: { aziendaId },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  }

  markRead(aziendaId: string, id: string) {
    return this.prisma.en1090Notifica.updateMany({
      where: { id, aziendaId },
      data: { letta: true },
    });
  }

  private create(
    aziendaId: string,
    payload: {
      tipo: string;
      messaggio: string;
      entityId?: string;
      entityType?: string;
      commessaId?: number;
    },
  ) {
    return this.prisma.en1090Notifica.create({
      data: { aziendaId, ...payload },
    });
  }
}

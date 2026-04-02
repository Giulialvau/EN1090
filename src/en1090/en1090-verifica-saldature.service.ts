import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";

import { En1090VerificaSaldaturaDto } from "./dto/en1090.dto";

type JwtLike = { sub?: string; aziendaId?: string | null };

@Injectable()
export class En1090VerificaSaldatureService {
  constructor(private readonly prisma: PrismaService) {}

  async verifyWeld(input: En1090VerificaSaldaturaDto, user: JwtLike) {
    const aziendaId = user.aziendaId ?? "";
    const createdById = user.sub ?? null;
    if (!aziendaId) throw new NotFoundException("Tenant non trovato nel JWT");

    const commessa = await this.prisma.en1090Commessa.findFirst({
      where: { id: input.commessaId, aziendaId },
    });
    if (!commessa) throw new NotFoundException("Commessa non trovata");

    const [wps, materiale, saldatura] = await Promise.all([
      input.wpsId
        ? this.prisma.en1090Wps.findFirst({
            where: { id: input.wpsId, aziendaId },
          })
        : Promise.resolve(null),
      input.materialeId
        ? this.prisma.en1090Materiale.findFirst({
            where: { id: input.materialeId, aziendaId },
          })
        : Promise.resolve(null),
      input.saldaturaId
        ? this.prisma.en1090Saldatura.findFirst({
            where: { id: input.saldaturaId, aziendaId },
          })
        : Promise.resolve(null),
    ]);

    const fu = this.materialFu(materiale?.norma);
    const fvwk = input.fvwk ?? 0.8 * fu;
    const gammaM2 = input.gammaM2 ?? 1.25;
    const betaW = input.betaW ?? (input.tipoGiunto.toLowerCase() === "fillet" ? 0.8 : 1.0);
    const fvwRd = (betaW * fvwk) / gammaM2;

    const a = input.golaEffettiva ?? null;
    const L = input.lunghezza ?? null;
    const area = a && L ? a * L : null; // mm2

    const nN = (input.forzaNormaleEd ?? 0) * 1000; // kN -> N
    const vpN = (input.taglioParalleloEd ?? 0) * 1000;
    const vtN = (input.taglioPerpendicolareEd ?? 0) * 1000;

    const sigmaPerpEd = area ? nN / area : null; // MPa
    const tauParallelaEd = area ? vpN / area : null;
    const tauPerpEd = area ? vtN / area : null;
    const sigmaEqEd =
      sigmaPerpEd !== null && tauParallelaEd !== null && tauPerpEd !== null
        ? Math.sqrt(
            sigmaPerpEd * sigmaPerpEd +
              tauParallelaEd * tauParallelaEd +
              tauPerpEd * tauPerpEd,
          )
        : null;

    const fEqN = Math.sqrt(nN * nN + vpN * vpN + vtN * vtN);
    const golaMinimaRichiesta = L ? fEqN / (L * fvwRd) : null;
    const lunghezzaMinimaRichiesta = a ? fEqN / (a * fvwRd) : null;
    const esito =
      sigmaEqEd !== null && Number.isFinite(sigmaEqEd) && sigmaEqEd <= fvwRd
        ? "PASS"
        : "FAIL";

    const noteAuto =
      area === null
        ? "golaEffettiva o lunghezza non valorizzate: tensioni non calcolabili."
        : null;

    return this.prisma.en1090VerificaSaldatura.create({
      data: {
        aziendaId,
        commessaId: input.commessaId,
        saldaturaId: input.saldaturaId,
        wpsId: input.wpsId,
        materialeId: input.materialeId,
        tipoGiunto: input.tipoGiunto,
        tipoSollecitazione: input.tipoSollecitazione,
        spessoreElemento: input.spessoreElemento,
        golaEffettiva: input.golaEffettiva,
        lunghezza: input.lunghezza,
        forzaNormaleEd: input.forzaNormaleEd,
        taglioParalleloEd: input.taglioParalleloEd,
        taglioPerpendicolareEd: input.taglioPerpendicolareEd,
        momentoEd: input.momentoEd,
        fvwk,
        gammaM2,
        betaW,
        sigmaPerpEd,
        tauParallelaEd,
        tauPerpEd,
        sigmaEqEd,
        fvwRd,
        golaMinimaRichiesta,
        lunghezzaMinimaRichiesta,
        esito,
        note: noteAuto,
        createdById,
      },
      include: { commessa: true, saldatura: true, wps: true, materiale: true },
    });
  }

  async getOne(id: string, user: JwtLike) {
    const row = await this.prisma.en1090VerificaSaldatura.findFirst({
      where: { id, aziendaId: user.aziendaId ?? "" },
      include: { commessa: true, saldatura: true, wps: true, materiale: true },
    });
    if (!row) throw new NotFoundException("Verifica saldatura non trovata");
    return row;
  }

  async listByCommessa(commessaId: number, user: JwtLike) {
    return this.prisma.en1090VerificaSaldatura.findMany({
      where: { commessaId, aziendaId: user.aziendaId ?? "" },
      orderBy: { createdAt: "desc" },
    });
  }

  private materialFu(norma?: string | null): number {
    const n = (norma ?? "").toUpperCase();
    if (n.includes("S355")) return 510;
    if (n.includes("S275")) return 430;
    if (n.includes("S235")) return 360;
    return 430;
  }
}

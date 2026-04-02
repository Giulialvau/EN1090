import * as bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

type UserRow = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  passwordHash: string;
  refreshTokenHash: string | null;
};

type CommessaRow = {
  id: number;
  codice: string;
  cliente: string;
  note?: string | null;
};

type MaterialeRow = {
  id: number;
  commessaId: number;
  codice: string;
  descrizione: string;
  tipo?: string | null;
  norma?: string | null;
  certificato31?: string | null;
  lotto?: string | null;
  fornitore?: string | null;
  dataCarico?: Date | null;
  certificatoDocumentoId?: number | null;
};

type DocumentoRow = {
  id: number;
  commessaId: number;
  nome: string;
  tipo: string;
  versione: string;
  percorsoFile: string;
  statoApprovazione: string;
};

type ChecklistRow = {
  id: number;
  commessaId: number;
  titolo: string;
  categoria: string;
  fase?: string | null;
  dataCompilazione?: Date | null;
  stato?: string | null;
  esito?: string | null;
  note?: string | null;
  operatore?: string | null;
  elementi?: unknown;
  allegati?: unknown;
};

type SimpleWithCommessa = { id: number; commessaId: number };

function uuidLike() {
  return "00000000-0000-4000-8000-000000000000";
}

export function createE2EPrismaMock() {
  let commessaSeq = 1;
  let materialeSeq = 1;
  let documentoSeq = 1;
  let checklistSeq = 1;
  let attrezzaturaSeq = 1;
  let auditSeq = 1;
  let ncSeq = 1;
  let pianoSeq = 1;
  let tracciabilitaSeq = 1;
  let wpsSeq = 1;
  let wpqrSeq = 1;

  const users: UserRow[] = [
    {
      id: uuidLike(),
      email: "admin@example.com",
      firstName: "Admin",
      lastName: "User",
      role: Role.ADMIN,
      passwordHash: bcrypt.hashSync("admin1234", 10),
      refreshTokenHash: null,
    },
  ];

  const commesse: CommessaRow[] = [];
  const materiali: MaterialeRow[] = [];
  const documenti: DocumentoRow[] = [];
  const checklists: ChecklistRow[] = [];

  const attrezzature: Array<{ id: number; nome: string; matricola: string }> =
    [];
  const audits: Array<{
    id: number;
    commessaId: number;
    titolo: string;
    data: Date;
    auditor: string;
    esito: string;
    note: string | null;
  }> = [];
  const nonConformita: Array<{
    id: number;
    commessaId: number;
    titolo: string;
    descrizione: string;
    tipo: string;
    gravita: string;
    stato: string;
    dataApertura: Date;
    dataChiusura: Date | null;
    causa: string | null;
    azione: string | null;
    note: string | null;
  }> = [];
  const piani: Array<{
    id: number;
    commessaId: number;
    fase: string;
    controlliRichiesti: unknown;
    esito: string | null;
  }> = [];
  const tracciabilita: Array<{
    id: number;
    commessaId: number;
    materialeId: number;
    posizione: string;
    quantita: any;
    descrizioneComponente: string | null;
    riferimentoDisegno: string | null;
    note: string | null;
  }> = [];
  const wps: Array<{
    id: number;
    codice: string;
    commessaId: number | null;
    materialeId: number | null;
    processo: string;
    descrizione: string | null;
  }> = [];
  const wpqr: Array<{
    id: number;
    codice: string;
    wpsId: number;
    commessaId: number | null;
    saldatore: string;
    dataQualifica: Date;
    scadenza: Date | null;
    note: string | null;
  }> = [];

  function ensureCommessaExists(id: number) {
    const c = commesse.find((x) => x.id === id);
    if (!c) throw new Error("Commessa not found");
    return c;
  }

  return {
    $connect: async () => undefined,
    $disconnect: async () => undefined,

    user: {
      findUnique: async (args: any) => {
        if (args?.where?.email) {
          return users.find((u) => u.email === args.where.email) ?? null;
        }
        if (args?.where?.id) {
          return users.find((u) => u.id === args.where.id) ?? null;
        }
        return null;
      },
      findMany: async () => users,
      create: async (args: any) => {
        const row: UserRow = {
          id: `${uuidLike().slice(0, 32)}${String(users.length).padStart(4, "0")}`,
          email: args.data.email,
          firstName: args.data.firstName ?? "",
          lastName: args.data.lastName ?? "",
          role: args.data.role ?? Role.USER,
          passwordHash: args.data.passwordHash,
          refreshTokenHash: null,
        };
        users.push(row);
        return row;
      },
      update: async (args: any) => {
        const idx = users.findIndex((u) => u.id === args.where.id);
        if (idx === -1) throw new Error("User not found");
        users[idx] = { ...users[idx], ...args.data };
        return users[idx];
      },
      delete: async (args: any) => {
        const idx = users.findIndex((u) => u.id === args.where.id);
        if (idx === -1) throw new Error("User not found");
        const [deleted] = users.splice(idx, 1);
        return deleted;
      },
    },

    commessa: {
      findUnique: async (args: any) => {
        if (args?.where?.codice) {
          return commesse.find((c) => c.codice === args.where.codice) ?? null;
        }
        if (args?.where?.id) {
          const c = commesse.find((x) => x.id === args.where.id) ?? null;
          if (!c) return null;
          return args.include
            ? {
                ...c,
                materiali: [],
                documenti: [],
                pianiControllo: [],
                nonConformita: [],
                audits: [],
                wps: [],
                wpqr: [],
                checklist: [],
                tracciabilita: [],
              }
            : c;
        }
        return null;
      },
      findFirst: async (args: any) => {
        const codice = args?.where?.codice;
        const notId = args?.where?.NOT?.id;
        if (!codice) return null;
        return (
          commesse.find((c) => c.codice === codice && c.id !== notId) ?? null
        );
      },
      findMany: async () => commesse,
      create: async (args: any) => {
        const row: CommessaRow = {
          id: commessaSeq++,
          codice: args.data.codice,
          cliente: args.data.cliente,
          note: args.data.note ?? null,
        };
        commesse.push(row);
        return row;
      },
      update: async (args: any) => {
        const idx = commesse.findIndex((c) => c.id === args.where.id);
        if (idx === -1) throw new Error("Commessa not found");
        commesse[idx] = { ...commesse[idx], ...args.data };
        return commesse[idx];
      },
      delete: async (args: any) => {
        const idx = commesse.findIndex((c) => c.id === args.where.id);
        if (idx === -1) throw new Error("Commessa not found");
        const [deleted] = commesse.splice(idx, 1);
        return deleted;
      },
      count: async (args?: any) => {
        if (!args?.where) return commesse.length;
        const inStates: string[] | undefined = args.where?.stato?.in;
        if (inStates) return commesse.filter(() => true).length;
        return commesse.length;
      },
    },

    materiale: {
      findUnique: async (args: any) => {
        if (args?.where?.id)
          return materiali.find((m) => m.id === args.where.id) ?? null;
        const ck = args?.where?.commessaId_codice;
        if (ck) {
          return (
            materiali.find(
              (m) => m.commessaId === ck.commessaId && m.codice === ck.codice,
            ) ?? null
          );
        }
        return null;
      },
      findFirst: async (args: any) => {
        const where = args?.where;
        if (where?.codice && where?.commessaId) {
          const notId = where?.NOT?.id;
          return (
            materiali.find(
              (m) =>
                m.commessaId === where.commessaId &&
                m.codice === where.codice &&
                m.id !== notId,
            ) ?? null
          );
        }
        return null;
      },
      findMany: async (args?: any) => {
        if (args?.where?.commessaId) {
          return materiali.filter(
            (m) => m.commessaId === args.where.commessaId,
          );
        }
        return materiali;
      },
      create: async (args: any) => {
        const commessaId =
          args.data.commessa?.connect?.id ?? args.data.commessaId;
        ensureCommessaExists(commessaId);
        const row: MaterialeRow = {
          id: materialeSeq++,
          commessaId,
          codice: args.data.codice,
          descrizione: args.data.descrizione ?? "",
          tipo: args.data.tipo ?? null,
          norma: args.data.norma ?? null,
          certificato31: args.data.certificato31 ?? null,
          lotto: args.data.lotto ?? null,
          fornitore: args.data.fornitore ?? null,
          dataCarico: args.data.dataCarico ?? null,
          certificatoDocumentoId:
            args.data.certificatoDocumento?.connect?.id ?? null,
        };
        materiali.push(row);
        return row;
      },
      update: async (args: any) => {
        const idx = materiali.findIndex((m) => m.id === args.where.id);
        if (idx === -1) throw new Error("Materiale not found");
        materiali[idx] = { ...materiali[idx], ...args.data };
        return materiali[idx];
      },
      delete: async (args: any) => {
        const idx = materiali.findIndex((m) => m.id === args.where.id);
        if (idx === -1) throw new Error("Materiale not found");
        const [deleted] = materiali.splice(idx, 1);
        return deleted;
      },
      count: async () => materiali.length,
      groupBy: async () => [
        { fornitore: "TEST", _count: { _all: materiali.length } },
      ],
    },

    documento: {
      findUnique: async (args: any) =>
        documenti.find((d) => d.id === args?.where?.id) ?? null,
      findMany: async (args?: any) => {
        if (args?.where?.commessaId) {
          return documenti.filter(
            (d) => d.commessaId === args.where.commessaId,
          );
        }
        return documenti;
      },
      create: async (args: any) => {
        ensureCommessaExists(args.data.commessaId);
        const row: DocumentoRow = {
          id: documentoSeq++,
          commessaId: args.data.commessaId,
          nome: args.data.nome,
          tipo: args.data.tipo,
          versione: args.data.versione,
          percorsoFile: args.data.percorsoFile ?? "uploads/documenti/x.pdf",
          statoApprovazione: args.data.statoApprovazione ?? "BOZZA",
        };
        documenti.push(row);
        return row;
      },
      update: async (args: any) => {
        const idx = documenti.findIndex((d) => d.id === args.where.id);
        if (idx === -1) throw new Error("Documento not found");
        documenti[idx] = { ...documenti[idx], ...args.data };
        return documenti[idx];
      },
      delete: async (args: any) => {
        const idx = documenti.findIndex((d) => d.id === args.where.id);
        if (idx === -1) throw new Error("Documento not found");
        const [deleted] = documenti.splice(idx, 1);
        return deleted;
      },
      count: async () => documenti.length,
    },

    checklist: {
      findUnique: async (args: any) =>
        checklists.find((c) => c.id === args?.where?.id) ?? null,
      findMany: async (args?: any) => {
        if (args?.where?.commessaId) {
          return checklists.filter(
            (c) => c.commessaId === args.where.commessaId,
          );
        }
        return checklists;
      },
      create: async (args: any) => {
        const commessaId =
          args.data.commessa?.connect?.id ?? args.data.commessaId;
        ensureCommessaExists(commessaId);
        const row: ChecklistRow = {
          id: checklistSeq++,
          commessaId,
          titolo: args.data.titolo ?? "Checklist",
          categoria: args.data.categoria ?? "generale",
          fase: args.data.fase ?? null,
          stato: args.data.stato ?? null,
          esito: args.data.esito ?? null,
          note: args.data.note ?? null,
          operatore: args.data.operatore ?? null,
          dataCompilazione: args.data.dataCompilazione ?? null,
          elementi: args.data.elementi ?? [],
          allegati: args.data.allegati ?? [],
        };
        checklists.push(row);
        return row;
      },
      update: async (args: any) => {
        const idx = checklists.findIndex((c) => c.id === args.where.id);
        if (idx === -1) throw new Error("Checklist not found");
        checklists[idx] = { ...checklists[idx], ...args.data };
        return checklists[idx];
      },
      delete: async (args: any) => {
        const idx = checklists.findIndex((c) => c.id === args.where.id);
        if (idx === -1) throw new Error("Checklist not found");
        const [deleted] = checklists.splice(idx, 1);
        return deleted;
      },
    },

    attrezzatura: {
      findUnique: async (args: any) => {
        if (args?.where?.id)
          return attrezzature.find((a) => a.id === args.where.id) ?? null;
        if (args?.where?.matricola)
          return (
            attrezzature.find((a) => a.matricola === args.where.matricola) ??
            null
          );
        return null;
      },
      findFirst: async (args: any) => {
        const m = args?.where?.matricola;
        const notId = args?.where?.NOT?.id;
        if (!m) return null;
        return (
          attrezzature.find((a) => a.matricola === m && a.id !== notId) ?? null
        );
      },
      findMany: async () => attrezzature,
      create: async (args: any) => {
        const row = {
          id: attrezzaturaSeq++,
          nome: args.data.nome,
          matricola: args.data.matricola,
        };
        attrezzature.push(row);
        return row;
      },
      update: async (args: any) => {
        const idx = attrezzature.findIndex((a) => a.id === args.where.id);
        if (idx === -1) throw new Error("Attrezzatura not found");
        attrezzature[idx] = { ...attrezzature[idx], ...args.data };
        return attrezzature[idx];
      },
      delete: async (args: any) => {
        const idx = attrezzature.findIndex((a) => a.id === args.where.id);
        if (idx === -1) throw new Error("Attrezzatura not found");
        const [deleted] = attrezzature.splice(idx, 1);
        return deleted;
      },
    },

    audit: {
      findUnique: async (args: any) =>
        audits.find((a) => a.id === args?.where?.id) ?? null,
      findMany: async (args?: any) => {
        if (args?.where?.commessaId)
          return audits.filter((a) => a.commessaId === args.where.commessaId);
        return audits;
      },
      create: async (args: any) => {
        ensureCommessaExists(args.data.commessaId);
        const row = {
          id: auditSeq++,
          commessaId: args.data.commessaId,
          titolo: args.data.titolo ?? "Audit",
          data: args.data.data ?? new Date(),
          auditor: args.data.auditor ?? "Auditor",
          esito: args.data.esito ?? "CONFORME",
          note: args.data.note ?? null,
        };
        audits.push(row);
        return row;
      },
      update: async (args: any) => {
        const idx = audits.findIndex((a) => a.id === args.where.id);
        if (idx === -1) throw new Error("Audit not found");
        audits[idx] = { ...audits[idx], ...args.data };
        return audits[idx];
      },
      delete: async (args: any) => {
        const idx = audits.findIndex((a) => a.id === args.where.id);
        if (idx === -1) throw new Error("Audit not found");
        const [deleted] = audits.splice(idx, 1);
        return deleted;
      },
      count: async (args?: any) => {
        if (args?.where?.esito)
          return audits.filter((a) => a.esito === args.where.esito).length;
        return audits.length;
      },
    },

    nonConformita: {
      findUnique: async (args: any) =>
        nonConformita.find((n) => n.id === args?.where?.id) ?? null,
      findMany: async (args?: any) => {
        if (args?.where?.commessaId)
          return nonConformita.filter(
            (n) => n.commessaId === args.where.commessaId,
          );
        return nonConformita;
      },
      create: async (args: any) => {
        const commessaId =
          args.data.commessa?.connect?.id ?? args.data.commessaId;
        ensureCommessaExists(commessaId);
        const row = {
          id: ncSeq++,
          commessaId,
          titolo: args.data.titolo ?? "NC",
          descrizione: args.data.descrizione ?? "",
          tipo: args.data.tipo ?? "ALTRO",
          gravita: args.data.gravita ?? "MINORE",
          stato: args.data.stato ?? "APERTA",
          dataApertura: args.data.dataApertura ?? new Date(),
          dataChiusura: args.data.dataChiusura ?? null,
          causa: args.data.causa ?? null,
          azione: args.data.azione ?? null,
          note: args.data.note ?? null,
        };
        nonConformita.push(row);
        return row;
      },
      update: async (args: any) => {
        const idx = nonConformita.findIndex((n) => n.id === args.where.id);
        if (idx === -1) throw new Error("NC not found");
        nonConformita[idx] = { ...nonConformita[idx], ...args.data };
        return nonConformita[idx];
      },
      delete: async (args: any) => {
        const idx = nonConformita.findIndex((n) => n.id === args.where.id);
        if (idx === -1) throw new Error("NC not found");
        const [deleted] = nonConformita.splice(idx, 1);
        return deleted;
      },
      count: async () => nonConformita.length,
      groupBy: async () => [
        { stato: "APERTA", _count: { _all: nonConformita.length } },
      ],
    },

    pianoControllo: {
      findUnique: async (args: any) =>
        piani.find((p) => p.id === args?.where?.id) ?? null,
      findMany: async (args?: any) => {
        if (args?.where?.commessaId)
          return piani.filter((p) => p.commessaId === args.where.commessaId);
        return piani;
      },
      create: async (args: any) => {
        const commessaId =
          args.data.commessa?.connect?.id ?? args.data.commessaId;
        ensureCommessaExists(commessaId);
        const row = {
          id: pianoSeq++,
          commessaId,
          fase: args.data.fase ?? "F1",
          controlliRichiesti: args.data.controlliRichiesti ?? [],
          esito: args.data.esito ?? null,
        };
        piani.push(row);
        return row;
      },
      update: async (args: any) => {
        const idx = piani.findIndex((p) => p.id === args.where.id);
        if (idx === -1) throw new Error("Piano not found");
        piani[idx] = { ...piani[idx], ...args.data };
        return piani[idx];
      },
      delete: async (args: any) => {
        const idx = piani.findIndex((p) => p.id === args.where.id);
        if (idx === -1) throw new Error("Piano not found");
        const [deleted] = piani.splice(idx, 1);
        return deleted;
      },
      count: async () => piani.length,
    },

    tracciabilita: {
      findUnique: async (args: any) =>
        tracciabilita.find((t) => t.id === args?.where?.id) ?? null,
      findMany: async (args?: any) => {
        if (args?.where?.commessaId)
          return tracciabilita.filter(
            (t) => t.commessaId === args.where.commessaId,
          );
        return tracciabilita;
      },
      create: async (args: any) => {
        ensureCommessaExists(args.data.commessaId);
        const m = materiali.find((x) => x.id === args.data.materialeId);
        if (!m) throw new Error("Materiale not found");
        const row = { id: tracciabilitaSeq++, ...args.data };
        tracciabilita.push(row as any);
        return row;
      },
      update: async (args: any) => {
        const idx = tracciabilita.findIndex((t) => t.id === args.where.id);
        if (idx === -1) throw new Error("Tracciabilita not found");
        tracciabilita[idx] = { ...tracciabilita[idx], ...args.data };
        return tracciabilita[idx];
      },
      delete: async (args: any) => {
        const idx = tracciabilita.findIndex((t) => t.id === args.where.id);
        if (idx === -1) throw new Error("Tracciabilita not found");
        const [deleted] = tracciabilita.splice(idx, 1);
        return deleted;
      },
      count: async () => tracciabilita.length,
    },

    wps: {
      findUnique: async (args: any) => {
        if (args?.where?.id)
          return wps.find((w) => w.id === args.where.id) ?? null;
        if (args?.where?.codice)
          return wps.find((w) => w.codice === args.where.codice) ?? null;
        return null;
      },
      findFirst: async (args: any) => {
        const codice = args?.where?.codice;
        const notId = args?.where?.NOT?.id;
        if (!codice) return null;
        return wps.find((w) => w.codice === codice && w.id !== notId) ?? null;
      },
      findMany: async (args?: any) => {
        if (args?.where?.commessaId)
          return wps.filter((w) => w.commessaId === args.where.commessaId);
        return wps;
      },
      create: async (args: any) => {
        if (args.data.commessa?.connect?.id)
          ensureCommessaExists(args.data.commessa.connect.id);
        const row = {
          id: wpsSeq++,
          codice: args.data.codice,
          processo: args.data.processo ?? "SALDATURA",
          descrizione: args.data.descrizione ?? null,
          commessaId: args.data.commessa?.connect?.id ?? null,
          materialeId: args.data.materiale?.connect?.id ?? null,
        };
        wps.push(row);
        return row;
      },
      update: async (args: any) => {
        const idx = wps.findIndex((w) => w.id === args.where.id);
        if (idx === -1) throw new Error("WPS not found");
        wps[idx] = { ...wps[idx], ...args.data };
        return wps[idx];
      },
      delete: async (args: any) => {
        const idx = wps.findIndex((w) => w.id === args.where.id);
        if (idx === -1) throw new Error("WPS not found");
        const [deleted] = wps.splice(idx, 1);
        return deleted;
      },
      count: async () => wps.length,
    },

    wpqr: {
      findUnique: async (args: any) =>
        wpqr.find((q) => q.id === args?.where?.id) ?? null,
      findMany: async (args?: any) => {
        if (args?.where?.commessaId)
          return wpqr.filter((q) => q.commessaId === args.where.commessaId);
        return wpqr;
      },
      create: async (args: any) => {
        const row = {
          id: wpqrSeq++,
          codice: args.data.codice ?? `Q-${wpqrSeq}`,
          wpsId: args.data.wpsId,
          commessaId: args.data.commessaId ?? null,
          saldatore: args.data.saldatore ?? "S",
          dataQualifica: args.data.dataQualifica ?? new Date(),
          scadenza: args.data.scadenza ?? null,
          note: args.data.note ?? null,
        };
        wpqr.push(row);
        return row;
      },
      update: async (args: any) => {
        const idx = wpqr.findIndex((q) => q.id === args.where.id);
        if (idx === -1) throw new Error("WPQR not found");
        wpqr[idx] = { ...wpqr[idx], ...args.data };
        return wpqr[idx];
      },
      delete: async (args: any) => {
        const idx = wpqr.findIndex((q) => q.id === args.where.id);
        if (idx === -1) throw new Error("WPQR not found");
        const [deleted] = wpqr.splice(idx, 1);
        return deleted;
      },
      count: async () => wpqr.length,
    },
  };
}

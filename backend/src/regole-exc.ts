type ExcRule = {
  processi: string[];
  checklist: string[];
};

const REGOLE_EXC: Record<string, ExcRule> = {
  EXC1: {
    processi: [],
    checklist: ["controllo_dimensionale"],
  },
  EXC2: {
    processi: ["SALDATURA"],
    checklist: ["controllo_dimensionale", "controllo_saldature"],
  },
  EXC3: {
    processi: ["SALDATURA", "TAGLIO_TERMICO"],
    checklist: [
      "controllo_dimensionale",
      "controllo_saldature",
      "controllo_materiali",
    ],
  },
  EXC4: {
    processi: ["SALDATURA", "TAGLIO_TERMICO", "VERNICIATURA"],
    checklist: [
      "controllo_dimensionale",
      "controllo_saldature",
      "controllo_materiali",
      "controllo_finale",
    ],
  },
};

function normalizeExc(exc: string): string {
  return (exc ?? "").trim().toUpperCase();
}

export function getProcessiRichiestiPerEXC(exc: string): string[] {
  const key = normalizeExc(exc);
  return REGOLE_EXC[key]?.processi ?? [];
}

export function getChecklistRichiestePerEXC(exc: string): string[] {
  const key = normalizeExc(exc);
  return REGOLE_EXC[key]?.checklist ?? [];
}

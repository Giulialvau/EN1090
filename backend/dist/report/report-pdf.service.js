"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportPdfService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const report_pdf_renderer_1 = require("./report-pdf.renderer");
let ReportPdfService = class ReportPdfService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async commessaOrThrow(id) {
        const c = await this.prisma.commessa.findUnique({ where: { id } });
        if (!c) {
            throw new common_1.NotFoundException(`Commessa ${id} non trovata`);
        }
        return c;
    }
    commessaVars(c) {
        return {
            COMMESSA_CODICE: (0, report_pdf_renderer_1.escapeHtml)(c.codice),
            COMMESSA_CLIENTE: (0, report_pdf_renderer_1.escapeHtml)(c.cliente),
            COMMESSA_TITOLO: (0, report_pdf_renderer_1.escapeHtml)(c.titolo ?? '—'),
            COMMESSA_DESCRIZIONE: (0, report_pdf_renderer_1.escapeHtml)(c.descrizione ?? '—'),
            COMMESSA_RESPONSABILE: (0, report_pdf_renderer_1.escapeHtml)(c.responsabile ?? '—'),
            COMMESSA_LUOGO: (0, report_pdf_renderer_1.escapeHtml)(c.luogo ?? '—'),
            COMMESSA_DATA_INIZIO: (0, report_pdf_renderer_1.formatDateIt)(c.dataInizio),
            COMMESSA_DATA_FINE: (0, report_pdf_renderer_1.formatDateIt)(c.dataFine),
            COMMESSA_STATO: (0, report_pdf_renderer_1.escapeHtml)(String(c.stato)),
            GENERATO_IL: (0, report_pdf_renderer_1.formatDateTimeIt)(new Date()),
        };
    }
    async renderTemplate(filename, vars, pdfOptions) {
        const raw = (0, report_pdf_renderer_1.loadHtmlTemplate)(filename);
        const html = (0, report_pdf_renderer_1.applyTemplate)(raw, vars);
        return (0, report_pdf_renderer_1.renderHtmlToPdf)(html, pdfOptions);
    }
    async dopPdf(commessaId) {
        const c = await this.commessaOrThrow(commessaId);
        const DOP_TESTO = (0, report_pdf_renderer_1.escapeHtml)('Il presente documento è generato automaticamente dai dati registrati nel sistema. ' +
            'Verificare la conformità alla normativa vigente e completare i campi legali ove richiesto.');
        return this.renderTemplate('dop.html', {
            ...this.commessaVars(c),
            DOC_TITLE: 'Dichiarazione di Prestazione (DoP)',
            DOP_TESTO,
        });
    }
    async cePdf(commessaId) {
        const c = await this.commessaOrThrow(commessaId);
        const CE_TESTO = (0, report_pdf_renderer_1.escapeHtml)('Il fascicolo tecnico e la tracciabilità devono essere coerenti con la marcatura CE applicata in officina. ' +
            'Adattare alle procedure aziendali di marcatura e controllo.');
        return this.renderTemplate('ce.html', {
            ...this.commessaVars(c),
            DOC_TITLE: 'Marcatura CE',
            CE_TESTO,
        });
    }
    async fascicoloTecnicoPdf(commessaId) {
        const data = await this.prisma.commessa.findUnique({
            where: { id: commessaId },
            include: {
                materiali: {
                    orderBy: { codice: 'asc' },
                    include: {
                        certificatoDocumento: { select: { nome: true, tipo: true } },
                    },
                },
                tracciabilita: {
                    orderBy: { posizione: 'asc' },
                    include: {
                        materiale: { select: { codice: true, lotto: true } },
                    },
                },
                checklists: { orderBy: { titolo: 'asc' } },
                nonConformita: { orderBy: { dataApertura: 'desc' } },
                audits: { orderBy: { data: 'desc' } },
                wps: {
                    orderBy: { codice: 'asc' },
                    include: { materiale: { select: { descrizione: true } } },
                },
                wpqr: {
                    orderBy: { codice: 'asc' },
                    include: {
                        wps: { select: { codice: true } },
                        qualifica: {
                            select: {
                                id: true,
                                nome: true,
                                ruolo: true,
                                scadenza: true,
                                documento: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        materiali: true,
                        documenti: true,
                        tracciabilita: true,
                        checklists: true,
                        nonConformita: true,
                        audits: true,
                        wps: true,
                        wpqr: true,
                    },
                },
            },
        });
        if (!data) {
            throw new common_1.NotFoundException(`Commessa ${commessaId} non trovata`);
        }
        const base = this.commessaVars(data);
        const DOP_TESTO = (0, report_pdf_renderer_1.escapeHtml)('Il presente documento è generato automaticamente dai dati registrati nel sistema. ' +
            'Verificare la conformità alla normativa vigente e completare i campi legali ove richiesto.');
        const CE_TESTO = (0, report_pdf_renderer_1.escapeHtml)('Il fascicolo tecnico e la tracciabilità devono essere coerenti con la marcatura CE applicata in officina. ' +
            'Adattare alle procedure aziendali di marcatura e controllo.');
        const RIEPILOGO_NOTA = (0, report_pdf_renderer_1.escapeHtml)('Per il dettaglio operativo utilizzare i singoli moduli EN 1090 del gestionale. ' +
            'Questo fascicolo costituisce una sintesi ai fini della documentazione di costruzione.');
        const MATERIALI_ROWS = this.buildMaterialiRows(data.materiali);
        const TRACCIABILITA_ROWS = this.buildTracciabilitaRows(data.tracciabilita, data.codice);
        const CHECKLIST_CONTENT = this.fascicoloChecklistSectionsHtml(data.checklists);
        const NC_ROWS = this.buildNcRows(data.nonConformita);
        const AUDIT_ROWS = this.buildAuditRows(data.audits);
        const WPS_ROWS = this.buildWpsRows(data.wps);
        const WPQR_ROWS = this.buildWpqrRows(data.wpqr);
        const QUALIFICHE_ROWS = this.buildQualificheDistinctRows(data.wpqr);
        const cnt = data._count;
        const riepilogoVars = {
            ...base,
            COUNT_MATERIALI: String(cnt.materiali),
            COUNT_DOCUMENTI: String(cnt.documenti),
            COUNT_TRACCIABILITA: String(cnt.tracciabilita),
            COUNT_CHECKLIST: String(cnt.checklists),
            COUNT_NC: String(cnt.nonConformita),
            COUNT_AUDIT: String(cnt.audits),
            COUNT_WPS: String(cnt.wps),
            COUNT_WPQR: String(cnt.wpqr),
            RIEPILOGO_NOTA,
        };
        const sectionFiles = [
            'fascicolo/01-cover.html',
            'fascicolo/02-dop.html',
            'fascicolo/03-ce.html',
            'fascicolo/04-materiali.html',
            'fascicolo/05-tracciabilita.html',
            'fascicolo/06-checklist.html',
            'fascicolo/07-nc.html',
            'fascicolo/08-audit.html',
            'fascicolo/09-qualifiche.html',
            'fascicolo/10-wps-wpqr.html',
            'fascicolo/11-riepilogo.html',
        ];
        const sectionVars = [
            { ...base },
            { ...base, DOP_TESTO },
            { ...base, CE_TESTO },
            {
                ...base,
                TOTAL_MATERIALI: String(data.materiali.length),
                MATERIALI_ROWS,
            },
            {
                ...base,
                TOTAL_RECORDS: String(data.tracciabilita.length),
                TRACCIABILITA_ROWS,
            },
            { ...base, CHECKLIST_CONTENT },
            { ...base, NC_ROWS },
            { ...base, AUDIT_ROWS },
            { ...base, QUALIFICHE_ROWS },
            { ...base, WPS_ROWS, WPQR_ROWS },
            riepilogoVars,
        ];
        const bodyParts = sectionFiles.map((file, i) => (0, report_pdf_renderer_1.applyTemplate)((0, report_pdf_renderer_1.loadHtmlTemplate)(file), sectionVars[i]));
        const body = bodyParts.join('\n');
        const html = (0, report_pdf_renderer_1.applyTemplate)((0, report_pdf_renderer_1.loadHtmlTemplate)('fascicolo-tecnico-shell.html'), {
            ...base,
            BODY: body,
        });
        return (0, report_pdf_renderer_1.renderHtmlToPdf)(html, {
            footerNote: `Generato il ${(0, report_pdf_renderer_1.formatDateTimeIt)(new Date())}`,
        });
    }
    buildMaterialiRows(materiali) {
        if (materiali.length === 0) {
            return '<tr><td colspan="7">Nessun materiale registrato.</td></tr>';
        }
        return materiali
            .map((m) => {
            const certNome = m.certificatoDocumento?.nome;
            const cert = certNome != null
                ? `${(0, report_pdf_renderer_1.escapeHtml)(certNome)} (${(0, report_pdf_renderer_1.escapeHtml)(m.certificatoDocumento?.tipo ?? '')})`
                : '—';
            return `<tr><td>${(0, report_pdf_renderer_1.escapeHtml)(m.codice)}</td><td>${(0, report_pdf_renderer_1.escapeHtml)(m.descrizione)}</td><td>${(0, report_pdf_renderer_1.escapeHtml)(m.lotto ?? '—')}</td><td>${(0, report_pdf_renderer_1.escapeHtml)(m.fornitore ?? '—')}</td><td>${(0, report_pdf_renderer_1.escapeHtml)(m.norma ?? '—')}</td><td>${(0, report_pdf_renderer_1.escapeHtml)(m.certificato31 ?? '—')}</td><td>${cert}</td></tr>`;
        })
            .join('');
    }
    buildTracciabilitaRows(rows, commessaCodice) {
        const code = (0, report_pdf_renderer_1.escapeHtml)(commessaCodice);
        if (rows.length === 0) {
            return '<tr><td colspan="7">Nessun record.</td></tr>';
        }
        return rows
            .map((r) => {
            const mc = r.materiale;
            return `<tr><td>${(0, report_pdf_renderer_1.escapeHtml)(mc?.codice ?? '—')}</td><td>${(0, report_pdf_renderer_1.escapeHtml)(mc?.lotto ?? '—')}</td><td>${(0, report_pdf_renderer_1.escapeHtml)(r.descrizioneComponente ?? '—')}</td><td>${(0, report_pdf_renderer_1.escapeHtml)(r.posizione)}</td><td>${(0, report_pdf_renderer_1.escapeHtml)(String(r.quantita))}</td><td>${code}</td><td>${(0, report_pdf_renderer_1.escapeHtml)(r.riferimentoDisegno ?? '—')}</td></tr>`;
        })
            .join('');
    }
    elementiTableRows(elementi) {
        if (!Array.isArray(elementi) || elementi.length === 0) {
            return '<tr><td colspan="5">Nessun punto controllo.</td></tr>';
        }
        return elementi
            .map((e, i) => {
            const o = e;
            return `<tr><td>${i + 1}</td><td>${(0, report_pdf_renderer_1.escapeHtml)(String(o.descrizione ?? ''))}</td><td>${o.completato ? 'Sì' : 'No'}</td><td>${(0, report_pdf_renderer_1.escapeHtml)(String(o.risposta ?? '—'))}</td><td>${(0, report_pdf_renderer_1.escapeHtml)(String(o.note ?? '—'))}</td></tr>`;
        })
            .join('');
    }
    fascicoloChecklistSectionsHtml(checklists) {
        if (checklists.length === 0) {
            return '<p class="note">Nessuna checklist registrata per questa commessa.</p>';
        }
        return checklists
            .map((cl) => {
            const elRows = this.elementiTableRows(cl.elementi);
            const noteBlock = cl.note
                ? `<p class="note">${(0, report_pdf_renderer_1.escapeHtml)(cl.note)}</p>`
                : '';
            return `
      <h3 class="sub-sec">${(0, report_pdf_renderer_1.escapeHtml)(cl.titolo)}</h3>
      <p style="font-size:9pt;">Categoria: ${(0, report_pdf_renderer_1.escapeHtml)(cl.categoria)} | Fase: ${(0, report_pdf_renderer_1.escapeHtml)(cl.fase ?? '—')} | Stato: ${(0, report_pdf_renderer_1.escapeHtml)(String(cl.stato))} | Esito: ${cl.esito ? (0, report_pdf_renderer_1.escapeHtml)(String(cl.esito)) : '—'}</p>
      ${noteBlock}
      <table class="grid">
        <thead><tr><th>#</th><th>Punto controllo</th><th>Completato</th><th>Risposta</th><th>Note</th></tr></thead>
        <tbody>${elRows}</tbody>
      </table>`;
        })
            .join('');
    }
    buildNcRows(rows) {
        if (rows.length === 0) {
            return '<tr><td colspan="5">Nessuna NC.</td></tr>';
        }
        return rows
            .map((n) => `<tr><td>${(0, report_pdf_renderer_1.escapeHtml)(n.titolo)}</td><td>${(0, report_pdf_renderer_1.escapeHtml)(String(n.stato))}</td><td>${(0, report_pdf_renderer_1.escapeHtml)(String(n.gravita))}</td><td>${(0, report_pdf_renderer_1.formatDateIt)(n.dataApertura)}</td><td>${(0, report_pdf_renderer_1.escapeHtml)((n.azioniCorrettive ?? '—').slice(0, 240))}</td></tr>`)
            .join('');
    }
    buildAuditRows(rows) {
        if (rows.length === 0) {
            return '<tr><td colspan="5">Nessun audit.</td></tr>';
        }
        return rows
            .map((a) => `<tr><td>${(0, report_pdf_renderer_1.escapeHtml)(a.titolo)}</td><td>${(0, report_pdf_renderer_1.formatDateIt)(a.data)}</td><td>${(0, report_pdf_renderer_1.escapeHtml)(a.auditor)}</td><td>${(0, report_pdf_renderer_1.escapeHtml)(String(a.esito))}</td><td>${(0, report_pdf_renderer_1.escapeHtml)((a.note ?? '—').slice(0, 140))}</td></tr>`)
            .join('');
    }
    buildWpsRows(rows) {
        if (rows.length === 0) {
            return '<tr><td colspan="4">Nessuna WPS.</td></tr>';
        }
        return rows
            .map((w) => `<tr><td>${(0, report_pdf_renderer_1.escapeHtml)(w.codice)}</td><td>${(0, report_pdf_renderer_1.escapeHtml)(w.processo)}</td><td>${(0, report_pdf_renderer_1.escapeHtml)(w.materialeBase ?? w.materiale?.descrizione ?? '—')}</td><td>${(0, report_pdf_renderer_1.formatDateIt)(w.scadenza)}</td></tr>`)
            .join('');
    }
    buildWpqrRows(rows) {
        if (rows.length === 0) {
            return '<tr><td colspan="6">Nessun WPQR.</td></tr>';
        }
        return rows
            .map((q) => {
            const wpsC = q.wps?.codice ?? '—';
            const qual = q.qualifica?.nome ?? '—';
            return `<tr><td>${(0, report_pdf_renderer_1.escapeHtml)(q.codice)}</td><td>${(0, report_pdf_renderer_1.escapeHtml)(q.saldatore)}</td><td>${(0, report_pdf_renderer_1.escapeHtml)(wpsC)}</td><td>${(0, report_pdf_renderer_1.formatDateIt)(q.dataQualifica)}</td><td>${(0, report_pdf_renderer_1.formatDateIt)(q.scadenza)}</td><td>${(0, report_pdf_renderer_1.escapeHtml)(qual)}</td></tr>`;
        })
            .join('');
    }
    buildQualificheDistinctRows(wpqr) {
        const map = new Map();
        for (const w of wpqr) {
            if (w.qualifica) {
                map.set(w.qualifica.id, {
                    nome: w.qualifica.nome,
                    ruolo: w.qualifica.ruolo,
                    scadenza: w.qualifica.scadenza,
                    documento: w.qualifica.documento,
                });
            }
        }
        if (map.size === 0) {
            return '<tr><td colspan="4">Nessuna qualifica anagrafica collegata ai WPQR.</td></tr>';
        }
        return [...map.values()]
            .map((q) => `<tr><td>${(0, report_pdf_renderer_1.escapeHtml)(q.nome)}</td><td>${(0, report_pdf_renderer_1.escapeHtml)(q.ruolo)}</td><td>${(0, report_pdf_renderer_1.formatDateIt)(q.scadenza)}</td><td>${(0, report_pdf_renderer_1.escapeHtml)(q.documento ?? '—')}</td></tr>`)
            .join('');
    }
    async materialiPdf(commessaId) {
        const c = await this.commessaOrThrow(commessaId);
        const materiali = await this.prisma.materiale.findMany({
            where: { commessaId },
            orderBy: { codice: 'asc' },
            include: {
                certificatoDocumento: {
                    select: { nome: true, tipo: true },
                },
            },
        });
        const MATERIALI_ROWS = materiali.length === 0
            ? '<tr><td colspan="7">Nessun materiale registrato.</td></tr>'
            : materiali
                .map((m) => {
                const certNome = m.certificatoDocumento?.nome;
                const cert = certNome != null
                    ? `${(0, report_pdf_renderer_1.escapeHtml)(certNome)} (${(0, report_pdf_renderer_1.escapeHtml)(m.certificatoDocumento?.tipo ?? '')})`
                    : '—';
                return `<tr><td>${(0, report_pdf_renderer_1.escapeHtml)(m.codice)}</td><td>${(0, report_pdf_renderer_1.escapeHtml)(m.descrizione)}</td><td>${(0, report_pdf_renderer_1.escapeHtml)(m.lotto ?? '—')}</td><td>${(0, report_pdf_renderer_1.escapeHtml)(m.fornitore ?? '—')}</td><td>${(0, report_pdf_renderer_1.escapeHtml)(m.norma ?? '—')}</td><td>${(0, report_pdf_renderer_1.escapeHtml)(m.certificato31 ?? '—')}</td><td>${cert}</td></tr>`;
            })
                .join('');
        return this.renderTemplate('materiali.html', {
            ...this.commessaVars(c),
            DOC_TITLE: 'Report materiali',
            TOTAL_MATERIALI: String(materiali.length),
            MATERIALI_ROWS,
        });
    }
    async tracciabilitaPdf(commessaId) {
        const c = await this.commessaOrThrow(commessaId);
        const rows = await this.prisma.tracciabilita.findMany({
            where: { commessaId },
            include: {
                materiale: { select: { codice: true, lotto: true } },
            },
            orderBy: { posizione: 'asc' },
        });
        const code = (0, report_pdf_renderer_1.escapeHtml)(c.codice);
        const TRACCIABILITA_ROWS = rows.length === 0
            ? '<tr><td colspan="7">Nessun record.</td></tr>'
            : rows
                .map((r) => {
                const mc = r.materiale;
                return `<tr><td>${(0, report_pdf_renderer_1.escapeHtml)(mc?.codice ?? '—')}</td><td>${(0, report_pdf_renderer_1.escapeHtml)(mc?.lotto ?? '—')}</td><td>${(0, report_pdf_renderer_1.escapeHtml)(r.descrizioneComponente ?? '—')}</td><td>${(0, report_pdf_renderer_1.escapeHtml)(r.posizione)}</td><td>${(0, report_pdf_renderer_1.escapeHtml)(String(r.quantita))}</td><td>${code}</td><td>${(0, report_pdf_renderer_1.escapeHtml)(r.riferimentoDisegno ?? '—')}</td></tr>`;
            })
                .join('');
        return this.renderTemplate('tracciabilita.html', {
            ...this.commessaVars(c),
            DOC_TITLE: 'Report tracciabilità',
            TOTAL_RECORDS: String(rows.length),
            TRACCIABILITA_ROWS,
        });
    }
    checklistRowsHtml(checklists) {
        if (checklists.length === 0) {
            return '<tr><td colspan="5">Nessuna checklist.</td></tr>';
        }
        return checklists
            .map((cl) => {
            const sum = this.elementiSummary(cl.elementi);
            return `<tr><td>${(0, report_pdf_renderer_1.escapeHtml)(cl.titolo)}</td><td>${(0, report_pdf_renderer_1.escapeHtml)(String(cl.stato))}</td><td>${(0, report_pdf_renderer_1.escapeHtml)(cl.esito != null ? String(cl.esito) : '—')}</td><td>${(0, report_pdf_renderer_1.escapeHtml)(cl.note ?? '—')}</td><td>${sum}</td></tr>`;
        })
            .join('');
    }
    elementiSummary(elementi) {
        if (!Array.isArray(elementi))
            return '—';
        const parts = [];
        for (let i = 0; i < Math.min(elementi.length, 6); i++) {
            const o = elementi[i];
            parts.push(String(o.descrizione ?? ''));
        }
        const s = parts.filter(Boolean).join(' · ');
        const out = s.length > 280 ? `${s.slice(0, 280)}…` : s;
        return (0, report_pdf_renderer_1.escapeHtml)(out || '—');
    }
    async commessaCompletoPdf(commessaId) {
        const data = await this.prisma.commessa.findUnique({
            where: { id: commessaId },
            include: {
                _count: {
                    select: {
                        materiali: true,
                        documenti: true,
                        nonConformita: true,
                        checklists: true,
                        audits: true,
                        wps: true,
                        wpqr: true,
                        tracciabilita: true,
                        pianiControllo: true,
                    },
                },
                materiali: {
                    take: 15,
                    orderBy: { codice: 'asc' },
                    include: {
                        certificatoDocumento: { select: { nome: true, tipo: true } },
                    },
                },
                tracciabilita: {
                    take: 20,
                    orderBy: { posizione: 'asc' },
                    include: {
                        materiale: { select: { codice: true, lotto: true } },
                    },
                },
                checklists: { take: 12, orderBy: { titolo: 'asc' } },
                nonConformita: { take: 15, orderBy: { dataApertura: 'desc' } },
                audits: { take: 12, orderBy: { data: 'desc' } },
                wps: {
                    orderBy: { codice: 'asc' },
                    include: { materiale: { select: { descrizione: true } } },
                },
                wpqr: {
                    orderBy: { codice: 'asc' },
                    include: {
                        wps: { select: { codice: true } },
                        qualifica: {
                            select: {
                                id: true,
                                nome: true,
                                ruolo: true,
                                scadenza: true,
                                documento: true,
                            },
                        },
                    },
                },
            },
        });
        if (!data) {
            throw new common_1.NotFoundException(`Commessa ${commessaId} non trovata`);
        }
        const [ncAperteDb, ncChiuseDb] = await Promise.all([
            this.prisma.nonConformita.count({
                where: { commessaId, stato: { not: client_1.NcStato.CHIUSA } },
            }),
            this.prisma.nonConformita.count({
                where: { commessaId, stato: client_1.NcStato.CHIUSA },
            }),
        ]);
        const ncTotalDb = ncAperteDb + ncChiuseDb;
        const cnt = data._count;
        const overview = Boolean(String(data.codice ?? '').trim() && String(data.cliente ?? '').trim());
        const workflowPhases = [
            {
                label: 'Anagrafica commessa',
                ok: overview,
                note: overview ? 'Codice e cliente valorizzati' : 'Completare dati obbligatori',
            },
            {
                label: 'Materiali',
                ok: cnt.materiali > 0,
                note: `${cnt.materiali} lotti registrati`,
            },
            {
                label: 'Documenti',
                ok: cnt.documenti > 0,
                note: `${cnt.documenti} documenti`,
            },
            {
                label: 'Checklist',
                ok: cnt.checklists > 0,
                note: `${cnt.checklists} checklist`,
            },
            {
                label: 'Tracciabilità',
                ok: cnt.tracciabilita > 0,
                note: `${cnt.tracciabilita} record`,
            },
            {
                label: 'Non conformità (nessuna aperta)',
                ok: ncAperteDb === 0,
                note: ncAperteDb === 0
                    ? `Nessuna NC aperta (${ncChiuseDb} chiuse)`
                    : `${ncAperteDb} NC aperte`,
            },
            {
                label: 'WPS / WPQR',
                ok: cnt.wps > 0 && cnt.wpqr > 0,
                note: `${cnt.wps} WPS, ${cnt.wpqr} WPQR`,
            },
            {
                label: 'Qualifiche saldatori (WPQR)',
                ok: cnt.wpqr > 0,
                note: `${cnt.wpqr} WPQR collegati`,
            },
            {
                label: 'Audit FPC',
                ok: cnt.audits > 0,
                note: `${cnt.audits} audit`,
            },
            {
                label: 'Piani di controllo',
                ok: cnt.pianiControllo > 0,
                note: `${cnt.pianiControllo} piani`,
            },
            {
                label: 'Report / fascicolo dati',
                ok: true,
                note: 'Dati commessa disponibili nel sistema',
            },
        ];
        const workflowDone = workflowPhases.filter((p) => p.ok).length;
        const workflowTotal = workflowPhases.length;
        const workflowPct = Math.round((workflowDone / workflowTotal) * 100);
        const WORKFLOW_ROWS = workflowPhases
            .map((p) => `<tr><td>${(0, report_pdf_renderer_1.escapeHtml)(p.label)}</td><td>${p.ok ? 'Sì' : 'No'}</td><td>${(0, report_pdf_renderer_1.escapeHtml)(p.note)}</td></tr>`)
            .join('');
        const WORKFLOW_CHART_SVG = this.buildWorkflowBarChartSvg(workflowPhases.map(({ label, ok }) => ({ label, ok })));
        const MATERIALI_ROWS = this.buildMaterialiRowsReport(data.materiali);
        const TRACCIABILITA_ROWS = this.buildTracciabilitaRowsShort(data.tracciabilita);
        const CHECKLIST_ROWS = this.checklistRowsReportShort(data.checklists);
        const NC_ROWS = data.nonConformita.length === 0
            ? '<tr><td colspan="4">Nessuna NC in elenco (estratti recenti).</td></tr>'
            : data.nonConformita
                .map((n) => `<tr><td>${(0, report_pdf_renderer_1.escapeHtml)(n.titolo)}</td><td>${(0, report_pdf_renderer_1.escapeHtml)(String(n.stato))}</td><td>${(0, report_pdf_renderer_1.escapeHtml)(String(n.gravita))}</td><td>${(0, report_pdf_renderer_1.formatDateIt)(n.dataApertura)}</td></tr>`)
                .join('');
        const AUDIT_ROWS = data.audits.length === 0
            ? '<tr><td colspan="5">Nessun audit.</td></tr>'
            : data.audits
                .map((a) => `<tr><td>${(0, report_pdf_renderer_1.escapeHtml)(a.titolo)}</td><td>${(0, report_pdf_renderer_1.formatDateIt)(a.data)}</td><td>${(0, report_pdf_renderer_1.escapeHtml)(a.auditor)}</td><td>${(0, report_pdf_renderer_1.escapeHtml)(String(a.esito))}</td><td>${(0, report_pdf_renderer_1.escapeHtml)((a.note ?? '—').slice(0, 100))}</td></tr>`)
                .join('');
        const WPS_ROWS = this.buildWpsRows(data.wps);
        const WPQR_ROWS = this.buildWpqrRows(data.wpqr);
        const QUALIFICHE_ROWS = this.buildQualificheDistinctRows(data.wpqr);
        const gen = (0, report_pdf_renderer_1.formatDateTimeIt)(new Date());
        return this.renderTemplate('report-commessa.html', {
            ...this.commessaVars(data),
            GENERATO_IL: gen,
            WORKFLOW_ROWS,
            WORKFLOW_PCT: String(workflowPct),
            WORKFLOW_DONE: String(workflowDone),
            WORKFLOW_TOTAL: String(workflowTotal),
            WORKFLOW_CHART_SVG,
            MATERIALI_ROWS,
            TRACCIABILITA_ROWS,
            NC_APERTE: String(ncAperteDb),
            NC_CHIUSE: String(ncChiuseDb),
            NC_TOTAL: String(ncTotalDb),
            NC_ROWS,
            AUDIT_ROWS,
            CHECKLIST_ROWS,
            QUALIFICHE_ROWS,
            WPS_ROWS,
            WPQR_ROWS,
            COUNT_MATERIALI: String(cnt.materiali),
            COUNT_DOCUMENTI: String(cnt.documenti),
            COUNT_TRACCIABILITA: String(cnt.tracciabilita),
            COUNT_CHECKLIST: String(cnt.checklists),
            COUNT_NC: String(cnt.nonConformita),
            COUNT_AUDIT: String(cnt.audits),
            COUNT_WPS: String(cnt.wps),
            COUNT_WPQR: String(cnt.wpqr),
            COUNT_PIANI: String(cnt.pianiControllo),
            REPORT_FOOTER_NOTE: (0, report_pdf_renderer_1.escapeHtml)('Le NC in tabella sono un estratto (max 15). I totali aperte/chiuse si riferiscono all’intera commessa.'),
        }, { footerNote: `Generato il ${gen}` });
    }
    buildWorkflowBarChartSvg(phases) {
        const w = 480;
        const rowH = 22;
        const startY = 30;
        const h = startY + phases.length * rowH + 14;
        const parts = [
            `<text x="6" y="18" font-size="11" font-weight="bold" font-family="Arial,Helvetica,sans-serif">Avanzamento fasi EN 1090 (barre)</text>`,
        ];
        phases.forEach((p, i) => {
            const y = startY + i * rowH;
            const barW = p.ok ? 180 : 72;
            const fill = p.ok ? '#2d7a4e' : '#c5c5c5';
            const lab = p.label.length > 38 ? `${p.label.slice(0, 36)}…` : p.label;
            parts.push(`<text x="6" y="${y + 12}" font-size="8.5" font-family="Arial,Helvetica,sans-serif">${(0, report_pdf_renderer_1.escapeHtml)(lab)}</text>`);
            parts.push(`<rect x="200" y="${y}" width="${barW}" height="14" fill="${fill}" rx="2"/>`);
            parts.push(`<text x="392" y="${y + 12}" font-size="8.5" font-family="Arial,Helvetica,sans-serif">${p.ok ? 'OK' : '—'}</text>`);
        });
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${parts.join('')}</svg>`;
    }
    buildMaterialiRowsReport(materiali) {
        if (materiali.length === 0) {
            return '<tr><td colspan="6">Nessun materiale.</td></tr>';
        }
        return materiali
            .map((m) => {
            const cert = m.certificatoDocumento?.nome
                ? (0, report_pdf_renderer_1.escapeHtml)(m.certificatoDocumento.nome)
                : '—';
            return `<tr><td>${(0, report_pdf_renderer_1.escapeHtml)(m.codice)}</td><td>${(0, report_pdf_renderer_1.escapeHtml)(m.descrizione)}</td><td>${(0, report_pdf_renderer_1.escapeHtml)(m.lotto ?? '—')}</td><td>${(0, report_pdf_renderer_1.escapeHtml)(m.fornitore ?? '—')}</td><td>${(0, report_pdf_renderer_1.escapeHtml)(m.norma ?? '—')}</td><td>${cert}</td></tr>`;
        })
            .join('');
    }
    buildTracciabilitaRowsShort(rows) {
        if (rows.length === 0) {
            return '<tr><td colspan="5">Nessun record.</td></tr>';
        }
        return rows
            .map((r) => {
            const mc = r.materiale;
            return `<tr><td>${(0, report_pdf_renderer_1.escapeHtml)(mc?.codice ?? '—')}</td><td>${(0, report_pdf_renderer_1.escapeHtml)(mc?.lotto ?? '—')}</td><td>${(0, report_pdf_renderer_1.escapeHtml)(r.descrizioneComponente ?? '—')}</td><td>${(0, report_pdf_renderer_1.escapeHtml)(r.posizione)}</td><td>${(0, report_pdf_renderer_1.escapeHtml)(String(r.quantita))}</td></tr>`;
        })
            .join('');
    }
    checklistRowsReportShort(checklists) {
        if (checklists.length === 0) {
            return '<tr><td colspan="5">Nessuna checklist.</td></tr>';
        }
        return checklists
            .map((cl) => {
            const cat = cl.fase
                ? `${(0, report_pdf_renderer_1.escapeHtml)(cl.categoria)} / ${(0, report_pdf_renderer_1.escapeHtml)(cl.fase)}`
                : (0, report_pdf_renderer_1.escapeHtml)(cl.categoria);
            return `<tr><td>${(0, report_pdf_renderer_1.escapeHtml)(cl.titolo)}</td><td>${(0, report_pdf_renderer_1.escapeHtml)(String(cl.stato))}</td><td>${(0, report_pdf_renderer_1.escapeHtml)(cl.esito != null ? String(cl.esito) : '—')}</td><td>${cat}</td><td>${(0, report_pdf_renderer_1.escapeHtml)((cl.note ?? '—').slice(0, 100))}</td></tr>`;
        })
            .join('');
    }
};
exports.ReportPdfService = ReportPdfService;
exports.ReportPdfService = ReportPdfService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportPdfService);
//# sourceMappingURL=report-pdf.service.js.map
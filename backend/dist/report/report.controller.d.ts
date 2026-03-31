import { StreamableFile } from '@nestjs/common';
import { ReportPdfService } from './report-pdf.service';
import { ReportService } from './report.service';
export declare class ReportController {
    private readonly reportService;
    private readonly reportPdfService;
    constructor(reportService: ReportService, reportPdfService: ReportPdfService);
    private pdfResponse;
    private requireCommessaId;
    getDashboard(): Promise<{
        generatedAt: string;
        riepilogo: {
            commesseTotal: number;
            commesseAttive: number;
            materialiTotal: number;
            documentiTotal: number;
            nonConformitaAperte: number;
            nonConformitaChiuse: number;
            auditTotal: number;
            auditNonConformi: number;
            wpsTotal: number;
            wpqrInScadenza90gg: number;
        };
        ultimeNonConformita: ({
            commessa: {
                codice: string;
                cliente: string;
            };
        } & {
            tipo: import(".prisma/client").$Enums.NcTipo;
            id: string;
            commessaId: string;
            titolo: string;
            descrizione: string;
            stato: import(".prisma/client").$Enums.NcStato;
            gravita: import(".prisma/client").$Enums.NcGravita;
            azioniCorrettive: string | null;
            dataApertura: Date;
            dataChiusura: Date | null;
        })[];
        ultimiAudit: ({
            commessa: {
                codice: string;
                cliente: string;
            };
        } & {
            id: string;
            data: Date;
            commessaId: string;
            titolo: string;
            auditor: string;
            esito: import(".prisma/client").$Enums.AuditEsito;
            note: string | null;
        })[];
    }>;
    commessaPdf(commessaId: string): Promise<StreamableFile>;
    getCommessaReport(id: string): Promise<{
        commessa: {
            wps: {
                scadenza: Date | null;
                id: string;
                commessaId: string | null;
                note: string | null;
                codice: string;
                descrizione: string | null;
                materialeId: string | null;
                processo: string;
                spessore: string | null;
                materialeBase: string | null;
            }[];
            wpqr: {
                scadenza: Date | null;
                id: string;
                commessaId: string | null;
                note: string | null;
                codice: string;
                saldatore: string;
                wpsId: string;
                dataQualifica: Date;
                qualificaId: string | null;
            }[];
            nonConformita: {
                tipo: import(".prisma/client").$Enums.NcTipo;
                id: string;
                commessaId: string;
                titolo: string;
                descrizione: string;
                stato: import(".prisma/client").$Enums.NcStato;
                gravita: import(".prisma/client").$Enums.NcGravita;
                azioniCorrettive: string | null;
                dataApertura: Date;
                dataChiusura: Date | null;
            }[];
            tracciabilita: ({
                materiale: {
                    codice: string;
                    lotto: string | null;
                };
            } & {
                id: string;
                commessaId: string;
                note: string | null;
                materialeId: string;
                posizione: string;
                quantita: import("@prisma/client/runtime/library").Decimal;
                descrizioneComponente: string | null;
                riferimentoDisegno: string | null;
            })[];
            materiali: {
                tipo: string | null;
                id: string;
                commessaId: string;
                codice: string;
                descrizione: string;
                norma: string | null;
                certificato31: string | null;
                certificatoDocumentoId: string | null;
                lotto: string | null;
                fornitore: string | null;
                dataCarico: Date | null;
            }[];
            documenti: {
                nome: string;
                tipo: string;
                id: string;
                commessaId: string;
                createdAt: Date;
                updatedAt: Date;
                versione: string;
                percorsoFile: string;
                statoApprovazione: import(".prisma/client").$Enums.DocumentoStatoApprovazione;
            }[];
            pianiControllo: {
                id: string;
                commessaId: string;
                esito: import(".prisma/client").$Enums.PianoControlloEsito;
                fase: string;
                controlliRichiesti: import("@prisma/client/runtime/library").JsonValue;
            }[];
            audits: {
                id: string;
                data: Date;
                commessaId: string;
                titolo: string;
                auditor: string;
                esito: import(".prisma/client").$Enums.AuditEsito;
                note: string | null;
            }[];
            checklists: {
                id: string;
                commessaId: string | null;
                titolo: string;
                esito: import(".prisma/client").$Enums.ChecklistEsito | null;
                note: string | null;
                stato: import(".prisma/client").$Enums.ChecklistStato;
                categoria: string;
                fase: string | null;
                dataCompilazione: Date | null;
                operatore: string | null;
                allegati: import("@prisma/client/runtime/library").JsonValue | null;
                elementi: import("@prisma/client/runtime/library").JsonValue;
            }[];
        } & {
            id: string;
            titolo: string | null;
            note: string | null;
            codice: string;
            cliente: string;
            descrizione: string | null;
            responsabile: string | null;
            luogo: string | null;
            dataInizio: Date | null;
            dataFine: Date | null;
            stato: import(".prisma/client").$Enums.CommessaStato;
            createdAt: Date;
            updatedAt: Date;
        };
        nonConformitaPerStato: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.NonConformitaGroupByOutputType, "stato"[]> & {
            _count: {
                _all: number;
            };
        })[];
    }>;
    getMaterialiPerFornitore(): Promise<{
        fornitore: string | null;
        conteggio: number;
    }[]>;
    dopPdf(commessaId: string): Promise<StreamableFile>;
    cePdf(commessaId: string): Promise<StreamableFile>;
    fascicoloTecnicoPdf(commessaId: string): Promise<StreamableFile>;
    materialiPdf(commessaId: string): Promise<StreamableFile>;
    tracciabilitaPdf(commessaId: string): Promise<StreamableFile>;
}

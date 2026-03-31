import { ChecklistService } from '../checklist/checklist.service';
import { MaterialiService } from '../materiali/materiali.service';
import { TracciabilitaService } from '../tracciabilita/tracciabilita.service';
import { WpsService } from '../wps/wps.service';
import { WpqrService } from '../wpqr/wpqr.service';
import { NonConformitaService } from '../non-conformita/non-conformita.service';
import { AuditService } from '../audit/audit.service';
import { PianiControlloService } from '../piani-controllo/piani-controllo.service';
import { DocumentiService } from '../documenti/documenti.service';
import { CommesseService } from './commesse.service';
import { CreateCommessaDto } from './dto/create-commessa.dto';
import { QueryCommessaDto } from './dto/query-commessa.dto';
import { UpdateCommessaDto } from './dto/update-commessa.dto';
export declare class CommesseController {
    private readonly commesseService;
    private readonly materialiService;
    private readonly checklistService;
    private readonly tracciabilitaService;
    private readonly wpsService;
    private readonly wpqrService;
    private readonly nonConformitaService;
    private readonly auditService;
    private readonly pianiControlloService;
    private readonly documentiService;
    constructor(commesseService: CommesseService, materialiService: MaterialiService, checklistService: ChecklistService, tracciabilitaService: TracciabilitaService, wpsService: WpsService, wpqrService: WpqrService, nonConformitaService: NonConformitaService, auditService: AuditService, pianiControlloService: PianiControlloService, documentiService: DocumentiService);
    create(dto: CreateCommessaDto): Promise<{
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
    }>;
    findAll(query: QueryCommessaDto): Promise<{
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
    }[]>;
    listMateriali(id: string): Promise<({
        commessa: {
            id: string;
            codice: string;
            cliente: string;
        };
        certificatoDocumento: {
            nome: string;
            tipo: string;
            id: string;
            versione: string;
            percorsoFile: string;
        } | null;
    } & {
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
    })[]>;
    listChecklist(id: string): Promise<({
        commessa: {
            id: string;
            codice: string;
            cliente: string;
        } | null;
    } & {
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
    })[]>;
    listTracciabilita(id: string): Promise<({
        commessa: {
            id: string;
            codice: string;
            cliente: string;
        };
        materiale: {
            id: string;
            codice: string;
            descrizione: string;
            certificato31: string | null;
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
    })[]>;
    listWps(id: string): Promise<({
        commessa: {
            id: string;
            codice: string;
            cliente: string;
        } | null;
        materiale: {
            id: string;
            codice: string;
            descrizione: string;
            norma: string | null;
            lotto: string | null;
        } | null;
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
    } & {
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
    })[]>;
    listWpqr(id: string): Promise<({
        commessa: {
            id: string;
            codice: string;
            cliente: string;
        } | null;
        wps: {
            id: string;
            codice: string;
            descrizione: string | null;
            processo: string;
        };
        qualifica: {
            nome: string;
            scadenza: Date | null;
            id: string;
            ruolo: string;
        } | null;
    } & {
        scadenza: Date | null;
        id: string;
        commessaId: string | null;
        note: string | null;
        codice: string;
        saldatore: string;
        wpsId: string;
        dataQualifica: Date;
        qualificaId: string | null;
    })[]>;
    listDocumenti(id: string): Promise<({
        commessa: {
            id: string;
            codice: string;
            cliente: string;
        };
    } & {
        nome: string;
        tipo: string;
        id: string;
        commessaId: string;
        createdAt: Date;
        updatedAt: Date;
        versione: string;
        percorsoFile: string;
        statoApprovazione: import(".prisma/client").$Enums.DocumentoStatoApprovazione;
    })[]>;
    listNonConformita(id: string): Promise<({
        commessa: {
            id: string;
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
    })[]>;
    listAudit(id: string): Promise<({
        commessa: {
            id: string;
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
    })[]>;
    listPianiControllo(id: string): Promise<({
        commessa: {
            id: string;
            codice: string;
            cliente: string;
        };
    } & {
        id: string;
        commessaId: string;
        esito: import(".prisma/client").$Enums.PianoControlloEsito;
        fase: string;
        controlliRichiesti: import("@prisma/client/runtime/library").JsonValue;
    })[]>;
    findOne(id: string): Promise<{
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
                id: string;
                codice: string;
                descrizione: string;
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
    }>;
    update(id: string, dto: UpdateCommessaDto): Promise<{
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
    }>;
    remove(id: string): Promise<{
        deleted: boolean;
        id: string;
    }>;
}

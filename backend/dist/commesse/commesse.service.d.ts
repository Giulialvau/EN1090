import { Commessa, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommessaDto } from './dto/create-commessa.dto';
import { QueryCommessaDto } from './dto/query-commessa.dto';
import { UpdateCommessaDto } from './dto/update-commessa.dto';
export declare class CommesseService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
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
    private buildCommessaWhere;
    findAll(query?: QueryCommessaDto): Promise<Commessa[]>;
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
            quantita: Prisma.Decimal;
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
            controlliRichiesti: Prisma.JsonValue;
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
            allegati: Prisma.JsonValue | null;
            elementi: Prisma.JsonValue;
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
    private ensureExists;
}

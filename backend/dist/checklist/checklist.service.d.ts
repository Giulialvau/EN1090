import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChecklistDto } from './dto/create-checklist.dto';
import { UpdateChecklistDto } from './dto/update-checklist.dto';
export declare class ChecklistService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateChecklistDto): Promise<{
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
        allegati: Prisma.JsonValue | null;
        elementi: Prisma.JsonValue;
    }>;
    findAll(): Prisma.PrismaPromise<({
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
        allegati: Prisma.JsonValue | null;
        elementi: Prisma.JsonValue;
    })[]>;
    findByCommessa(commessaId: string): Promise<({
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
        allegati: Prisma.JsonValue | null;
        elementi: Prisma.JsonValue;
    })[]>;
    findOne(id: string): Promise<{
        commessa: {
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
        allegati: Prisma.JsonValue | null;
        elementi: Prisma.JsonValue;
    }>;
    update(id: string, dto: UpdateChecklistDto): Promise<{
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
        allegati: Prisma.JsonValue | null;
        elementi: Prisma.JsonValue;
    }>;
    remove(id: string): Promise<{
        deleted: boolean;
        id: string;
    }>;
    private ensureCommessa;
    private ensureExists;
}

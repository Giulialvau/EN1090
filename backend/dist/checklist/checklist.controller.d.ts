import { ChecklistService } from './checklist.service';
import { CreateChecklistDto } from './dto/create-checklist.dto';
import { UpdateChecklistDto } from './dto/update-checklist.dto';
export declare class ChecklistController {
    private readonly checklistService;
    constructor(checklistService: ChecklistService);
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
        allegati: import("@prisma/client/runtime/library").JsonValue | null;
        elementi: import("@prisma/client/runtime/library").JsonValue;
    }>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
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
        allegati: import("@prisma/client/runtime/library").JsonValue | null;
        elementi: import("@prisma/client/runtime/library").JsonValue;
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
        allegati: import("@prisma/client/runtime/library").JsonValue | null;
        elementi: import("@prisma/client/runtime/library").JsonValue;
    }>;
    remove(id: string): Promise<{
        deleted: boolean;
        id: string;
    }>;
}

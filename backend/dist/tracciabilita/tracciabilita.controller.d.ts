import { CreateTracciabilitaDto } from './dto/create-tracciabilita.dto';
import { UpdateTracciabilitaDto } from './dto/update-tracciabilita.dto';
import { TracciabilitaService } from './tracciabilita.service';
export declare class TracciabilitaController {
    private readonly tracciabilitaService;
    constructor(tracciabilitaService: TracciabilitaService);
    create(dto: CreateTracciabilitaDto): Promise<{
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
    }>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
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
    findOne(id: string): Promise<{
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
    }>;
    update(id: string, dto: UpdateTracciabilitaDto): Promise<{
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
    }>;
    remove(id: string): Promise<{
        deleted: boolean;
        id: string;
    }>;
}

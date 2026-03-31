import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTracciabilitaDto } from './dto/create-tracciabilita.dto';
import { UpdateTracciabilitaDto } from './dto/update-tracciabilita.dto';
export declare class TracciabilitaService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
        quantita: Prisma.Decimal;
        descrizioneComponente: string | null;
        riferimentoDisegno: string | null;
    }>;
    findAll(): Prisma.PrismaPromise<({
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
        quantita: Prisma.Decimal;
        descrizioneComponente: string | null;
        riferimentoDisegno: string | null;
    })[]>;
    findByCommessa(commessaId: string): Promise<({
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
        quantita: Prisma.Decimal;
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
        quantita: Prisma.Decimal;
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
        quantita: Prisma.Decimal;
        descrizioneComponente: string | null;
        riferimentoDisegno: string | null;
    }>;
    remove(id: string): Promise<{
        deleted: boolean;
        id: string;
    }>;
    private ensureCommessaExists;
    private ensureMaterialeCommessaCoherent;
    private ensureExists;
}

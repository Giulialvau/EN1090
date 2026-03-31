import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWpqrDto } from './dto/create-wpqr.dto';
import { UpdateWpqrDto } from './dto/update-wpqr.dto';
export declare class WpqrService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateWpqrDto): Promise<{
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
    }>;
    findAll(): Prisma.PrismaPromise<({
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
    findByCommessa(commessaId: string): Promise<({
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
    findOne(id: string): Promise<{
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
    }>;
    update(id: string, dto: UpdateWpqrDto): Promise<{
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
    }>;
    remove(id: string): Promise<{
        deleted: boolean;
        id: string;
    }>;
    private ensureCommessa;
    private ensureQualifica;
    private ensureExists;
}

import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWpsDto } from './dto/create-wps.dto';
import { UpdateWpsDto } from './dto/update-wps.dto';
export declare class WpsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateWpsDto): Promise<{
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
    }>;
    findAll(): Prisma.PrismaPromise<({
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
    findByCommessa(commessaId: string): Promise<({
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
    findOne(id: string): Promise<{
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
    }>;
    update(id: string, dto: UpdateWpsDto): Promise<{
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
    }>;
    remove(id: string): Promise<{
        deleted: boolean;
        id: string;
    }>;
    private ensureCommessa;
    private ensureExists;
    private validateMaterialeForWps;
}

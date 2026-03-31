import { CreateWpqrDto } from './dto/create-wpqr.dto';
import { UpdateWpqrDto } from './dto/update-wpqr.dto';
import { WpqrService } from './wpqr.service';
export declare class WpqrController {
    private readonly wpqrService;
    constructor(wpqrService: WpqrService);
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
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
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
}

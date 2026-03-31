import { CreateMaterialeDto } from './dto/create-materiale.dto';
import { UpdateMaterialeDto } from './dto/update-materiale.dto';
import { MaterialiService } from './materiali.service';
export declare class MaterialiController {
    private readonly materialiService;
    constructor(materialiService: MaterialiService);
    create(dto: CreateMaterialeDto): Promise<{
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
    }>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
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
    findOne(id: string): Promise<{
        commessa: {
            id: string;
            codice: string;
            cliente: string;
        };
        tracciabilita: {
            id: string;
            commessaId: string;
            note: string | null;
            materialeId: string;
            posizione: string;
            quantita: import("@prisma/client/runtime/library").Decimal;
            descrizioneComponente: string | null;
            riferimentoDisegno: string | null;
        }[];
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
    }>;
    update(id: string, dto: UpdateMaterialeDto): Promise<{
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
    }>;
    remove(id: string): Promise<{
        deleted: boolean;
        id: string;
    }>;
}

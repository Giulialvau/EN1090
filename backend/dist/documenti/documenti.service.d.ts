import { createReadStream } from 'fs';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { UpdateDocumentoDto } from './dto/update-documento.dto';
import { UploadDocumentoDto } from './dto/upload-documento.dto';
export declare class DocumentiService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private ensureUploadDir;
    create(dto: CreateDocumentoDto): Promise<{
        nome: string;
        tipo: string;
        id: string;
        commessaId: string;
        createdAt: Date;
        updatedAt: Date;
        versione: string;
        percorsoFile: string;
        statoApprovazione: import(".prisma/client").$Enums.DocumentoStatoApprovazione;
    }>;
    uploadFromFile(file: Express.Multer.File, dto: UploadDocumentoDto): Promise<{
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
    }>;
    absolutePathFromStored(percorsoFile: string): string;
    getReadStreamForDocumento(id: string): Promise<{
        stream: ReturnType<typeof createReadStream>;
        filename: string;
        mimeType: string;
    }>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
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
    findByCommessa(commessaId: string): Promise<({
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
    }>;
    update(id: string, dto: UpdateDocumentoDto): Promise<{
        nome: string;
        tipo: string;
        id: string;
        commessaId: string;
        createdAt: Date;
        updatedAt: Date;
        versione: string;
        percorsoFile: string;
        statoApprovazione: import(".prisma/client").$Enums.DocumentoStatoApprovazione;
    }>;
    remove(id: string): Promise<{
        deleted: boolean;
        id: string;
    }>;
    private ensureCommessa;
    private ensureExists;
}

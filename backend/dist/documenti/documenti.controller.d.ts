import { StreamableFile } from '@nestjs/common';
import { DocumentiService } from './documenti.service';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { UpdateDocumentoDto } from './dto/update-documento.dto';
import { UploadDocumentoDto } from './dto/upload-documento.dto';
export declare class DocumentiController {
    private readonly documentiService;
    constructor(documentiService: DocumentiService);
    upload(file: Express.Multer.File | undefined, body: UploadDocumentoDto): Promise<{
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
    download(id: string): Promise<StreamableFile>;
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
}

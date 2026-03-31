import { DocumentoStatoApprovazione } from '@prisma/client';
export declare class CreateDocumentoDto {
    commessaId: string;
    nome: string;
    tipo: string;
    versione: string;
    percorsoFile: string;
    statoApprovazione?: DocumentoStatoApprovazione;
}

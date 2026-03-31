import { CommessaStato } from '@prisma/client';
export declare class CreateCommessaDto {
    codice: string;
    titolo?: string;
    cliente: string;
    descrizione?: string;
    responsabile?: string;
    luogo?: string;
    note?: string;
    dataInizio?: Date;
    dataFine?: Date;
    stato?: CommessaStato;
}

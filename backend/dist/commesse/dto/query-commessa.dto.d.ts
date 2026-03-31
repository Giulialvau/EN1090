import { CommessaStato } from '@prisma/client';
export declare class QueryCommessaDto {
    stato?: CommessaStato;
    cliente?: string;
    dataInizioDa?: string;
    dataInizioA?: string;
}

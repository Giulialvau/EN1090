import { ChecklistEsito, ChecklistStato } from '@prisma/client';
import { ChecklistElementoDto } from './checklist-elemento.dto';
export declare class CreateChecklistDto {
    titolo: string;
    categoria: string;
    fase?: string;
    dataCompilazione?: Date;
    esito?: ChecklistEsito;
    note?: string;
    operatore?: string;
    allegati?: unknown;
    stato: ChecklistStato;
    elementi?: ChecklistElementoDto[];
    commessaId?: string;
}

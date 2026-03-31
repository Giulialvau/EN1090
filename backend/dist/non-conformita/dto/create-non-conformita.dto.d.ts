import { NcGravita, NcStato, NcTipo } from '@prisma/client';
export declare class CreateNonConformitaDto {
    commessaId: string;
    titolo: string;
    descrizione: string;
    tipo: NcTipo;
    gravita: NcGravita;
    stato: NcStato;
    azioniCorrettive?: string;
    dataApertura?: Date;
    dataChiusura?: Date;
}

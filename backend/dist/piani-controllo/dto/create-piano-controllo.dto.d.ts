import { PianoControlloEsito } from '@prisma/client';
import { ControlloRichiestoDto } from './controllo-richiesto.dto';
export declare class CreatePianoControlloDto {
    commessaId: string;
    fase: string;
    controlliRichiesti: ControlloRichiestoDto[];
    esito: PianoControlloEsito;
}

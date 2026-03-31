import { CreatePianoControlloDto } from './dto/create-piano-controllo.dto';
import { UpdatePianoControlloDto } from './dto/update-piano-controllo.dto';
import { PianiControlloService } from './piani-controllo.service';
export declare class PianiControlloController {
    private readonly pianiControlloService;
    constructor(pianiControlloService: PianiControlloService);
    create(dto: CreatePianoControlloDto): Promise<{
        id: string;
        commessaId: string;
        esito: import(".prisma/client").$Enums.PianoControlloEsito;
        fase: string;
        controlliRichiesti: import("@prisma/client/runtime/library").JsonValue;
    }>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        commessa: {
            id: string;
            codice: string;
            cliente: string;
        };
    } & {
        id: string;
        commessaId: string;
        esito: import(".prisma/client").$Enums.PianoControlloEsito;
        fase: string;
        controlliRichiesti: import("@prisma/client/runtime/library").JsonValue;
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
        id: string;
        commessaId: string;
        esito: import(".prisma/client").$Enums.PianoControlloEsito;
        fase: string;
        controlliRichiesti: import("@prisma/client/runtime/library").JsonValue;
    }>;
    update(id: string, dto: UpdatePianoControlloDto): Promise<{
        id: string;
        commessaId: string;
        esito: import(".prisma/client").$Enums.PianoControlloEsito;
        fase: string;
        controlliRichiesti: import("@prisma/client/runtime/library").JsonValue;
    }>;
    remove(id: string): Promise<{
        deleted: boolean;
        id: string;
    }>;
}

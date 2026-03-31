import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePianoControlloDto } from './dto/create-piano-controllo.dto';
import { UpdatePianoControlloDto } from './dto/update-piano-controllo.dto';
export declare class PianiControlloService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreatePianoControlloDto): Promise<{
        id: string;
        commessaId: string;
        esito: import(".prisma/client").$Enums.PianoControlloEsito;
        fase: string;
        controlliRichiesti: Prisma.JsonValue;
    }>;
    findAll(): Prisma.PrismaPromise<({
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
        controlliRichiesti: Prisma.JsonValue;
    })[]>;
    findByCommessa(commessaId: string): Promise<({
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
        controlliRichiesti: Prisma.JsonValue;
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
        controlliRichiesti: Prisma.JsonValue;
    }>;
    update(id: string, dto: UpdatePianoControlloDto): Promise<{
        id: string;
        commessaId: string;
        esito: import(".prisma/client").$Enums.PianoControlloEsito;
        fase: string;
        controlliRichiesti: Prisma.JsonValue;
    }>;
    remove(id: string): Promise<{
        deleted: boolean;
        id: string;
    }>;
    private ensureCommessa;
    private ensureExists;
}

import { PrismaService } from '../prisma/prisma.service';
import { CreateNonConformitaDto } from './dto/create-non-conformita.dto';
import { UpdateNonConformitaDto } from './dto/update-non-conformita.dto';
export declare class NonConformitaService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateNonConformitaDto): Promise<{
        tipo: import(".prisma/client").$Enums.NcTipo;
        id: string;
        commessaId: string;
        titolo: string;
        descrizione: string;
        stato: import(".prisma/client").$Enums.NcStato;
        gravita: import(".prisma/client").$Enums.NcGravita;
        azioniCorrettive: string | null;
        dataApertura: Date;
        dataChiusura: Date | null;
    }>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        commessa: {
            id: string;
            codice: string;
            cliente: string;
        };
    } & {
        tipo: import(".prisma/client").$Enums.NcTipo;
        id: string;
        commessaId: string;
        titolo: string;
        descrizione: string;
        stato: import(".prisma/client").$Enums.NcStato;
        gravita: import(".prisma/client").$Enums.NcGravita;
        azioniCorrettive: string | null;
        dataApertura: Date;
        dataChiusura: Date | null;
    })[]>;
    findByCommessa(commessaId: string): Promise<({
        commessa: {
            id: string;
            codice: string;
            cliente: string;
        };
    } & {
        tipo: import(".prisma/client").$Enums.NcTipo;
        id: string;
        commessaId: string;
        titolo: string;
        descrizione: string;
        stato: import(".prisma/client").$Enums.NcStato;
        gravita: import(".prisma/client").$Enums.NcGravita;
        azioniCorrettive: string | null;
        dataApertura: Date;
        dataChiusura: Date | null;
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
        tipo: import(".prisma/client").$Enums.NcTipo;
        id: string;
        commessaId: string;
        titolo: string;
        descrizione: string;
        stato: import(".prisma/client").$Enums.NcStato;
        gravita: import(".prisma/client").$Enums.NcGravita;
        azioniCorrettive: string | null;
        dataApertura: Date;
        dataChiusura: Date | null;
    }>;
    update(id: string, dto: UpdateNonConformitaDto): Promise<{
        tipo: import(".prisma/client").$Enums.NcTipo;
        id: string;
        commessaId: string;
        titolo: string;
        descrizione: string;
        stato: import(".prisma/client").$Enums.NcStato;
        gravita: import(".prisma/client").$Enums.NcGravita;
        azioniCorrettive: string | null;
        dataApertura: Date;
        dataChiusura: Date | null;
    }>;
    remove(id: string): Promise<{
        deleted: boolean;
        id: string;
    }>;
    private ensureCommessa;
    private ensureExists;
}

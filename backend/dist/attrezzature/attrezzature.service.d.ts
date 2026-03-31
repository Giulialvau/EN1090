import { PrismaService } from '../prisma/prisma.service';
import { CreateAttrezzaturaDto } from './dto/create-attrezzatura.dto';
import { UpdateAttrezzaturaDto } from './dto/update-attrezzatura.dto';
export declare class AttrezzatureService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateAttrezzaturaDto): Promise<{
        nome: string;
        matricola: string;
        tipo: string;
        dataManutenzione: Date | null;
        dataTaratura: Date | null;
        scadenza: Date | null;
        id: string;
    }>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        nome: string;
        matricola: string;
        tipo: string;
        dataManutenzione: Date | null;
        dataTaratura: Date | null;
        scadenza: Date | null;
        id: string;
    }[]>;
    findOne(id: string): Promise<{
        nome: string;
        matricola: string;
        tipo: string;
        dataManutenzione: Date | null;
        dataTaratura: Date | null;
        scadenza: Date | null;
        id: string;
    }>;
    update(id: string, dto: UpdateAttrezzaturaDto): Promise<{
        nome: string;
        matricola: string;
        tipo: string;
        dataManutenzione: Date | null;
        dataTaratura: Date | null;
        scadenza: Date | null;
        id: string;
    }>;
    remove(id: string): Promise<{
        deleted: boolean;
        id: string;
    }>;
    private ensureExists;
}

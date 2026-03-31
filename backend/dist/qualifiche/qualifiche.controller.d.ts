import { CreateQualificaDto } from './dto/create-qualifica.dto';
import { UpdateQualificaDto } from './dto/update-qualifica.dto';
import { QualificheService } from './qualifiche.service';
export declare class QualificheController {
    private readonly qualificheService;
    constructor(qualificheService: QualificheService);
    create(dto: CreateQualificaDto): import(".prisma/client").Prisma.Prisma__QualificaClient<{
        documento: string | null;
        nome: string;
        scadenza: Date | null;
        id: string;
        ruolo: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        documento: string | null;
        nome: string;
        scadenza: Date | null;
        id: string;
        ruolo: string;
    }[]>;
    findOne(id: string): Promise<{
        documento: string | null;
        nome: string;
        scadenza: Date | null;
        id: string;
        ruolo: string;
    }>;
    update(id: string, dto: UpdateQualificaDto): Promise<{
        documento: string | null;
        nome: string;
        scadenza: Date | null;
        id: string;
        ruolo: string;
    }>;
    remove(id: string): Promise<{
        deleted: boolean;
        id: string;
    }>;
}

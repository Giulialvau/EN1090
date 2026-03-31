import { AuditService } from './audit.service';
import { CreateAuditDto } from './dto/create-audit.dto';
import { UpdateAuditDto } from './dto/update-audit.dto';
export declare class AuditController {
    private readonly auditService;
    constructor(auditService: AuditService);
    create(dto: CreateAuditDto): Promise<{
        id: string;
        data: Date;
        commessaId: string;
        titolo: string;
        auditor: string;
        esito: import(".prisma/client").$Enums.AuditEsito;
        note: string | null;
    }>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        commessa: {
            id: string;
            codice: string;
            cliente: string;
        };
    } & {
        id: string;
        data: Date;
        commessaId: string;
        titolo: string;
        auditor: string;
        esito: import(".prisma/client").$Enums.AuditEsito;
        note: string | null;
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
        data: Date;
        commessaId: string;
        titolo: string;
        auditor: string;
        esito: import(".prisma/client").$Enums.AuditEsito;
        note: string | null;
    }>;
    update(id: string, dto: UpdateAuditDto): Promise<{
        id: string;
        data: Date;
        commessaId: string;
        titolo: string;
        auditor: string;
        esito: import(".prisma/client").$Enums.AuditEsito;
        note: string | null;
    }>;
    remove(id: string): Promise<{
        deleted: boolean;
        id: string;
    }>;
}

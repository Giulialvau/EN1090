import { AuditEsito } from '@prisma/client';
export declare class CreateAuditDto {
    commessaId: string;
    titolo: string;
    data: Date;
    auditor: string;
    esito: AuditEsito;
    note?: string;
}

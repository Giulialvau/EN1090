import { Role } from '@prisma/client';
export declare class UserEntity {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
}

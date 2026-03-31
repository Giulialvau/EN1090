import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<Omit<User, 'passwordHash'>>;
    findAll(): Promise<Array<Omit<User, 'passwordHash'>>>;
    findOne(id: string): Promise<Omit<User, 'passwordHash'>>;
    findByEmail(email: string): Promise<User | null>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<Omit<User, 'passwordHash'>>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
    updateRefreshToken(userId: string, refreshToken: string | null): Promise<void>;
    private ensureExists;
    private excludeSensitive;
}

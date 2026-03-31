import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<Omit<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.Role;
        passwordHash: string;
        refreshTokenHash: string | null;
    }, "passwordHash">>;
    findAll(): Promise<Omit<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.Role;
        passwordHash: string;
        refreshTokenHash: string | null;
    }, "passwordHash">[]>;
    findOne(id: string): Promise<Omit<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.Role;
        passwordHash: string;
        refreshTokenHash: string | null;
    }, "passwordHash">>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<Omit<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.Role;
        passwordHash: string;
        refreshTokenHash: string | null;
    }, "passwordHash">>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}

import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        user: Omit<{
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.Role;
            passwordHash: string;
            refreshTokenHash: string | null;
        }, "passwordHash">;
        access_token: string;
        refresh_token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.Role;
            passwordHash: string;
            refreshTokenHash: string | null;
        };
        access_token: string;
        refresh_token: string;
    }>;
    refresh(req: Request): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    logout(req: Request): Promise<{
        loggedOut: boolean;
    }>;
}

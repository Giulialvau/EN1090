import { CreateUserDto } from '../../users/dto/create-user.dto';
declare const RegisterDto_base: import("@nestjs/common").Type<Pick<CreateUserDto, "email" | "password" | "firstName" | "lastName">>;
export declare class RegisterDto extends RegisterDto_base {
}
export {};

import { Role } from "@prisma/client";
import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";

export class UpdateUserDto {
  @ApiPropertyOptional({ description: "Email utente" })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: "Password in chiaro (min 8 caratteri)" })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @ApiPropertyOptional({ description: "Nome" })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ description: "Cognome" })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ description: "Ruolo", enum: Role })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}

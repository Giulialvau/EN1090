import { Role } from "@prisma/client";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";

export class CreateUserDto {
  @ApiProperty({ description: "Email utente" })
  @IsEmail()
  email!: string;

  @ApiProperty({ description: "Password in chiaro (min 8 caratteri)" })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ description: "Nome" })
  @IsString()
  firstName!: string;

  @ApiProperty({ description: "Cognome" })
  @IsString()
  lastName!: string;

  @ApiPropertyOptional({ description: "Ruolo (default: USER)", enum: Role })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}

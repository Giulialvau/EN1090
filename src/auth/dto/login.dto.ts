import { IsEmail, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({ description: "Email utente" })
  @IsEmail()
  email!: string;

  @ApiProperty({ description: "Password in chiaro (min 8 caratteri)" })
  @IsString()
  @MinLength(8)
  password!: string;
}

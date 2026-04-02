import { CommessaStato } from "@prisma/client";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

export class CreateCommessaDto {
  @ApiProperty({ description: "Codice commessa univoco" })
  @IsString()
  @MaxLength(64)
  codice!: string;

  @ApiPropertyOptional({ description: "Titolo commessa" })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  titolo?: string;

  @ApiProperty({ description: "Cliente" })
  @IsString()
  @MaxLength(255)
  cliente!: string;

  @ApiPropertyOptional({ description: "Descrizione commessa" })
  @IsOptional()
  @IsString()
  descrizione?: string;

  @ApiPropertyOptional({ description: "Responsabile commessa" })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  responsabile?: string;

  @ApiPropertyOptional({ description: "Luogo / cantiere" })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  luogo?: string;

  @ApiPropertyOptional({ description: "Note" })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({ description: "Data inizio" })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dataInizio?: Date;

  @ApiPropertyOptional({ description: "Data fine" })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dataFine?: Date;

  @ApiPropertyOptional({ description: "Stato commessa", enum: CommessaStato })
  @IsOptional()
  @IsEnum(CommessaStato)
  stato?: CommessaStato;
}

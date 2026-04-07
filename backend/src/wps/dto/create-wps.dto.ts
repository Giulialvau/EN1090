import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from "class-validator";

export class CreateWpsDto {
  @ApiProperty({ description: "Codice WPS univoco" })
  @IsString()
  @MaxLength(64)
  codice!: string;

  @ApiPropertyOptional({ description: "Descrizione WPS" })
  @IsOptional()
  @IsString()
  descrizione?: string;

  @ApiProperty({ description: "Processo (testo libero, es. 111/135)" })
  @IsString()
  @MaxLength(128)
  processo!: string;

  @ApiPropertyOptional({ description: "Spessore (testo libero)" })
  @IsOptional()
  @IsString()
  spessore?: string;

  @ApiPropertyOptional({ description: "Materiale base (testo libero)" })
  @IsOptional()
  @IsString()
  materialeBase?: string;

  @ApiPropertyOptional({ description: "Data scadenza (opzionale)" })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  scadenza?: Date;

  @ApiPropertyOptional({ description: "ID commessa (Int) opzionale" })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  commessaId?: number;

  @ApiPropertyOptional({ description: "Note (opzionale)" })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({ description: "ID materiale (Int) opzionale" })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  materialeId?: number;
}

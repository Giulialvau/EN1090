import { ChecklistEsito, ChecklistStato } from "@prisma/client";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
  Min,
} from "class-validator";

import { ChecklistElementoDto } from "./checklist-elemento.dto";

export class CreateChecklistDto {
  @ApiProperty({ description: "Titolo checklist" })
  @IsString()
  titolo!: string;

  @ApiProperty({ description: "Categoria checklist (tipologia legacy UI)" })
  @IsString()
  categoria!: string;

  @ApiPropertyOptional({ description: "Fase di lavorazione / controllo" })
  @IsOptional()
  @IsString()
  fase?: string;

  @ApiPropertyOptional({ description: "Data compilazione (default: now)" })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dataCompilazione?: Date;

  @ApiPropertyOptional({ description: "Esito checklist", enum: ChecklistEsito })
  @IsOptional()
  @IsEnum(ChecklistEsito)
  esito?: ChecklistEsito;

  @ApiPropertyOptional({ description: "Note checklist" })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({ description: "Operatore / compilatore" })
  @IsOptional()
  @IsString()
  operatore?: string;

  @ApiPropertyOptional({
    description: "Allegati (JSON) es. array di { documentoId?, nome?, note? }",
    type: Object,
  })
  @IsOptional()
  allegati?: unknown;

  @ApiProperty({ description: "Stato checklist", enum: ChecklistStato })
  @IsEnum(ChecklistStato)
  stato!: ChecklistStato;

  @ApiPropertyOptional({
    description:
      "Elementi checklist (array di punti controllo) serializzati in JSON",
    type: [ChecklistElementoDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChecklistElementoDto)
  elementi?: ChecklistElementoDto[];

  @ApiProperty({ description: "ID commessa (Int)" })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  commessaId!: number;
}

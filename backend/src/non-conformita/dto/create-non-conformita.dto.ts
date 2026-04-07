import { NcGravita, NcStato, NcTipo } from "@prisma/client";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

export class CreateNonConformitaDto {
  @ApiProperty({ description: "ID commessa (Int)" })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  commessaId!: number;

  @ApiProperty({ description: "Titolo non conformità" })
  @IsString()
  titolo!: string;

  @ApiProperty({ description: "Descrizione (testo)" })
  @IsString()
  descrizione!: string;

  @ApiProperty({ description: "Tipo non conformità", enum: NcTipo })
  @IsEnum(NcTipo)
  tipo!: NcTipo;

  @ApiProperty({ description: "Gravità", enum: NcGravita })
  @IsEnum(NcGravita)
  gravita!: NcGravita;

  @ApiProperty({ description: "Stato", enum: NcStato })
  @IsEnum(NcStato)
  stato!: NcStato;

  @ApiPropertyOptional({ description: "Causa (opzionale)" })
  @IsOptional()
  @IsString()
  causa?: string;

  @ApiPropertyOptional({ description: "Azione correttiva (opzionale)" })
  @IsOptional()
  @IsString()
  azione?: string;

  @ApiPropertyOptional({ description: "Note (opzionale)" })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({ description: "Data apertura (default: now)" })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dataApertura?: Date;

  @ApiPropertyOptional({ description: "Data chiusura" })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dataChiusura?: Date;
}

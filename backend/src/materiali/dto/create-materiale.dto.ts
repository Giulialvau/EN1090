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

export class CreateMaterialeDto {
  @ApiProperty({ description: "ID commessa (Int)" })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  commessaId!: number;

  @ApiProperty({ description: "Codice materiale univoco per commessa" })
  @IsString()
  @MaxLength(128)
  codice!: string;

  @ApiProperty({ description: "Descrizione materiale" })
  @IsString()
  descrizione!: string;

  @ApiPropertyOptional({ description: "Tipologia materiale" })
  @IsOptional()
  @IsString()
  @MaxLength(128)
  tipo?: string;

  @ApiPropertyOptional({ description: "Norma di riferimento (es. EN 10025-2)" })
  @IsOptional()
  @IsString()
  @MaxLength(128)
  norma?: string;

  @ApiPropertyOptional({ description: "Riferimento certificato 3.1" })
  @IsOptional()
  @IsString()
  certificato31?: string;

  @ApiPropertyOptional({
    description: "ID documento certificato collegato (Int)",
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  certificatoDocumentoId?: number;

  @ApiPropertyOptional({ description: "Lotto / batch" })
  @IsOptional()
  @IsString()
  lotto?: string;

  @ApiPropertyOptional({ description: "Fornitore materiale" })
  @IsOptional()
  @IsString()
  fornitore?: string;

  @ApiPropertyOptional({ description: "Data carico materiale" })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dataCarico?: Date;
}

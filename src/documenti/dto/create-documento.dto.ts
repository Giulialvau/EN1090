import { DocumentoStatoApprovazione } from "@prisma/client";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from "class-validator";

export class CreateDocumentoDto {
  @ApiProperty({ description: "ID commessa (Int)" })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  commessaId!: number;

  @ApiProperty({ description: "Nome documento" })
  @IsString()
  @MaxLength(255)
  nome!: string;

  @ApiProperty({ description: "Tipo documento (testo libero)" })
  @IsString()
  @MaxLength(128)
  tipo!: string;

  @ApiProperty({ description: "Versione documento (es. 1.0)" })
  @IsString()
  @MaxLength(32)
  versione!: string;

  @ApiProperty({
    description: "Percorso file salvato (relativo al backend)",
  })
  @IsString()
  percorsoFile!: string;

  @ApiPropertyOptional({
    description: "Stato approvazione documento",
    enum: DocumentoStatoApprovazione,
  })
  @IsOptional()
  @IsEnum(DocumentoStatoApprovazione)
  statoApprovazione?: DocumentoStatoApprovazione;
}

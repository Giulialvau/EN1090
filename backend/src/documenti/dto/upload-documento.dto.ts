import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, MaxLength, Min } from "class-validator";

/**
 * Metadati multipart per POST /documenti/upload.
 * `commessaId` è Int (Prisma); dal FormData arriva come stringa ma viene trasformato.
 */
export class UploadDocumentoDto {
  @ApiProperty({ description: "Titolo documento (usato come nome)" })
  @IsString()
  @MaxLength(255)
  title!: string;

  @ApiProperty({ description: "ID commessa (Int)" })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  commessaId!: number;

  @ApiPropertyOptional({ description: "Tipo documento (default: modulo)" })
  @IsOptional()
  @IsString()
  @MaxLength(128)
  tipo?: string;

  @ApiPropertyOptional({ description: "Versione documento (default: 1.0)" })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  versione?: string;
}

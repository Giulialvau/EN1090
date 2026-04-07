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

export class CreateWpqrDto {
  @ApiProperty({ description: "Codice WPQR" })
  @IsString()
  @MaxLength(64)
  codice!: string;

  @ApiProperty({ description: "Nome saldatore" })
  @IsString()
  @MaxLength(255)
  saldatore!: string;

  @ApiProperty({ description: "ID WPS collegata (Int)" })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  wpsId!: number;

  @ApiProperty({ description: "Data qualifica" })
  @Type(() => Date)
  @IsDate()
  dataQualifica!: Date;

  @ApiPropertyOptional({ description: "Data scadenza qualifica (opzionale)" })
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
}

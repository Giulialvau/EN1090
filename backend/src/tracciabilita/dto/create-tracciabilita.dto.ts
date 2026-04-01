import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from "class-validator";

export class CreateTracciabilitaDto {
  @ApiProperty({ description: "ID materiale (Int)" })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  materialeId!: number;

  @ApiProperty({ description: "ID commessa (Int)" })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  commessaId!: number;

  @ApiProperty({ description: "Posizione/locazione del componente" })
  @IsString()
  @MaxLength(500)
  posizione!: string;

  @ApiProperty({ description: "Quantità (decimale fino a 4 cifre)" })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  quantita!: number;

  @ApiPropertyOptional({ description: "Descrizione componente (opzionale)" })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  descrizioneComponente?: string;

  @ApiPropertyOptional({ description: "Riferimento disegno (opzionale)" })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  riferimentoDisegno?: string;

  @ApiPropertyOptional({ description: "Note (opzionale)" })
  @IsOptional()
  @IsString()
  @MaxLength(8000)
  note?: string;
}

import { IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ControlloRichiestoDto {
  @ApiProperty({ description: "Codice controllo (es. VT, MT, UT)" })
  @IsString()
  codice!: string;

  @ApiProperty({ description: "Descrizione controllo richiesto" })
  @IsString()
  descrizione!: string;

  @ApiPropertyOptional({ description: "Riferimento normativo (opzionale)" })
  @IsOptional()
  @IsString()
  riferimentoNormativo?: string;
}

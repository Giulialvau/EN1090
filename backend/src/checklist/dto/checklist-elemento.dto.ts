import { IsBoolean, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

/** Punto controllo / domanda con risposta strutturata */
export class ChecklistElementoDto {
  @ApiProperty({ description: "ID punto controllo (stringa) usato lato UI" })
  @IsString()
  id!: string;

  @ApiProperty({ description: "Descrizione del punto controllo" })
  @IsString()
  descrizione!: string;

  @ApiPropertyOptional({ description: "Flag completato" })
  @IsOptional()
  @IsBoolean()
  completato?: boolean;

  @ApiPropertyOptional({ description: "Risposta (testo libero)" })
  @IsOptional()
  @IsString()
  risposta?: string;

  @ApiPropertyOptional({ description: "Note (testo libero)" })
  @IsOptional()
  @IsString()
  note?: string;
}

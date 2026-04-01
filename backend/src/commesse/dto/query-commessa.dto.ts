import { CommessaStato } from "@prisma/client";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";

/** Filtri opzionali per GET /commesse (date in formato ISO YYYY-MM-DD) */
export class QueryCommessaDto {
  @ApiPropertyOptional({
    description: "Filtro per stato commessa",
    enum: CommessaStato,
  })
  @IsOptional()
  @IsEnum(CommessaStato)
  stato?: CommessaStato;

  @ApiPropertyOptional({
    description: "Filtro per cliente (contiene, case-insensitive)",
  })
  @IsOptional()
  @IsString()
  cliente?: string;

  @ApiPropertyOptional({ description: "Data inizio da (ISO date YYYY-MM-DD)" })
  @IsOptional()
  @IsString()
  dataInizioDa?: string;

  @ApiPropertyOptional({ description: "Data inizio a (ISO date YYYY-MM-DD)" })
  @IsOptional()
  @IsString()
  dataInizioA?: string;
}

import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDate, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateAttrezzaturaDto {
  @ApiProperty({ description: "Nome attrezzatura / strumento" })
  @IsString()
  @MaxLength(255)
  nome!: string;

  @ApiProperty({ description: "Matricola univoca" })
  @IsString()
  @MaxLength(128)
  matricola!: string;

  @ApiProperty({
    description: "Tipologia (es. calibro, saldatrice, trapano...)",
  })
  @IsString()
  @MaxLength(128)
  tipo!: string;

  @ApiPropertyOptional({ description: "Data manutenzione" })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dataManutenzione?: Date;

  @ApiPropertyOptional({ description: "Data taratura" })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dataTaratura?: Date;

  @ApiPropertyOptional({ description: "Data scadenza (manutenzione/taratura)" })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  scadenza?: Date;
}

import { AuditEsito } from "@prisma/client";
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

export class CreateAuditDto {
  @ApiProperty({ description: "ID commessa (Int)" })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  commessaId!: number;

  @ApiProperty({ description: "Titolo audit" })
  @IsString()
  titolo!: string;

  @ApiProperty({ description: "Data audit" })
  @Type(() => Date)
  @IsDate()
  data!: Date;

  @ApiProperty({ description: "Auditor / responsabile audit" })
  @IsString()
  auditor!: string;

  @ApiProperty({ description: "Esito audit", enum: AuditEsito })
  @IsEnum(AuditEsito)
  esito!: AuditEsito;

  @ApiPropertyOptional({ description: "Note audit" })
  @IsOptional()
  @IsString()
  note?: string;
}

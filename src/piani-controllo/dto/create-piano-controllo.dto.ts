import { PianoControlloEsito } from "@prisma/client";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import {
  IsArray,
  IsEnum,
  IsInt,
  IsString,
  ValidateNested,
  Min,
} from "class-validator";

import { ControlloRichiestoDto } from "./controllo-richiesto.dto";

export class CreatePianoControlloDto {
  @ApiProperty({ description: "ID commessa (Int)" })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  commessaId!: number;

  @ApiProperty({ description: "Fase del piano di controllo" })
  @IsString()
  fase!: string;

  @ApiProperty({
    description: "Lista controlli richiesti (array)",
    type: [ControlloRichiestoDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ControlloRichiestoDto)
  controlliRichiesti!: ControlloRichiestoDto[];

  @ApiProperty({
    description: "Esito piano di controllo",
    enum: PianoControlloEsito,
  })
  @IsEnum(PianoControlloEsito)
  esito!: PianoControlloEsito;
}

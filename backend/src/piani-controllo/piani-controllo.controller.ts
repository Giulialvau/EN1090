import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

import { CreatePianoControlloDto } from "./dto/create-piano-controllo.dto";
import { UpdatePianoControlloDto } from "./dto/update-piano-controllo.dto";
import { PianiControlloService } from "./piani-controllo.service";

@Controller("piani-controllo")
@ApiTags("piani-controllo")
@ApiBearerAuth("bearer")
@ApiUnauthorizedResponse({ description: "Unauthorized" })
@ApiBadRequestResponse({ description: "Bad Request" })
@UseGuards(JwtAuthGuard)
export class PianiControlloController {
  constructor(private readonly pianiControlloService: PianiControlloService) {}

  @Post()
  @ApiOkResponse({ description: "Piano di controllo creato" })
  create(@Body() dto: CreatePianoControlloDto) {
    return this.pianiControlloService.create(dto);
  }

  @Get()
  @ApiOkResponse({ description: "Elenco piani di controllo" })
  findAll() {
    return this.pianiControlloService.findAll();
  }

  @Get(":id")
  @ApiOkResponse({ description: "Dettaglio piano di controllo" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.pianiControlloService.findOne(id);
  }

  @Patch(":id")
  @ApiOkResponse({ description: "Piano di controllo aggiornato" })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdatePianoControlloDto,
  ) {
    return this.pianiControlloService.update(id, dto);
  }

  @Delete(":id")
  @ApiOkResponse({ description: "Piano di controllo eliminato" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.pianiControlloService.remove(id);
  }
}

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

import { CreateNonConformitaDto } from "./dto/create-non-conformita.dto";
import { UpdateNonConformitaDto } from "./dto/update-non-conformita.dto";
import { NonConformitaService } from "./non-conformita.service";

@Controller("non-conformita")
@ApiTags("non-conformita")
@ApiBearerAuth("bearer")
@ApiUnauthorizedResponse({ description: "Unauthorized" })
@ApiBadRequestResponse({ description: "Bad Request" })
@UseGuards(JwtAuthGuard)
export class NonConformitaController {
  constructor(private readonly nonConformitaService: NonConformitaService) {}

  @Post()
  @ApiOkResponse({ description: "Non conformità creata" })
  create(@Body() dto: CreateNonConformitaDto) {
    return this.nonConformitaService.create(dto);
  }

  @Get()
  @ApiOkResponse({ description: "Elenco non conformità" })
  findAll() {
    return this.nonConformitaService.findAll();
  }

  @Get(":id")
  @ApiOkResponse({ description: "Dettaglio non conformità" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.nonConformitaService.findOne(id);
  }

  @Patch(":id")
  @ApiOkResponse({ description: "Non conformità aggiornata" })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateNonConformitaDto,
  ) {
    return this.nonConformitaService.update(id, dto);
  }

  @Delete(":id")
  @ApiOkResponse({ description: "Non conformità eliminata" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.nonConformitaService.remove(id);
  }
}

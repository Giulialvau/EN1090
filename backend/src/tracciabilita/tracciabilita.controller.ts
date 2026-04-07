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

import { CreateTracciabilitaDto } from "./dto/create-tracciabilita.dto";
import { UpdateTracciabilitaDto } from "./dto/update-tracciabilita.dto";
import { TracciabilitaService } from "./tracciabilita.service";

@Controller("tracciabilita")
@ApiTags("tracciabilita")
@ApiBearerAuth("bearer")
@ApiUnauthorizedResponse({ description: "Unauthorized" })
@ApiBadRequestResponse({ description: "Bad Request" })
@UseGuards(JwtAuthGuard)
export class TracciabilitaController {
  constructor(private readonly tracciabilitaService: TracciabilitaService) {}

  @Post()
  @ApiOkResponse({ description: "Record tracciabilità creato" })
  create(@Body() dto: CreateTracciabilitaDto) {
    return this.tracciabilitaService.create(dto);
  }

  @Get()
  @ApiOkResponse({ description: "Elenco tracciabilità" })
  findAll() {
    return this.tracciabilitaService.findAll();
  }

  @Get(":id")
  @ApiOkResponse({ description: "Dettaglio tracciabilità" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.tracciabilitaService.findOne(id);
  }

  @Patch(":id")
  @ApiOkResponse({ description: "Record tracciabilità aggiornato" })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateTracciabilitaDto,
  ) {
    return this.tracciabilitaService.update(id, dto);
  }

  @Delete(":id")
  @ApiOkResponse({ description: "Record tracciabilità eliminato" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.tracciabilitaService.remove(id);
  }
}

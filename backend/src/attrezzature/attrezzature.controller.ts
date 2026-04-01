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

import { AttrezzatureService } from "./attrezzature.service";
import { CreateAttrezzaturaDto } from "./dto/create-attrezzatura.dto";
import { UpdateAttrezzaturaDto } from "./dto/update-attrezzatura.dto";

@Controller("attrezzature")
@ApiTags("attrezzature")
@ApiBearerAuth("bearer")
@ApiUnauthorizedResponse({ description: "Unauthorized" })
@ApiBadRequestResponse({ description: "Bad Request" })
@UseGuards(JwtAuthGuard)
export class AttrezzatureController {
  constructor(private readonly attrezzatureService: AttrezzatureService) {}

  @Post()
  @ApiOkResponse({ description: "Attrezzatura creata" })
  create(@Body() dto: CreateAttrezzaturaDto) {
    return this.attrezzatureService.create(dto);
  }

  @Get()
  @ApiOkResponse({ description: "Elenco attrezzature" })
  findAll() {
    return this.attrezzatureService.findAll();
  }

  @Get(":id")
  @ApiOkResponse({ description: "Dettaglio attrezzatura" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.attrezzatureService.findOne(id);
  }

  @Patch(":id")
  @ApiOkResponse({ description: "Attrezzatura aggiornata" })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateAttrezzaturaDto,
  ) {
    return this.attrezzatureService.update(id, dto);
  }

  @Delete(":id")
  @ApiOkResponse({ description: "Attrezzatura eliminata" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.attrezzatureService.remove(id);
  }
}

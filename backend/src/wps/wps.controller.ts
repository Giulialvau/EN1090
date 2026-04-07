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

import { CreateWpsDto } from "./dto/create-wps.dto";
import { UpdateWpsDto } from "./dto/update-wps.dto";
import { WpsService } from "./wps.service";

@Controller("wps")
@ApiTags("wps")
@ApiBearerAuth("bearer")
@ApiUnauthorizedResponse({ description: "Unauthorized" })
@ApiBadRequestResponse({ description: "Bad Request" })
@UseGuards(JwtAuthGuard)
export class WpsController {
  constructor(private readonly wpsService: WpsService) {}

  @Post()
  @ApiOkResponse({ description: "WPS creata" })
  create(@Body() dto: CreateWpsDto) {
    return this.wpsService.create(dto);
  }

  @Get()
  @ApiOkResponse({ description: "Elenco WPS" })
  findAll() {
    return this.wpsService.findAll();
  }

  @Get(":id")
  @ApiOkResponse({ description: "Dettaglio WPS" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.wpsService.findOne(id);
  }

  @Patch(":id")
  @ApiOkResponse({ description: "WPS aggiornata" })
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateWpsDto) {
    return this.wpsService.update(id, dto);
  }

  @Delete(":id")
  @ApiOkResponse({ description: "WPS eliminata" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.wpsService.remove(id);
  }
}

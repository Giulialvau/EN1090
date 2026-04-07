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

import { CreateMaterialeDto } from "./dto/create-materiale.dto";
import { UpdateMaterialeDto } from "./dto/update-materiale.dto";
import { MaterialiService } from "./materiali.service";

@Controller("materiali")
@ApiTags("materiali")
@ApiBearerAuth("bearer")
@ApiUnauthorizedResponse({ description: "Unauthorized" })
@ApiBadRequestResponse({ description: "Bad Request" })
@UseGuards(JwtAuthGuard)
export class MaterialiController {
  constructor(private readonly materialiService: MaterialiService) {}

  @Post()
  @ApiOkResponse({ description: "Materiale creato" })
  create(@Body() dto: CreateMaterialeDto) {
    return this.materialiService.create(dto);
  }

  @Get()
  @ApiOkResponse({ description: "Elenco materiali" })
  findAll() {
    return this.materialiService.findAll();
  }

  @Get(":id")
  @ApiOkResponse({ description: "Dettaglio materiale" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.materialiService.findOne(id);
  }

  @Patch(":id")
  @ApiOkResponse({ description: "Materiale aggiornato" })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateMaterialeDto,
  ) {
    return this.materialiService.update(id, dto);
  }

  @Delete(":id")
  @ApiOkResponse({ description: "Materiale eliminato" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.materialiService.remove(id);
  }
}

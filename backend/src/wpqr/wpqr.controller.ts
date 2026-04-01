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

import { CreateWpqrDto } from "./dto/create-wpqr.dto";
import { UpdateWpqrDto } from "./dto/update-wpqr.dto";
import { WpqrService } from "./wpqr.service";

@Controller("wpqr")
@ApiTags("wpqr")
@ApiBearerAuth("bearer")
@ApiUnauthorizedResponse({ description: "Unauthorized" })
@ApiBadRequestResponse({ description: "Bad Request" })
@UseGuards(JwtAuthGuard)
export class WpqrController {
  constructor(private readonly wpqrService: WpqrService) {}

  @Post()
  @ApiOkResponse({ description: "WPQR creato" })
  create(@Body() dto: CreateWpqrDto) {
    return this.wpqrService.create(dto);
  }

  @Get()
  @ApiOkResponse({ description: "Elenco WPQR" })
  findAll() {
    return this.wpqrService.findAll();
  }

  @Get(":id")
  @ApiOkResponse({ description: "Dettaglio WPQR" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.wpqrService.findOne(id);
  }

  @Patch(":id")
  @ApiOkResponse({ description: "WPQR aggiornato" })
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateWpqrDto) {
    return this.wpqrService.update(id, dto);
  }

  @Delete(":id")
  @ApiOkResponse({ description: "WPQR eliminato" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.wpqrService.remove(id);
  }
}

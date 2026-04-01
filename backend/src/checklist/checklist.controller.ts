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

import { ChecklistService } from "./checklist.service";
import { CreateChecklistDto } from "./dto/create-checklist.dto";
import { UpdateChecklistDto } from "./dto/update-checklist.dto";

@Controller("checklist")
@ApiTags("checklist")
@ApiBearerAuth("bearer")
@ApiUnauthorizedResponse({ description: "Unauthorized" })
@ApiBadRequestResponse({ description: "Bad Request" })
@UseGuards(JwtAuthGuard)
export class ChecklistController {
  constructor(private readonly checklistService: ChecklistService) {}

  @Post()
  @ApiOkResponse({ description: "Checklist creata" })
  create(@Body() dto: CreateChecklistDto) {
    return this.checklistService.create(dto);
  }

  @Get()
  @ApiOkResponse({ description: "Elenco checklist" })
  findAll() {
    return this.checklistService.findAll();
  }

  @Get(":id")
  @ApiOkResponse({ description: "Dettaglio checklist" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.checklistService.findOne(id);
  }

  @Patch(":id")
  @ApiOkResponse({ description: "Checklist aggiornata" })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateChecklistDto,
  ) {
    return this.checklistService.update(id, dto);
  }

  @Delete(":id")
  @ApiOkResponse({ description: "Checklist eliminata" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.checklistService.remove(id);
  }
}

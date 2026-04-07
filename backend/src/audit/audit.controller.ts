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

import { AuditService } from "./audit.service";
import { CreateAuditDto } from "./dto/create-audit.dto";
import { UpdateAuditDto } from "./dto/update-audit.dto";

@Controller("audit")
@ApiTags("audit")
@ApiBearerAuth("bearer")
@ApiUnauthorizedResponse({ description: "Unauthorized" })
@ApiBadRequestResponse({ description: "Bad Request" })
@UseGuards(JwtAuthGuard)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Post()
  @ApiOkResponse({ description: "Audit creato" })
  create(@Body() dto: CreateAuditDto) {
    return this.auditService.create(dto);
  }

  @Get()
  @ApiOkResponse({ description: "Elenco audit" })
  findAll() {
    return this.auditService.findAll();
  }

  @Get(":id")
  @ApiOkResponse({ description: "Dettaglio audit" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.auditService.findOne(id);
  }

  @Patch(":id")
  @ApiOkResponse({ description: "Audit aggiornato" })
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateAuditDto) {
    return this.auditService.update(id, dto);
  }

  @Delete(":id")
  @ApiOkResponse({ description: "Audit eliminato" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.auditService.remove(id);
  }
}

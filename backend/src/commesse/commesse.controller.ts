import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
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
import { ChecklistService } from "../checklist/checklist.service";
import { MaterialiService } from "../materiali/materiali.service";
import { TracciabilitaService } from "../tracciabilita/tracciabilita.service";
import { WpsService } from "../wps/wps.service";
import { WpqrService } from "../wpqr/wpqr.service";
import { NonConformitaService } from "../non-conformita/non-conformita.service";
import { AuditService } from "../audit/audit.service";
import { PianiControlloService } from "../piani-controllo/piani-controllo.service";
import { DocumentiService } from "../documenti/documenti.service";

import { CommesseService } from "./commesse.service";
import { CreateCommessaDto } from "./dto/create-commessa.dto";
import { QueryCommessaDto } from "./dto/query-commessa.dto";
import { UpdateCommessaDto } from "./dto/update-commessa.dto";

@Controller("commesse")
@ApiTags("Commesse")
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: "Unauthorized" })
@ApiBadRequestResponse({ description: "Bad Request" })
@UseGuards(JwtAuthGuard)
export class CommesseController {
  constructor(
    private readonly commesseService: CommesseService,
    private readonly materialiService: MaterialiService,
    private readonly checklistService: ChecklistService,
    private readonly tracciabilitaService: TracciabilitaService,
    private readonly wpsService: WpsService,
    private readonly wpqrService: WpqrService,
    private readonly nonConformitaService: NonConformitaService,
    private readonly auditService: AuditService,
    private readonly pianiControlloService: PianiControlloService,
    private readonly documentiService: DocumentiService,
  ) {}

  @Post()
  @ApiOkResponse({ description: "Commessa creata" })
  create(@Body() dto: CreateCommessaDto) {
    return this.commesseService.create(dto);
  }

  @Get()
  @ApiOkResponse({ description: "Elenco commesse" })
  findAll(@Query() query: QueryCommessaDto) {
    return this.commesseService.findAll(query);
  }

  @Get(":id/materiali")
  listMateriali(@Param("id", ParseIntPipe) id: number) {
    return this.materialiService.findByCommessa(id);
  }

  @Get(":id/checklist")
  listChecklist(@Param("id", ParseIntPipe) id: number) {
    return this.checklistService.findByCommessa(id);
  }

  @Get(":id/tracciabilita")
  listTracciabilita(@Param("id", ParseIntPipe) id: number) {
    return this.tracciabilitaService.findByCommessa(id);
  }

  @Get(":id/wps")
  listWps(@Param("id", ParseIntPipe) id: number) {
    return this.wpsService.findByCommessa(id);
  }

  @Get(":id/wpqr")
  listWpqr(@Param("id", ParseIntPipe) id: number) {
    return this.wpqrService.findByCommessa(id);
  }

  @Get(":id/documenti")
  listDocumenti(@Param("id", ParseIntPipe) id: number) {
    return this.documentiService.findByCommessa(id);
  }

  @Get(":id/non-conformita")
  listNonConformita(@Param("id", ParseIntPipe) id: number) {
    return this.nonConformitaService.findByCommessa(id);
  }

  @Get(":id/audit")
  listAudit(@Param("id", ParseIntPipe) id: number) {
    return this.auditService.findByCommessa(id);
  }

  @Get(":id/piani-controllo")
  listPianiControllo(@Param("id", ParseIntPipe) id: number) {
    return this.pianiControlloService.findByCommessa(id);
  }

  @Get(":id")
  @ApiOkResponse({ description: "Dettaglio commessa" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.commesseService.findOne(id);
  }

  @Patch(":id")
  @ApiOkResponse({ description: "Commessa aggiornata" })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateCommessaDto,
  ) {
    return this.commesseService.update(id, dto);
  }

  @Delete(":id")
  @ApiOkResponse({ description: "Commessa eliminata" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.commesseService.remove(id);
  }
}

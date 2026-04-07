import { randomUUID } from "crypto";
import { extname, join } from "path";
import { mkdirSync } from "fs";

import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import type { Express } from "express";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

import { DocumentiService } from "./documenti.service";
import { CreateDocumentoDto } from "./dto/create-documento.dto";
import { UpdateDocumentoDto } from "./dto/update-documento.dto";
import { UploadDocumentoDto } from "./dto/upload-documento.dto";

const UPLOAD_DEST = join(process.cwd(), "uploads", "documenti");

const documentiUpload = {
  storage: diskStorage({
    destination: (_req, _file, cb) => {
      mkdirSync(UPLOAD_DEST, { recursive: true });
      cb(null, UPLOAD_DEST);
    },
    filename: (_req, file, cb) => {
      cb(null, `${randomUUID()}${extname(file.originalname) || ".pdf"}`);
    },
  }),
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (
    _req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    const name = (file.originalname ?? "").toLowerCase();
    const ext = extname(name);
    const mt = (file.mimetype ?? "").toLowerCase();
    const pdf = ext === ".pdf" || mt === "application/pdf";
    const imgExt = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    const img =
      imgExt.includes(ext) &&
      (mt.startsWith("image/") ||
        mt === "application/octet-stream" ||
        mt === "");
    if (pdf || img) {
      cb(null, true);
      return;
    }
    cb(
      new BadRequestException(
        "Accettati solo PDF o immagini (JPEG, PNG, GIF, WebP)",
      ) as Error,
      false,
    );
  },
};

@Controller("documenti")
@ApiTags("documenti")
@ApiBearerAuth("bearer")
@ApiUnauthorizedResponse({ description: "Unauthorized" })
@ApiBadRequestResponse({ description: "Bad Request" })
@UseGuards(JwtAuthGuard)
export class DocumentiController {
  constructor(private readonly documentiService: DocumentiService) {}

  @Post("upload")
  @ApiOkResponse({ description: "Documento caricato" })
  @UseInterceptors(FileInterceptor("file", documentiUpload))
  upload(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() body: UploadDocumentoDto,
  ) {
    if (!file) {
      throw new BadRequestException("File obbligatorio");
    }
    return this.documentiService.uploadFromFile(file, body);
  }

  @Post()
  @ApiOkResponse({ description: "Documento creato" })
  create(@Body() dto: CreateDocumentoDto) {
    return this.documentiService.create(dto);
  }

  @Get()
  @ApiOkResponse({ description: "Elenco documenti" })
  findAll() {
    return this.documentiService.findAll();
  }

  @Get(":id/download")
  @ApiOkResponse({ description: "Download documento" })
  async download(@Param("id", ParseIntPipe) id: number) {
    const { stream, filename, mimeType } =
      await this.documentiService.getReadStreamForDocumento(id);
    return new StreamableFile(stream, {
      type: mimeType,
      disposition: `inline; filename="${encodeURIComponent(filename)}"`,
    });
  }

  @Get(":id")
  @ApiOkResponse({ description: "Dettaglio documento" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.documentiService.findOne(id);
  }

  @Patch(":id")
  @ApiOkResponse({ description: "Documento aggiornato" })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateDocumentoDto,
  ) {
    return this.documentiService.update(id, dto);
  }

  @Delete(":id")
  @ApiOkResponse({ description: "Documento eliminato" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.documentiService.remove(id);
  }
}

import { Module } from "@nestjs/common";

import { RolesGuard } from "../auth/guards/roles.guard";
import { PrismaModule } from "../prisma/prisma.module";

import { En1090BusinessService } from "./en1090-business.service";
import { En1090Controller } from "./en1090.controller";
import { En1090CertificatiService } from "./en1090-certificati.service";
import { En1090DopCeAiService } from "./en1090-dopce-ai.service";
import { En1090NotificheService } from "./en1090-notifiche.service";
import { En1090PdfService } from "./en1090-pdf.service";
import { En1090QrcodeService } from "./en1090-qrcode.service";
import { En1090Service } from "./en1090.service";
import { En1090VerificaSaldatureService } from "./en1090-verifica-saldature.service";

@Module({
  imports: [PrismaModule],
  controllers: [En1090Controller],
  providers: [
    En1090Service,
    En1090CertificatiService,
    En1090DopCeAiService,
    En1090QrcodeService,
    En1090NotificheService,
    En1090PdfService,
    En1090BusinessService,
    En1090VerificaSaldatureService,
    RolesGuard,
  ],
})
export class En1090Module {}

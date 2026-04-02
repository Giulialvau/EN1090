import { Injectable, NotFoundException } from "@nestjs/common";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";

import QRCode from "qrcode";

import { PrismaService } from "../prisma/prisma.service";

type Entity = "materiale" | "saldatura" | "commessa";

@Injectable()
export class En1090QrcodeService {
  constructor(private readonly prisma: PrismaService) {}

  async generaQr(aziendaId: string, entity: Entity, id: string) {
    const dir = join(process.cwd(), "EN1090", "QR", aziendaId, entity);
    await mkdir(dir, { recursive: true });
    const filename = `${id}.png`;
    const abs = join(dir, filename);
    const payload = JSON.stringify({ entity, id, aziendaId });
    const png = await QRCode.toBuffer(payload, { type: "png", width: 320 });
    await writeFile(abs, png);
    const rel = `QR/${aziendaId}/${entity}/${filename}`;

    if (entity === "materiale") {
      const updated = await this.prisma.en1090Materiale.updateMany({
        where: { id, aziendaId },
        data: { qrCodePath: rel },
      });
      if (updated.count === 0) throw new NotFoundException("Materiale non trovato");
    } else if (entity === "saldatura") {
      const updated = await this.prisma.en1090Saldatura.updateMany({
        where: { id, aziendaId },
        data: { qrCodePath: rel },
      });
      if (updated.count === 0) throw new NotFoundException("Saldatura non trovata");
    } else {
      const num = Number(id);
      const updated = await this.prisma.en1090Commessa.updateMany({
        where: { id: num, aziendaId },
        data: { qrCodePath: rel },
      });
      if (updated.count === 0) throw new NotFoundException("Commessa non trovata");
    }

    return { path: rel, url: `/api/en1090/qrcode/${entity}/${id}` };
  }
}

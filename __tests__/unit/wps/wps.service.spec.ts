import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { Test } from "@nestjs/testing";

import { WpsService } from "../../../src/wps/wps.service";
import { PrismaService } from "../../../src/prisma/prisma.service";
import { createPrismaMock } from "../../mocks/prisma.mock";

describe("WpsService (unit)", () => {
  let service: WpsService;
  const prisma = createPrismaMock() as unknown as PrismaService;

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [WpsService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = moduleRef.get(WpsService);
  });

  it("create: throws ConflictException on duplicate codice", async () => {
    (prisma.wps.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
    await expect(
      service.create({ codice: "W1" } as any),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it("create: throws NotFoundException if commessaId provided but missing", async () => {
    (prisma.wps.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.commessa.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(
      service.create({ codice: "W2", commessaId: 1 } as any),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("remove: maps P2003/P2014 to BadRequestException", async () => {
    (prisma.wps.findUnique as jest.Mock).mockResolvedValueOnce({ id: 1 });
    (prisma.wps.delete as jest.Mock).mockRejectedValue({ code: "P2003" });
    await expect(service.remove(1)).rejects.toBeInstanceOf(BadRequestException);
  });
});

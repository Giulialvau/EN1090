import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";

import { WpqrService } from "../../../src/wpqr/wpqr.service";
import { PrismaService } from "../../../src/prisma/prisma.service";
import { createPrismaMock } from "../../mocks/prisma.mock";

describe("WpqrService (unit)", () => {
  let service: WpqrService;
  const prisma = createPrismaMock() as unknown as PrismaService;

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [WpqrService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = moduleRef.get(WpqrService);
  });

  it("create: throws NotFoundException when WPS missing", async () => {
    (prisma.wps.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(
      service.create({ wpsId: 1, codice: "Q1" } as any),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("create: throws BadRequestException when WPS commessa mismatch", async () => {
    (prisma.wps.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      commessaId: 2,
    });
    (prisma.commessa.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
    await expect(
      service.create({ wpsId: 1, commessaId: 1, codice: "Q1" } as any),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("remove: calls prisma.wpqr.delete", async () => {
    (prisma.wpqr.findUnique as jest.Mock).mockResolvedValueOnce({ id: 1 });
    (prisma.wpqr.delete as jest.Mock).mockResolvedValue({ id: 1 });
    const res = await service.remove(1);
    expect(prisma.wpqr.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(res).toEqual({ deleted: true, id: 1 });
  });
});

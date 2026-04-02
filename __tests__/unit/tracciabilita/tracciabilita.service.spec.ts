import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { Prisma } from "@prisma/client";

import { TracciabilitaService } from "../../../src/tracciabilita/tracciabilita.service";
import { PrismaService } from "../../../src/prisma/prisma.service";
import { createPrismaMock } from "../../mocks/prisma.mock";

describe("TracciabilitaService (unit)", () => {
  let service: TracciabilitaService;
  const prisma = createPrismaMock() as unknown as PrismaService;

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        TracciabilitaService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = moduleRef.get(TracciabilitaService);
  });

  it("create: throws NotFoundException if materiale missing", async () => {
    (prisma.materiale.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(
      service.create({
        materialeId: 1,
        commessaId: 1,
        posizione: "P1",
        quantita: 1,
      } as any),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("create: throws BadRequestException if materiale not in commessa", async () => {
    (prisma.materiale.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      commessaId: 2,
    });
    (prisma.commessa.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
    await expect(
      service.create({
        materialeId: 1,
        commessaId: 1,
        posizione: "P1",
        quantita: 1,
      } as any),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("create: calls prisma.tracciabilita.create and wraps quantita in Decimal", async () => {
    (prisma.materiale.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      commessaId: 1,
    });
    (prisma.commessa.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
    (prisma.tracciabilita.create as jest.Mock).mockResolvedValue({ id: 1 });
    await service.create({
      materialeId: 1,
      commessaId: 1,
      posizione: "P1",
      quantita: 2.5,
    } as any);
    const call = (prisma.tracciabilita.create as jest.Mock).mock.calls[0][0];
    expect(call.data.quantita).toBeInstanceOf(Prisma.Decimal);
  });

  it("findOne: throws if missing", async () => {
    (prisma.tracciabilita.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(service.findOne(1)).rejects.toBeInstanceOf(NotFoundException);
  });
});

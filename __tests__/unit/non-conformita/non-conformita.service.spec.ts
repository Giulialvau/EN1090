import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";

import { NonConformitaService } from "../../../src/non-conformita/non-conformita.service";
import { PrismaService } from "../../../src/prisma/prisma.service";
import { createPrismaMock } from "../../mocks/prisma.mock";

describe("NonConformitaService (unit)", () => {
  let service: NonConformitaService;
  const prisma = createPrismaMock() as unknown as PrismaService;

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        NonConformitaService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = moduleRef.get(NonConformitaService);
  });

  it("create: throws if commessa missing", async () => {
    (prisma.commessa.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(
      service.create({ commessaId: 1, titolo: "NC" } as any),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("create: calls prisma.nonConformita.create with commessa connect", async () => {
    (prisma.commessa.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
    (prisma.nonConformita.create as jest.Mock).mockResolvedValue({ id: 1 });
    await service.create({ commessaId: 1, titolo: "NC" } as any);
    expect(prisma.nonConformita.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          commessa: { connect: { id: 1 } },
        }),
      }),
    );
  });

  it("findOne: throws if missing", async () => {
    (prisma.nonConformita.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(service.findOne(1)).rejects.toBeInstanceOf(NotFoundException);
  });

  it("remove: calls prisma.nonConformita.delete", async () => {
    (prisma.nonConformita.findUnique as jest.Mock).mockResolvedValueOnce({
      id: 1,
    });
    (prisma.nonConformita.delete as jest.Mock).mockResolvedValue({ id: 1 });
    const res = await service.remove(1);
    expect(prisma.nonConformita.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(res).toEqual({ deleted: true, id: 1 });
  });
});

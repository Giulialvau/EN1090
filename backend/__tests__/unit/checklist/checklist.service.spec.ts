import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";

import { ChecklistService } from "../../../src/checklist/checklist.service";
import { PrismaService } from "../../../src/prisma/prisma.service";
import { createPrismaMock } from "../../mocks/prisma.mock";

describe("ChecklistService (unit)", () => {
  let service: ChecklistService;
  const prisma = createPrismaMock() as unknown as PrismaService;

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        ChecklistService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = moduleRef.get(ChecklistService);
  });

  it("create: throws if commessa missing", async () => {
    (prisma.commessa.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(
      service.create({ commessaId: 1, titolo: "T" } as any),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("create: calls prisma.checklist.create with connect commessa", async () => {
    (prisma.commessa.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
    (prisma.checklist.create as jest.Mock).mockResolvedValue({ id: 1 });
    await service.create({
      commessaId: 1,
      titolo: "T",
      elementi: [],
    } as any);
    expect(prisma.checklist.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          commessa: { connect: { id: 1 } },
        }),
      }),
    );
  });

  it("findOne: throws if missing", async () => {
    (prisma.checklist.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(service.findOne(1)).rejects.toBeInstanceOf(NotFoundException);
  });

  it("remove: calls prisma.checklist.delete", async () => {
    (prisma.checklist.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
    (prisma.checklist.delete as jest.Mock).mockResolvedValue({ id: 1 });
    const res = await service.remove(1);
    expect(prisma.checklist.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(res).toEqual({ deleted: true, id: 1 });
  });
});

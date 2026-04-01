import { ConflictException, NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";

import { AttrezzatureService } from "../../../src/attrezzature/attrezzature.service";
import { PrismaService } from "../../../src/prisma/prisma.service";
import { createPrismaMock } from "../../mocks/prisma.mock";

describe("AttrezzatureService (unit)", () => {
  let service: AttrezzatureService;
  const prisma = createPrismaMock() as unknown as PrismaService;

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        AttrezzatureService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = moduleRef.get(AttrezzatureService);
  });

  it("create: throws ConflictException on duplicate matricola", async () => {
    (prisma.attrezzatura.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
    await expect(
      service.create({ matricola: "M1", nome: "Saldatrice" } as any),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it("findOne: throws NotFoundException if missing", async () => {
    (prisma.attrezzatura.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(service.findOne(1)).rejects.toBeInstanceOf(NotFoundException);
  });

  it("update: throws ConflictException on matricola clash", async () => {
    (prisma.attrezzatura.findUnique as jest.Mock).mockResolvedValueOnce({
      id: 1,
    });
    (prisma.attrezzatura.findFirst as jest.Mock).mockResolvedValue({ id: 2 });
    await expect(
      service.update(1, { matricola: "X" } as any),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it("remove: calls prisma.attrezzatura.delete", async () => {
    (prisma.attrezzatura.findUnique as jest.Mock).mockResolvedValueOnce({
      id: 1,
    });
    (prisma.attrezzatura.delete as jest.Mock).mockResolvedValue({ id: 1 });
    const res = await service.remove(1);
    expect(prisma.attrezzatura.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(res).toEqual({ deleted: true, id: 1 });
  });
});

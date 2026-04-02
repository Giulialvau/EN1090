jest.mock("fs", () => {
  const actual = jest.requireActual("fs");
  return {
    ...actual,
    createReadStream: jest.fn(),
    existsSync: jest.fn().mockReturnValue(true),
    mkdirSync: jest.fn(),
    unlinkSync: jest.fn(),
  };
});

import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";

import { DocumentiService } from "../../../src/documenti/documenti.service";
import { PrismaService } from "../../../src/prisma/prisma.service";
import { createPrismaMock } from "../../mocks/prisma.mock";

describe("DocumentiService (unit)", () => {
  let service: DocumentiService;
  const prisma = createPrismaMock() as unknown as PrismaService;

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        DocumentiService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = moduleRef.get(DocumentiService);
  });

  it("create: throws NotFoundException if commessa missing", async () => {
    (prisma.commessa.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(
      service.create({
        commessaId: 1,
        nome: "Doc",
        tipo: "mod",
        versione: "1.0",
        statoApprovazione: "BOZZA",
      } as any),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("create: calls prisma.documento.create with mapped data", async () => {
    (prisma.commessa.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
    (prisma.documento.create as jest.Mock).mockResolvedValue({ id: 10 });
    await service.create({
      commessaId: 1,
      nome: "Doc",
      tipo: "modulo",
      versione: "1.0",
      percorsoFile: "uploads/documenti/x.pdf",
      statoApprovazione: "BOZZA",
    } as any);
    expect(prisma.documento.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        commessaId: 1,
        nome: "Doc",
      }),
    });
  });

  it("findOne: throws NotFoundException if missing", async () => {
    (prisma.documento.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(service.findOne(999)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("remove: throws NotFoundException if missing", async () => {
    (prisma.documento.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(service.remove(1)).rejects.toBeInstanceOf(NotFoundException);
  });

  it("remove: calls prisma.documento.delete", async () => {
    (prisma.documento.findUnique as jest.Mock).mockResolvedValue({
      percorsoFile: "uploads/documenti/x.pdf",
    });
    (prisma.documento.delete as jest.Mock).mockResolvedValue({ id: 1 });
    const res = await service.remove(1);
    expect(prisma.documento.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(res).toEqual({ deleted: true, id: 1 });
  });
});

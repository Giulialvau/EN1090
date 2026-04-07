import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { Test } from "@nestjs/testing";

import { MaterialiService } from "../../../src/materiali/materiali.service";
import { PrismaService } from "../../../src/prisma/prisma.service";
import { createPrismaMock } from "../../mocks/prisma.mock";

describe("MaterialiService (unit)", () => {
  let service: MaterialiService;
  const prisma = createPrismaMock() as unknown as PrismaService;

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        MaterialiService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = moduleRef.get(MaterialiService);
  });

  it("create: throws NotFoundException if commessa missing", async () => {
    (prisma.commessa.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(
      service.create({ commessaId: 1, codice: "M1" } as any),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("create: throws ConflictException on duplicate codice (composite)", async () => {
    (prisma.commessa.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
    (prisma.documento.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.materiale.findUnique as jest.Mock).mockResolvedValue({ id: 10 });

    await expect(
      service.create({ commessaId: 1, codice: "M1" } as any),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it("create: calls prisma.materiale.create with connect commessa", async () => {
    (prisma.commessa.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
    (prisma.documento.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.materiale.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.materiale.create as jest.Mock).mockResolvedValue({ id: 10 });

    await service.create({
      commessaId: 1,
      codice: "M2",
      descrizione: "Acciaio",
      tipo: "S355",
      norma: "EN 10025",
      certificato31: true,
    } as any);

    expect(prisma.materiale.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          codice: "M2",
          commessa: { connect: { id: 1 } },
        }),
      }),
    );
  });

  it("findOne: throws NotFoundException if missing", async () => {
    (prisma.materiale.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(service.findOne(999)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("update: throws BadRequestException if certificato documento in altra commessa", async () => {
    (prisma.materiale.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      commessaId: 1,
      codice: "M1",
      certificatoDocumentoId: null,
    });
    (prisma.documento.findUnique as jest.Mock).mockResolvedValue({
      id: 50,
      commessaId: 2,
    });

    await expect(
      service.update(1, { certificatoDocumentoId: 50 } as any),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("remove: calls prisma.materiale.delete", async () => {
    (prisma.materiale.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
    (prisma.materiale.delete as jest.Mock).mockResolvedValue({ id: 1 });
    const res = await service.remove(1);
    expect(prisma.materiale.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(res).toEqual({ deleted: true, id: 1 });
  });
});

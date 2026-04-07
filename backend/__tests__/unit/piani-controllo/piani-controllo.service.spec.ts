import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";

import { PianiControlloService } from "../../../src/piani-controllo/piani-controllo.service";
import { PrismaService } from "../../../src/prisma/prisma.service";
import { createPrismaMock } from "../../mocks/prisma.mock";

describe("PianiControlloService (unit)", () => {
  let service: PianiControlloService;
  const prisma = createPrismaMock() as unknown as PrismaService;

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        PianiControlloService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = moduleRef.get(PianiControlloService);
  });

  it("create: throws if commessa missing", async () => {
    (prisma.commessa.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(
      service.create({
        commessaId: 1,
        fase: "F1",
        controlliRichiesti: [],
      } as any),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("create: calls prisma.pianoControllo.create with commessa connect", async () => {
    (prisma.commessa.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
    (prisma.pianoControllo.create as jest.Mock).mockResolvedValue({ id: 1 });
    await service.create({
      commessaId: 1,
      fase: "F1",
      controlliRichiesti: [],
    } as any);
    expect(prisma.pianoControllo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ commessa: { connect: { id: 1 } } }),
      }),
    );
  });

  it("findOne: throws if missing", async () => {
    (prisma.pianoControllo.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(service.findOne(1)).rejects.toBeInstanceOf(NotFoundException);
  });

  it("remove: calls prisma.pianoControllo.delete", async () => {
    (prisma.pianoControllo.findUnique as jest.Mock).mockResolvedValueOnce({
      id: 1,
    });
    (prisma.pianoControllo.delete as jest.Mock).mockResolvedValue({ id: 1 });
    const res = await service.remove(1);
    expect(prisma.pianoControllo.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(res).toEqual({ deleted: true, id: 1 });
  });
});

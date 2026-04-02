import { ConflictException, NotFoundException, Logger } from "@nestjs/common";
import { Test } from "@nestjs/testing";

import { PrismaService } from "../../../src/prisma/prisma.service";
import { CommesseService } from "../../../src/commesse/commesse.service";
import { createPrismaMock } from "../../mocks/prisma.mock";

describe("CommesseService (unit)", () => {
  let service: CommesseService;
  const prisma = createPrismaMock() as unknown as PrismaService;

  beforeEach(async () => {
    jest.resetAllMocks();
    jest
      .spyOn(Logger.prototype as any, "error")
      .mockImplementation(() => undefined);
    const moduleRef = await Test.createTestingModule({
      providers: [
        CommesseService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = moduleRef.get(CommesseService);
  });

  it("create: throws ConflictException when codice exists", async () => {
    (prisma.commessa.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
    await expect(
      service.create({
        codice: "C-1",
        cliente: "ACME",
      } as any),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it("create: calls prisma.commessa.create with mapped data", async () => {
    (prisma.commessa.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.commessa.create as jest.Mock).mockResolvedValue({ id: 1 });

    await service.create({
      codice: "C-2",
      titolo: "Titolo",
      cliente: "ACME",
      descrizione: "Desc",
      stato: undefined,
    } as any);

    expect(prisma.commessa.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        codice: "C-2",
        cliente: "ACME",
      }),
    });
  });

  it("findAll: returns [] on prisma error", async () => {
    (prisma.commessa.findMany as jest.Mock).mockRejectedValue(
      new Error("boom"),
    );
    const rows = await service.findAll({} as any);
    expect(rows).toEqual([]);
  });

  it("findOne: throws NotFoundException when missing", async () => {
    (prisma.commessa.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(service.findOne(123)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("update: calls prisma.commessa.update", async () => {
    // ensureExists
    (prisma.commessa.findUnique as jest.Mock).mockResolvedValueOnce({ id: 1 });
    // codice clash check
    (prisma.commessa.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.commessa.update as jest.Mock).mockResolvedValue({ id: 1 });

    await service.update(1, { cliente: "NEW" } as any);

    expect(prisma.commessa.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { cliente: "NEW" },
    });
  });

  it("remove: calls prisma.commessa.delete", async () => {
    (prisma.commessa.findUnique as jest.Mock).mockResolvedValueOnce({ id: 1 });
    (prisma.commessa.delete as jest.Mock).mockResolvedValue({ id: 1 });

    const res = await service.remove(1);
    expect(prisma.commessa.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(res).toEqual({ deleted: true, id: 1 });
  });
});

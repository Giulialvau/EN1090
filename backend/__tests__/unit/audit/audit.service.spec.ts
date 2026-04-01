import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";

import { AuditService } from "../../../src/audit/audit.service";
import { PrismaService } from "../../../src/prisma/prisma.service";
import { createPrismaMock } from "../../mocks/prisma.mock";

describe("AuditService (unit)", () => {
  let service: AuditService;
  const prisma = createPrismaMock() as unknown as PrismaService;

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [AuditService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = moduleRef.get(AuditService);
  });

  it("create: throws if commessa missing", async () => {
    (prisma.commessa.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(
      service.create({ commessaId: 1, titolo: "A" } as any),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("create: calls prisma.audit.create", async () => {
    (prisma.commessa.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
    (prisma.audit.create as jest.Mock).mockResolvedValue({ id: 10 });
    await service.create({ commessaId: 1, titolo: "A", auditor: "X" } as any);
    expect(prisma.audit.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ commessaId: 1, titolo: "A" }),
    });
  });

  it("findOne: throws if missing", async () => {
    (prisma.audit.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(service.findOne(1)).rejects.toBeInstanceOf(NotFoundException);
  });

  it("remove: calls prisma.audit.delete", async () => {
    (prisma.audit.findUnique as jest.Mock).mockResolvedValueOnce({ id: 1 });
    (prisma.audit.delete as jest.Mock).mockResolvedValue({ id: 1 });
    const res = await service.remove(1);
    expect(prisma.audit.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(res).toEqual({ deleted: true, id: 1 });
  });
});

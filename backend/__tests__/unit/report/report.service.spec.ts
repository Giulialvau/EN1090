import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";

import { ReportService } from "../../../src/report/report.service";
import { PrismaService } from "../../../src/prisma/prisma.service";
import { createPrismaMock } from "../../mocks/prisma.mock";

describe("ReportService (unit)", () => {
  let service: ReportService;
  const prisma = createPrismaMock() as unknown as PrismaService;

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [ReportService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = moduleRef.get(ReportService);
  });

  it("dashboard: calls prisma counts", async () => {
    (prisma.commessa.count as jest.Mock).mockResolvedValue(1);
    (prisma.materiale.count as jest.Mock).mockResolvedValue(1);
    (prisma.documento.count as jest.Mock).mockResolvedValue(1);
    (prisma.nonConformita.count as jest.Mock).mockResolvedValue(0);
    (prisma.audit.count as jest.Mock).mockResolvedValue(0);
    (prisma.wps.count as jest.Mock).mockResolvedValue(0);
    (prisma.wpqr.count as jest.Mock).mockResolvedValue(0);
    (prisma.nonConformita.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.audit.findMany as jest.Mock).mockResolvedValue([]);

    await service.dashboard();
    expect(prisma.commessa.count).toHaveBeenCalled();
    expect(prisma.wpqr.count).toHaveBeenCalled();
  });

  it("commessaReport: throws NotFoundException if missing", async () => {
    (prisma.commessa.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(service.commessaReport(1)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("materialiPerFornitore: maps groupBy result", async () => {
    (prisma.materiale.groupBy as jest.Mock).mockResolvedValue([
      { fornitore: "A", _count: { _all: 2 } },
    ]);
    const res = await service.materialiPerFornitore();
    expect(res).toEqual([{ fornitore: "A", conteggio: 2 }]);
  });
});

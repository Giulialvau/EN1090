jest.mock("../../../src/report/report-pdf.renderer", () => ({
  applyTemplate: jest.fn((raw: string) => raw),
  escapeHtml: jest.fn((s: string) => s),
  formatDateIt: jest.fn(() => "01/01/2026"),
  formatDateTimeIt: jest.fn(() => "01/01/2026 10:00"),
  loadHtmlTemplate: jest.fn(() => "<html>{{DOC_TITLE}}</html>"),
  renderHtmlToPdf: jest.fn(async () => new Uint8Array([1, 2, 3])),
}));

import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";

import { ReportPdfService } from "../../../src/report/report-pdf.service";
import { PrismaService } from "../../../src/prisma/prisma.service";
import { createPrismaMock } from "../../mocks/prisma.mock";

describe("ReportPdfService (unit)", () => {
  let service: ReportPdfService;
  const prisma = createPrismaMock() as unknown as PrismaService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        ReportPdfService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = moduleRef.get(ReportPdfService);
  });

  it("dopPdf: throws NotFoundException if commessa missing", async () => {
    (prisma.commessa.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(service.dopPdf(1)).rejects.toBeInstanceOf(NotFoundException);
  });

  it("dopPdf: returns pdf bytes", async () => {
    (prisma.commessa.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      codice: "C1",
      cliente: "ACME",
      titolo: null,
      descrizione: null,
      responsabile: null,
      luogo: null,
      dataInizio: null,
      dataFine: null,
      stato: "IN_CORSO",
    });
    const bytes = await service.dopPdf(1);
    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(Array.from(bytes)).toEqual([1, 2, 3]);
  });
});

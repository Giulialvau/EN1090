import type { INestApplication } from "@nestjs/common";
import * as request from "supertest";

import { ReportPdfService } from "../../src/report/report-pdf.service";

import { createE2EApp } from "./utils/create-app";
import { loginAsAdmin } from "./utils/auth";

describe("ReportController (e2e)", () => {
  let app: INestApplication;
  let accessToken: string;
  let commessaId: number;

  beforeAll(async () => {
    app = await createE2EApp();
    ({ accessToken } = await loginAsAdmin(app));

    const pdf = app.get(ReportPdfService);
    jest
      .spyOn(pdf, "commessaCompletoPdf")
      .mockResolvedValue(new Uint8Array([1, 2, 3]));
    jest.spyOn(pdf, "dopPdf").mockResolvedValue(new Uint8Array([1]));
    jest.spyOn(pdf, "cePdf").mockResolvedValue(new Uint8Array([1]));
    jest
      .spyOn(pdf, "fascicoloTecnicoPdf")
      .mockResolvedValue(new Uint8Array([1]));
    jest.spyOn(pdf, "materialiPdf").mockResolvedValue(new Uint8Array([1]));
    jest.spyOn(pdf, "tracciabilitaPdf").mockResolvedValue(new Uint8Array([1]));

    const cRes = await request(app.getHttpServer())
      .post("/commesse")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ codice: `REP-${Date.now()}`, cliente: "ACME" })
      .expect(201);
    commessaId = cRes.body.data.id as number;
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET /report/dashboard -> 401 without token", async () => {
    await request(app.getHttpServer()).get("/report/dashboard").expect(401);
  });

  it("GET /report/dashboard -> 200 with token", async () => {
    await request(app.getHttpServer())
      .get("/report/dashboard")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
  });

  it("GET /report/commessa/:id -> 200 json report", async () => {
    await request(app.getHttpServer())
      .get(`/report/commessa/${commessaId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
  });

  it("GET /report/materiali/fornitori -> 200", async () => {
    await request(app.getHttpServer())
      .get("/report/materiali/fornitori")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
  });

  it("GET /report/commessa?commessaId= -> 400 when missing query", async () => {
    await request(app.getHttpServer())
      .get("/report/commessa")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(400);
  });

  it("GET /report/commessa?commessaId= -> 200 pdf", async () => {
    await request(app.getHttpServer())
      .get(`/report/commessa?commessaId=${commessaId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
  });
});

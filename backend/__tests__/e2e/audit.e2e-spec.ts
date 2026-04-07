import type { INestApplication } from "@nestjs/common";
import * as request from "supertest";

import { createE2EApp } from "./utils/create-app";
import { loginAsAdmin } from "./utils/auth";

describe("AuditController (e2e)", () => {
  let app: INestApplication;
  let accessToken: string;
  let commessaId: number;
  let auditId: number;

  beforeAll(async () => {
    app = await createE2EApp();
    ({ accessToken } = await loginAsAdmin(app));

    const cRes = await request(app.getHttpServer())
      .post("/commesse")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ codice: `AUD-${Date.now()}`, cliente: "ACME", exc: "EXC2" })
      .expect(201);
    commessaId = cRes.body.data.id as number;
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET /audit -> 401 without token", async () => {
    await request(app.getHttpServer()).get("/audit").expect(401);
  });

  it("POST /audit -> 400 on invalid dto", async () => {
    await request(app.getHttpServer())
      .post("/audit")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ commessaId, titolo: 123 })
      .expect(400);
  });

  it("POST /audit -> 201 create", async () => {
    const res = await request(app.getHttpServer())
      .post("/audit")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        commessaId,
        titolo: "Audit test",
        auditor: "QA",
        esito: "CONFORME",
        data: new Date().toISOString(),
      })
      .expect(201);

    auditId = res.body.data.id as number;
    expect(auditId).toBeGreaterThan(0);
  });

  it("GET /audit -> 200 list", async () => {
    await request(app.getHttpServer())
      .get("/audit")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
  });

  it("GET /audit/:id -> 200 detail", async () => {
    await request(app.getHttpServer())
      .get(`/audit/${auditId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
  });

  it("PATCH /audit/:id -> 200 update", async () => {
    await request(app.getHttpServer())
      .patch(`/audit/${auditId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ note: "updated" })
      .expect(200);
  });

  it("DELETE /audit/:id -> 200 delete", async () => {
    await request(app.getHttpServer())
      .delete(`/audit/${auditId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
  });
});

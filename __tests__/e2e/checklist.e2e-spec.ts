import type { INestApplication } from "@nestjs/common";
import * as request from "supertest";

import { createE2EApp } from "./utils/create-app";
import { loginAsAdmin } from "./utils/auth";

describe("ChecklistController (e2e)", () => {
  let app: INestApplication;
  let accessToken: string;
  let commessaId: number;
  let checklistId: number;

  beforeAll(async () => {
    app = await createE2EApp();
    ({ accessToken } = await loginAsAdmin(app));

    const cRes = await request(app.getHttpServer())
      .post("/commesse")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ codice: `CHK-${Date.now()}`, cliente: "ACME" })
      .expect(201);
    commessaId = cRes.body.data.id as number;
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET /checklist -> 401 without token", async () => {
    await request(app.getHttpServer()).get("/checklist").expect(401);
  });

  it("POST /checklist -> 400 on invalid dto", async () => {
    await request(app.getHttpServer())
      .post("/checklist")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ commessaId: commessaId, titolo: 123 })
      .expect(400);
  });

  it("POST /checklist -> 201 create", async () => {
    const res = await request(app.getHttpServer())
      .post("/checklist")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        commessaId,
        titolo: "Controllo dimensionale",
        categoria: "controllo_dimensionale",
        stato: "APERTA",
        elementi: [],
      })
      .expect(201);

    checklistId = res.body.data.id as number;
    expect(checklistId).toBeGreaterThan(0);
  });

  it("GET /checklist -> 200 list", async () => {
    await request(app.getHttpServer())
      .get("/checklist")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
  });

  it("GET /checklist/:id -> 200 detail", async () => {
    await request(app.getHttpServer())
      .get(`/checklist/${checklistId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
  });

  it("PATCH /checklist/:id -> 200 update", async () => {
    await request(app.getHttpServer())
      .patch(`/checklist/${checklistId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ note: "ok" })
      .expect(200);
  });

  it("DELETE /checklist/:id -> 200 delete", async () => {
    await request(app.getHttpServer())
      .delete(`/checklist/${checklistId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
  });
});

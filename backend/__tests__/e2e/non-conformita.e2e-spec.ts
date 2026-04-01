import type { INestApplication } from "@nestjs/common";
import * as request from "supertest";

import { createE2EApp } from "./utils/create-app";
import { loginAsAdmin } from "./utils/auth";

describe("NonConformitaController (e2e)", () => {
  let app: INestApplication;
  let accessToken: string;
  let commessaId: number;
  let ncId: number;

  beforeAll(async () => {
    app = await createE2EApp();
    ({ accessToken } = await loginAsAdmin(app));

    const cRes = await request(app.getHttpServer())
      .post("/commesse")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ codice: `NC-${Date.now()}`, cliente: "ACME", exc: "EXC2" })
      .expect(201);
    commessaId = cRes.body.data.id as number;
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET /non-conformita -> 401 without token", async () => {
    await request(app.getHttpServer()).get("/non-conformita").expect(401);
  });

  it("POST /non-conformita -> 400 on invalid dto", async () => {
    await request(app.getHttpServer())
      .post("/non-conformita")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ commessaId, titolo: 123 })
      .expect(400);
  });

  it("POST /non-conformita -> 201 create", async () => {
    const res = await request(app.getHttpServer())
      .post("/non-conformita")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        commessaId,
        titolo: "NC test",
        descrizione: "Desc",
        tipo: "INTERNA",
        gravita: "BASSA",
        stato: "APERTA",
      })
      .expect(201);

    ncId = res.body.data.id as number;
    expect(ncId).toBeGreaterThan(0);
  });

  it("GET /non-conformita -> 200 list", async () => {
    await request(app.getHttpServer())
      .get("/non-conformita")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
  });

  it("GET /non-conformita/:id -> 200 detail", async () => {
    await request(app.getHttpServer())
      .get(`/non-conformita/${ncId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
  });

  it("PATCH /non-conformita/:id -> 200 update", async () => {
    await request(app.getHttpServer())
      .patch(`/non-conformita/${ncId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ note: "updated" })
      .expect(200);
  });

  it("DELETE /non-conformita/:id -> 200 delete", async () => {
    await request(app.getHttpServer())
      .delete(`/non-conformita/${ncId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
  });
});

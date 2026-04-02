import type { INestApplication } from "@nestjs/common";
import * as request from "supertest";

import { createE2EApp } from "./utils/create-app";
import { loginAsAdmin } from "./utils/auth";

describe("TracciabilitaController (e2e)", () => {
  let app: INestApplication;
  let accessToken: string;
  let commessaId: number;
  let materialeId: number;
  let tracciabilitaId: number;

  beforeAll(async () => {
    app = await createE2EApp();
    ({ accessToken } = await loginAsAdmin(app));

    const cRes = await request(app.getHttpServer())
      .post("/commesse")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ codice: `TRC-${Date.now()}`, cliente: "ACME" })
      .expect(201);
    commessaId = cRes.body.data.id as number;

    const mRes = await request(app.getHttpServer())
      .post("/materiali")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        commessaId,
        codice: "M-TRC",
        descrizione: "Acciaio",
        tipo: "S355",
        norma: "EN 10025",
        certificato31: "3.1",
      })
      .expect(201);
    materialeId = mRes.body.data.id as number;
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET /tracciabilita -> 401 without token", async () => {
    await request(app.getHttpServer()).get("/tracciabilita").expect(401);
  });

  it("POST /tracciabilita -> 400 on invalid dto", async () => {
    await request(app.getHttpServer())
      .post("/tracciabilita")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ materialeId: "x" })
      .expect(400);
  });

  it("POST /tracciabilita -> 201 create", async () => {
    const res = await request(app.getHttpServer())
      .post("/tracciabilita")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        materialeId,
        commessaId,
        posizione: "P1",
        quantita: 1,
      })
      .expect(201);

    tracciabilitaId = res.body.data.id as number;
    expect(tracciabilitaId).toBeGreaterThan(0);
  });

  it("GET /tracciabilita -> 200 list", async () => {
    await request(app.getHttpServer())
      .get("/tracciabilita")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
  });

  it("GET /tracciabilita/:id -> 200 detail", async () => {
    await request(app.getHttpServer())
      .get(`/tracciabilita/${tracciabilitaId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
  });

  it("PATCH /tracciabilita/:id -> 200 update", async () => {
    await request(app.getHttpServer())
      .patch(`/tracciabilita/${tracciabilitaId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ note: "updated" })
      .expect(200);
  });

  it("DELETE /tracciabilita/:id -> 200 delete", async () => {
    await request(app.getHttpServer())
      .delete(`/tracciabilita/${tracciabilitaId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
  });
});

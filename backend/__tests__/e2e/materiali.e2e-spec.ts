import type { INestApplication } from "@nestjs/common";
import * as request from "supertest";

import { createE2EApp } from "./utils/create-app";
import { loginAsAdmin } from "./utils/auth";

describe("MaterialiController (e2e)", () => {
  let app: INestApplication;
  let accessToken: string;
  let commessaId: number;
  let materialeId: number;

  beforeAll(async () => {
    app = await createE2EApp();
    ({ accessToken } = await loginAsAdmin(app));

    const cRes = await request(app.getHttpServer())
      .post("/commesse")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ codice: `MAT-${Date.now()}`, cliente: "ACME", exc: "EXC2" })
      .expect(201);
    commessaId = cRes.body.data.id as number;
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET /materiali -> 401 without token", async () => {
    await request(app.getHttpServer()).get("/materiali").expect(401);
  });

  it("POST /materiali -> 400 on invalid dto", async () => {
    await request(app.getHttpServer())
      .post("/materiali")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ commessaId: "x" })
      .expect(400);
  });

  it("POST /materiali -> 201 create", async () => {
    const res = await request(app.getHttpServer())
      .post("/materiali")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        commessaId,
        codice: "M-1",
        descrizione: "Acciaio",
        tipo: "S355",
        norma: "EN 10025",
        certificato31: "3.1",
      })
      .expect(201);

    materialeId = res.body.data.id as number;
    expect(materialeId).toBeGreaterThan(0);
  });

  it("GET /materiali -> 200 list", async () => {
    await request(app.getHttpServer())
      .get("/materiali")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
  });

  it("GET /materiali/:id -> 200 detail", async () => {
    await request(app.getHttpServer())
      .get(`/materiali/${materialeId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
  });

  it("PATCH /materiali/:id -> 200 update", async () => {
    await request(app.getHttpServer())
      .patch(`/materiali/${materialeId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ descrizione: "Acciaio aggiornato" })
      .expect(200);
  });

  it("DELETE /materiali/:id -> 200 delete", async () => {
    await request(app.getHttpServer())
      .delete(`/materiali/${materialeId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
  });
});

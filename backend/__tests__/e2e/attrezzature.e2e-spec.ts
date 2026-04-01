import type { INestApplication } from "@nestjs/common";
import * as request from "supertest";

import { createE2EApp } from "./utils/create-app";
import { loginAsAdmin } from "./utils/auth";

describe("AttrezzatureController (e2e)", () => {
  let app: INestApplication;
  let accessToken: string;
  let attrezzaturaId: number;

  beforeAll(async () => {
    app = await createE2EApp();
    ({ accessToken } = await loginAsAdmin(app));
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET /attrezzature -> 401 without token", async () => {
    await request(app.getHttpServer()).get("/attrezzature").expect(401);
  });

  it("POST /attrezzature -> 400 on invalid dto", async () => {
    await request(app.getHttpServer())
      .post("/attrezzature")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ nome: 123 })
      .expect(400);
  });

  it("POST /attrezzature -> 201 create", async () => {
    const res = await request(app.getHttpServer())
      .post("/attrezzature")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        nome: "Saldatrice",
        matricola: `ATR-${Date.now()}`,
        tipo: "saldatrice",
      })
      .expect(201);

    attrezzaturaId = res.body.data.id as number;
    expect(attrezzaturaId).toBeGreaterThan(0);
  });

  it("GET /attrezzature -> 200 list", async () => {
    await request(app.getHttpServer())
      .get("/attrezzature")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
  });

  it("GET /attrezzature/:id -> 200 detail", async () => {
    await request(app.getHttpServer())
      .get(`/attrezzature/${attrezzaturaId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
  });

  it("PATCH /attrezzature/:id -> 200 update", async () => {
    await request(app.getHttpServer())
      .patch(`/attrezzature/${attrezzaturaId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ nome: "Saldatrice aggiornata" })
      .expect(200);
  });

  it("DELETE /attrezzature/:id -> 200 delete", async () => {
    await request(app.getHttpServer())
      .delete(`/attrezzature/${attrezzaturaId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
  });
});

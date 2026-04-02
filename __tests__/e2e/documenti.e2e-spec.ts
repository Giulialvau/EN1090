import type { INestApplication } from "@nestjs/common";
import * as request from "supertest";

import { createE2EApp } from "./utils/create-app";
import { loginAsAdmin } from "./utils/auth";

describe("DocumentiController (e2e)", () => {
  let app: INestApplication;
  let accessToken: string;
  let commessaId: number;
  let documentoId: number;

  beforeAll(async () => {
    app = await createE2EApp();
    ({ accessToken } = await loginAsAdmin(app));

    const cRes = await request(app.getHttpServer())
      .post("/commesse")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ codice: `DOC-${Date.now()}`, cliente: "ACME" })
      .expect(201);
    commessaId = cRes.body.data.id as number;
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET /documenti -> 401 without token", async () => {
    await request(app.getHttpServer()).get("/documenti").expect(401);
  });

  it("POST /documenti -> 400 on invalid dto", async () => {
    await request(app.getHttpServer())
      .post("/documenti")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ commessaId: "x" })
      .expect(400);
  });

  it("POST /documenti -> 201 create", async () => {
    const res = await request(app.getHttpServer())
      .post("/documenti")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        commessaId,
        nome: "Manuale",
        tipo: "manuale",
        versione: "1.0",
        percorsoFile: "uploads/documenti/test.pdf",
        statoApprovazione: "BOZZA",
      })
      .expect(201);

    documentoId = res.body.data.id as number;
    expect(documentoId).toBeGreaterThan(0);
  });

  it("GET /documenti -> 200 list", async () => {
    await request(app.getHttpServer())
      .get("/documenti")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
  });

  it("GET /documenti/:id -> 200 detail", async () => {
    await request(app.getHttpServer())
      .get(`/documenti/${documentoId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
  });

  it("PATCH /documenti/:id -> 200 update", async () => {
    await request(app.getHttpServer())
      .patch(`/documenti/${documentoId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ versione: "1.1" })
      .expect(200);
  });

  it("DELETE /documenti/:id -> 200 delete", async () => {
    await request(app.getHttpServer())
      .delete(`/documenti/${documentoId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
  });
});

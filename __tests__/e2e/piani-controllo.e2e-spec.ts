import type { INestApplication } from "@nestjs/common";
import * as request from "supertest";

import { createE2EApp } from "./utils/create-app";
import { loginAsAdmin } from "./utils/auth";

describe("PianiControlloController (e2e)", () => {
  let app: INestApplication;
  let accessToken: string;
  let commessaId: number;
  let pianoId: number;

  beforeAll(async () => {
    app = await createE2EApp();
    ({ accessToken } = await loginAsAdmin(app));

    const cRes = await request(app.getHttpServer())
      .post("/commesse")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ codice: `PC-${Date.now()}`, cliente: "ACME" })
      .expect(201);
    commessaId = cRes.body.data.id as number;
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET /piani-controllo -> 401 without token", async () => {
    await request(app.getHttpServer()).get("/piani-controllo").expect(401);
  });

  it("POST /piani-controllo -> 400 on invalid dto", async () => {
    await request(app.getHttpServer())
      .post("/piani-controllo")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ commessaId, fase: 123 })
      .expect(400);
  });

  it("POST /piani-controllo -> 201 create", async () => {
    const res = await request(app.getHttpServer())
      .post("/piani-controllo")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        commessaId,
        fase: "F1",
        controlliRichiesti: [],
        esito: "IN_ATTESA",
      })
      .expect(201);

    pianoId = res.body.data.id as number;
    expect(pianoId).toBeGreaterThan(0);
  });

  it("GET /piani-controllo -> 200 list", async () => {
    await request(app.getHttpServer())
      .get("/piani-controllo")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
  });

  it("GET /piani-controllo/:id -> 200 detail", async () => {
    await request(app.getHttpServer())
      .get(`/piani-controllo/${pianoId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
  });

  it("PATCH /piani-controllo/:id -> 200 update", async () => {
    await request(app.getHttpServer())
      .patch(`/piani-controllo/${pianoId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ esito: "IN_ATTESA" })
      .expect(200);
  });

  it("DELETE /piani-controllo/:id -> 200 delete", async () => {
    await request(app.getHttpServer())
      .delete(`/piani-controllo/${pianoId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
  });
});

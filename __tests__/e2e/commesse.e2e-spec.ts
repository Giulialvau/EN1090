import type { INestApplication } from "@nestjs/common";
import * as request from "supertest";

import { createE2EApp } from "./utils/create-app";
import { loginAsAdmin } from "./utils/auth";

describe("CommesseController (e2e)", () => {
  let app: INestApplication;
  let accessToken: string;
  let commessaId: number;

  beforeAll(async () => {
    app = await createE2EApp();
    ({ accessToken } = await loginAsAdmin(app));
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET /commesse -> 401 without token", async () => {
    await request(app.getHttpServer()).get("/commesse").expect(401);
  });

  it("POST /commesse -> 400 on invalid dto", async () => {
    await request(app.getHttpServer())
      .post("/commesse")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ codice: 123 })
      .expect(400);
  });

  it("POST /commesse -> 201 create", async () => {
    const res = await request(app.getHttpServer())
      .post("/commesse")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        codice: `TST-${Date.now()}`,
        cliente: "ACME",
      })
      .expect(201);

    commessaId = res.body.data.id as number;
    expect(commessaId).toBeGreaterThan(0);
  });

  it("GET /commesse -> 200 list", async () => {
    await request(app.getHttpServer())
      .get("/commesse")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
  });

  it("GET /commesse/:id -> 200 detail", async () => {
    await request(app.getHttpServer())
      .get(`/commesse/${commessaId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
  });

  it("PATCH /commesse/:id -> 200 update", async () => {
    await request(app.getHttpServer())
      .patch(`/commesse/${commessaId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ note: "updated" })
      .expect(200);
  });

  it("DELETE /commesse/:id -> 200 delete", async () => {
    await request(app.getHttpServer())
      .delete(`/commesse/${commessaId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
  });
});

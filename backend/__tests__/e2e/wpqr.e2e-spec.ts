import type { INestApplication } from "@nestjs/common";
import * as request from "supertest";

import { createE2EApp } from "./utils/create-app";
import { loginAsAdmin } from "./utils/auth";

describe("WpqrController (e2e)", () => {
  let app: INestApplication;
  let accessToken: string;
  let wpsId: number;
  let wpqrId: number;

  beforeAll(async () => {
    app = await createE2EApp();
    ({ accessToken } = await loginAsAdmin(app));

    const wRes = await request(app.getHttpServer())
      .post("/wps")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ codice: `WPSQ-${Date.now()}`, processo: "SALDATURA" })
      .expect(201);
    wpsId = wRes.body.data.id as number;
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET /wpqr -> 401 without token", async () => {
    await request(app.getHttpServer()).get("/wpqr").expect(401);
  });

  it("POST /wpqr -> 400 on invalid dto", async () => {
    await request(app.getHttpServer())
      .post("/wpqr")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ wpsId: "x" })
      .expect(400);
  });

  it("POST /wpqr -> 201 create", async () => {
    const res = await request(app.getHttpServer())
      .post("/wpqr")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        wpsId,
        codice: `WPQR-${Date.now()}`,
        saldatore: "Mario Rossi",
        dataQualifica: new Date().toISOString(),
      })
      .expect(201);

    wpqrId = res.body.data.id as number;
    expect(wpqrId).toBeGreaterThan(0);
  });

  it("GET /wpqr -> 200 list", async () => {
    await request(app.getHttpServer())
      .get("/wpqr")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
  });

  it("GET /wpqr/:id -> 200 detail", async () => {
    await request(app.getHttpServer())
      .get(`/wpqr/${wpqrId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
  });

  it("PATCH /wpqr/:id -> 200 update", async () => {
    await request(app.getHttpServer())
      .patch(`/wpqr/${wpqrId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ note: "updated" })
      .expect(200);
  });

  it("DELETE /wpqr/:id -> 200 delete", async () => {
    await request(app.getHttpServer())
      .delete(`/wpqr/${wpqrId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
  });
});

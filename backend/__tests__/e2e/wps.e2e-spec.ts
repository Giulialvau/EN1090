import type { INestApplication } from "@nestjs/common";
import * as request from "supertest";

import { createE2EApp } from "./utils/create-app";
import { loginAsAdmin } from "./utils/auth";

describe("WpsController (e2e)", () => {
  let app: INestApplication;
  let accessToken: string;
  let wpsId: number;

  beforeAll(async () => {
    app = await createE2EApp();
    ({ accessToken } = await loginAsAdmin(app));
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET /wps -> 401 without token", async () => {
    await request(app.getHttpServer()).get("/wps").expect(401);
  });

  it("POST /wps -> 400 on invalid dto", async () => {
    await request(app.getHttpServer())
      .post("/wps")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ codice: 123 })
      .expect(400);
  });

  it("POST /wps -> 201 create", async () => {
    const res = await request(app.getHttpServer())
      .post("/wps")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ codice: `WPS-${Date.now()}`, processo: "SALDATURA" })
      .expect(201);

    wpsId = res.body.data.id as number;
    expect(wpsId).toBeGreaterThan(0);
  });

  it("GET /wps -> 200 list", async () => {
    await request(app.getHttpServer())
      .get("/wps")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
  });

  it("GET /wps/:id -> 200 detail", async () => {
    await request(app.getHttpServer())
      .get(`/wps/${wpsId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
  });

  it("PATCH /wps/:id -> 200 update", async () => {
    await request(app.getHttpServer())
      .patch(`/wps/${wpsId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ note: "updated" })
      .expect(200);
  });

  it("DELETE /wps/:id -> 200 delete", async () => {
    await request(app.getHttpServer())
      .delete(`/wps/${wpsId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
  });
});

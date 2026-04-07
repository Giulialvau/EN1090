import type { INestApplication } from "@nestjs/common";
import * as request from "supertest";

import { createE2EApp } from "./utils/create-app";
import { loginAsAdmin } from "./utils/auth";

describe("AuthController (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createE2EApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it("POST /auth/login -> 400 on invalid dto", async () => {
    await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email: "admin@example.com" })
      .expect(400);
  });

  it("POST /auth/login -> 401 on wrong credentials", async () => {
    await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email: "admin@example.com", password: "wrongpass" })
      .expect(401);
  });

  it("POST /auth/login -> 201 returns tokens", async () => {
    const { accessToken, refreshToken } = await loginAsAdmin(app);
    expect(accessToken).toBeTruthy();
    expect(refreshToken).toBeTruthy();
  });

  it("POST /auth/refresh -> 401 without bearer", async () => {
    await request(app.getHttpServer()).post("/auth/refresh").expect(401);
  });

  it("POST /auth/refresh -> 200 with refresh bearer", async () => {
    const { refreshToken } = await loginAsAdmin(app);
    await request(app.getHttpServer())
      .post("/auth/refresh")
      .set("Authorization", `Bearer ${refreshToken}`)
      .expect(201);
  });

  it("POST /auth/logout -> 200 with access bearer", async () => {
    const { accessToken } = await loginAsAdmin(app);
    await request(app.getHttpServer())
      .post("/auth/logout")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(201);
  });
});

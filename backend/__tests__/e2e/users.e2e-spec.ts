import type { INestApplication } from "@nestjs/common";
import * as request from "supertest";

import { createE2EApp } from "./utils/create-app";
import { loginAsAdmin } from "./utils/auth";

describe("UsersController (e2e)", () => {
  let app: INestApplication;
  let accessToken: string;
  let userId: string;

  beforeAll(async () => {
    app = await createE2EApp();
    ({ accessToken } = await loginAsAdmin(app));
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET /users -> 401 without token", async () => {
    await request(app.getHttpServer()).get("/users").expect(401);
  });

  it("POST /users -> 400 on invalid dto", async () => {
    await request(app.getHttpServer())
      .post("/users")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ email: "not-an-email" })
      .expect(400);
  });

  it("POST /users -> 201 create", async () => {
    const res = await request(app.getHttpServer())
      .post("/users")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        email: `u${Date.now()}@example.com`,
        password: "password1",
        firstName: "Test",
        lastName: "User",
        role: "USER",
      })
      .expect(201);

    userId = res.body.data.id as string;
    expect(userId).toBeTruthy();
  });

  it("GET /users -> 200 list", async () => {
    await request(app.getHttpServer())
      .get("/users")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
  });

  it("GET /users/:id -> 200 detail", async () => {
    await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
  });

  it("PATCH /users/:id -> 200 update", async () => {
    await request(app.getHttpServer())
      .patch(`/users/${userId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ firstName: "Updated" })
      .expect(200);
  });

  it("DELETE /users/:id -> 200 delete", async () => {
    await request(app.getHttpServer())
      .delete(`/users/${userId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
  });
});

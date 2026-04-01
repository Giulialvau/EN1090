import type { INestApplication } from "@nestjs/common";
import * as request from "supertest";

import { createE2EApp } from "./utils/create-app";

describe("HealthController (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createE2EApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET /health -> 200", async () => {
    await request(app.getHttpServer()).get("/health").expect(200);
  });
});

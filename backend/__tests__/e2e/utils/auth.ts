import * as request from "supertest";
import type { INestApplication } from "@nestjs/common";

export async function loginAsAdmin(app: INestApplication): Promise<{
  accessToken: string;
  refreshToken: string;
}> {
  const res = await request(app.getHttpServer())
    .post("/auth/login")
    .send({ email: "admin@example.com", password: "admin1234" })
    .expect(201);

  return {
    accessToken: res.body.data.access_token as string,
    refreshToken: res.body.data.refresh_token as string,
  };
}

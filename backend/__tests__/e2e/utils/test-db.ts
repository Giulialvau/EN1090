import { spawnSync } from "child_process";

import { GenericContainer, StartedTestContainer, Wait } from "testcontainers";

type DbState = {
  container: StartedTestContainer;
  databaseUrl: string;
};

declare global {
  // eslint-disable-next-line no-var
  var __EN1090_E2E_DB__: DbState | undefined;
}

function run(cmd: string, args: string[], env: NodeJS.ProcessEnv) {
  const res = spawnSync(cmd, args, {
    env,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (res.status !== 0) {
    throw new Error(`Command failed: ${cmd} ${args.join(" ")}`);
  }
}

export async function ensureTestDatabase(): Promise<string> {
  if (global.__EN1090_E2E_DB__) return global.__EN1090_E2E_DB__.databaseUrl;

  const user = "postgres";
  const password = "postgres";
  const db = "en1090_test";

  const container = await new GenericContainer("postgres:16-alpine")
    .withEnvironment({
      POSTGRES_USER: user,
      POSTGRES_PASSWORD: password,
      POSTGRES_DB: db,
    })
    .withExposedPorts(5432)
    .withWaitStrategy(
      Wait.forLogMessage("database system is ready to accept connections"),
    )
    .start();

  const host = container.getHost();
  const port = container.getMappedPort(5432);
  const databaseUrl = `postgresql://${user}:${password}@${host}:${port}/${db}?schema=public`;

  process.env.DATABASE_URL = databaseUrl;

  const env = {
    ...process.env,
    DATABASE_URL: databaseUrl,
    NODE_ENV: "test",
  };

  // Prisma migrate + seed sul DB temporaneo
  run("npx", ["prisma", "migrate", "deploy"], env);
  run("npx", ["prisma", "db", "seed"], env);

  global.__EN1090_E2E_DB__ = { container, databaseUrl };

  // Teardown best-effort a fine processo
  process.once("exit", () => {
    void container.stop().catch(() => undefined);
  });

  return databaseUrl;
}

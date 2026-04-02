import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

import { GenericContainer, StartedTestContainer, Wait } from "testcontainers";

const STATE_PATH = join(__dirname, ".tc-state.json");

type State = {
  containerId: string;
  databaseUrl: string;
};

export async function startPostgresContainer(): Promise<State> {
  const user = "postgres";
  const password = "postgres";
  const db = "en1090_test";

  const container: StartedTestContainer = await new GenericContainer(
    "postgres:16-alpine",
  )
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

  const state: State = {
    containerId: container.getId(),
    databaseUrl,
  };
  writeFileSync(STATE_PATH, JSON.stringify(state, null, 2), "utf8");

  return state;
}

export function readState(): State {
  if (!existsSync(STATE_PATH)) {
    throw new Error(
      `Testcontainers state file not found: ${STATE_PATH}. Did globalSetup run?`,
    );
  }
  return JSON.parse(readFileSync(STATE_PATH, "utf8")) as State;
}

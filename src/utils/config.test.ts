import { vi, expect, test, beforeEach, afterEach } from "vitest";
import { config, type Config } from "@/utils/config.js";
import { EnvVarRequiredError } from "@/errors/EnvVarError.js";

let env: NodeJS.ProcessEnv;

beforeEach(() => {
  env = process.env;
  process.env = { ...env };
  vi.resetAllMocks();
});

afterEach(() => {
  process.env = env;
});

test("fails if PORT is not a number", async () => {
  const envVarError = new EnvVarRequiredError("PORT");

  process.env.PORT = "xxxx";

  await expect(config()).rejects.toThrow(envVarError);
});

test("fails if HOST is not valid", async () => {
  const envVarError = new EnvVarRequiredError("HOST");

  process.env.HOST = "xxxxx";

  await expect(config()).rejects.toThrow(envVarError);
});

test("succeeds if all configurations are set", async () => {
  const expected: Config = {
    slack: {
      channelId: undefined,
      token: undefined,
    },
    server: {
      production: false,
      port: 3000,
      host: "0.0.0.0",
    },
  };

  await expect(config()).resolves.toStrictEqual(expected);
});

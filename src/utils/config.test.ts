import { vi, expect, test, beforeEach } from "vitest";
import { config, type Config } from "@/utils/config.js";
import { EnvVarRequiredError } from "@/errors/EnvVarError.js";

beforeEach(() => {
  vi.resetAllMocks();
});

test("fails if PORT is not defined", async () => {
  const envVarError = new EnvVarRequiredError("PORT");

  await expect(config()).rejects.toThrow(envVarError);
});

test("succeeds if all configurations are set", async () => {
  const expected: Config = {
    slack: {
      channelId: undefined,
      token: undefined,
    },
    server: {
      port: 3000,
    },
  };

  process.env.PORT = String(expected.server.port);

  await expect(config()).resolves.toStrictEqual(expected);
});

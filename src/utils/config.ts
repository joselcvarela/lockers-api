import { EnvVarRequiredError } from "@/errors/EnvVarError.js";

export type Config = Awaited<ReturnType<typeof config>>;

export type MockedConfig = () => Promise<Partial<Config>>;

export async function config() {
  const slack = {
    channelId: process.env.SLACK_CHANNEL_ID,
    token: process.env.SLACK_TOKEN,
  };

  const server = {
    port: Number(process.env.PORT ?? 3000),
    host: process.env.HOST ?? "0.0.0.0",
  };

  const configValue = {
    slack,
    server,
  };

  await validate(configValue);

  return configValue;
}

async function validate(configValue: Config) {
  if (!(configValue.server.port > 0)) throw new EnvVarRequiredError("PORT");

  const isHostValid = await import("validator").then((m) => m.isIP(configValue.server.host));
  if (!isHostValid) throw new EnvVarRequiredError("HOST");
}

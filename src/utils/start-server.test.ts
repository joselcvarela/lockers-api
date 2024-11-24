import { vi, expect, test, beforeEach } from "vitest";
import { type Config, config } from "@/utils/config.js";
import { emit, on } from "@/utils/events.js";
import { startServer } from "./start-server.js";

vi.mock("express", () => {
  return {
    default() {
      return {
        listen: vi.fn(),
      };
    },
  };
});
vi.mock("@/utils/events.js");
vi.mock("@/utils/config.js");

beforeEach(() => {
  vi.resetAllMocks();
});

test("starts listen on port", async () => {
  const configValue = { server: { production: false, host: "127.0.0.1", port: 3000 } };
  vi.mocked<() => Promise<Partial<Config>>>(config).mockResolvedValueOnce(configValue);

  const app = await startServer();

  expect(emit).toHaveBeenNthCalledWith(1, "middlewares.before", app);
  expect(emit).toHaveBeenNthCalledWith(2, "middlewares.after", app);
  expect(emit).toHaveBeenNthCalledWith(3, "routes.before", app);
  expect(emit).toHaveBeenNthCalledWith(4, "routes.after", app);

  expect(app.listen).toBeCalledWith(
    configValue.server.port,
    configValue.server.host,
    expect.any(Function),
  );
});

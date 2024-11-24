import axios, { AxiosError } from "axios";
import { vi, expect, test, beforeEach } from "vitest";
import { config, type MockedConfig } from "@/utils/config.js";
import { sendSlackMessage } from "./send-slack-message.js";

vi.mock("axios");
vi.mock("@/utils/config");

beforeEach(() => {
  vi.resetAllMocks();
});

test("sends message successfully", async () => {
  const configValue = {
    server: { production: true },
    slack: { channelId: "CHANNEL", token: "TOKEN" },
  };
  vi.mocked<MockedConfig>(config).mockResolvedValueOnce(configValue);

  vi.mocked(axios.post).mockResolvedValueOnce({ data: {} });

  const message = "hello world";
  await sendSlackMessage(message);

  expect(axios.post).toBeCalledWith(
    "https://slack.com/api/chat.postMessage",
    {
      channel: configValue.slack.channelId,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: message,
          },
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${configValue.slack.token}`,
      },
    },
  );
});

test("fails to send message", async () => {
  const configValue = {
    server: { production: true },
    slack: { channelId: "CHANNEL", token: "TOKEN" },
  };
  vi.mocked<MockedConfig>(config).mockResolvedValueOnce(configValue);

  const error = new AxiosError("Something went wrong", "500");
  vi.mocked(axios.post).mockRejectedValueOnce(error);

  vi.spyOn(console, "error").mockImplementationOnce(() => undefined);

  const message = "hello world";
  await sendSlackMessage(message);

  expect(axios.post).toBeCalledWith(
    "https://slack.com/api/chat.postMessage",
    {
      channel: configValue.slack.channelId,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: message,
          },
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${configValue.slack.token}`,
      },
    },
  );

  expect(console.error).toHaveBeenNthCalledWith(
    1,
    "Was not able to send message to slack:",
    message,
  );
  expect(console.error).toHaveBeenNthCalledWith(2, "Message:", message);
  expect(console.error).toHaveBeenNthCalledWith(3, "Error:", error);
});

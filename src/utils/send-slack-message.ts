export async function sendSlackMessage(message: string) {
  const config = await import("@/utils/config.js").then((m) => m.config());
  const axios = (await import("axios")).default;

  return axios
    .post(
      "https://slack.com/api/chat.postMessage",
      {
        channel: config.slack.channelId,
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
          Authorization: `Bearer ${config.slack.token}`,
        },
      }
    )
    .catch((error) => {
      console.error("Was not able to send message to slack:", message);
      console.error("Message:", message);
      console.error("Error:", error);
    });
}

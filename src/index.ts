async function start() {
  try {
    // Start server
  } catch (error) {
    if (error && error.toString) {
      const { sendSlackMessage } = await import("@/utils/send-slack-message.js");
      await sendSlackMessage(error.toString());
    }

    throw error;
  }
}

start();

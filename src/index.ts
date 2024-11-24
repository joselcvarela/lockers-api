async function start() {
  try {
    const { startServer } = await import("@/utils/start-server.js");
    await startServer();
  } catch (error) {
    if (error && error.toString) {
      const { sendSlackMessage } = await import("@/utils/send-slack-message.js");
      await sendSlackMessage(error.toString());
    }

    throw error;
  }
}

start();

async function start() {
  try {
    await import("@/middlewares/index.js").then((m) => m.start());
    await import("@/modules/index.js").then((m) => m.start());

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

export async function start() {
  const events = await import("@/utils/events.js");

  await events.on("routes.after", async (app) => {
    const { respond } = await import("@/middlewares/respond/respond.js");

    app.use(async (error, req, res, next) => {
      const { HttpError } = await import("@/errors/HttpError.js");
      const { InternalError } = await import("@/errors/InternalError.js");
      const { logger } = await import("@/utils/logger.js");
      const { sendSlackMessage } = await import("@/utils/send-slack-message.js");

      const err = error instanceof HttpError ? error : new InternalError();

      if (err instanceof InternalError && error?.toString) {
        await sendSlackMessage(error.toString());
      }

      res.locals["status"] = err.status;
      res.locals["data"] = err.body;

      logger(String(error));

      return next();
    }, respond);
  });
}

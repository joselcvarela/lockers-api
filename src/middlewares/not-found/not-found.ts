import { respond } from "@/middlewares/respond/respond.js";

async function start() {
  const events = await import("@/utils/events.js");
  await events.on("routes.after", async (app) => {
    app.use((_, res, next) => {
      res.locals["status"] = 404;
      res.locals["id"] = "not_found";

      return next();
    }, respond);
  });
}

start();

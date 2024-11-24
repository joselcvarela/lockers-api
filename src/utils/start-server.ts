export async function startServer() {
  const express = (await import("express")).default;
  const events = await import("@/utils/events.js");
  const config = await import("@/utils/config.js").then((m) => m.config());

  const app = express();

  await events.emit("middlewares.before", app);

  const bodyParser = await import("body-parser").then((m) => m.default);
  app.use(bodyParser.json());

  await events.emit("middlewares.after", app);

  await events.emit("routes.before", app);

  app.use("/bloqs", await import("@/controllers/bloqs/bloqs.js").then((m) => m.controller()));

  app.use("/lockers", await import("@/controllers/lockers/lockers.js").then((m) => m.controller()));

  app.use("/rents", await import("@/controllers/rents/rents.js").then((m) => m.controller()));

  await events.emit("routes.after", app);

  app.use(await import("@/controllers/not-found/not-found.js").then((m) => m.controller()));

  app.use(await import("@/controllers/error/error.js").then((m) => m.controller()));

  app.listen(config.server.port, config.server.host, () => {
    console.log(`Server started on : ${config.server.host}:${config.server.port}`);
  });

  return app;
}

export async function startServer() {
  const express = (await import("express")).default;
  const events = await import("@/utils/events.js");
  const config = await import("@/utils/config.js").then((m) => m.config());

  const app = express();

  await events.emit("middlewares.before", app);

  await events.emit("middlewares.after", app);

  await events.emit("routes.before", app);

  await events.emit("routes.after", app);

  app.listen(config.server.port, config.server.host, () => {
    console.log(`Server started on : ${config.server.host}:${config.server.port}`);
  });

  return app;
}

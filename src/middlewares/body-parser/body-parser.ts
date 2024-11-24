export async function start() {
  const events = await import("@/utils/events.js");

  await events.on("middlewares.before", async (app) => {
    const bodyParser = await import("body-parser").then((m) => m.default);
    app.use(bodyParser.json());
  });
}

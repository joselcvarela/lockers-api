export async function start() {
  const events = await import("@/utils/events.js");

  await events.on("routes.after", async (app) => {
    const { respond } = await import("@/middlewares/respond/respond.js");
    const { route } = await import("@/utils/route.js");

    app.use(
      route((_, res, next) => {
        res.locals["status"] = 404;
        res.locals["id"] = "not_found";

        return next();
      }),
      respond,
    );
  });
}

export async function controller() {
  const { respond } = await import("@/middlewares/respond/respond.js");
  const { route } = await import("@/utils/route.js");

  return route((req, res) => {
    res.locals["status"] = 404;
    res.locals["id"] = "not_found";

    return respond(req, res);
  });
}

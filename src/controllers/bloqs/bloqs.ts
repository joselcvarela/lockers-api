export async function controller() {
  const express = await import("express");
  const { route } = await import("@/utils/route.js");
  const { respond } = await import("@/middlewares/respond/respond.js");
  const router = express.Router();

  router.get(
    "/:bloqId?",
    route(async (req, res, next) => {
      const db = await import("@/utils/db.js").then((m) => m.getDb());
      const { NotFoundError } = await import("@/errors/NotFoundError.js");

      const bloqId = req.params["bloqId"];
      if (bloqId) {
        const bloq = await db.bloq.findFirst({ where: { id: bloqId }, include: { lockers: true } });

        if (!bloq?.id) throw new NotFoundError("Bloq", bloqId);

        res.locals["data"] = bloq;
      } else {
        const page = req.query["page"] ? Number(req.query["page"]) : 0;

        const bloqs = await db.bloq.findMany({
          take: 50,
          skip: 50 * page,
          include: { lockers: true },
        });

        res.locals["data"] = bloqs;
      }

      return next();
    }),
    respond,
  );

  router.post(
    "/",
    route(async (req, res, next) => {
      const events = await import("@/utils/events.js");
      const db = await import("@/utils/db.js").then((m) => m.getDb());
      const { ConflictError } = await import("@/errors/ConflictError.js");

      const { address, title } = req.body;

      const existent = await db.bloq.findFirst({ where: { address, title } });

      if (existent?.id) throw new ConflictError("Bloq");

      const data = { address, title };

      await events.emit("bloq.create.before", data);

      const bloq = await db.bloq.create({ data });

      await events.emit("bloq.create.after", bloq.id, bloq);

      res.locals["data"] = bloq;
      return next();
    }),
    respond,
  );

  router.put(
    "/:bloqId",
    route(async (req, res, next) => {
      const events = await import("@/utils/events.js");

      const db = await import("@/utils/db.js").then((m) => m.getDb());
      const { NotFoundError } = await import("@/errors/NotFoundError.js");

      const bloqId = req.params.bloqId;
      const { address, title } = req.body;

      const bloq = await db.bloq.findFirst({ where: { id: bloqId } });

      if (!bloq?.id) throw new NotFoundError("Bloq", bloqId);

      const data = { address, title };

      const updatedBloq = await db.$transaction(async (tx) => {
        await events.emit("bloq.update.before", bloq.id, data, tx);

        const updatedBloq = await db.bloq.update({
          where: { id: bloq.id },
          data,
        });

        await events.emit("bloq.update.after", bloq.id, updatedBloq, tx);

        return updatedBloq;
      });

      res.locals["data"] = updatedBloq;
      return next();
    }),
    respond,
  );

  router.delete(
    "/:bloqId",
    route(async (req, res, next) => {
      const events = await import("@/utils/events.js");

      const db = await import("@/utils/db.js").then((m) => m.getDb());
      const { NotFoundError } = await import("@/errors/NotFoundError.js");

      const bloqId = req.params.bloqId;

      const bloq = await db.bloq.findFirst({ where: { id: bloqId } });

      if (!bloq?.id) throw new NotFoundError("Bloq", bloqId);

      await events.emit("bloq.delete.before", bloq.id, bloq);

      await db.bloq.delete({
        where: { id: bloq.id },
      });

      await events.emit("bloq.delete.after", bloq.id, bloq);

      res.locals["data"] = {};
      return next();
    }),
    respond,
  );

  return router;
}

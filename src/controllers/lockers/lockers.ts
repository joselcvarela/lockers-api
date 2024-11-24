export async function controller() {
  const express = await import("express");
  const { route } = await import("@/utils/route.js");
  const { respond } = await import("@/middlewares/respond/respond.js");
  const router = express.Router();

  router.get(
    "/:lockerId?",
    route(async (req, res, next) => {
      const db = await import("@/utils/db.js").then((m) => m.getDb());
      const { NotFoundError } = await import("@/errors/NotFoundError.js");

      const lockerId = req.params["lockerId"];
      if (lockerId) {
        const locker = await db.locker.findFirst({
          where: { id: lockerId },
          include: { bloq: true, rent: true },
        });

        if (!locker?.id) throw new NotFoundError("Locker", lockerId);

        res.locals["data"] = locker;
      } else {
        const page = req.query["page"] ? Number(req.query["page"]) : 0;

        const lockers = await db.locker.findMany({
          take: 50,
          skip: 50 * page,
          include: { bloq: true, rent: true },
        });

        res.locals["data"] = lockers;
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

      const { bloqId, status = "CLOSED", isOccupied = false } = req.body;

      const data = { bloqId, status, isOccupied };

      await events.emit("locker.create.before", data);

      const locker = await db.locker.create({ data });

      await events.emit("locker.create.after", locker.id, locker);

      res.locals["data"] = locker;
      return next();
    }),
    respond,
  );

  router.put(
    "/:lockerId",
    route(async (req, res, next) => {
      const events = await import("@/utils/events.js");

      const db = await import("@/utils/db.js").then((m) => m.getDb());
      const { NotFoundError } = await import("@/errors/NotFoundError.js");

      const lockerId = req.params.lockerId;
      const { bloqId, status, isOccupied } = req.body;

      const locker = await db.locker.findFirst({ where: { id: lockerId } });

      if (!locker?.id) throw new NotFoundError("Locker", lockerId);

      const data = { bloqId, status, isOccupied };

      const updatedLocker = await db.$transaction(async (tx) => {
        await events.emit("locker.update.before", locker.id, data, tx);

        const updatedLocker = await db.locker.update({
          where: { id: locker.id },
          data,
        });

        await events.emit("locker.update.after", locker.id, updatedLocker, tx);

        return updatedLocker;
      });

      res.locals["data"] = updatedLocker;
      return next();
    }),
    respond,
  );

  router.delete(
    "/:lockerId",
    route(async (req, res, next) => {
      const events = await import("@/utils/events.js");

      const db = await import("@/utils/db.js").then((m) => m.getDb());
      const { NotFoundError } = await import("@/errors/NotFoundError.js");

      const lockerId = req.params.lockerId;

      const locker = await db.locker.findFirst({ where: { id: lockerId } });

      if (!locker?.id) throw new NotFoundError("Locker", lockerId);

      await events.emit("locker.delete.before", locker.id, locker);

      await db.locker.delete({
        where: { id: locker.id },
      });

      await events.emit("locker.delete.after", locker.id, locker);

      res.locals["data"] = {};
      return next();
    }),
    respond,
  );

  return router;
}

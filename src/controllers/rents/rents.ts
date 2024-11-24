export async function controller() {
  const express = await import("express");
  const { route } = await import("@/utils/route.js");
  const { respond } = await import("@/middlewares/respond/respond.js");
  const router = express.Router();

  router.get(
    "/:rentId?",
    route(async (req, res, next) => {
      const db = await import("@/utils/db.js").then((m) => m.getDb());
      const { NotFoundError } = await import("@/errors/NotFoundError.js");

      const rentId = req.params["rentId"];
      if (rentId) {
        const rent = await db.rent.findFirst({
          where: { id: rentId },
          include: { locker: true },
        });

        if (!rent?.id) throw new NotFoundError("Rent", rentId);

        res.locals["data"] = rent;
      } else {
        const page = req.query["page"] ? Number(req.query["page"]) : 0;

        const rents = await db.rent.findMany({
          take: 50,
          skip: 50 * page,
          include: { locker: true },
        });

        res.locals["data"] = rents;
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

      const { size, status = "CREATED", weight, lockerId } = req.body;

      const data = { size, status, weight, lockerId };

      await events.emit("rent.create.before", data);

      const rent = await db.rent.create({ data });

      await events.emit("rent.create.after", rent.id, rent);

      res.locals["data"] = rent;
      return next();
    }),
    respond,
  );

  router.put(
    "/:rentId",
    route(async (req, res, next) => {
      const events = await import("@/utils/events.js");

      const db = await import("@/utils/db.js").then((m) => m.getDb());
      const { NotFoundError } = await import("@/errors/NotFoundError.js");

      const rentId = req.params.rentId;
      const { size, status, weight, lockerId } = req.body;

      const rent = await db.rent.findFirst({ where: { id: rentId } });

      if (!rent?.id) throw new NotFoundError("Rent", rentId);

      const data = { size, status, weight, lockerId };

      await events.emit("rent.update.before", rent.id, data);

      const updatedRent = await db.rent.update({
        where: { id: rent.id },
        data,
      });

      await events.emit("rent.update.after", rent.id, updatedRent);

      res.locals["data"] = updatedRent;
      return next();
    }),
    respond,
  );

  router.delete(
    "/:rentId",
    route(async (req, res, next) => {
      const events = await import("@/utils/events.js");

      const db = await import("@/utils/db.js").then((m) => m.getDb());
      const { NotFoundError } = await import("@/errors/NotFoundError.js");

      const rentId = req.params.rentId;

      const rent = await db.rent.findFirst({ where: { id: rentId } });

      if (!rent?.id) throw new NotFoundError("Rent", rentId);

      await events.emit("rent.delete.before", rent.id, rent);

      await db.rent.delete({
        where: { id: rent.id },
      });

      await events.emit("rent.delete.after", rent.id, rent);

      res.locals["data"] = {};
      return next();
    }),
    respond,
  );

  return router;
}

import { NotFoundError } from "@/errors/NotFoundError.js";
import { ValidationError } from "@/errors/ValidationError.js";
import { NoFreeLockersError } from "@/modules/prepare-rent/NoFreeLockersError.js";

export async function start() {
  const events = await import("@/utils/events.js");

  await events.on("routes.before", async (app) => {
    const express = await import("express");
    const { respond } = await import("@/middlewares/respond/respond.js");
    const db = await import("@/utils/db.js").then((m) => m.getDb());
    const { route } = await import("@/utils/route.js");
    const router = express.Router();

    router.post(
      "/prepare-rent",
      route(async (req, res, next) => {
        await validate(req.body);

        const { bloqId, weight, size } = req.body;

        const bloq = await db.bloq.findFirst({
          where: { id: bloqId },
          include: { lockers: { where: { isOccupied: false } } },
        });

        if (!bloq?.id) throw new NotFoundError("Bloq", bloqId);

        const locker = bloq.lockers.at(0);
        if (!locker) throw new NoFreeLockersError();

        const rent = await db.$transaction(async (tx) => {
          const rent = await tx.rent.create({
            data: {
              lockerId: locker.id,
              weight,
              size,
              status: "WAITING_DROPOFF",
            },
          });

          await tx.locker.update({ where: { id: locker.id }, data: { isOccupied: true } });

          return rent;
        });

        res.locals["data"] = rent;
        return next();
      }),
      respond,
    );

    app.use(router);
  });
}

async function validate(body: { lockerId: string; weight: string; size: string }) {
  const validator = await import("validator").then((m) => m.default);

  if (!validator.isUUID(body.lockerId, "4")) throw new ValidationError("lockerId", "uuid");

  if (!(Number(body.weight) > 0)) throw new ValidationError("weight", "number greater than zero");

  const sizes = ["XS", "S", "M", "L", "XL"];
  if (!validator.isIn(String(body.size), sizes))
    throw new ValidationError("size", sizes.toString());
}

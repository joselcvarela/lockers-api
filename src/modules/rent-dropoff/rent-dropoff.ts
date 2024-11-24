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
      "/rent-dropoff",
      route(async (req, res, next) => {
        await validate(req.body);

        const { rentId } = req.body;

        const rent = await db.rent.findFirst({
          where: { id: rentId },
          include: { locker: true },
        });

        if (!rent?.id) throw new NotFoundError("Rent", rentId);
        if (!rent.locker?.isOccupied) throw new NoFreeLockersError();

        const updatedRent = await db.$transaction(async (tx) => {
          const updatedRent = await tx.rent.update({
            where: { id: rent.id },
            data: { status: "WAITING_PICKUP" },
          });

          await tx.locker.update({ where: { id: rent.locker!.id }, data: { isOccupied: true } });

          return updatedRent;
        });

        res.locals["data"] = updatedRent;
        return next();
      }),
      respond,
    );

    app.use(router);
  });
}

async function validate(body: { rentId: string }) {
  const validator = await import("validator").then((m) => m.default);

  if (!validator.isUUID(body.rentId, "4")) throw new ValidationError("rentId", "uuid");
}

export async function start() {
  const events = await import("@/utils/events.js");
  const { HttpError } = await import("@/errors/HttpError.js");

  await events.on("rent.update.before", async (id, data, tx) => {
    if (data.status) {
      const status = ["CREATED", "WAITING_DROPOFF", "WAITING_PICKUP", "DELIVERED"];

      const existent = await tx.rent.findFirst({ where: { id }, include: { locker: true } });
      const locker = existent?.locker;

      const indexExistentStatus = status.indexOf(existent?.status || "");
      const indexNewStatus = status.indexOf(String(data.status || ""));

      if (indexNewStatus < indexExistentStatus) {
        throw new HttpError(`Cannot move "Rent" to "${data.status}"`, 400);
      }

      if (data.status === "WAITING_DROPOFF" && locker?.id) {
        if (locker.isOccupied)
          throw new HttpError("Cannot allocate Locker as it is already occupied", 409);

        await tx.locker.update({ where: { id: locker.id }, data: { isOccupied: true } });
      }
    }
  });
}

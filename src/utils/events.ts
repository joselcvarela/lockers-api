import { type ListenerFn, type EventEmitter2 } from "eventemitter2";
import { type Express } from "express";
import { type Prisma } from "@prisma/client";

const getEmitter = (function () {
  let emitter: EventEmitter2;

  return async function () {
    if (!emitter) {
      const { EventEmitter2 } = (await import("eventemitter2")).default;
      emitter = new EventEmitter2();
    }

    return emitter;
  };
})();

export async function emit(event: "middlewares.before", app: Express): Promise<void>;
export async function emit(event: "middlewares.after", app: Express): Promise<void>;
export async function emit(event: "routes.before", app: Express): Promise<void>;
export async function emit(event: "routes.after", app: Express): Promise<void>;
export async function emit(
  event: "bloq.create.before",
  bloq: Prisma.BloqUpdateInput,
): Promise<void>;
export async function emit(
  event: "bloq.create.after",
  id: string,
  bloq: Prisma.BloqUpdateInput,
): Promise<void>;
export async function emit(
  event: "bloq.update.before",
  id: string,
  bloq: Prisma.BloqUpdateInput,
): Promise<void>;
export async function emit(
  event: "bloq.update.after",
  id: string,
  bloq: Prisma.BloqUpdateInput,
): Promise<void>;
export async function emit(
  event: "bloq.delete.before",
  id: string,
  bloq: Prisma.BloqUpdateInput,
): Promise<void>;
export async function emit(
  event: "bloq.delete.after",
  id: string,
  bloq: Prisma.BloqUpdateInput,
): Promise<void>;
export async function emit(
  event: "locker.create.before",
  locker: Prisma.LockerUpdateInput,
): Promise<void>;
export async function emit(
  event: "locker.create.after",
  id: string,
  locker: Prisma.LockerUpdateInput,
): Promise<void>;
export async function emit(
  event: "locker.update.before",
  id: string,
  locker: Prisma.LockerUpdateInput,
): Promise<void>;
export async function emit(
  event: "locker.update.after",
  id: string,
  locker: Prisma.LockerUpdateInput,
): Promise<void>;
export async function emit(
  event: "locker.delete.before",
  id: string,
  locker: Prisma.LockerUpdateInput,
): Promise<void>;
export async function emit(
  event: "locker.delete.after",
  id: string,
  locker: Prisma.LockerUpdateInput,
): Promise<void>;
export async function emit(
  event: "rent.create.before",
  rent: Prisma.RentUpdateInput,
): Promise<void>;
export async function emit(
  event: "rent.create.after",
  id: string,
  rent: Prisma.RentUpdateInput,
): Promise<void>;
export async function emit(
  event: "rent.update.before",
  id: string,
  rent: Prisma.RentUpdateInput,
): Promise<void>;
export async function emit(
  event: "rent.update.after",
  id: string,
  rent: Prisma.RentUpdateInput,
): Promise<void>;
export async function emit(
  event: "rent.delete.before",
  id: string,
  rent: Prisma.RentUpdateInput,
): Promise<void>;
export async function emit(
  event: "rent.delete.after",
  id: string,
  rent: Prisma.RentUpdateInput,
): Promise<void>;
export async function emit(event: string, ...args: any[]) {
  const emitter = await getEmitter();
  await emitter.emitAsync(event, ...args);
}

export async function on(
  event: "middlewares.before",
  listener: (app: Express) => Promise<void>,
): Promise<void>;
export async function on(
  event: "middlewares.after",
  listener: (app: Express) => Promise<void>,
): Promise<void>;
export async function on(
  event: "routes.before",
  listener: (app: Express) => Promise<void>,
): Promise<void>;
export async function on(
  event: "routes.after",
  listener: (app: Express) => Promise<void>,
): Promise<void>;
export async function on(
  event: "bloq.create.before",
  listener: (bloq: Prisma.BloqUpdateInput) => Promise<void>,
): Promise<void>;
export async function on(
  event: "bloq.create.after",
  listener: (id: string, bloq: Prisma.BloqUpdateInput) => Promise<void>,
): Promise<void>;
export async function on(
  event: "bloq.update.before",
  listener: (id: string, bloq: Prisma.BloqUpdateInput) => Promise<void>,
): Promise<void>;
export async function on(
  event: "bloq.update.after",
  listener: (id: string, bloq: Prisma.BloqUpdateInput) => Promise<void>,
): Promise<void>;
export async function on(
  event: "bloq.delete.before",
  listener: (id: string, bloq: Prisma.BloqUpdateInput) => Promise<void>,
): Promise<void>;
export async function on(
  event: "bloq.delete.after",
  listener: (id: string, bloq: Prisma.BloqUpdateInput) => Promise<void>,
): Promise<void>;
export async function on(
  event: "locker.create.before",
  listener: (locker: Prisma.LockerUpdateInput) => Promise<void>,
): Promise<void>;
export async function on(
  event: "locker.create.after",
  listener: (id: string, locker: Prisma.LockerUpdateInput) => Promise<void>,
): Promise<void>;
export async function on(
  event: "locker.update.before",
  listener: (id: string, locker: Prisma.LockerUpdateInput) => Promise<void>,
): Promise<void>;
export async function on(
  event: "locker.update.after",
  listener: (id: string, locker: Prisma.LockerUpdateInput) => Promise<void>,
): Promise<void>;
export async function on(
  event: "locker.delete.before",
  listener: (id: string, locker: Prisma.LockerUpdateInput) => Promise<void>,
): Promise<void>;
export async function on(
  event: "locker.delete.after",
  listener: (id: string, locker: Prisma.LockerUpdateInput) => Promise<void>,
): Promise<void>;
export async function on(
  event: "rent.create.before",
  listener: (rent: Prisma.RentUpdateInput) => Promise<void>,
): Promise<void>;
export async function on(
  event: "rent.create.after",
  listener: (id: string, rent: Prisma.RentUpdateInput) => Promise<void>,
): Promise<void>;
export async function on(
  event: "rent.update.before",
  listener: (id: string, rent: Prisma.RentUpdateInput) => Promise<void>,
): Promise<void>;
export async function on(
  event: "rent.update.after",
  listener: (id: string, rent: Prisma.RentUpdateInput) => Promise<void>,
): Promise<void>;
export async function on(
  event: "rent.delete.before",
  listener: (id: string, rent: Prisma.RentUpdateInput) => Promise<void>,
): Promise<void>;
export async function on(
  event: "rent.delete.after",
  listener: (id: string, rent: Prisma.RentUpdateInput) => Promise<void>,
): Promise<void>;
export async function on(event: string, listener: ListenerFn) {
  const emitter = await getEmitter();
  emitter.on(event, listener);
}

export async function off(event: string, listener: ListenerFn) {
  const emitter = await getEmitter();
  emitter.off(event, listener);
}

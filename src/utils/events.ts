import { type ListenerFn, type EventEmitter2 } from "eventemitter2";
import { type Express } from "express";

const getEmitter = (function () {
  let emitter: EventEmitter2;

  return async function () {
    if (!emitter) {
      emitter = new (await import("eventemitter2")).EventEmitter2();
    }

    return emitter;
  };
})();

export async function emit(event: "middlewares.before", app: Express): Promise<void>;
export async function emit(event: "middlewares.after", app: Express): Promise<void>;
export async function emit(event: "routes", app: Express): Promise<void>;
export async function emit(event: string, ...args: any[]) {
  const emitter = await getEmitter();
  emitter.emit(event, ...args);
}

export async function on(
  event: "middlewares.before",
  listener: (app: Express) => Promise<void>,
): Promise<void>;
export async function on(
  event: "middlewares.after",
  listener: (app: Express) => Promise<void>,
): Promise<void>;
export async function on(event: "routes", listener: (app: Express) => Promise<void>): Promise<void>;
export async function on(event: string, listener: ListenerFn) {
  const emitter = await getEmitter();
  emitter.on(event, listener);
}

export async function off(event: string, listener: ListenerFn) {
  const emitter = await getEmitter();
  emitter.off(event, listener);
}

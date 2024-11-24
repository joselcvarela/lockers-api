import { type ListenerFn } from "eventemitter2";
import { type Express } from "express";

export async function events() {
  const emitter = new (await import("eventemitter2")).EventEmitter2();

  return { emit, on, off };

  async function emit(event: "middlewares.before", app: Express): Promise<void>;
  async function emit(event: "middlewares.after", app: Express): Promise<void>;
  async function emit(event: "routes", app: Express): Promise<void>;
  async function emit(event: string, ...args: any[]) {
    emitter.emit(event, ...args);
  }

  async function on(
    event: "middlewares.before",
    listener: (app: Express) => Promise<void>,
  ): Promise<void>;
  async function on(
    event: "middlewares.after",
    listener: (app: Express) => Promise<void>,
  ): Promise<void>;
  async function on(event: "routes", listener: (app: Express) => Promise<void>): Promise<void>;
  async function on(event: string, listener: ListenerFn) {
    emitter.on(event, listener);
  }

  async function off(event: string, listener: ListenerFn) {
    emitter.off(event, listener);
  }
}

import { type Express } from "express";
import { vi, expect, test, beforeEach } from "vitest";
import { events } from "@/utils/events.js";

beforeEach(() => {
  vi.resetAllMocks();
});

test("listen and receive data sent by emit", () => {
  return new Promise(async (done) => {
    const event = await events();
    const expected = {} as Express;

    event.on("middlewares.before", async (received) => {
      expect(received).toBe(expected);
      done(true);
    });

    event.emit("middlewares.before", expected);
  });
});

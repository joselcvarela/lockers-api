import { type Express } from "express";
import { vi, expect, test, beforeEach } from "vitest";
import * as events from "@/utils/events.js";

beforeEach(() => {
  vi.resetAllMocks();
});

test("listen and receive data sent by emit", () => {
  return new Promise(async (done) => {
    const expected = {} as Express;

    await events.on("middlewares.before", async (received) => {
      expect(received).toBe(expected);
      done(true);
    });

    await events.emit("middlewares.before", expected);
  });
});

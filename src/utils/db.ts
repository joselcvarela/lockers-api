import { type PrismaClient } from "@prisma/client";

export const getDb = (function () {
  let db: PrismaClient;

  return async function () {
    if (!db) {
      const { PrismaClient } = await import("@prisma/client");
      const config = await import("@/utils/config.js").then((m) => m.config());

      db = new PrismaClient({
        log: [config.server.production ? "warn" : "query"],
      });
    }

    return db;
  };
})();

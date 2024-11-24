type Level = "info" | "warn" | "error";

const getLogger = (function () {
  let logger: Console;

  return async function () {
    if (!logger) {
      logger = console;
    }

    return logger;
  };
})();

export async function logger(message: string, status: Level = "info") {
  const log = await getLogger();
  await log[status](message);
}

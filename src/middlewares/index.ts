export async function start() {
  await import("@/middlewares/body-parser/body-parser.js").then((m) => m.start());
  await import("@/middlewares/not-found/not-found.js").then((m) => m.start());
  await import("@/middlewares/handle-error/handle-error.js").then((m) => m.start());
}

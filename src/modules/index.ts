export async function start() {
  await import("@/modules/prepare-rent/prepare-rent.js").then((m) => m.start());
}

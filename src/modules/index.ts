export async function start() {
  await import("@/modules/prepare-rent/prepare-rent.js").then((m) => m.start());
  await import("@/modules/rent-dropoff/rent-dropoff.js").then((m) => m.start());
}

import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

async function start() {
  const [bloq, locker, rent] = await Promise.all([
    import("./bloq.json").then((m) => m.default),
    import("./locker.json").then((m) => m.default),
    import("./rent.json").then((m) => m.default),
  ]);

  return prisma.$transaction(async (tx) => {
    for (const { id, ...rest } of bloq) {
      await tx.bloq.upsert({
        where: { id },
        update: rest as Prisma.BloqUpdateInput,
        create: { id, ...rest } as Prisma.BloqUncheckedCreateInput,
      });
    }

    for (const { id, ...rest } of locker) {
      await tx.locker.upsert({
        where: { id },
        update: rest as Prisma.LockerUpdateInput,
        create: { id, ...rest } as Prisma.LockerUncheckedCreateInput,
      });
    }

    for (const { id, ...rest } of rent) {
      await tx.rent.upsert({
        where: { id },
        update: rest as Prisma.RentUpdateInput,
        create: { id, ...rest } as Prisma.RentUncheckedCreateInput,
      });
    }
  });
}

start()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

-- CreateEnum
CREATE TYPE "RentSize" AS ENUM ('XS', 'S', 'M', 'L', 'XL');

-- CreateEnum
CREATE TYPE "RentStatus" AS ENUM ('CREATED', 'WAITING_DROPOFF', 'WAITING_PICKUP', 'DELIVERED');

-- CreateEnum
CREATE TYPE "LockerStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateTable
CREATE TABLE "Rent" (
    "id" UUID NOT NULL,
    "lockerId" UUID NOT NULL,
    "weight" INTEGER NOT NULL,
    "size" "RentSize" NOT NULL,
    "status" "RentStatus" NOT NULL,

    CONSTRAINT "Rent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Locker" (
    "id" UUID NOT NULL,
    "bloqId" UUID NOT NULL,
    "status" "LockerStatus" NOT NULL,
    "isOccupied" BOOLEAN NOT NULL,

    CONSTRAINT "Locker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bloq" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Bloq_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Rent" ADD CONSTRAINT "Rent_lockerId_fkey" FOREIGN KEY ("lockerId") REFERENCES "Locker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Locker" ADD CONSTRAINT "Locker_bloqId_fkey" FOREIGN KEY ("bloqId") REFERENCES "Bloq"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

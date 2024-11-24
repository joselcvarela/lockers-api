-- DropForeignKey
ALTER TABLE "Rent" DROP CONSTRAINT "Rent_lockerId_fkey";

-- AlterTable
ALTER TABLE "Rent" ALTER COLUMN "lockerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Rent" ADD CONSTRAINT "Rent_lockerId_fkey" FOREIGN KEY ("lockerId") REFERENCES "Locker"("id") ON DELETE SET NULL ON UPDATE CASCADE;

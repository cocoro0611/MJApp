/*
  Warnings:

  - You are about to drop the column `chipCount` on the `Chip` table. All the data in the column will be lost.
  - You are about to drop the column `roomId` on the `Chip` table. All the data in the column will be lost.
  - The primary key for the `RoomUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `order` on the `RoomUser` table. All the data in the column will be lost.
  - You are about to drop the column `gameCount` on the `Score` table. All the data in the column will be lost.
  - You are about to drop the column `roomId` on the `Score` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[roomId,userId]` on the table `RoomUser` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userOrder` to the `RoomUser` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Chip" DROP CONSTRAINT "Chip_roomId_fkey";

-- DropForeignKey
ALTER TABLE "Score" DROP CONSTRAINT "Score_roomId_fkey";

-- DropIndex
DROP INDEX "RoomUser_userId_roomId_key";

-- AlterTable
ALTER TABLE "Chip" DROP COLUMN "chipCount",
DROP COLUMN "roomId";

-- AlterTable
ALTER TABLE "RoomUser" DROP CONSTRAINT "RoomUser_pkey",
DROP COLUMN "order",
ADD COLUMN     "userOrder" INTEGER NOT NULL,
ADD CONSTRAINT "RoomUser_pkey" PRIMARY KEY ("roomId", "userId");

-- AlterTable
ALTER TABLE "Score" DROP COLUMN "gameCount",
DROP COLUMN "roomId";

-- CreateTable
CREATE TABLE "RoomScore" (
    "roomId" UUID NOT NULL,
    "scoreId" UUID NOT NULL,
    "scoreOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoomScore_pkey" PRIMARY KEY ("roomId","scoreId")
);

-- CreateTable
CREATE TABLE "RoomChip" (
    "roomId" UUID NOT NULL,
    "chipId" UUID NOT NULL,
    "chipOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoomChip_pkey" PRIMARY KEY ("roomId","chipId")
);

-- CreateIndex
CREATE UNIQUE INDEX "RoomScore_roomId_scoreId_key" ON "RoomScore"("roomId", "scoreId");

-- CreateIndex
CREATE UNIQUE INDEX "RoomChip_roomId_chipId_key" ON "RoomChip"("roomId", "chipId");

-- CreateIndex
CREATE UNIQUE INDEX "RoomUser_roomId_userId_key" ON "RoomUser"("roomId", "userId");

-- AddForeignKey
ALTER TABLE "RoomScore" ADD CONSTRAINT "RoomScore_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomScore" ADD CONSTRAINT "RoomScore_scoreId_fkey" FOREIGN KEY ("scoreId") REFERENCES "Score"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomChip" ADD CONSTRAINT "RoomChip_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomChip" ADD CONSTRAINT "RoomChip_chipId_fkey" FOREIGN KEY ("chipId") REFERENCES "Chip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

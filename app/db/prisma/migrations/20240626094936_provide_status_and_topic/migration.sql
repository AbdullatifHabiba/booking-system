/*
  Warnings:

  - Added the required column `status` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topic` to the `Meeting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Meeting" ADD COLUMN     "topic" TEXT NOT NULL;

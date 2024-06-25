/*
  Warnings:

  - A unique constraint covering the columns `[meetingId]` on the table `Meeting` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bookingId` to the `Meeting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "zoomMeetingId" TEXT;

-- AlterTable
ALTER TABLE "Meeting" ADD COLUMN     "bookingId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Meeting_meetingId_key" ON "Meeting"("meetingId");

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

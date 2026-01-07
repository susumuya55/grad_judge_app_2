/*
  Warnings:

  - You are about to drop the column `room_session_id` on the `grad_judge_data` table. All the data in the column will be lost.
  - You are about to drop the `hosts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `room_participants` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `room_sessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rooms` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "grad_judge_data" DROP CONSTRAINT "grad_judge_data_room_session_id_fkey";

-- DropForeignKey
ALTER TABLE "room_participants" DROP CONSTRAINT "room_participants_room_id_fkey";

-- DropForeignKey
ALTER TABLE "room_sessions" DROP CONSTRAINT "room_sessions_participant_id_fkey";

-- DropForeignKey
ALTER TABLE "rooms" DROP CONSTRAINT "rooms_host_id_fkey";

-- AlterTable
ALTER TABLE "grad_judge_data" DROP COLUMN "room_session_id";

-- DropTable
DROP TABLE "hosts";

-- DropTable
DROP TABLE "room_participants";

-- DropTable
DROP TABLE "room_sessions";

-- DropTable
DROP TABLE "rooms";

-- DropEnum
DROP TYPE "RoomStatus";

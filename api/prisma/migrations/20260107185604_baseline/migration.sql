/*
  Warnings:

  - The `status` column on the `rooms` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "RoomStatus" AS ENUM ('OPEN', 'CLOSED', 'EXPIRED');

-- AlterTable
ALTER TABLE "rooms" DROP COLUMN "status",
ADD COLUMN     "status" "RoomStatus" NOT NULL DEFAULT 'OPEN';

-- CreateTable
CREATE TABLE "hosts" (
    "id" BIGSERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hosts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_participants" (
    "id" BIGSERIAL NOT NULL,
    "room_id" BIGINT NOT NULL,
    "student_id" TEXT NOT NULL,
    "sended" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "room_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_sessions" (
    "id" TEXT NOT NULL,
    "participant_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "room_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grad_judge_data" (
    "id" BIGSERIAL NOT NULL,
    "room_session_id" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "grad_judge_data_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "hosts_email_key" ON "hosts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "room_participants_room_id_student_id_key" ON "room_participants"("room_id", "student_id");

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_host_id_fkey" FOREIGN KEY ("host_id") REFERENCES "hosts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_participants" ADD CONSTRAINT "room_participants_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_sessions" ADD CONSTRAINT "room_sessions_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "room_participants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grad_judge_data" ADD CONSTRAINT "grad_judge_data_room_session_id_fkey" FOREIGN KEY ("room_session_id") REFERENCES "room_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

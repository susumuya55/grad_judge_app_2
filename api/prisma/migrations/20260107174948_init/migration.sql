-- CreateTable
CREATE TABLE "rooms" (
    "id" BIGSERIAL NOT NULL,
    "public_id" TEXT NOT NULL,
    "host_id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "enter_token" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rooms_public_id_key" ON "rooms"("public_id");

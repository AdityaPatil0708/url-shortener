-- CreateTable
CREATE TABLE "Url" (
    "id" SERIAL NOT NULL,
    "original_url" TEXT NOT NULL,
    "short_url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Url_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Url_original_url_key" ON "Url"("original_url");

-- CreateIndex
CREATE UNIQUE INDEX "Url_short_url_key" ON "Url"("short_url");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

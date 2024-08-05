/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cpf` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'cliente');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "cpf" TEXT NOT NULL,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'cliente';

-- CreateIndex
CREATE UNIQUE INDEX "users_cpf_key" ON "users"("cpf");

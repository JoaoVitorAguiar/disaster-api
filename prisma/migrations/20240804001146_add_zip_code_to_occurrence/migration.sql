/*
  Warnings:

  - Added the required column `zipCode` to the `occurrences` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "occurrences" ADD COLUMN     "zipCode" TEXT NOT NULL;

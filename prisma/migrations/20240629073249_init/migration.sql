/*
  Warnings:

  - Added the required column `time` to the `cita` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cita" ADD COLUMN     "time" TEXT NOT NULL;

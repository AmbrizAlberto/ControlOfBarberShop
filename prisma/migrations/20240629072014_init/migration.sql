/*
  Warnings:

  - You are about to drop the column `service` on the `cita` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[date,services,clientName]` on the table `cita` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "cita_date_service_clientName_key";

-- AlterTable
ALTER TABLE "cita" DROP COLUMN "service",
ADD COLUMN     "services" TEXT[],
ADD COLUMN     "specificServices" TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "cita_date_services_clientName_key" ON "cita"("date", "services", "clientName");

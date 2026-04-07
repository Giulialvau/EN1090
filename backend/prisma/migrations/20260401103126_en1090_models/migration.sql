/*
  Warnings:

  - The primary key for the `Checklist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `allegati` on the `Checklist` table. All the data in the column will be lost.
  - You are about to drop the column `categoria` on the `Checklist` table. All the data in the column will be lost.
  - You are about to drop the column `dataCompilazione` on the `Checklist` table. All the data in the column will be lost.
  - You are about to drop the column `elementi` on the `Checklist` table. All the data in the column will be lost.
  - You are about to drop the column `fase` on the `Checklist` table. All the data in the column will be lost.
  - You are about to drop the column `operatore` on the `Checklist` table. All the data in the column will be lost.
  - You are about to drop the column `titolo` on the `Checklist` table. All the data in the column will be lost.
  - The `id` column on the `Checklist` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Commessa` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `codice` on the `Commessa` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Commessa` table. All the data in the column will be lost.
  - You are about to drop the column `dataFine` on the `Commessa` table. All the data in the column will be lost.
  - You are about to drop the column `dataInizio` on the `Commessa` table. All the data in the column will be lost.
  - You are about to drop the column `luogo` on the `Commessa` table. All the data in the column will be lost.
  - You are about to drop the column `note` on the `Commessa` table. All the data in the column will be lost.
  - You are about to drop the column `responsabile` on the `Commessa` table. All the data in the column will be lost.
  - You are about to drop the column `stato` on the `Commessa` table. All the data in the column will be lost.
  - You are about to drop the column `titolo` on the `Commessa` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Commessa` table. All the data in the column will be lost.
  - The `id` column on the `Commessa` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Materiale` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `certificato31` on the `Materiale` table. All the data in the column will be lost.
  - You are about to drop the column `certificatoDocumentoId` on the `Materiale` table. All the data in the column will be lost.
  - You are about to drop the column `codice` on the `Materiale` table. All the data in the column will be lost.
  - You are about to drop the column `dataCarico` on the `Materiale` table. All the data in the column will be lost.
  - You are about to drop the column `descrizione` on the `Materiale` table. All the data in the column will be lost.
  - You are about to drop the column `fornitore` on the `Materiale` table. All the data in the column will be lost.
  - The `id` column on the `Materiale` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Attrezzatura` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Audit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Documento` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NonConformita` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PianoControllo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Qualifica` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tracciabilita` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Wpqr` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Wps` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `tipo` to the `Checklist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `esito` to the `Checklist` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `stato` on the `Checklist` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `commessaId` to the `Checklist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `exc` to the `Commessa` table without a default value. This is not possible if the table is not empty.
  - Made the column `descrizione` on table `Commessa` required. This step will fail if there are existing NULL values in that column.
  - Made the column `tipo` on table `Materiale` required. This step will fail if there are existing NULL values in that column.
  - Made the column `norma` on table `Materiale` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `commessaId` on the `Materiale` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Audit" DROP CONSTRAINT "Audit_commessaId_fkey";

-- DropForeignKey
ALTER TABLE "Checklist" DROP CONSTRAINT "Checklist_commessaId_fkey";

-- DropForeignKey
ALTER TABLE "Documento" DROP CONSTRAINT "Documento_commessaId_fkey";

-- DropForeignKey
ALTER TABLE "Materiale" DROP CONSTRAINT "Materiale_certificatoDocumentoId_fkey";

-- DropForeignKey
ALTER TABLE "Materiale" DROP CONSTRAINT "Materiale_commessaId_fkey";

-- DropForeignKey
ALTER TABLE "NonConformita" DROP CONSTRAINT "NonConformita_commessaId_fkey";

-- DropForeignKey
ALTER TABLE "PianoControllo" DROP CONSTRAINT "PianoControllo_commessaId_fkey";

-- DropForeignKey
ALTER TABLE "Tracciabilita" DROP CONSTRAINT "Tracciabilita_commessaId_fkey";

-- DropForeignKey
ALTER TABLE "Tracciabilita" DROP CONSTRAINT "Tracciabilita_materialeId_fkey";

-- DropForeignKey
ALTER TABLE "Wpqr" DROP CONSTRAINT "Wpqr_commessaId_fkey";

-- DropForeignKey
ALTER TABLE "Wpqr" DROP CONSTRAINT "Wpqr_qualificaId_fkey";

-- DropForeignKey
ALTER TABLE "Wpqr" DROP CONSTRAINT "Wpqr_wpsId_fkey";

-- DropForeignKey
ALTER TABLE "Wps" DROP CONSTRAINT "Wps_commessaId_fkey";

-- DropForeignKey
ALTER TABLE "Wps" DROP CONSTRAINT "Wps_materialeId_fkey";

-- DropIndex
DROP INDEX "Checklist_commessaId_idx";

-- DropIndex
DROP INDEX "Commessa_codice_key";

-- DropIndex
DROP INDEX "Materiale_certificatoDocumentoId_idx";

-- DropIndex
DROP INDEX "Materiale_commessaId_codice_key";

-- DropIndex
DROP INDEX "Materiale_commessaId_idx";

-- AlterTable
ALTER TABLE "Checklist" DROP CONSTRAINT "Checklist_pkey",
DROP COLUMN "allegati",
DROP COLUMN "categoria",
DROP COLUMN "dataCompilazione",
DROP COLUMN "elementi",
DROP COLUMN "fase",
DROP COLUMN "operatore",
DROP COLUMN "titolo",
ADD COLUMN     "tipo" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "esito",
ADD COLUMN     "esito" TEXT NOT NULL,
DROP COLUMN "stato",
ADD COLUMN     "stato" TEXT NOT NULL,
DROP COLUMN "commessaId",
ADD COLUMN     "commessaId" INTEGER NOT NULL,
ADD CONSTRAINT "Checklist_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Commessa" DROP CONSTRAINT "Commessa_pkey",
DROP COLUMN "codice",
DROP COLUMN "createdAt",
DROP COLUMN "dataFine",
DROP COLUMN "dataInizio",
DROP COLUMN "luogo",
DROP COLUMN "note",
DROP COLUMN "responsabile",
DROP COLUMN "stato",
DROP COLUMN "titolo",
DROP COLUMN "updatedAt",
ADD COLUMN     "dataApertura" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "exc" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "descrizione" SET NOT NULL,
ADD CONSTRAINT "Commessa_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Materiale" DROP CONSTRAINT "Materiale_pkey",
DROP COLUMN "certificato31",
DROP COLUMN "certificatoDocumentoId",
DROP COLUMN "codice",
DROP COLUMN "dataCarico",
DROP COLUMN "descrizione",
DROP COLUMN "fornitore",
ADD COLUMN     "certificato" TEXT,
ADD COLUMN     "heatNumber" TEXT,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "tipo" SET NOT NULL,
ALTER COLUMN "norma" SET NOT NULL,
DROP COLUMN "commessaId",
ADD COLUMN     "commessaId" INTEGER NOT NULL,
ADD CONSTRAINT "Materiale_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "Attrezzatura";

-- DropTable
DROP TABLE "Audit";

-- DropTable
DROP TABLE "Documento";

-- DropTable
DROP TABLE "NonConformita";

-- DropTable
DROP TABLE "PianoControllo";

-- DropTable
DROP TABLE "Qualifica";

-- DropTable
DROP TABLE "Tracciabilita";

-- DropTable
DROP TABLE "Wpqr";

-- DropTable
DROP TABLE "Wps";

-- DropEnum
DROP TYPE "AuditEsito";

-- DropEnum
DROP TYPE "ChecklistEsito";

-- DropEnum
DROP TYPE "ChecklistStato";

-- DropEnum
DROP TYPE "CommessaStato";

-- DropEnum
DROP TYPE "DocumentoStatoApprovazione";

-- DropEnum
DROP TYPE "NcGravita";

-- DropEnum
DROP TYPE "NcStato";

-- DropEnum
DROP TYPE "NcTipo";

-- DropEnum
DROP TYPE "PianoControlloEsito";

-- CreateTable
CREATE TABLE "Processo" (
    "id" SERIAL NOT NULL,
    "commessaId" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,

    CONSTRAINT "Processo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NCR" (
    "id" SERIAL NOT NULL,
    "commessaId" INTEGER NOT NULL,
    "descrizione" TEXT NOT NULL,
    "causa" TEXT,
    "azione" TEXT,
    "stato" TEXT NOT NULL,

    CONSTRAINT "NCR_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Materiale" ADD CONSTRAINT "Materiale_commessaId_fkey" FOREIGN KEY ("commessaId") REFERENCES "Commessa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Processo" ADD CONSTRAINT "Processo_commessaId_fkey" FOREIGN KEY ("commessaId") REFERENCES "Commessa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checklist" ADD CONSTRAINT "Checklist_commessaId_fkey" FOREIGN KEY ("commessaId") REFERENCES "Commessa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NCR" ADD CONSTRAINT "NCR_commessaId_fkey" FOREIGN KEY ("commessaId") REFERENCES "Commessa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

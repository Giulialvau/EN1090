/*
  Warnings:

  - You are about to drop the column `tipo` on the `Checklist` table. All the data in the column will be lost.
  - The `esito` column on the `Checklist` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `stato` column on the `Checklist` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `certificato` on the `Materiale` table. All the data in the column will be lost.
  - You are about to drop the `NCR` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[codice]` on the table `Commessa` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[commessaId,codice]` on the table `Materiale` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoria` to the `Checklist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `elementi` to the `Checklist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titolo` to the `Checklist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `codice` to the `Commessa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Commessa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `codice` to the `Materiale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descrizione` to the `Materiale` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `tipo` on the `Processo` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "CommessaStato" AS ENUM ('BOZZA', 'IN_CORSO', 'SOSPESA', 'CHIUSA');

-- CreateEnum
CREATE TYPE "DocumentoStatoApprovazione" AS ENUM ('BOZZA', 'IN_REVISIONE', 'APPROVATO', 'RESPINTO');

-- CreateEnum
CREATE TYPE "ChecklistStato" AS ENUM ('APERTA', 'IN_CORSO', 'COMPLETATA', 'ARCHIVIATA');

-- CreateEnum
CREATE TYPE "ChecklistEsito" AS ENUM ('CONFORME', 'NON_CONFORME', 'PARZIALE', 'NON_APPLICABILE');

-- CreateEnum
CREATE TYPE "NcTipo" AS ENUM ('INTERNA', 'ESTERNA', 'FORNITORE', 'PROCESSO');

-- CreateEnum
CREATE TYPE "NcGravita" AS ENUM ('BASSA', 'MEDIA', 'ALTA', 'CRITICA');

-- CreateEnum
CREATE TYPE "NcStato" AS ENUM ('APERTA', 'IN_ANALISI', 'IN_CORSO_AZIONI', 'CHIUSA');

-- CreateEnum
CREATE TYPE "AuditEsito" AS ENUM ('CONFORME', 'NON_CONFORME', 'PARZIALE');

-- CreateEnum
CREATE TYPE "PianoControlloEsito" AS ENUM ('IN_ATTESA', 'CONFORME', 'NON_CONFORME', 'NON_APPLICABILE');

-- CreateEnum
CREATE TYPE "ProcessoTipo" AS ENUM ('SALDATURA', 'TAGLIO_TERMICO', 'VERNICIATURA', 'ASSEMBLAGGIO', 'MONTAGGIO', 'TRATTAMENTO_SUPERFICIALE');

-- DropForeignKey
ALTER TABLE "Checklist" DROP CONSTRAINT "Checklist_commessaId_fkey";

-- DropForeignKey
ALTER TABLE "Materiale" DROP CONSTRAINT "Materiale_commessaId_fkey";

-- DropForeignKey
ALTER TABLE "NCR" DROP CONSTRAINT "NCR_commessaId_fkey";

-- DropForeignKey
ALTER TABLE "Processo" DROP CONSTRAINT "Processo_commessaId_fkey";

-- AlterTable
ALTER TABLE "Checklist" DROP COLUMN "tipo",
ADD COLUMN     "allegati" JSONB,
ADD COLUMN     "categoria" TEXT NOT NULL,
ADD COLUMN     "dataCompilazione" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "elementi" JSONB NOT NULL,
ADD COLUMN     "fase" TEXT,
ADD COLUMN     "operatore" TEXT,
ADD COLUMN     "titolo" TEXT NOT NULL,
DROP COLUMN "esito",
ADD COLUMN     "esito" "ChecklistEsito",
DROP COLUMN "stato",
ADD COLUMN     "stato" "ChecklistStato" NOT NULL DEFAULT 'APERTA';

-- AlterTable
ALTER TABLE "Commessa" ADD COLUMN     "codice" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dataFine" TIMESTAMP(3),
ADD COLUMN     "dataInizio" TIMESTAMP(3),
ADD COLUMN     "luogo" TEXT,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "responsabile" TEXT,
ADD COLUMN     "stato" "CommessaStato" NOT NULL DEFAULT 'BOZZA',
ADD COLUMN     "titolo" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "descrizione" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Materiale" DROP COLUMN "certificato",
ADD COLUMN     "certificato31" TEXT,
ADD COLUMN     "certificatoDocumentoId" INTEGER,
ADD COLUMN     "codice" TEXT NOT NULL,
ADD COLUMN     "dataCarico" TIMESTAMP(3),
ADD COLUMN     "descrizione" TEXT NOT NULL,
ADD COLUMN     "fornitore" TEXT,
ALTER COLUMN "tipo" DROP NOT NULL,
ALTER COLUMN "norma" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Processo" ADD COLUMN     "dataFine" TIMESTAMP(3),
ADD COLUMN     "dataInizio" TIMESTAMP(3),
ADD COLUMN     "descrizione" TEXT,
ADD COLUMN     "note" TEXT,
DROP COLUMN "tipo",
ADD COLUMN     "tipo" "ProcessoTipo" NOT NULL;

-- DropTable
DROP TABLE "NCR";

-- CreateTable
CREATE TABLE "NonConformita" (
    "id" SERIAL NOT NULL,
    "commessaId" INTEGER NOT NULL,
    "titolo" TEXT NOT NULL,
    "descrizione" TEXT NOT NULL,
    "tipo" "NcTipo" NOT NULL,
    "gravita" "NcGravita" NOT NULL,
    "stato" "NcStato" NOT NULL,
    "causa" TEXT,
    "azione" TEXT,
    "note" TEXT,
    "dataApertura" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataChiusura" TIMESTAMP(3),

    CONSTRAINT "NonConformita_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Documento" (
    "id" SERIAL NOT NULL,
    "commessaId" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "versione" TEXT NOT NULL,
    "percorsoFile" TEXT NOT NULL,
    "statoApprovazione" "DocumentoStatoApprovazione" NOT NULL DEFAULT 'BOZZA',
    "note" TEXT,
    "allegati" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Documento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Audit" (
    "id" SERIAL NOT NULL,
    "commessaId" INTEGER NOT NULL,
    "titolo" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "auditor" TEXT NOT NULL,
    "esito" "AuditEsito" NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Audit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attrezzatura" (
    "id" SERIAL NOT NULL,
    "commessaId" INTEGER,
    "nome" TEXT NOT NULL,
    "matricola" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "descrizione" TEXT,
    "dataManutenzione" TIMESTAMP(3),
    "dataTaratura" TIMESTAMP(3),
    "scadenza" TIMESTAMP(3),
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attrezzatura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PianoControllo" (
    "id" SERIAL NOT NULL,
    "commessaId" INTEGER NOT NULL,
    "fase" TEXT NOT NULL,
    "controlliRichiesti" JSONB NOT NULL,
    "esito" "PianoControlloEsito" NOT NULL DEFAULT 'IN_ATTESA',
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PianoControllo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wps" (
    "id" SERIAL NOT NULL,
    "commessaId" INTEGER,
    "codice" TEXT NOT NULL,
    "descrizione" TEXT,
    "processo" TEXT NOT NULL,
    "spessore" TEXT,
    "materialeBase" TEXT,
    "scadenza" TIMESTAMP(3),
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "materialeId" INTEGER,

    CONSTRAINT "Wps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wpqr" (
    "id" SERIAL NOT NULL,
    "commessaId" INTEGER,
    "codice" TEXT NOT NULL,
    "saldatore" TEXT NOT NULL,
    "wpsId" INTEGER NOT NULL,
    "dataQualifica" TIMESTAMP(3) NOT NULL,
    "scadenza" TIMESTAMP(3),
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wpqr_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tracciabilita" (
    "id" SERIAL NOT NULL,
    "commessaId" INTEGER NOT NULL,
    "materialeId" INTEGER NOT NULL,
    "posizione" TEXT NOT NULL,
    "quantita" DECIMAL(18,4) NOT NULL,
    "descrizioneComponente" TEXT,
    "riferimentoDisegno" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tracciabilita_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "NonConformita_commessaId_idx" ON "NonConformita"("commessaId");

-- CreateIndex
CREATE INDEX "Documento_commessaId_idx" ON "Documento"("commessaId");

-- CreateIndex
CREATE INDEX "Audit_commessaId_idx" ON "Audit"("commessaId");

-- CreateIndex
CREATE UNIQUE INDEX "Attrezzatura_matricola_key" ON "Attrezzatura"("matricola");

-- CreateIndex
CREATE INDEX "Attrezzatura_commessaId_idx" ON "Attrezzatura"("commessaId");

-- CreateIndex
CREATE INDEX "PianoControllo_commessaId_idx" ON "PianoControllo"("commessaId");

-- CreateIndex
CREATE UNIQUE INDEX "Wps_codice_key" ON "Wps"("codice");

-- CreateIndex
CREATE INDEX "Wps_commessaId_idx" ON "Wps"("commessaId");

-- CreateIndex
CREATE INDEX "Wps_materialeId_idx" ON "Wps"("materialeId");

-- CreateIndex
CREATE INDEX "Wpqr_wpsId_idx" ON "Wpqr"("wpsId");

-- CreateIndex
CREATE INDEX "Wpqr_commessaId_idx" ON "Wpqr"("commessaId");

-- CreateIndex
CREATE INDEX "Tracciabilita_commessaId_idx" ON "Tracciabilita"("commessaId");

-- CreateIndex
CREATE INDEX "Tracciabilita_materialeId_idx" ON "Tracciabilita"("materialeId");

-- CreateIndex
CREATE INDEX "Checklist_commessaId_idx" ON "Checklist"("commessaId");

-- CreateIndex
CREATE UNIQUE INDEX "Commessa_codice_key" ON "Commessa"("codice");

-- CreateIndex
CREATE INDEX "Materiale_commessaId_idx" ON "Materiale"("commessaId");

-- CreateIndex
CREATE INDEX "Materiale_certificatoDocumentoId_idx" ON "Materiale"("certificatoDocumentoId");

-- CreateIndex
CREATE UNIQUE INDEX "Materiale_commessaId_codice_key" ON "Materiale"("commessaId", "codice");

-- CreateIndex
CREATE INDEX "Processo_commessaId_idx" ON "Processo"("commessaId");

-- AddForeignKey
ALTER TABLE "Materiale" ADD CONSTRAINT "Materiale_certificatoDocumentoId_fkey" FOREIGN KEY ("certificatoDocumentoId") REFERENCES "Documento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Materiale" ADD CONSTRAINT "Materiale_commessaId_fkey" FOREIGN KEY ("commessaId") REFERENCES "Commessa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Processo" ADD CONSTRAINT "Processo_commessaId_fkey" FOREIGN KEY ("commessaId") REFERENCES "Commessa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checklist" ADD CONSTRAINT "Checklist_commessaId_fkey" FOREIGN KEY ("commessaId") REFERENCES "Commessa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NonConformita" ADD CONSTRAINT "NonConformita_commessaId_fkey" FOREIGN KEY ("commessaId") REFERENCES "Commessa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documento" ADD CONSTRAINT "Documento_commessaId_fkey" FOREIGN KEY ("commessaId") REFERENCES "Commessa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Audit" ADD CONSTRAINT "Audit_commessaId_fkey" FOREIGN KEY ("commessaId") REFERENCES "Commessa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attrezzatura" ADD CONSTRAINT "Attrezzatura_commessaId_fkey" FOREIGN KEY ("commessaId") REFERENCES "Commessa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PianoControllo" ADD CONSTRAINT "PianoControllo_commessaId_fkey" FOREIGN KEY ("commessaId") REFERENCES "Commessa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wps" ADD CONSTRAINT "Wps_commessaId_fkey" FOREIGN KEY ("commessaId") REFERENCES "Commessa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wps" ADD CONSTRAINT "Wps_materialeId_fkey" FOREIGN KEY ("materialeId") REFERENCES "Materiale"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wpqr" ADD CONSTRAINT "Wpqr_wpsId_fkey" FOREIGN KEY ("wpsId") REFERENCES "Wps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wpqr" ADD CONSTRAINT "Wpqr_commessaId_fkey" FOREIGN KEY ("commessaId") REFERENCES "Commessa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tracciabilita" ADD CONSTRAINT "Tracciabilita_commessaId_fkey" FOREIGN KEY ("commessaId") REFERENCES "Commessa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tracciabilita" ADD CONSTRAINT "Tracciabilita_materialeId_fkey" FOREIGN KEY ("materialeId") REFERENCES "Materiale"("id") ON DELETE CASCADE ON UPDATE CASCADE;

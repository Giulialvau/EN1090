-- CreateEnum
CREATE TYPE "En1090CommessaStato" AS ENUM ('aperta', 'chiusa');

-- CreateEnum
CREATE TYPE "En1090ModuloTipo" AS ENUM ('Mod04', 'Mod14', 'PFC');

-- CreateEnum
CREATE TYPE "En1090CeTipo" AS ENUM ('etichetta', 'marcatura');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Role" ADD VALUE 'SUPER_ADMIN';
ALTER TYPE "Role" ADD VALUE 'ADMIN_AZIENDA';
ALTER TYPE "Role" ADD VALUE 'RGQ';
ALTER TYPE "Role" ADD VALUE 'SALDATORE';
ALTER TYPE "Role" ADD VALUE 'COMMERCIALE';
ALTER TYPE "Role" ADD VALUE 'DIREZIONE';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "aziendaId" TEXT;

-- CreateTable
CREATE TABLE "Azienda" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "codice" TEXT NOT NULL,
    "piva" TEXT,
    "indirizzo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Azienda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "en1090_commesse" (
    "id" SERIAL NOT NULL,
    "aziendaId" TEXT NOT NULL,
    "codice" TEXT NOT NULL,
    "cliente" TEXT NOT NULL,
    "descrizione" TEXT,
    "exc" TEXT NOT NULL,
    "data_apertura" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_chiusura" TIMESTAMP(3),
    "stato" "En1090CommessaStato" NOT NULL DEFAULT 'aperta',
    "qrCodePath" TEXT,

    CONSTRAINT "en1090_commesse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "en1090_moduli" (
    "id" SERIAL NOT NULL,
    "aziendaId" TEXT NOT NULL,
    "commessa_id" INTEGER NOT NULL,
    "tipo" "En1090ModuloTipo" NOT NULL,
    "contenuto_json" JSONB NOT NULL,
    "markdown_path" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "en1090_moduli_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "en1090_dop" (
    "id" SERIAL NOT NULL,
    "aziendaId" TEXT NOT NULL,
    "commessa_id" INTEGER NOT NULL,
    "contenuto_markdown" TEXT NOT NULL,
    "pdf_path" TEXT,
    "autoGenerata" BOOLEAN NOT NULL DEFAULT false,
    "datiSorgente" JSONB,
    "stato" TEXT NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "en1090_dop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "en1090_ce" (
    "id" SERIAL NOT NULL,
    "aziendaId" TEXT NOT NULL,
    "commessa_id" INTEGER NOT NULL,
    "tipo" "En1090CeTipo" NOT NULL,
    "contenuto_markdown" TEXT NOT NULL,
    "pdf_path" TEXT,
    "autoGenerata" BOOLEAN NOT NULL DEFAULT false,
    "datiSorgente" JSONB,
    "stato" TEXT NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "en1090_ce_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "En1090Materiale" (
    "id" TEXT NOT NULL,
    "aziendaId" TEXT NOT NULL,
    "codice" TEXT NOT NULL,
    "descrizione" TEXT,
    "norma" TEXT,
    "certificatoPath" TEXT,
    "fornitore" TEXT,
    "lotto" TEXT,
    "colata" TEXT,
    "acciaio" TEXT,
    "analisiChimica" JSONB,
    "proprietaMeccaniche" JSONB,
    "qrCodePath" TEXT,
    "dataIngresso" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "En1090Materiale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "En1090CommessaMateriale" (
    "id" TEXT NOT NULL,
    "aziendaId" TEXT NOT NULL,
    "commessaId" INTEGER NOT NULL,
    "materialeId" TEXT NOT NULL,
    "quantita" DOUBLE PRECISION,
    "note" TEXT,

    CONSTRAINT "En1090CommessaMateriale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "En1090Saldatore" (
    "id" TEXT NOT NULL,
    "aziendaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "matricola" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "En1090Saldatore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "En1090Wpqr" (
    "id" TEXT NOT NULL,
    "aziendaId" TEXT NOT NULL,
    "codice" TEXT NOT NULL,
    "descrizione" TEXT,
    "certificatoPath" TEXT,
    "dataProva" TIMESTAMP(3),
    "dataScadenza" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "En1090Wpqr_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "En1090Wps" (
    "id" TEXT NOT NULL,
    "aziendaId" TEXT NOT NULL,
    "codice" TEXT NOT NULL,
    "descrizione" TEXT NOT NULL,
    "processo" TEXT,
    "spessoreMin" DOUBLE PRECISION,
    "spessoreMax" DOUBLE PRECISION,
    "posizione" TEXT,
    "materiale" TEXT,
    "wpqrId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "En1090Wps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "En1090QualificaSaldatore" (
    "id" TEXT NOT NULL,
    "aziendaId" TEXT NOT NULL,
    "saldatoreId" TEXT NOT NULL,
    "norma" TEXT NOT NULL,
    "processo" TEXT NOT NULL,
    "spessoreMin" DOUBLE PRECISION,
    "spessoreMax" DOUBLE PRECISION,
    "posizione" TEXT,
    "dataQualifica" TIMESTAMP(3),
    "dataScadenza" TIMESTAMP(3),
    "certificatoPath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "En1090QualificaSaldatore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "En1090Saldatura" (
    "id" TEXT NOT NULL,
    "aziendaId" TEXT NOT NULL,
    "commessaId" INTEGER NOT NULL,
    "saldatoreId" TEXT NOT NULL,
    "wpsId" TEXT NOT NULL,
    "giunto" TEXT NOT NULL,
    "materialeId" TEXT,
    "qrCodePath" TEXT,
    "fotoPath" TEXT,
    "firmaPath" TEXT,
    "qrScanData" JSONB,
    "dataSaldatura" TIMESTAMP(3) NOT NULL,
    "controlli" JSONB,
    "esito" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "En1090Saldatura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "En1090DocumentVersion" (
    "id" TEXT NOT NULL,
    "aziendaId" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "En1090DocumentVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "En1090VerificaSaldatura" (
    "id" TEXT NOT NULL,
    "aziendaId" TEXT NOT NULL,
    "commessaId" INTEGER NOT NULL,
    "saldaturaId" TEXT,
    "wpsId" TEXT,
    "materialeId" TEXT,
    "tipoGiunto" TEXT NOT NULL,
    "tipoSollecitazione" TEXT NOT NULL,
    "spessoreElemento" DOUBLE PRECISION,
    "golaEffettiva" DOUBLE PRECISION,
    "lunghezza" DOUBLE PRECISION,
    "forzaNormaleEd" DOUBLE PRECISION,
    "taglioParalleloEd" DOUBLE PRECISION,
    "taglioPerpendicolareEd" DOUBLE PRECISION,
    "momentoEd" DOUBLE PRECISION,
    "fvwk" DOUBLE PRECISION,
    "gammaM2" DOUBLE PRECISION,
    "betaW" DOUBLE PRECISION,
    "sigmaPerpEd" DOUBLE PRECISION,
    "tauParallelaEd" DOUBLE PRECISION,
    "tauPerpEd" DOUBLE PRECISION,
    "sigmaEqEd" DOUBLE PRECISION,
    "fvwRd" DOUBLE PRECISION,
    "golaMinimaRichiesta" DOUBLE PRECISION,
    "lunghezzaMinimaRichiesta" DOUBLE PRECISION,
    "esito" TEXT NOT NULL,
    "note" TEXT,
    "pdfPath" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "En1090VerificaSaldatura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "En1090Notifica" (
    "id" TEXT NOT NULL,
    "aziendaId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "messaggio" TEXT NOT NULL,
    "entityId" TEXT,
    "entityType" TEXT,
    "commessaId" INTEGER,
    "letta" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "En1090Notifica_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Azienda_codice_key" ON "Azienda"("codice");

-- CreateIndex
CREATE UNIQUE INDEX "en1090_commesse_codice_key" ON "en1090_commesse"("codice");

-- CreateIndex
CREATE UNIQUE INDEX "en1090_moduli_commessa_id_tipo_key" ON "en1090_moduli"("commessa_id", "tipo");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_aziendaId_fkey" FOREIGN KEY ("aziendaId") REFERENCES "Azienda"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "en1090_commesse" ADD CONSTRAINT "en1090_commesse_aziendaId_fkey" FOREIGN KEY ("aziendaId") REFERENCES "Azienda"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "en1090_moduli" ADD CONSTRAINT "en1090_moduli_aziendaId_fkey" FOREIGN KEY ("aziendaId") REFERENCES "Azienda"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "en1090_moduli" ADD CONSTRAINT "en1090_moduli_commessa_id_fkey" FOREIGN KEY ("commessa_id") REFERENCES "en1090_commesse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "en1090_dop" ADD CONSTRAINT "en1090_dop_aziendaId_fkey" FOREIGN KEY ("aziendaId") REFERENCES "Azienda"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "en1090_dop" ADD CONSTRAINT "en1090_dop_commessa_id_fkey" FOREIGN KEY ("commessa_id") REFERENCES "en1090_commesse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "en1090_ce" ADD CONSTRAINT "en1090_ce_aziendaId_fkey" FOREIGN KEY ("aziendaId") REFERENCES "Azienda"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "en1090_ce" ADD CONSTRAINT "en1090_ce_commessa_id_fkey" FOREIGN KEY ("commessa_id") REFERENCES "en1090_commesse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "En1090Materiale" ADD CONSTRAINT "En1090Materiale_aziendaId_fkey" FOREIGN KEY ("aziendaId") REFERENCES "Azienda"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "En1090CommessaMateriale" ADD CONSTRAINT "En1090CommessaMateriale_aziendaId_fkey" FOREIGN KEY ("aziendaId") REFERENCES "Azienda"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "En1090CommessaMateriale" ADD CONSTRAINT "En1090CommessaMateriale_commessaId_fkey" FOREIGN KEY ("commessaId") REFERENCES "en1090_commesse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "En1090CommessaMateriale" ADD CONSTRAINT "En1090CommessaMateriale_materialeId_fkey" FOREIGN KEY ("materialeId") REFERENCES "En1090Materiale"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "En1090Saldatore" ADD CONSTRAINT "En1090Saldatore_aziendaId_fkey" FOREIGN KEY ("aziendaId") REFERENCES "Azienda"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "En1090Wpqr" ADD CONSTRAINT "En1090Wpqr_aziendaId_fkey" FOREIGN KEY ("aziendaId") REFERENCES "Azienda"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "En1090Wps" ADD CONSTRAINT "En1090Wps_aziendaId_fkey" FOREIGN KEY ("aziendaId") REFERENCES "Azienda"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "En1090Wps" ADD CONSTRAINT "En1090Wps_wpqrId_fkey" FOREIGN KEY ("wpqrId") REFERENCES "En1090Wpqr"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "En1090QualificaSaldatore" ADD CONSTRAINT "En1090QualificaSaldatore_aziendaId_fkey" FOREIGN KEY ("aziendaId") REFERENCES "Azienda"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "En1090QualificaSaldatore" ADD CONSTRAINT "En1090QualificaSaldatore_saldatoreId_fkey" FOREIGN KEY ("saldatoreId") REFERENCES "En1090Saldatore"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "En1090Saldatura" ADD CONSTRAINT "En1090Saldatura_aziendaId_fkey" FOREIGN KEY ("aziendaId") REFERENCES "Azienda"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "En1090Saldatura" ADD CONSTRAINT "En1090Saldatura_commessaId_fkey" FOREIGN KEY ("commessaId") REFERENCES "en1090_commesse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "En1090Saldatura" ADD CONSTRAINT "En1090Saldatura_saldatoreId_fkey" FOREIGN KEY ("saldatoreId") REFERENCES "En1090Saldatore"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "En1090Saldatura" ADD CONSTRAINT "En1090Saldatura_wpsId_fkey" FOREIGN KEY ("wpsId") REFERENCES "En1090Wps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "En1090Saldatura" ADD CONSTRAINT "En1090Saldatura_materialeId_fkey" FOREIGN KEY ("materialeId") REFERENCES "En1090Materiale"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "En1090DocumentVersion" ADD CONSTRAINT "En1090DocumentVersion_aziendaId_fkey" FOREIGN KEY ("aziendaId") REFERENCES "Azienda"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "En1090DocumentVersion" ADD CONSTRAINT "En1090DocumentVersion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "En1090VerificaSaldatura" ADD CONSTRAINT "En1090VerificaSaldatura_aziendaId_fkey" FOREIGN KEY ("aziendaId") REFERENCES "Azienda"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "En1090VerificaSaldatura" ADD CONSTRAINT "En1090VerificaSaldatura_commessaId_fkey" FOREIGN KEY ("commessaId") REFERENCES "en1090_commesse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "En1090VerificaSaldatura" ADD CONSTRAINT "En1090VerificaSaldatura_saldaturaId_fkey" FOREIGN KEY ("saldaturaId") REFERENCES "En1090Saldatura"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "En1090VerificaSaldatura" ADD CONSTRAINT "En1090VerificaSaldatura_wpsId_fkey" FOREIGN KEY ("wpsId") REFERENCES "En1090Wps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "En1090VerificaSaldatura" ADD CONSTRAINT "En1090VerificaSaldatura_materialeId_fkey" FOREIGN KEY ("materialeId") REFERENCES "En1090Materiale"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "En1090Notifica" ADD CONSTRAINT "En1090Notifica_aziendaId_fkey" FOREIGN KEY ("aziendaId") REFERENCES "Azienda"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "En1090Notifica" ADD CONSTRAINT "En1090Notifica_commessaId_fkey" FOREIGN KEY ("commessaId") REFERENCES "en1090_commesse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

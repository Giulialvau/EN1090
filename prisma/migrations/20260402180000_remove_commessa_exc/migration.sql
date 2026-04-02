-- Remove Execution Class column from commessa tables (no longer stored on commessa).

ALTER TABLE "Commessa" DROP COLUMN IF EXISTS "exc";

ALTER TABLE "en1090_commesse" DROP COLUMN IF EXISTS "exc";

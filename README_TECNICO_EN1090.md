# README Tecnico EN1090

## Architettura

- Monorepo con due applicazioni canoniche:
  - `backend/`: API NestJS + Prisma/PostgreSQL
  - `safe-frontend/`: UI Next.js
- Backend espone API REST con validazione DTO (`class-validator`) e regole business lato service (strict blocking 4xx).
- Frontend usa API client centralizzato e pannelli modulo-specifici.

## Moduli principali

- Commesse
- Materiali
- Tracciabilita
- Checklist
- Non-Conformita
- Audit
- Piani di Controllo
- WPS/WPQR
- Documenti
- Report

## DTO e validazioni

- DTO validano formato/typing (campi obbligatori, enum, max length).
- Service applicano validazioni cross-modulo:
  - coerenza materiale/commessa
  - prerequisiti transizioni stato commessa
  - blocchi su chiusura NC/audit/checklist
  - vincoli temporali WPQR

## Flusso commessa (sintesi)

1. Creazione commessa (`BOZZA`, `codice`, `cliente`).
2. Definizione piano di controllo + materiali qualificati.
3. Passaggio a `IN_CORSO` solo con prerequisiti soddisfatti.
4. Esecuzione tracciabilita, checklist, audit, NC.
5. Chiusura `CHIUSA` consentita solo a regole rispettate.

## Regole normative EN1090 (implementate)

- Mapping `tipo`/`norma` materiali:
  - acciaio -> EN10025/EN10210/EN10219
  - inox -> EN10088-x
  - alluminio -> EN573/EN485/EN755
- Certificazione 3.1 obbligatoria (testo o PDF collegato).
- Tracciabilita con riferimento disegno obbligatorio.
- Checklist completata con esito/note/allegati.
- NC chiusa con azione correttiva.
- Audit con note obbligatorie.

## Comandi sviluppo

### Backend

- `cd backend`
- `npm install`
- `npm run start:dev`
- `npm run build`

### Frontend

- `cd safe-frontend`
- `npm install`
- `npm run dev`
- `npm run build`

## QA e smoke

- Script smoke:
  - `backend/scripts/smoke-suite-api.js`
  - `backend/scripts/smoke-blocking-additional.js`
- Evidenze:
  - `backend/qa-evidence/`
  - `backend/qa-evidence/audit-pack/`

## Struttura repository (essenziale)

- `backend/src/` servizi, controller, DTO, regole
- `backend/prisma/` schema + migrations + seed
- `safe-frontend/app/` route/page Next.js
- `safe-frontend/components/` pannelli modulo
- `backend/qa-evidence/` risultati QA e audit pack

# Audit Pack - API Smoke Snapshots

Questa sezione riporta snapshot testuali delle principali chiamate smoke (status + estratto risposta).

## Snapshot principali

- `POST /auth/login` -> `201`
- `POST /commesse` -> `201`
- `PATCH /commesse/:id` (`IN_CORSO` senza prerequisiti) -> `400` (blocco atteso)
- `POST /materiali` (norma/tipo invalido) -> `400` (blocco atteso)
- `POST /tracciabilita` (senza riferimento disegno) -> `400` (blocco atteso)
- `POST /checklist` (`COMPLETATA` incompleta) -> `400` (blocco atteso)
- `POST /non-conformita` (`CHIUSA` senza azione) -> `400` (blocco atteso)
- `POST /audit` (senza note) -> `400` (blocco atteso)
- `POST /wpqr` (`scadenza <= dataQualifica`) -> `400` (blocco atteso)
- `PATCH /commesse/:id` (`CHIUSA` con NC aperta) -> `400` (blocco atteso)
- `PATCH /commesse/:id` (`CHIUSA` dopo prerequisiti) -> `200`

## Evidenze raw

- `backend/qa-evidence/smoke-suite-api.json`
- `backend/qa-evidence/smoke-blocking-additional.json`
- `backend/qa-evidence/smoke-evidence-matrix.csv`

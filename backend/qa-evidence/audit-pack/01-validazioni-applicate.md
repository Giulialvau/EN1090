# Audit Pack - Validazioni Applicate

## Backend (strict blocking)

- `commesse`: `codice` alfanumerico 1-16, `cliente` obbligatorio, default `BOZZA`, transizioni stato bloccanti.
- `materiali`: validazione combinazione `tipo`/`norma`, obbligo `lotto` + `fornitore` + certificato 3.1 (testo o PDF).
- `tracciabilita`: obbligo `riferimentoDisegno`, coerenza materiale/commessa, blocco materiale non qualificato.
- `checklist`: obbligo `fase`; per `COMPLETATA` obbligo `esito` + `note` + almeno un allegato.
- `non-conformita`: chiusura consentita solo con `azione` correttiva.
- `audit`: obbligo note in create/update.
- `wpqr`: `scadenza` deve essere successiva a `dataQualifica`.

## Frontend alignment

- Validazioni form rese coerenti con vincoli backend (materiali, tracciabilita, audit, NC).
- Mapping payload corretto per NC (`azione`).
- Gestione errori lato UI allineata ai 4xx bloccanti.

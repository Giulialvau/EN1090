# EN1090 Audit Pack (QA)

Generated: 2026-04-07T15:03:58.430Z

| Criterio | Esito | Evidenza |
|---|---|---|
| Commessa codice/cliente + stato default/transition blocking | PASS | POST /commesse, PATCH /commesse/:id (IN_CORSO/CHIUSA), test blocking prerequisiti |
| Materiali norma/tipo whitelist + mandatory + delete protection | PASS | POST /materiali (invalid/valid), DELETE /materiali/:id referenziato |
| Tracciabilita obbligo riferimentoDisegno | PASS | POST /tracciabilita invalid/valid |
| Checklist regole completamento (fase/esito/note/allegati) | PASS | POST /checklist casi negativi e PATCH complete |
| NC chiusura richiede azione correttiva | PASS | POST/PATCH /non-conformita |
| Audit note obbligatorie | PASS | POST/PATCH /audit |
| WPS/WPQR coerenza + validita temporale WPQR | PASS | POST /wps, POST /wpqr invalid/valid |
| Documenti upload/delete operativo | PASS | POST /documenti/upload, DELETE /documenti/:id |
| Report API disponibile | PASS | GET /report/dashboard |
| CRUD moduli core (create/update/delete) | PASS | Matrice smoke-suite-api.json |

## Riferimenti
- `qa-evidence/smoke-suite-api.json`
- `qa-evidence/smoke-blocking-additional.json`
- `qa-evidence/smoke-evidence-matrix.csv`

# Audit Pack - Mapping Norme/Materiali

## Mapping implementato

- `tipo = acciaio` -> norma ammessa: `EN10025`, `EN10210`, `EN10219`
- `tipo = inox` -> norma ammessa: `EN10088-x`
- `tipo = alluminio` -> norma ammessa: `EN573`, `EN485`, `EN755`

## Vincoli associati

- Obbligatori: `lotto`, `fornitore`.
- Obbligatorio certificato 3.1 in almeno una forma:
  - testo (`certificato31`) oppure
  - documento PDF collegato (`certificatoDocumentoId`).

## Esito QA

- Payload con norma non coerente -> bloccato (4xx).
- Payload incompleti (es. lotto assente) -> bloccati (4xx).
- Payload validi -> accettati (2xx).

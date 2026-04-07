# Audit Pack - Regole Bloccanti e Flussi Stato

## Commesse - Stato

- `BOZZA -> IN_CORSO` bloccata se manca `dataInizio`.
- `BOZZA/IN_CORSO -> IN_CORSO` bloccata se non esistono almeno un materiale e un piano di controllo.
- `IN_CORSO -> CHIUSA` bloccata in presenza di:
  - non conformita aperte;
  - checklist incomplete/senza esito;
  - audit con note mancanti;
  - assenza di tracciabilita;
  - WPS senza almeno un WPQR valido.
- `CHIUSA -> altro stato` bloccata.

## Regole trasversali

- Materiale referenziato in tracciabilita non eliminabile.
- Tracciabilita senza riferimento disegno non accettata.
- NC chiusa senza azione correttiva non accettata.
- Checklist completata senza allegati/note/esito non accettata.

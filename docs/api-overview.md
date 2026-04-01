# EN1090 — API Overview

Versione: 1.0  
Data: 2026-04-01  

## Documentazione interattiva

Il backend espone Swagger UI:

- Endpoint: `/docs`
- OpenAPI: generato via NestJS Swagger

## Convenzioni di risposta

Le risposte sono wrappate da un interceptor nel formato:

```json
{ "data": { /* payload */ } }
```

Gli errori seguono un formato consistente (con `statusCode`, `path`, `timestamp`).

## Autenticazione

Flusso JWT (access + refresh):

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh` (Authorization: Bearer <refresh_token>)
- `POST /auth/logout` (Authorization: Bearer <access_token>)

## Moduli API (principali)

- `/users`
- `/commesse`
- `/materiali`
- `/documenti`
- `/checklist`
- `/audit`
- `/non-conformita`
- `/wps`
- `/wpqr`
- `/tracciabilita`
- `/report`
- `/health`

## Status code (linee guida)

- `200 OK`: letture/aggiornamenti
- `201 Created`: creazioni (es. login/register/create)
- `400 Bad Request`: validazione DTO fallita
- `401 Unauthorized`: token mancante/invalidato
- `403 Forbidden`: permessi insufficienti
- `404 Not Found`: risorsa non trovata


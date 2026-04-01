# EN1090 — Modules

Versione: 1.0  
Data: 2026-04-01  

## Backend (NestJS)

Struttura per moduli (indicativa):

- `auth`: login, refresh, logout, guard e strategy JWT
- `users`: CRUD utenti e ruoli
- `commesse`: gestione commesse
- `materiali`: gestione materiali
- `documenti`: upload e gestione documenti
- `checklist`: checklist controlli
- `audit`: audit e verifiche
- `non-conformita`: NCR/NC
- `wps`: WPS
- `wpqr`: WPQR
- `tracciabilita`: tracciabilità
- `report`: reportistica
- `health`: health endpoint
- `common`: filtri, interceptor, middleware, pipe comuni
- `prisma`: prisma module/service

## Flusso request (backend)

```mermaid
sequenceDiagram
  participant Client
  participant MW as Middleware (requestId, headers, logger)
  participant Pipe as Pipes (sanitize + validate)
  participant Guard as Guards (jwt/roles + throttling)
  participant Ctrl as Controller
  participant Svc as Service
  participant Prisma as PrismaService
  participant DB as PostgreSQL

  Client->>MW: HTTP Request
  MW->>Pipe: pass request
  Pipe->>Guard: pass sanitized/validated
  Guard->>Ctrl: authorized
  Ctrl->>Svc: business call
  Svc->>Prisma: query
  Prisma->>DB: SQL
  DB-->>Prisma: result
  Prisma-->>Svc: data
  Svc-->>Ctrl: response DTO
  Ctrl-->>Client: HTTP Response
```

## Frontend (Next.js)

Cartella `safe-frontend/` con struttura Next.js (App Router).


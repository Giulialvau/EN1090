# EN1090 — Architecture

Versione: 1.0  
Data: 2026-04-01  

## Panoramica

Il sistema è composto da:

- **Frontend**: Next.js (`safe-frontend/`)
- **Backend**: NestJS (`backend/`)
- **Database**: PostgreSQL (Prisma ORM)

## Componenti

```mermaid
flowchart TB
  subgraph Client
    B[Browser]
  end

  subgraph FE[Frontend - Next.js]
    FE1[App Router / Pages]
    FE2[API client]
  end

  subgraph BE[Backend - NestJS]
    M[Modules]
    C[Controllers]
    S[Services]
    G[Guards]
    P[Pipes]
    I[Interceptors]
    F[Filters]
    PR[PrismaService]
  end

  subgraph DB[PostgreSQL]
    T[(Tables)]
  end

  B --> FE1
  FE2 -->|REST| C
  C --> S
  S --> PR
  PR --> T
  C --> G
  C --> P
  C --> I
  C --> F
```

## Principi architetturali

- **Separation of concerns**: controller (I/O HTTP), service (logica applicativa), Prisma (data access)
- **Validation-first**: DTO validation (class-validator) + trasformazioni (class-transformer)
- **Security-by-default**: Helmet + rate limit + audit logging + hardening JWT
- **Observability**: logging strutturato con `requestId` e tempi di risposta

## Ambienti

- **dev**: `.env` locale, hot reload
- **test**: e2e con Prisma mock in-memory
- **prod**: variabili d’ambiente, migrazioni Prisma deploy, healthcheck


# EN1090 — Manuale di Installazione

Versione: 1.0  
Data: 2026-04-01  

## Requisiti

### Ambienti supportati

- Sviluppo locale (Windows/macOS/Linux)
- Produzione (Linux consigliato)

### Componenti

- **Node.js**: 20.x
- **npm**: 9+ (o compatibile)
- **Database**: PostgreSQL 16+
- **Docker** (opzionale ma consigliato): Docker + Docker Compose

## Installazione locale (senza Docker)

### 1) Backend (NestJS)

Percorso: `backend/`

1. Installa dipendenze:

```bash
cd backend
npm install
```

2. Configura variabili d’ambiente (esempio):

- Crea `backend/.env` (o imposta variabili di sistema)
- Imposta almeno: `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `JWT_ACCESS_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`, `FRONTEND_ORIGIN`

3. Prisma (generate + migrate + seed):

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

4. Avvia in sviluppo:

```bash
npm run start:dev
```

### 2) Frontend (Next.js)

Percorso: `safe-frontend/`

1. Installa dipendenze:

```bash
cd safe-frontend
npm install
```

2. Avvia in sviluppo:

```bash
npm run dev
```

## Installazione Docker (consigliata)

Per produzione è presente un file di compose:

- `docker-compose.prod.yml`

### Avvio (esempio)

1. Crea un file `.env` a livello root del repo con i valori richiesti dal compose (segreti inclusi).
2. Avvia:

```bash
docker compose -f docker-compose.prod.yml up -d
```

### Migrazioni Prisma

In produzione, eseguire:

```bash
cd backend
npm run prisma:deploy
```

(Nel flusso CI/CD il deploy può eseguire automaticamente `prisma migrate deploy`.)

## Deploy produzione (linee guida)

### Checklist minima

- Database PostgreSQL in rete privata o protetta
- Segreti gestiti tramite variabili d’ambiente (mai committare `.env`)
- TLS terminato da reverse proxy (Nginx/Traefik/Cloud LB)
- Monitoring/alert su healthcheck

### Variabili d’ambiente backend (minimo)

- `NODE_ENV=production`
- `PORT=3001`
- `DATABASE_URL=postgresql://...`
- `FRONTEND_ORIGIN=https://<dominio-frontend>`
- `JWT_ACCESS_SECRET=<segreto>`
- `JWT_REFRESH_SECRET=<segreto>`
- `JWT_ACCESS_EXPIRES_IN=15m`
- `JWT_REFRESH_EXPIRES_IN=7d`

## Troubleshooting

### Il backend parte ma l’auth fallisce

- Verifica che le migrazioni Prisma siano applicate (`prisma migrate deploy`).
- Verifica che `JWT_*_SECRET` siano presenti e coerenti.

### Errore “table does not exist”

- Migrazioni non applicate o DB puntato errato (`DATABASE_URL`).

### CORS bloccato

- Impostare `FRONTEND_ORIGIN` correttamente (lista separata da virgole).

### Problemi Docker

- Verifica che il DB sia “healthy” (healthcheck compose).
- Verifica mapping porte e variabili `.env`.


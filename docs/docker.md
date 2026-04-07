# EN1090 — Docker

Versione: 1.0  
Data: 2026-04-01  

## File principali

- `docker-compose.prod.yml`
- `backend/Dockerfile`
- `safe-frontend/Dockerfile`
- `backend/.dockerignore`
- `safe-frontend/.dockerignore`

## Docker Compose (produzione)

Il compose avvia:

- `postgres` (PostgreSQL 16)
- `backend` (NestJS)
- `frontend` (Next.js)

Configurazione:

- Variabili via `.env` (root)
- Healthcheck su DB e backend
- Restart policy `unless-stopped`

## Comandi utili

Avvio:

```bash
docker compose -f docker-compose.prod.yml up -d
```

Log:

```bash
docker compose -f docker-compose.prod.yml logs -f backend
```

Stop:

```bash
docker compose -f docker-compose.prod.yml down
```

## Best practice

- Non includere segreti nelle immagini
- Aggiornare regolarmente le immagini base
- Abilitare monitoring dei container


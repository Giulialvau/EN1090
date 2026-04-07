# EN1090 — Deployment

Versione: 1.0  
Data: 2026-04-01  

## Opzioni di deploy

- Docker Compose (consigliato)
- PaaS (es. Railway) per backend + DB gestito
- Deploy su VM (Linux) con reverse proxy

## CI/CD (GitHub Actions)

Nel repository sono presenti pipeline:

- CI: lint, test, build, build/push immagini
- Deploy: deploy manuale o su tag `v*` con compose e healthcheck

Vedi:

- `.github/workflows/ci.yml`
- `.github/workflows/deploy.yml`

## Variabili d’ambiente (produzione)

Backend:

- `NODE_ENV=production`
- `PORT=3001`
- `DATABASE_URL=postgresql://...`
- `FRONTEND_ORIGIN=https://...` (anche lista separata da virgole)
- `JWT_ACCESS_SECRET=...`
- `JWT_REFRESH_SECRET=...`
- `JWT_ACCESS_EXPIRES_IN=15m`
- `JWT_REFRESH_EXPIRES_IN=7d`

## Healthcheck

- Endpoint: `/health`
- Usato da Docker healthcheck per orchestrare dipendenze

## Migrazioni

Produzione:

```bash
cd backend
npm run prisma:deploy
```

## Rollback (linee guida)

- Conservare tag immagini versionati (es. `v1.2.3`)
- Rollback: puntare `IMAGE_TAG` a versione precedente e riavviare compose
- Migrazioni DB: valutare strategia compatibile (forward-only consigliato)


# EN1090 — Frontend Structure

Versione: 1.0  
Data: 2026-04-01  

## Panoramica

Il frontend si trova in `safe-frontend/` ed è basato su **Next.js**.

## Struttura (indicativa)

- `app/`: routing e pagine (App Router)
- `components/`: componenti UI riutilizzabili (se presenti/aggiunti)
- `services/`: client API (se presente/aggiunto)
- `styles/`: stili globali/utility (se presenti/aggiunti)

## Configurazione ambiente

In produzione:

- il frontend comunica con il backend tramite URL configurato (reverse proxy o variabile ambiente in fase di build/runtime, a seconda della strategia adottata).

## Note operative

- Swagger backend: `/docs`
- Health backend: `/health`


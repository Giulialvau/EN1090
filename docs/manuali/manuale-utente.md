# EN1090 — Manuale Utente

Versione: 1.0  
Data: 2026-04-01  

## Introduzione

EN1090 è un’applicazione web per supportare la gestione operativa e documentale di commesse di carpenteria metallica secondo i workflow tipici EN 1090: tracciabilità, controlli, documentazione, audit e non conformità.

Questo manuale descrive l’uso dell’interfaccia utente e i flussi operativi principali.

## Accesso e autenticazione

### Prerequisiti

- Un account utente abilitato
- URL applicazione (fornito dall’amministratore)

### Login

1. Apri la pagina di accesso.
2. Inserisci **Email** e **Password**.
3. Conferma per entrare nella Dashboard.

### Sessione e sicurezza

- Per motivi di sicurezza, le sessioni possono scadere automaticamente.
- In caso di errori di accesso ripetuti, attendi e riprova o contatta l’amministratore.

## Navigazione UI (panoramica)

### Menu principale

L’app è organizzata per moduli:

- **Commesse**
- **Materiali**
- **Documenti**
- **Checklist**
- **Audit**
- **Non conformità (NC / NCR)**
- **WPS / WPQR**
- **Tracciabilità**
- **Report**

### Ricerca e filtri

Ogni elenco può offrire:

- Ricerca testuale
- Filtri per stato/esito/tipo
- Ordinamento per data o identificativi

## Moduli (cosa fanno e quando usarli)

### Commesse

Usa **Commesse** per creare e gestire il contenitore principale della lavorazione.

Operazioni tipiche:

- Creare una commessa con cliente, descrizione e classe di esecuzione (**EXC**)
- Consultare stato avanzamento (documenti, checklist, audit, NC collegate)

### Materiali

Usa **Materiali** per registrare i materiali di una commessa e le relative informazioni.

Esempi di dati:

- Codici/identificativi
- Norme e certificazioni
- Collegamenti a documenti/certificati

### Documenti

Usa **Documenti** per gestire allegati e documentazione (es. certificati, procedure, report).

Tipicamente include:

- Caricamento di file
- Stato di approvazione
- Collegamento alla commessa (e/o ad altri elementi)

### Checklist

Usa **Checklist** per registrare controlli e verifiche (dimensionale, saldature, materiali, finale, ecc.).

Le checklist possono includere:

- **Elementi** (struttura JSON)
- **Allegati** (struttura JSON)
- Stato ed esito

### Audit

Usa **Audit** per gestire verifiche interne/esterne con esito e note.

### Non conformità (NC / NCR)

Usa **Non conformità** per registrare deviazioni, difetti o eventi non conformi.

Campi tipici:

- Tipo, gravità, stato
- Causa, azione correttiva, note

### WPS / WPQR

Usa **WPS** per registrare procedure di saldatura e **WPQR** per le qualifiche correlate.

### Tracciabilità

Usa **Tracciabilità** per collegare materiali, commessa e riferimenti utili a ricostruire la catena documentale/operativa.

## Flussi operativi (best practice)

### Flusso consigliato “standard”

1. **Crea Commessa**
2. **Inserisci Materiali**
3. **Carica Documenti** (certificati, allegati, procedure)
4. **Esegui Checklist** (per fasi)
5. **Registra Audit** (se applicabile)
6. **Gestisci Non Conformità** (se emergono)
7. **Compila Tracciabilità**
8. **Esporta Report**

### Flusso “con non conformità”

1. Apri NC
2. Compila descrizione, tipo, gravità
3. Inserisci causa e azione correttiva
4. Aggiorna lo stato fino a chiusura

## FAQ

### Non riesco ad accedere

- Verifica credenziali e connessione.
- Se l’errore persiste, richiedi reset password o verifica permessi.

### Vedo errori di validazione (400)

- Alcuni campi sono obbligatori o richiedono un formato specifico (es. enum).
- Correggi i valori e riprova.

### Non vedo un documento appena caricato

- Aggiorna la pagina o riprova dopo qualche secondo.
- Verifica eventuali filtri attivi.

## Screenshot (placeholder)

> Inserire screenshot nelle sezioni: Login, Dashboard, elenco commesse, dettaglio commessa, creazione checklist, gestione NC.

- `[SCREENSHOT] Login`
- `[SCREENSHOT] Dashboard`
- `[SCREENSHOT] Commesse — elenco`
- `[SCREENSHOT] Commessa — dettaglio`
- `[SCREENSHOT] Checklist — compilazione`
- `[SCREENSHOT] Non conformità — gestione`


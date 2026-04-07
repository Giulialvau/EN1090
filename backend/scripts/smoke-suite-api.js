/* eslint-disable no-console */
const base = "http://localhost:3001";
const out = [];
const ids = {};

function push(module, test, ok, status, detail) {
  out.push({ module, test, ok, status, detail });
}

async function req(path, opt = {}) {
  const r = await fetch(base + path, opt);
  const t = await r.text();
  let j = null;
  try {
    j = JSON.parse(t);
  } catch {
    j = null;
  }
  return { r, t, j };
}

function tokenPayload(j) {
  return j && j.data ? j.data : j;
}

async function run() {
  try {
    const rnd = Date.now().toString().slice(-6);
    const code = `SMK${rnd}`;

    const login = await req("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@en1090.it", password: "admin123" }),
    });
    const loginOk = login.r.status === 200 || login.r.status === 201;
    push("auth", "login admin", loginOk, login.r.status, login.t.slice(0, 180));
    if (!loginOk) {
      console.log(JSON.stringify(out, null, 2));
      return;
    }

    const tok = tokenPayload(login.j) || {};
    const access = tok.access_token;
    const refresh = tok.refresh_token;
    const h = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access}`,
    };

    const rf = await req("/auth/refresh", {
      method: "POST",
      headers: { Authorization: `Bearer ${refresh}` },
    });
    push(
      "auth",
      "refresh token",
      rf.r.status === 200 || rf.r.status === 201,
      rf.r.status,
      rf.t.slice(0, 160),
    );

    const c = await req("/commesse", {
      method: "POST",
      headers: h,
      body: JSON.stringify({ codice: code, cliente: "Smoke Client" }),
    });
    const cOk = c.r.status === 200 || c.r.status === 201;
    push("commesse", "create", cOk, c.r.status, c.t.slice(0, 180));
    if (!cOk) {
      console.log(JSON.stringify(out, null, 2));
      return;
    }
    ids.commessa = (tokenPayload(c.j) || {}).id;

    const cInCorsoFail = await req(`/commesse/${ids.commessa}`, {
      method: "PATCH",
      headers: h,
      body: JSON.stringify({ stato: "IN_CORSO" }),
    });
    push(
      "commesse",
      "blocking IN_CORSO without prereq",
      cInCorsoFail.r.status >= 400,
      cInCorsoFail.r.status,
      cInCorsoFail.t.slice(0, 170),
    );

    const pc = await req("/piani-controllo", {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        commessaId: ids.commessa,
        fase: "Taglio",
        controlliRichiesti: [{ codice: "VT", descrizione: "Controllo visivo" }],
        esito: "IN_ATTESA",
      }),
    });
    const pcOk = pc.r.status === 200 || pc.r.status === 201;
    push("piani-controllo", "create", pcOk, pc.r.status, pc.t.slice(0, 140));
    if (pcOk) ids.pc = (tokenPayload(pc.j) || {}).id;

    const mFail1 = await req("/materiali", {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        commessaId: ids.commessa,
        codice: "MFB1",
        descrizione: "x",
        tipo: "acciaio",
        norma: "EN10025",
        fornitore: "F",
        certificato31: "C",
      }),
    });
    push(
      "materiali",
      "blocking missing lotto",
      mFail1.r.status >= 400,
      mFail1.r.status,
      mFail1.t.slice(0, 150),
    );

    const mFail2 = await req("/materiali", {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        commessaId: ids.commessa,
        codice: "MFB2",
        descrizione: "x",
        tipo: "acciaio",
        norma: "EN99999",
        lotto: "L1",
        fornitore: "F",
        certificato31: "C",
      }),
    });
    push(
      "materiali",
      "blocking invalid norma/tipo",
      mFail2.r.status >= 400,
      mFail2.r.status,
      mFail2.t.slice(0, 150),
    );

    const m = await req("/materiali", {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        commessaId: ids.commessa,
        codice: `MAT${rnd}`,
        descrizione: "Piastra",
        tipo: "acciaio",
        norma: "EN10025",
        lotto: `L-${rnd}`,
        fornitore: "Fornitore X",
        certificato31: `CERT-${rnd}`,
      }),
    });
    const mOk = m.r.status === 200 || m.r.status === 201;
    push("materiali", "create", mOk, m.r.status, m.t.slice(0, 150));
    if (mOk) ids.mat = (tokenPayload(m.j) || {}).id;

    const cInCorso = await req(`/commesse/${ids.commessa}`, {
      method: "PATCH",
      headers: h,
      body: JSON.stringify({ stato: "IN_CORSO", dataInizio: new Date().toISOString() }),
    });
    push(
      "commesse",
      "update IN_CORSO with prereq",
      cInCorso.r.status === 200 || cInCorso.r.status === 201,
      cInCorso.r.status,
      cInCorso.t.slice(0, 140),
    );

    const trFail = await req("/tracciabilita", {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        commessaId: ids.commessa,
        materialeId: ids.mat,
        posizione: "A1",
        quantita: 1,
      }),
    });
    push(
      "tracciabilita",
      "blocking missing riferimentoDisegno",
      trFail.r.status >= 400,
      trFail.r.status,
      trFail.t.slice(0, 160),
    );

    const tr = await req("/tracciabilita", {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        commessaId: ids.commessa,
        materialeId: ids.mat,
        posizione: "A1",
        quantita: 1,
        riferimentoDisegno: `DWG-${rnd}`,
      }),
    });
    const trOk = tr.r.status === 200 || tr.r.status === 201;
    push("tracciabilita", "create", trOk, tr.r.status, tr.t.slice(0, 140));
    if (trOk) ids.tr = (tokenPayload(tr.j) || {}).id;

    const mDelBlocked = await req(`/materiali/${ids.mat}`, {
      method: "DELETE",
      headers: h,
    });
    push(
      "materiali",
      "blocking delete referenced",
      mDelBlocked.r.status >= 400,
      mDelBlocked.r.status,
      mDelBlocked.t.slice(0, 150),
    );

    const clFail = await req("/checklist", {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        commessaId: ids.commessa,
        titolo: "CL1",
        categoria: "fab",
        stato: "COMPLETATA",
      }),
    });
    push(
      "checklist",
      "blocking COMPLETATA without esito/note/allegati",
      clFail.r.status >= 400,
      clFail.r.status,
      clFail.t.slice(0, 170),
    );

    const cl = await req("/checklist", {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        commessaId: ids.commessa,
        titolo: "CL1",
        categoria: "fab",
        fase: "Saldatura",
        stato: "APERTA",
        elementi: [{ id: "1", descrizione: "ok" }],
      }),
    });
    const clOk = cl.r.status === 200 || cl.r.status === 201;
    push("checklist", "create", clOk, cl.r.status, cl.t.slice(0, 140));
    if (clOk) ids.cl = (tokenPayload(cl.j) || {}).id;

    const clUp = await req(`/checklist/${ids.cl}`, {
      method: "PATCH",
      headers: h,
      body: JSON.stringify({
        stato: "COMPLETATA",
        esito: "CONFORME",
        note: "ok",
        allegati: [{ nome: "a.pdf" }],
        fase: "Saldatura",
      }),
    });
    push(
      "checklist",
      "update complete",
      clUp.r.status === 200 || clUp.r.status === 201,
      clUp.r.status,
      clUp.t.slice(0, 130),
    );

    const ncFail = await req("/non-conformita", {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        commessaId: ids.commessa,
        titolo: "NCF",
        descrizione: "d",
        tipo: "INTERNA",
        gravita: "MEDIA",
        stato: "CHIUSA",
      }),
    });
    push(
      "non-conformita",
      "blocking CHIUSA without azione",
      ncFail.r.status >= 400,
      ncFail.r.status,
      ncFail.t.slice(0, 160),
    );

    const nc = await req("/non-conformita", {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        commessaId: ids.commessa,
        titolo: "NC1",
        descrizione: "d",
        tipo: "INTERNA",
        gravita: "MEDIA",
        stato: "APERTA",
      }),
    });
    const ncOk = nc.r.status === 200 || nc.r.status === 201;
    push("non-conformita", "create", ncOk, nc.r.status, nc.t.slice(0, 120));
    if (ncOk) ids.nc = (tokenPayload(nc.j) || {}).id;

    const audFail = await req("/audit", {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        commessaId: ids.commessa,
        titolo: "A1",
        data: new Date().toISOString(),
        auditor: "RGQ",
        esito: "CONFORME",
      }),
    });
    push(
      "audit",
      "blocking missing note",
      audFail.r.status >= 400,
      audFail.r.status,
      audFail.t.slice(0, 150),
    );

    const aud = await req("/audit", {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        commessaId: ids.commessa,
        titolo: "A1",
        data: new Date().toISOString(),
        auditor: "RGQ",
        esito: "CONFORME",
        note: "audit ok",
      }),
    });
    const audOk = aud.r.status === 200 || aud.r.status === 201;
    push("audit", "create", audOk, aud.r.status, aud.t.slice(0, 120));
    if (audOk) ids.aud = (tokenPayload(aud.j) || {}).id;

    const wps = await req("/wps", {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        codice: `WPS${rnd}`,
        processo: "135",
        commessaId: ids.commessa,
        materialeId: ids.mat,
        note: "n",
      }),
    });
    const wpsOk = wps.r.status === 200 || wps.r.status === 201;
    push("wps", "create", wpsOk, wps.r.status, wps.t.slice(0, 130));
    if (wpsOk) ids.wps = (tokenPayload(wps.j) || {}).id;

    const wpqrFail = await req("/wpqr", {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        codice: `WPQRF${rnd}`,
        saldatore: "Mario",
        wpsId: ids.wps,
        commessaId: ids.commessa,
        dataQualifica: "2026-01-10T00:00:00.000Z",
        scadenza: "2026-01-09T00:00:00.000Z",
      }),
    });
    push(
      "wpqr",
      "blocking scadenza <= dataQualifica",
      wpqrFail.r.status >= 400,
      wpqrFail.r.status,
      wpqrFail.t.slice(0, 150),
    );

    const wpqr = await req("/wpqr", {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        codice: `WPQR${rnd}`,
        saldatore: "Mario",
        wpsId: ids.wps,
        commessaId: ids.commessa,
        dataQualifica: "2026-01-10T00:00:00.000Z",
        scadenza: "2027-01-10T00:00:00.000Z",
      }),
    });
    const wpqrOk = wpqr.r.status === 200 || wpqr.r.status === 201;
    push("wpqr", "create", wpqrOk, wpqr.r.status, wpqr.t.slice(0, 130));
    if (wpqrOk) ids.wpqr = (tokenPayload(wpqr.j) || {}).id;

    const docBody = new FormData();
    docBody.append("file", new Blob(["%PDF-1.4 smoke"], { type: "application/pdf" }), "smoke.pdf");
    docBody.append("title", "Smoke Doc");
    docBody.append("commessaId", String(ids.commessa));
    docBody.append("tipo", "CERTIFICATO");
    docBody.append("versione", "1");
    const doc = await req("/documenti/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${access}` },
      body: docBody,
    });
    const docOk = doc.r.status === 200 || doc.r.status === 201;
    push("documenti", "create/upload", docOk, doc.r.status, doc.t.slice(0, 140));
    if (docOk) ids.doc = (tokenPayload(doc.j) || {}).id;

    const repDash = await req("/report/dashboard", { headers: h });
    push(
      "report",
      "get dashboard",
      repDash.r.status === 200 || repDash.r.status === 201,
      repDash.r.status,
      repDash.t.slice(0, 120),
    );

    const closeFail = await req(`/commesse/${ids.commessa}`, {
      method: "PATCH",
      headers: h,
      body: JSON.stringify({ stato: "CHIUSA" }),
    });
    push(
      "commesse",
      "blocking CHIUSA with NC aperta",
      closeFail.r.status >= 400,
      closeFail.r.status,
      closeFail.t.slice(0, 170),
    );

    const ncClose = await req(`/non-conformita/${ids.nc}`, {
      method: "PATCH",
      headers: h,
      body: JSON.stringify({ stato: "CHIUSA", azione: "Correzione completata" }),
    });
    push(
      "non-conformita",
      "update close with azione",
      ncClose.r.status === 200 || ncClose.r.status === 201,
      ncClose.r.status,
      ncClose.t.slice(0, 120),
    );

    const closeOk = await req(`/commesse/${ids.commessa}`, {
      method: "PATCH",
      headers: h,
      body: JSON.stringify({ stato: "CHIUSA" }),
    });
    push(
      "commesse",
      "update CHIUSA after prereq",
      closeOk.r.status === 200 || closeOk.r.status === 201,
      closeOk.r.status,
      closeOk.t.slice(0, 160),
    );

    const u1 = await req(`/audit/${ids.aud}`, {
      method: "PATCH",
      headers: h,
      body: JSON.stringify({ note: "audit ok updated" }),
    });
    push("audit", "update", u1.r.status === 200 || u1.r.status === 201, u1.r.status, u1.t.slice(0, 100));

    const u2 = await req(`/piani-controllo/${ids.pc}`, {
      method: "PATCH",
      headers: h,
      body: JSON.stringify({ esito: "CONFORME" }),
    });
    push("piani-controllo", "update", u2.r.status === 200 || u2.r.status === 201, u2.r.status, u2.t.slice(0, 100));

    const u3 = await req(`/wps/${ids.wps}`, {
      method: "PATCH",
      headers: h,
      body: JSON.stringify({ note: "upd" }),
    });
    push("wps", "update", u3.r.status === 200 || u3.r.status === 201, u3.r.status, u3.t.slice(0, 100));

    const u4 = await req(`/wpqr/${ids.wpqr}`, {
      method: "PATCH",
      headers: h,
      body: JSON.stringify({ note: "upd" }),
    });
    push("wpqr", "update", u4.r.status === 200 || u4.r.status === 201, u4.r.status, u4.t.slice(0, 100));

    const u5 = await req(`/tracciabilita/${ids.tr}`, {
      method: "PATCH",
      headers: h,
      body: JSON.stringify({ note: "upd", riferimentoDisegno: `DWG-${rnd}-R1` }),
    });
    push("tracciabilita", "update", u5.r.status === 200 || u5.r.status === 201, u5.r.status, u5.t.slice(0, 100));

    const u6 = await req(`/materiali/${ids.mat}`, {
      method: "PATCH",
      headers: h,
      body: JSON.stringify({
        fornitore: "Fornitore Y",
        lotto: `L-${rnd}-2`,
        tipo: "acciaio",
        norma: "EN10025",
        certificato31: "CERT-2",
      }),
    });
    push("materiali", "update", u6.r.status === 200 || u6.r.status === 201, u6.r.status, u6.t.slice(0, 110));

    const dDoc = ids.doc
      ? await req(`/documenti/${ids.doc}`, { method: "DELETE", headers: h })
      : { r: { status: 0 }, t: "skip" };
    push("documenti", "delete", dDoc.r.status === 200 || dDoc.r.status === 201, dDoc.r.status, dDoc.t.slice(0, 90));

    const dWpqr = await req(`/wpqr/${ids.wpqr}`, { method: "DELETE", headers: h });
    push("wpqr", "delete", dWpqr.r.status === 200 || dWpqr.r.status === 201, dWpqr.r.status, dWpqr.t.slice(0, 90));

    const dWps = await req(`/wps/${ids.wps}`, { method: "DELETE", headers: h });
    push("wps", "delete", dWps.r.status === 200 || dWps.r.status === 201, dWps.r.status, dWps.t.slice(0, 90));

    const dTr = await req(`/tracciabilita/${ids.tr}`, { method: "DELETE", headers: h });
    push("tracciabilita", "delete", dTr.r.status === 200 || dTr.r.status === 201, dTr.r.status, dTr.t.slice(0, 90));

    const dMat = await req(`/materiali/${ids.mat}`, { method: "DELETE", headers: h });
    push("materiali", "delete", dMat.r.status === 200 || dMat.r.status === 201, dMat.r.status, dMat.t.slice(0, 100));

    const dCl = await req(`/checklist/${ids.cl}`, { method: "DELETE", headers: h });
    push("checklist", "delete", dCl.r.status === 200 || dCl.r.status === 201, dCl.r.status, dCl.t.slice(0, 90));

    const dNc = await req(`/non-conformita/${ids.nc}`, { method: "DELETE", headers: h });
    push("non-conformita", "delete", dNc.r.status === 200 || dNc.r.status === 201, dNc.r.status, dNc.t.slice(0, 90));

    const dAud = await req(`/audit/${ids.aud}`, { method: "DELETE", headers: h });
    push("audit", "delete", dAud.r.status === 200 || dAud.r.status === 201, dAud.r.status, dAud.t.slice(0, 90));

    const dPc = await req(`/piani-controllo/${ids.pc}`, { method: "DELETE", headers: h });
    push("piani-controllo", "delete", dPc.r.status === 200 || dPc.r.status === 201, dPc.r.status, dPc.t.slice(0, 90));

    const dCom = await req(`/commesse/${ids.commessa}`, { method: "DELETE", headers: h });
    push("commesse", "delete", dCom.r.status === 200 || dCom.r.status === 201, dCom.r.status, dCom.t.slice(0, 100));
  } catch (e) {
    push("suite", "runtime exception", false, 0, String(e && e.message ? e.message : e));
  }

  console.log(JSON.stringify(out, null, 2));
}

void run();

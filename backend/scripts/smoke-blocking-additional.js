/* eslint-disable no-console */
const base = "http://localhost:3001";
const out = [];
const ids = {};

function push(test, ok, status, detail) {
  out.push({ test, ok, status, detail });
}

async function req(path, opt = {}) {
  const r = await fetch(base + path, opt);
  const t = await r.text();
  let j = null;
  try {
    j = JSON.parse(t);
  } catch {}
  return { r, t, j };
}

function unwrap(j) {
  return j && j.data ? j.data : j;
}

async function run() {
  try {
    const login = await req("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@en1090.it", password: "admin123" }),
    });
    const tok = unwrap(login.j) || {};
    const h = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tok.access_token}`,
    };

    const rnd = Date.now().toString().slice(-6);
    const c = await req("/commesse", {
      method: "POST",
      headers: h,
      body: JSON.stringify({ codice: `SB${rnd}`, cliente: "Block Test" }),
    });
    ids.commessa = (unwrap(c.j) || {}).id;

    const cl1 = await req("/checklist", {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        commessaId: ids.commessa,
        titolo: "CL-B1",
        categoria: "fab",
        fase: "Saldatura",
        stato: "COMPLETATA",
      }),
    });
    push("checklist COMPLETATA missing esito", cl1.r.status >= 400, cl1.r.status, cl1.t.slice(0, 140));

    const cl2 = await req("/checklist", {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        commessaId: ids.commessa,
        titolo: "CL-B2",
        categoria: "fab",
        fase: "Saldatura",
        stato: "COMPLETATA",
        esito: "CONFORME",
      }),
    });
    push("checklist COMPLETATA missing note", cl2.r.status >= 400, cl2.r.status, cl2.t.slice(0, 140));

    const cl3 = await req("/checklist", {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        commessaId: ids.commessa,
        titolo: "CL-B3",
        categoria: "fab",
        fase: "Saldatura",
        stato: "COMPLETATA",
        esito: "CONFORME",
        note: "ok",
      }),
    });
    push("checklist COMPLETATA missing allegati", cl3.r.status >= 400, cl3.r.status, cl3.t.slice(0, 140));

    await req("/piani-controllo", {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        commessaId: ids.commessa,
        fase: "Taglio",
        controlliRichiesti: [{ codice: "VT", descrizione: "Controllo visivo" }],
        esito: "IN_ATTESA",
      }),
    });
    const m = await req("/materiali", {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        commessaId: ids.commessa,
        codice: `MB${rnd}`,
        descrizione: "Piastra",
        tipo: "acciaio",
        norma: "EN10025",
        lotto: `L-${rnd}`,
        fornitore: "F",
        certificato31: "C",
      }),
    });
    ids.materiale = (unwrap(m.j) || {}).id;
    await req(`/commesse/${ids.commessa}`, {
      method: "PATCH",
      headers: h,
      body: JSON.stringify({ stato: "IN_CORSO", dataInizio: new Date().toISOString() }),
    });
    await req("/checklist", {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        commessaId: ids.commessa,
        titolo: "CL-OK",
        categoria: "fab",
        fase: "Taglio",
        stato: "COMPLETATA",
        esito: "CONFORME",
        note: "ok",
        allegati: [{ nome: "a.pdf" }],
      }),
    });
    await req("/audit", {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        commessaId: ids.commessa,
        titolo: "A-OK",
        data: new Date().toISOString(),
        auditor: "RGQ",
        esito: "CONFORME",
        note: "ok",
      }),
    });
    const closeNoTrace = await req(`/commesse/${ids.commessa}`, {
      method: "PATCH",
      headers: h,
      body: JSON.stringify({ stato: "CHIUSA" }),
    });
    push("commessa CHIUSA blocked missing tracciabilita", closeNoTrace.r.status >= 400, closeNoTrace.r.status, closeNoTrace.t.slice(0, 160));

    await req("/tracciabilita", {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        commessaId: ids.commessa,
        materialeId: ids.materiale,
        posizione: "A1",
        quantita: 1,
        riferimentoDisegno: `DWG-${rnd}`,
      }),
    });
    await req("/wps", {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        codice: `WB${rnd}`,
        processo: "135",
        commessaId: ids.commessa,
        materialeId: ids.materiale,
      }),
    });
    const closeNoWpqr = await req(`/commesse/${ids.commessa}`, {
      method: "PATCH",
      headers: h,
      body: JSON.stringify({ stato: "CHIUSA" }),
    });
    push("commessa CHIUSA blocked WPS without WPQR", closeNoWpqr.r.status >= 400, closeNoWpqr.r.status, closeNoWpqr.t.slice(0, 170));

    const del = await req(`/commesse/${ids.commessa}`, { method: "DELETE", headers: h });
    push("cleanup commessa delete", del.r.status === 200 || del.r.status === 201, del.r.status, del.t.slice(0, 80));
  } catch (e) {
    push("runtime exception", false, 0, String(e && e.message ? e.message : e));
  }
  console.log(JSON.stringify(out, null, 2));
}

void run();

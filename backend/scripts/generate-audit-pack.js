/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");

const qaDir = path.join(process.cwd(), "qa-evidence");
const main = JSON.parse(fs.readFileSync(path.join(qaDir, "smoke-suite-api.json"), "utf16le").replace(/^\uFEFF/, ""));
const blocking = JSON.parse(fs.readFileSync(path.join(qaDir, "smoke-blocking-additional.json"), "utf16le").replace(/^\uFEFF/, ""));

function has(testContains, moduleName) {
  return main.some(
    (x) =>
      (!moduleName || x.module === moduleName) &&
      x.test.toLowerCase().includes(testContains.toLowerCase()) &&
      x.ok,
  );
}

function hasBlocking(text) {
  return blocking.some((x) => x.test.toLowerCase().includes(text.toLowerCase()) && x.ok);
}

const checks = [
  {
    criterio: "Commessa codice/cliente + stato default/transition blocking",
    pass:
      has("create", "commesse") &&
      has("blocking IN_CORSO", "commesse") &&
      has("update IN_CORSO", "commesse") &&
      has("blocking CHIUSA", "commesse"),
    evidenza:
      "POST /commesse, PATCH /commesse/:id (IN_CORSO/CHIUSA), test blocking prerequisiti",
  },
  {
    criterio: "Materiali norma/tipo whitelist + mandatory + delete protection",
    pass:
      has("blocking invalid norma/tipo", "materiali") &&
      has("blocking missing lotto", "materiali") &&
      has("blocking delete referenced", "materiali"),
    evidenza:
      "POST /materiali (invalid/valid), DELETE /materiali/:id referenziato",
  },
  {
    criterio: "Tracciabilita obbligo riferimentoDisegno",
    pass: has("blocking missing riferimentoDisegno", "tracciabilita") && has("create", "tracciabilita"),
    evidenza: "POST /tracciabilita invalid/valid",
  },
  {
    criterio: "Checklist regole completamento (fase/esito/note/allegati)",
    pass:
      has("blocking COMPLETATA", "checklist") &&
      hasBlocking("missing esito") &&
      hasBlocking("missing note") &&
      hasBlocking("missing allegati"),
    evidenza: "POST /checklist casi negativi e PATCH complete",
  },
  {
    criterio: "NC chiusura richiede azione correttiva",
    pass: has("blocking CHIUSA without azione", "non-conformita") && has("update close with azione", "non-conformita"),
    evidenza: "POST/PATCH /non-conformita",
  },
  {
    criterio: "Audit note obbligatorie",
    pass: has("blocking missing note", "audit") && has("create", "audit") && has("update", "audit"),
    evidenza: "POST/PATCH /audit",
  },
  {
    criterio: "WPS/WPQR coerenza + validita temporale WPQR",
    pass: has("create", "wps") && has("blocking scadenza <= dataQualifica", "wpqr") && has("create", "wpqr"),
    evidenza: "POST /wps, POST /wpqr invalid/valid",
  },
  {
    criterio: "Documenti upload/delete operativo",
    pass: has("create/upload", "documenti") && has("delete", "documenti"),
    evidenza: "POST /documenti/upload, DELETE /documenti/:id",
  },
  {
    criterio: "Report API disponibile",
    pass: has("get dashboard", "report"),
    evidenza: "GET /report/dashboard",
  },
  {
    criterio: "CRUD moduli core (create/update/delete)",
    pass:
      has("create", "commesse") &&
      has("delete", "commesse") &&
      has("create", "materiali") &&
      has("update", "materiali") &&
      has("delete", "materiali") &&
      has("create", "checklist") &&
      has("update", "checklist") &&
      has("delete", "checklist"),
    evidenza: "Matrice smoke-suite-api.json",
  },
];

const lines = [];
lines.push("# EN1090 Audit Pack (QA)");
lines.push("");
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push("");
lines.push("| Criterio | Esito | Evidenza |");
lines.push("|---|---|---|");
for (const c of checks) {
  lines.push(`| ${c.criterio} | ${c.pass ? "PASS" : "FAIL"} | ${c.evidenza} |`);
}
lines.push("");
lines.push("## Riferimenti");
lines.push("- `qa-evidence/smoke-suite-api.json`");
lines.push("- `qa-evidence/smoke-blocking-additional.json`");
lines.push("- `qa-evidence/smoke-evidence-matrix.csv`");

fs.writeFileSync(path.join(qaDir, "en1090-audit-pack.md"), `${lines.join("\n")}\n`);
console.log("Generated qa-evidence/en1090-audit-pack.md");

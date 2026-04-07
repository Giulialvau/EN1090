/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");

const root = path.join(process.cwd(), "qa-evidence");
const mainPath = path.join(root, "smoke-suite-api.json");
const blockingPath = path.join(root, "smoke-blocking-additional.json");

function readJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    const raw = fs.readFileSync(p, "utf16le");
    const cleaned = raw.replace(/^\uFEFF/, "");
    return JSON.parse(cleaned);
  }
}

function escCsv(v) {
  const s = String(v ?? "");
  if (s.includes('"') || s.includes(",") || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

const main = readJson(mainPath);
const blocking = readJson(blockingPath);
const now = new Date().toISOString();

const csvRows = [
  ["suite", "module", "test", "ok", "status", "detail", "timestamp"].join(","),
  ...main.map((r) =>
    [
      "smoke-suite-api",
      escCsv(r.module),
      escCsv(r.test),
      r.ok ? "PASS" : "FAIL",
      String(r.status ?? ""),
      escCsv(r.detail ?? ""),
      now,
    ].join(","),
  ),
  ...blocking.map((r) =>
    [
      "smoke-blocking-additional",
      "blocking-rules",
      escCsv(r.test),
      r.ok ? "PASS" : "FAIL",
      String(r.status ?? ""),
      escCsv(r.detail ?? ""),
      now,
    ].join(","),
  ),
];

const md = [
  "# QA Evidence - EN1090 Smoke Suite",
  "",
  `Generated: ${now}`,
  "",
  "## Files",
  "- `smoke-suite-api.json`",
  "- `smoke-blocking-additional.json`",
  "- `smoke-evidence-matrix.csv`",
  "",
  "## Summary",
  `- Main smoke tests: ${main.length}`,
  `- Additional blocking tests: ${blocking.length}`,
  `- PASS: ${[...main, ...blocking].filter((x) => x.ok).length}`,
  `- FAIL: ${[...main, ...blocking].filter((x) => !x.ok).length}`,
  "",
  "## Notes",
  "- Status >= 400 is considered PASS for expected blocking tests.",
  "- Evidence is collected against live `http://localhost:3001`.",
  "",
].join("\n");

fs.writeFileSync(path.join(root, "smoke-evidence-matrix.csv"), `${csvRows.join("\n")}\n`);
fs.writeFileSync(path.join(root, "smoke-evidence-report.md"), md);
console.log("Generated QA evidence files in qa-evidence/");

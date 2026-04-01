import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import puppeteer from "puppeteer";
import { marked } from "marked";

const repoRoot = path.resolve(process.cwd(), "..");
const docsRoot = path.join(repoRoot, "docs");
const outPdf = path.join(docsRoot, "EN1090-technical-documentation.pdf");

const templatePath = path.join(docsRoot, "_pdf", "template.html");

const DOCS = [
  { title: "Architecture", file: path.join(docsRoot, "architecture.md") },
  { title: "Modules", file: path.join(docsRoot, "modules.md") },
  { title: "Database Schema", file: path.join(docsRoot, "database-schema.md") },
  { title: "API Overview", file: path.join(docsRoot, "api-overview.md") },
  { title: "Security", file: path.join(docsRoot, "security.md") },
  { title: "Deployment", file: path.join(docsRoot, "deployment.md") },
  { title: "Docker", file: path.join(docsRoot, "docker.md") },
  { title: "Frontend Structure", file: path.join(docsRoot, "frontend-structure.md") },
  {
    title: "Manuale Utente",
    file: path.join(docsRoot, "manuali", "manuale-utente.md"),
  },
  {
    title: "Manuale Installazione",
    file: path.join(docsRoot, "manuali", "manuale-installazione.md"),
  },
  {
    title: "Presentazione Progetto",
    file: path.join(docsRoot, "presentazione", "presentazione-progetto.md"),
  },
];

function ensureExists(p) {
  if (!fs.existsSync(p)) {
    throw new Error(`Missing file: ${p}`);
  }
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildToc(items) {
  const li = items
    .map((x) => {
      const id = x.id;
      return `<li><a href="#${escapeHtml(id)}">${escapeHtml(x.title)}</a></li>`;
    })
    .join("\n");
  return `<ul>\n${li}\n</ul>`;
}

function slugify(s) {
  return String(s)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  ensureExists(templatePath);
  for (const d of DOCS) ensureExists(d.file);

  const template = fs.readFileSync(templatePath, "utf8");

  const tocItems = DOCS.map((d) => ({ title: d.title, id: slugify(d.title) }));
  const tocHtml = buildToc(tocItems);

  const docsHtml = DOCS.map((d) => {
    const md = fs.readFileSync(d.file, "utf8");
    const html = marked.parse(md);
    const id = slugify(d.title);

    const rel = path.relative(repoRoot, d.file).replaceAll("\\", "/");
    return `
      <section class="doc" id="${escapeHtml(id)}">
        <h2 class="doc-title">${escapeHtml(d.title)}</h2>
        <div class="doc-path">${escapeHtml(rel)}</div>
        ${html}
      </section>
    `;
  }).join("\n<div class=\"page-break\"></div>\n");

  const html = template
    .replace("{{GENERATED_AT}}", escapeHtml(new Date().toISOString()))
    .replace("{{TOC}}", tocHtml)
    .replace("{{CONTENT}}", docsHtml);

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.pdf({
      path: outPdf,
      format: "A4",
      printBackground: true,
      margin: { top: "14mm", right: "12mm", bottom: "14mm", left: "12mm" },
    });
  } finally {
    await browser.close();
  }

  // eslint-disable-next-line no-console
  console.log(`PDF generated: ${outPdf}`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});


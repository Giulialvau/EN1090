"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadHtmlTemplate = loadHtmlTemplate;
exports.escapeHtml = escapeHtml;
exports.formatDateIt = formatDateIt;
exports.formatDateTimeIt = formatDateTimeIt;
exports.applyTemplate = applyTemplate;
exports.renderHtmlToPdf = renderHtmlToPdf;
const fs_1 = require("fs");
const path_1 = require("path");
const puppeteer_1 = require("puppeteer");
function loadHtmlTemplate(filename) {
    const candidates = [
        (0, path_1.join)(__dirname, 'templates', filename),
        (0, path_1.join)(process.cwd(), 'src', 'report', 'templates', filename),
    ];
    for (const p of candidates) {
        try {
            return (0, fs_1.readFileSync)(p, 'utf-8');
        }
        catch {
        }
    }
    throw new Error(`Template non trovato: ${filename}`);
}
function escapeHtml(s) {
    if (s == null)
        return '';
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
function formatDateIt(d) {
    if (d == null)
        return '—';
    const x = d instanceof Date ? d : new Date(d);
    if (Number.isNaN(x.getTime()))
        return '—';
    return x.toLocaleDateString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}
function formatDateTimeIt(d) {
    if (d == null)
        return '—';
    const x = d instanceof Date ? d : new Date(d);
    if (Number.isNaN(x.getTime()))
        return '—';
    return x.toLocaleString('it-IT');
}
function applyTemplate(template, vars) {
    let out = template;
    for (const [key, value] of Object.entries(vars)) {
        out = out.split(`{{${key}}}`).join(value);
    }
    return out;
}
const FOOTER_TMPL = `
<div style="width:100%;font-size:9px;text-align:center;color:#555;font-family:Arial,Helvetica,sans-serif;padding:6px 0 0;border-top:1px solid #ddd;">
  Pagina <span class="pageNumber"></span> / <span class="totalPages"></span>
</div>
`;
function buildFooterTemplate(options) {
    const note = options?.footerNote?.trim();
    if (!note)
        return FOOTER_TMPL;
    const safe = escapeHtml(note);
    return `
<div style="width:100%;font-size:8px;text-align:center;color:#555;font-family:Arial,Helvetica,sans-serif;padding:5px 0 0;border-top:1px solid #ddd;">
  <div style="margin-bottom:2px;">${safe}</div>
  <div>Pagina <span class="pageNumber"></span> / <span class="totalPages"></span></div>
</div>`;
}
async function renderHtmlToPdf(html, options) {
    const browser = await puppeteer_1.default.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
        ],
    });
    try {
        const page = await browser.newPage();
        await page.setContent(html, {
            waitUntil: 'load',
            timeout: 120_000,
        });
        const buf = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20mm',
                right: '20mm',
                bottom: '22mm',
                left: '20mm',
            },
            displayHeaderFooter: true,
            headerTemplate: '<div></div>',
            footerTemplate: buildFooterTemplate(options),
        });
        return new Uint8Array(buf);
    }
    finally {
        await browser.close();
    }
}
//# sourceMappingURL=report-pdf.renderer.js.map
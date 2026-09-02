#!/usr/bin/env node
/**
 * Checa o peso de cada rota buildada contra budgets.json — fonte: 08 §3.2.
 * Bloqueante no CI (02 §7 step 6). Roda depois de `astro build` (dist/client/**).
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const distDir = join(root, 'dist', 'client');
const budgets = JSON.parse(readFileSync(join(root, 'budgets.json'), 'utf-8'));

if (!existsSync(distDir)) {
  console.error(`check-budgets: ${distDir} não existe — rode "npm run build" antes.`);
  process.exit(1);
}

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

function gzKb(buf) {
  return gzipSync(buf).length / 1024;
}

function routeForFile(file) {
  const rel = file.slice(distDir.length).replace(/index\.html$/, '');
  return rel === '' ? '/' : rel;
}

function budgetFor(route) {
  const categories = ['home', 'diagnostico', 'insight', 'default'];
  for (const key of categories) {
    const cfg = budgets.routes[key];
    if (cfg.match.some((pattern) => new RegExp(pattern).test(route))) {
      return { key, ...cfg };
    }
  }
  return { key: 'default', ...budgets.routes.default };
}

function assetSizeKb(hrefOrSrc) {
  if (/^https?:\/\//.test(hrefOrSrc)) return 0; // terceiros não entram no budget de "JS próprio"/"CSS"
  const assetPath = join(distDir, hrefOrSrc.split('?')[0]);
  if (!existsSync(assetPath)) return 0;
  return gzKb(readFileSync(assetPath));
}

let failed = false;
const rows = [];

for (const file of walk(distDir)) {
  const html = readFileSync(file, 'utf-8');
  const route = routeForFile(file);
  const budget = budgetFor(route);

  const scriptSrcs = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((m) => m[1]);
  const inlineScripts = [...html.matchAll(/<script(?:(?!src=)[^>])*>([\s\S]*?)<\/script>/g)]
    .map((m) => m[1])
    .filter(Boolean);
  const styleHrefs = [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map(
    (m) => m[1],
  );
  const inlineStyles = [...html.matchAll(/<style>([\s\S]*?)<\/style>/g)].map((m) => m[1]);

  const jsKb =
    scriptSrcs.reduce((sum, src) => sum + assetSizeKb(src), 0) +
    inlineScripts.reduce((sum, code) => sum + gzKb(Buffer.from(code)), 0) / 1024;
  const cssKb =
    styleHrefs.reduce((sum, href) => sum + assetSizeKb(href), 0) +
    inlineStyles.reduce((sum, code) => sum + gzKb(Buffer.from(code)), 0) / 1024;
  const htmlKb = gzKb(Buffer.from(html));
  const totalKb = jsKb + cssKb + htmlKb;

  const jsOver = jsKb > budget.jsKb;
  const cssOver = cssKb > budget.cssKb;
  const totalOver = totalKb > budget.totalKb;
  if (jsOver || cssOver || totalOver) failed = true;

  rows.push({
    route,
    category: budget.key,
    jsKb,
    cssKb,
    totalKb,
    budget,
    jsOver,
    cssOver,
    totalOver,
  });
}

// Fontes (08 §3.2: total ≤ 140 KB)
const fontsDir = join(distDir, 'fonts');
let fontsKb = 0;
if (existsSync(fontsDir)) {
  for (const f of readdirSync(fontsDir)) {
    if (f.endsWith('.woff2')) fontsKb += statSync(join(fontsDir, f)).size / 1024;
  }
}
const fontsOver = fontsKb > budgets.fontsKb;
if (fontsOver) failed = true;

console.log('\nBudgets por rota (08 §3.2):\n');
for (const r of rows) {
  const mark = (v) => (v ? 'FAIL' : 'ok');
  console.log(
    `  ${r.route.padEnd(28)} [${r.category.padEnd(11)}] ` +
      `JS ${r.jsKb.toFixed(1)}/${r.budget.jsKb}KB ${mark(r.jsOver)}  ` +
      `CSS ${r.cssKb.toFixed(1)}/${r.budget.cssKb}KB ${mark(r.cssOver)}  ` +
      `Total ${r.totalKb.toFixed(1)}/${r.budget.totalKb}KB ${mark(r.totalOver)}`,
  );
}
console.log(
  `\n  Fontes (woff2, real, não-gzip) ${fontsKb.toFixed(1)}/${budgets.fontsKb}KB ${fontsOver ? 'FAIL' : 'ok'}`,
);

if (failed) {
  console.error('\ncheck-budgets: orçamento excedido — ver linhas FAIL acima.');
  process.exit(1);
}
console.log('\ncheck-budgets: todos os orçamentos ok.');

#!/usr/bin/env node
/**
 * Gera docs/design-tokens.md a partir de src/styles/tokens.css — fonte: 05 §6.
 * Parser simples: agrupa por comentário de seção no formato "dashes, título, dashes"
 * dentro de um comentário CSS de uma linha, e lista `--token: valor;` em ordem. Não
 * interpreta CSS de verdade — se tokens.css mudar de formato (ex.: minificação), este
 * script para de funcionar corretamente.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const css = readFileSync(join(root, 'src/styles/tokens.css'), 'utf-8');

const lines = css.split('\n');
const sections = [];
let current = { title: 'Geral', tokens: [] };

for (const line of lines) {
  const sectionMatch = line.match(/\/\*\s*-{2,}\s*(.+?)\s*-{2,}\s*\*\//);
  const tokenMatch = line.match(/^\s*(--[\w-]+):\s*([^;]+);(?:\s*\/\*\s*(.+?)\s*\*\/)?/);

  if (sectionMatch) {
    if (current.tokens.length) sections.push(current);
    current = { title: sectionMatch[1], tokens: [] };
  } else if (tokenMatch) {
    current.tokens.push({ name: tokenMatch[1], value: tokenMatch[2].trim(), note: tokenMatch[3] });
  }
}
if (current.tokens.length) sections.push(current);

let md = `# Design tokens\n\nGerado automaticamente a partir de \`src/styles/tokens.css\` (\`npm run gen-tokens-doc\`). Não editar à mão — edite o CSS e rode o script de novo.\n\nFonte da especificação: \`05-DESIGN-SYSTEM.md\` §2.\n`;

for (const section of sections) {
  md += `\n## ${section.title}\n\n| Token | Valor | Nota |\n|---|---|---|\n`;
  for (const t of section.tokens) {
    md += `| \`${t.name}\` | \`${t.value}\` | ${t.note ?? ''} |\n`;
  }
}

writeFileSync(join(root, 'docs/design-tokens.md'), md);
console.log(
  `docs/design-tokens.md gerado (${sections.reduce((n, s) => n + s.tokens.length, 0)} tokens).`,
);

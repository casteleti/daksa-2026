#!/usr/bin/env bash
# Baixa as fontes fonte (Google Fonts / IBM Plex, via github.com/google/fonts) e gera os
# subsets latin (pt-BR) em woff2 usados por src/styles/typography.css e public/fonts/.
# Fonte da decisão: 02-STACK-INFRA-SEGURANCA.md §3 (self-hosted, subset latin, variable
# fonts) e 08-ANALYTICS-FORMS-PERF-A11Y-QA.md §3.3 (preload das 2 críticas, size-adjust).
#
# Requer: python3 + fonttools[woff]+brotli (instalados num venv local, não no sistema).
# Uso: npm run subset-fonts

set -euo pipefail
cd "$(dirname "$0")/.."

VENV_DIR=".fonts-venv"
SRC_DIR=".fonts-src"
OUT_DIR="public/fonts"

# Unicode ranges: Basic Latin + Latin-1 Supplement + Latin Extended-A (œ/Œ) +
# General Punctuation (aspas curvas, travessão, reticências) + símbolo do Euro.
# Cobre pt-BR integralmente (á é í ó ú â ê î ô û ã õ ç à ü e maiúsculas).
UNICODES="U+0000-00FF,U+0100-017F,U+0152-0153,U+2000-206F,U+20AC"

mkdir -p "$SRC_DIR" "$OUT_DIR"

if [ ! -d "$VENV_DIR" ]; then
  python3 -m venv "$VENV_DIR"
  "$VENV_DIR/bin/pip" install --quiet fonttools brotli
fi

fetch() {
  local url="$1" out="$2"
  [ -f "$SRC_DIR/$out" ] || curl -sL -o "$SRC_DIR/$out" "$url"
}

fetch "https://raw.githubusercontent.com/google/fonts/main/ofl/fraunces/Fraunces%5BSOFT%2CWONK%2Copsz%2Cwght%5D.ttf" "Fraunces.ttf"
fetch "https://raw.githubusercontent.com/google/fonts/main/ofl/inter/Inter%5Bopsz%2Cwght%5D.ttf" "Inter.ttf"
fetch "https://raw.githubusercontent.com/google/fonts/main/ofl/ibmplexmono/IBMPlexMono-Regular.ttf" "IBMPlexMono-Regular.ttf"
fetch "https://raw.githubusercontent.com/google/fonts/main/ofl/ibmplexmono/IBMPlexMono-Medium.ttf" "IBMPlexMono-Medium.ttf"

PY="$VENV_DIR/bin/python"

# Fraunces: fixar SOFT=0, WONK=0 (não usados pelo design system, 05 §2.2) e restringir
# wght ao intervalo realmente usado (500–700). Mantém opsz completo (9–144): o H1 fixa
# opsz=144 explicitamente (typography.css) e o restante depende de optical sizing automático.
"$PY" -m fontTools.varLib.instancer \
  "$SRC_DIR/Fraunces.ttf" SOFT=0 WONK=0 wght=500:700 \
  -o "$SRC_DIR/Fraunces.trimmed.ttf"

# Inter: restringir wght a 400–600 (05 §2.2: pesos 400, 500, 600).
"$PY" -m fontTools.varLib.instancer \
  "$SRC_DIR/Inter.ttf" wght=400:600 \
  -o "$SRC_DIR/Inter.trimmed.ttf"

# layout-features restrito a rvrn (obrigatório em fonte variável) + liga + kern:
# descarta stylistic sets, swashes e alternates não usados no design system — maior
# alavanca de redução de tamanho depois do range de eixos.
"$PY" -m fontTools.subset "$SRC_DIR/Fraunces.trimmed.ttf" \
  --unicodes="$UNICODES" \
  --layout-features='rvrn,liga,kern' \
  --flavor=woff2 \
  --output-file="$OUT_DIR/fraunces-variable.woff2"

"$PY" -m fontTools.subset "$SRC_DIR/Inter.trimmed.ttf" \
  --unicodes="$UNICODES" \
  --layout-features='rvrn,liga,kern' \
  --flavor=woff2 \
  --output-file="$OUT_DIR/inter-variable.woff2"

# Plex Mono: mantém tnum (tabular figures) — usado por .data { font-variant-numeric: tabular-nums }.
"$PY" -m fontTools.subset "$SRC_DIR/IBMPlexMono-Regular.ttf" \
  --unicodes="$UNICODES" \
  --layout-features='liga,kern,tnum' \
  --flavor=woff2 \
  --output-file="$OUT_DIR/ibm-plex-mono-400.woff2"

"$PY" -m fontTools.subset "$SRC_DIR/IBMPlexMono-Medium.ttf" \
  --unicodes="$UNICODES" \
  --layout-features='liga,kern,tnum' \
  --flavor=woff2 \
  --output-file="$OUT_DIR/ibm-plex-mono-500.woff2"

echo "Fontes geradas em $OUT_DIR:"
ls -la "$OUT_DIR"/*.woff2

TOTAL=$(du -cb "$OUT_DIR"/*.woff2 | tail -1 | cut -f1)
BUDGET=$((140 * 1024))
echo "Total: $TOTAL bytes (orçamento 08 §3.2: $BUDGET bytes / 140 KB)"
if [ "$TOTAL" -gt "$BUDGET" ]; then
  echo "AVISO: acima do orçamento em $((TOTAL - BUDGET)) bytes. gvar (deltas de interpolação" \
       "do eixo variável) domina o tamanho da Fraunces mesmo após restringir wght/features;" \
       "não há mais ganho fácil sem abandonar a exigência de fonte variável (02 §3). Ver docs/inputs.md."
fi

/** Formatação compartilhada — BRL (LeakCalculator, 05 §3) e datas (insights, 07 §5). */

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
});

export function formatBRL(value: number): string {
  return brl.format(value);
}

const dateLong = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

export function formatDateLong(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return dateLong.format(d);
}

/**
 * Bucket de vazamento para analytics — 08 §1.2 `calculator_complete`:
 * nunca enviar o valor exato, só a faixa.
 */
export function leakBucket(monthlyLeak: number): '<10k' | '10-50k' | '50-200k' | '>200k' {
  if (monthlyLeak < 10_000) return '<10k';
  if (monthlyLeak < 50_000) return '10-50k';
  if (monthlyLeak < 200_000) return '50-200k';
  return '>200k';
}

/**
 * Tempo de leitura estimado (Insights) — 200 palavras/min, arredondado para cima.
 * Content Collections calcula `readingTime` automaticamente (07 §6) a partir disto.
 */
export function estimateReadingTime(bodyText: string): number {
  const words = bodyText.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

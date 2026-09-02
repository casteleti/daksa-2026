import { describe, expect, it } from 'vitest';
import { formatBRL, leakBucket, estimateReadingTime } from '../../src/lib/format';

describe('formatBRL', () => {
  it('formata inteiro em BRL sem casas decimais', () => {
    expect(formatBRL(45000)).toContain('45.000');
  });
});

/** Fonte da regra: 08-ANALYTICS-FORMS-PERF-A11Y-QA.md §1.2 (calculator_complete). */
describe('leakBucket', () => {
  it('nunca deve vazar o valor exato — só a faixa', () => {
    expect(leakBucket(5000)).toBe('<10k');
    expect(leakBucket(25000)).toBe('10-50k');
    expect(leakBucket(120000)).toBe('50-200k');
    expect(leakBucket(500000)).toBe('>200k');
  });

  it('trata os limites de faixa corretamente', () => {
    expect(leakBucket(9999)).toBe('<10k');
    expect(leakBucket(10000)).toBe('10-50k');
    expect(leakBucket(49999)).toBe('10-50k');
    expect(leakBucket(50000)).toBe('50-200k');
    expect(leakBucket(199999)).toBe('50-200k');
    expect(leakBucket(200000)).toBe('>200k');
  });
});

describe('estimateReadingTime', () => {
  it('arredonda para cima e nunca retorna menos de 1 minuto', () => {
    expect(estimateReadingTime('uma frase curta')).toBe(1);
    expect(estimateReadingTime(Array(250).fill('palavra').join(' '))).toBe(2);
  });
});

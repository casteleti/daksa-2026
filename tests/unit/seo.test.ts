import { describe, expect, it } from 'vitest';
import { canonicalUrl, validateSeo } from '../../src/lib/seo';

describe('canonicalUrl', () => {
  it('junta o domínio do site com o path absoluto', () => {
    expect(canonicalUrl('/o-que-fazemos/')).toMatch(/\/o-que-fazemos\/$/);
  });
});

/** Fonte das regras: 01-CONTEXTO-POSICIONAMENTO-COPY.md §6.3. */
describe('validateSeo', () => {
  it('aceita title/description dentro dos limites', () => {
    const problems = validateSeo({
      title: 'Diagnóstico de receita em 5 dias | Daksa',
      description:
        'Em 5 dias medimos quanto sua empresa perde entre o primeiro contato e o pedido, e entregamos as três correções prioritárias da sua operação comercial hoje.',
    });
    expect(problems).toHaveLength(0);
  });

  it('rejeita title acima de 60 caracteres', () => {
    const problems = validateSeo({
      title: 'x'.repeat(61),
      description: 'y'.repeat(150),
    });
    expect(problems.some((p) => p.includes('title'))).toBe(true);
  });

  it('rejeita description fora de 140–155 caracteres', () => {
    const short = validateSeo({ title: 'ok', description: 'muito curta' });
    expect(short.some((p) => p.includes('description'))).toBe(true);
  });

  it('rejeita exclamação em title/description (01 §4: sem exclamação)', () => {
    const problems = validateSeo({
      title: 'Venda mais!',
      description: 'y'.repeat(150),
    });
    expect(problems.some((p) => p.includes('exclamação'))).toBe(true);
  });
});

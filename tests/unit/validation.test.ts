import { describe, expect, it } from 'vitest';
import {
  classifyLeadTier,
  contactSchema,
  diagnosticLeadSchema,
  isFreeEmailDomain,
} from '../../src/lib/validation';

/** Fonte da regra: 08-ANALYTICS-FORMS-PERF-A11Y-QA.md §2.1. */
describe('classifyLeadTier', () => {
  it('classifica tier A: segmento válido + time grande + cargo decisor', () => {
    expect(
      classifyLeadTier({ segment: 'Indústria', teamSize: '16–40', role: 'Diretor comercial' }),
    ).toBe('A');
  });

  it('classifica tier B: segmento válido + só um dos dois critérios', () => {
    expect(
      classifyLeadTier({
        segment: 'Distribuidora/atacadista',
        teamSize: '6–15',
        role: 'Marketing',
      }),
    ).toBe('B');
    expect(classifyLeadTier({ segment: 'Indústria', teamSize: 'até 5', role: 'Dono/CEO' })).toBe(
      'B',
    );
  });

  it('classifica tier C: segmento inválido, mesmo com time grande e cargo decisor', () => {
    expect(classifyLeadTier({ segment: 'Outro', teamSize: '40+', role: 'Diretor comercial' })).toBe(
      'C',
    );
  });

  it('classifica tier C: segmento válido mas time pequeno e cargo não decisor', () => {
    expect(classifyLeadTier({ segment: 'Indústria', teamSize: 'até 5', role: 'TI' })).toBe('C');
  });
});

describe('isFreeEmailDomain', () => {
  it('identifica domínio gratuito comum', () => {
    expect(isFreeEmailDomain('diretor@gmail.com')).toBe(true);
  });
  it('não sinaliza domínio corporativo', () => {
    expect(isFreeEmailDomain('diretor@industriaexemplo.com.br')).toBe(false);
  });
});

describe('diagnosticLeadSchema', () => {
  const validBase = {
    name: 'Ricardo Exemplo',
    email: 'ricardo@industriaexemplo.com.br',
    company: 'Indústria Exemplo',
    role: 'Diretor comercial' as const,
    segment: 'Indústria' as const,
    teamSize: '6–15' as const,
    turnstileToken: 'token-de-teste',
  };

  it('aceita payload válido com honeypot vazio', () => {
    const result = diagnosticLeadSchema.safeParse(validBase);
    expect(result.success).toBe(true);
  });

  it('rejeita honeypot preenchido (bot) — 02 §5', () => {
    const result = diagnosticLeadSchema.safeParse({ ...validBase, website: 'http://spam.example' });
    expect(result.success).toBe(false);
  });

  it('rejeita e-mail sem formato válido', () => {
    const result = diagnosticLeadSchema.safeParse({ ...validBase, email: 'não-é-email' });
    expect(result.success).toBe(false);
  });

  it('rejeita cargo fora do enum definido em 08 §2.1', () => {
    const result = diagnosticLeadSchema.safeParse({ ...validBase, role: 'CEO Global' });
    expect(result.success).toBe(false);
  });
});

describe('contactSchema', () => {
  it('exige mensagem não vazia — 08 §2.2', () => {
    const result = contactSchema.safeParse({
      name: 'Ricardo',
      email: 'ricardo@exemplo.com.br',
      message: '',
      turnstileToken: 'token',
    });
    expect(result.success).toBe(false);
  });
});

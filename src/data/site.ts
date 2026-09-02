/**
 * Dados globais do site. Dados reais da empresa — fonte: 01-CONTEXTO-POSICIONAMENTO-COPY.md §8
 * ("Dados reais da empresa (resolvidos)"). Campos ainda marcados TODO:O# dependem de
 * decisões abertas em 09-ROADMAP-RISCOS-DECISOES.md §3 — ver docs/inputs.md.
 */
export const site = {
  name: 'Daksa',
  legalName: 'Daksa',
  tagline: 'Operação comercial. Resultado, não relatório.',
  url: 'https://daksa.com.br',
  email: 'atendimento@daksa.com.br',
  phone: '+55 16 99740-0144',
  address: {
    street: 'R. Floriano Peixoto, 20',
    neighborhood: 'Centro',
    city: 'Jaboticabal',
    state: 'SP',
    postalCode: '14870-370',
    country: 'BR',
  },
  /** 2004 → 22 anos completos em 2026 (01 §8). */
  foundingYear: 2004,
  social: {
    linkedin: 'https://br.linkedin.com/company/daksa---marketing-e-tecnologia',
    // Instagram/Facebook existem mas ficam fora do site (O9, 09 §3) — não adicionar aqui.
  },
  locale: 'pt-BR',
  themeColor: {
    light: '#f5f4f0',
    dark: '#14181d',
  },
} as const;

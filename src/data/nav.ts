/**
 * Estrutura de navegação. Fonte: 03-ARQUITETURA-SITE-PAGINAS.md §2.
 * `trailingSlash: 'always'` (astro.config.mjs) — todos os hrefs terminam em '/'.
 */

export interface NavLink {
  label: string;
  href: string;
}

export interface NavGroup {
  label: string;
  href: string; // hub da própria seção (dropdown ainda leva a algum lugar ao clicar)
  items: NavLink[];
}

/** Header desktop: Logo · dropdowns/links · CTA. Fonte: 03 §2. */
export const headerNav: Array<NavGroup | NavLink> = [
  {
    label: 'O que fazemos',
    href: '/o-que-fazemos/',
    items: [
      { label: 'Diagnóstico de receita', href: '/o-que-fazemos/diagnostico-de-receita/' },
      { label: 'Implantação', href: '/o-que-fazemos/implantacao/' },
      { label: 'Estabilização', href: '/o-que-fazemos/estabilizacao/' },
      { label: 'Operação contínua', href: '/o-que-fazemos/operacao-continua/' },
      { label: 'Como funciona', href: '/o-que-fazemos/como-funciona/' },
    ],
  } satisfies NavGroup,
  {
    label: 'Para quem',
    href: '/para-quem/',
    items: [
      { label: 'Indústrias', href: '/para-quem/industrias/' },
      { label: 'Distribuidoras & atacadistas', href: '/para-quem/distribuidoras-e-atacadistas/' },
    ],
  } satisfies NavGroup,
  // "Como funciona" também é link direto no header, fora do dropdown (03 §1: "promovido a link direto") —
  // decisão deliberada, não duplicação acidental.
  { label: 'Como funciona', href: '/o-que-fazemos/como-funciona/' } satisfies NavLink,
  { label: 'Resultados', href: '/resultados/' } satisfies NavLink,
  {
    label: 'Sobre',
    href: '/sobre/',
    items: [
      { label: 'Nossa história', href: '/sobre/nossa-historia/' },
      { label: 'Como pensamos', href: '/sobre/como-pensamos/' },
    ],
  } satisfies NavGroup,
  { label: 'Insights', href: '/insights/' } satisfies NavLink,
];

export const headerCta: NavLink = { label: 'Solicitar diagnóstico', href: '/diagnostico/' };
export const headerCtaSecondary: NavLink = { label: 'Fale com um especialista', href: '/contato/' };

/**
 * Footer: 4 colunas. Fonte: 03 §2 ("O que fazemos / Para quem + Resultados / Sobre + Insights /
 * Tecnologia / Contato + legal"). A pontuação da fonte é ambígua sobre o agrupamento exato das
 * últimas colunas — assumimos [Tecnologia + Contato + legal] como 4ª coluna para fechar em 4
 * grupos balanceados; se O1 ou revisão de UX definirem outro agrupamento, ajustar aqui apenas.
 */
export const footerNav: NavGroup[] = [
  {
    label: 'O que fazemos',
    href: '/o-que-fazemos/',
    items: [
      { label: 'Diagnóstico de receita', href: '/o-que-fazemos/diagnostico-de-receita/' },
      { label: 'Implantação', href: '/o-que-fazemos/implantacao/' },
      { label: 'Estabilização', href: '/o-que-fazemos/estabilizacao/' },
      { label: 'Operação contínua', href: '/o-que-fazemos/operacao-continua/' },
      { label: 'Como funciona', href: '/o-que-fazemos/como-funciona/' },
    ],
  },
  {
    label: 'Para quem',
    href: '/para-quem/',
    items: [
      { label: 'Indústrias', href: '/para-quem/industrias/' },
      { label: 'Distribuidoras & atacadistas', href: '/para-quem/distribuidoras-e-atacadistas/' },
      { label: 'Resultados', href: '/resultados/' },
    ],
  },
  {
    label: 'Sobre',
    href: '/sobre/',
    items: [
      { label: 'Nossa história', href: '/sobre/nossa-historia/' },
      { label: 'Como pensamos', href: '/sobre/como-pensamos/' },
      { label: 'Insights', href: '/insights/' },
    ],
  },
  {
    label: 'Tecnologia',
    href: '/tecnologia/',
    items: [
      { label: 'Arquitetura', href: '/tecnologia/arquitetura/' },
      { label: 'Integrações', href: '/tecnologia/integracoes/' },
      { label: 'Governança de IA', href: '/tecnologia/governanca-de-ia/' },
      { label: 'Segurança e LGPD', href: '/tecnologia/seguranca-e-lgpd/' },
      { label: 'Fale com um especialista', href: '/contato/' },
    ],
  },
];

export const footerLegal: NavLink[] = [
  { label: 'Privacidade', href: '/privacidade/' },
  { label: 'Termos', href: '/termos/' },
];

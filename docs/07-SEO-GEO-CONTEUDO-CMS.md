# 07 — SEO, GEO, CONTEÚDO E CMS

Legenda: **[EV]** documentação oficial (Google Search Central, OpenAI, Bing) · **[BP]** boa prática consolidada · **[HIP]** hipótese experimental, medir

---

## 1. Princípio

**[EV]** AI Overviews/AI Mode usam os sistemas centrais do Search; não há requisito técnico adicional nem schema especial. Página precisa estar indexada e apta a snippet. **[EV]** OpenAI: `OAI-SearchBot` precisa estar permitido para inclusão em ChatGPT Search; atribuição por `utm_source=chatgpt.com`. **[EV]** Bing: Webmaster Tools + IndexNow.

Conclusão: GEO = SEO técnico sólido + conteúdo claro, autocontido, com entidades e provas + política deliberada de crawlers de IA + medição. Nada de `llms.txt` como fato, chunking obrigatório, keyword de LLM.

---

## 2. SEO técnico

| Item | Especificação |
|---|---|
| Rendering | Estático (SSG) para todas as páginas de conteúdo; SSR só `/api/*`. HTML completo, sem conteúdo pós-click |
| Crawl | `robots.txt`: `Allow: /` para `*`, `Googlebot`, `Bingbot`, `OAI-SearchBot`, `PerplexityBot`, `ClaudeBot`, `Google-Extended` (decisão: permitir treino? **[DEC] permitir** — visibilidade > proteção de conteúdo institucional); `Disallow: /api/`, `/_styleguide`, `/keystatic`; `Sitemap:` |
| Indexação | `noindex` em: preview/staging (header), `/resultados/cases/` enquanto vazio, `/insights/tag/*` com < 3 itens, `/404`, `/_styleguide`. Canonical absoluta em todas; `trailingSlash: 'always'` |
| Sitemap | `@astrojs/sitemap` com `lastmod` real (data de `dateModified` da collection), excluindo noindex; submissão em Search Console e Bing; IndexNow no deploy (Cloudflare Worker) **[BP]** |
| Status | 200/301/404 corretos; redirects em `_redirects` (Cloudflare Pages); sem soft-404; 410 para removidas |
| URLs | minúsculas, hífen, sem acento, sem parâmetros; máx. 3 níveis |
| Links internos | regras em 03 §5; toda página ≤ 3 cliques; breadcrumb; sem órfãs (teste no CI via crawl do build) |
| Metadata | title ≤ 60, description 140–155, um H1, hierarquia H2/H3 sem pular |
| Social | Open Graph + Twitter Card; imagem OG gerada em build (1200 × 630) por página com título sobre grafite + assinatura — template próprio, sem foto |
| Imagens | `alt` real; nomes descritivos; AVIF/WebP; `width/height`; sitemap de imagens não necessário em v1 |
| Vídeo | nenhum |
| JS SEO | nada crítico em JS; ilhas não contêm conteúdo indexável exclusivo |
| Performance SEO | CWV no campo (08); page experience |
| i18n | `lang="pt-BR"`; estrutura para `/en/` com `hreflang` futura |
| Pagination | Insights: `/insights/`, `/insights/2/`; `rel=prev/next` (Bing) + links visíveis |
| Hreflang | fase futura |

---

## 3. Arquitetura de informação para busca

### 3.1 Entidades

| Entidade | Página canônica | Schema |
|---|---|---|
| Daksa (organização) | `/sobre/nossa-historia/` (about) + site-wide | `Organization` (`ProfessionalService`), `foundingDate`, `areaServed: BR`, `knowsAbout`, `sameAs` (LinkedIn) |
| Consultoria de operação comercial (serviço-guarda-chuva) | `/o-que-fazemos/` | `Service` + `OfferCatalog` |
| Diagnóstico de receita | `/o-que-fazemos/diagnostico-de-receita/` | `Service` |
| Implantação / Estabilização / Operação contínua | respectivas | `Service` |
| Agente de qualificação / follow-up / reativação / atualização de CRM | `/o-que-fazemos/como-funciona/` | `DefinedTerm` em `DefinedTermSet` |
| Vazamento de receita (conceito) | insight pilar | `Article` + definição no topo |
| Indústrias / Distribuidoras (setores) | `/para-quem/*` | `WebPage` `about` |
| [Fundador] | `/sobre/nossa-historia/` | `Person` (`jobTitle`, `worksFor`, `sameAs`) |
| Insights | `/insights/*` | `BlogPosting` |
| FAQs | por página | `FAQPage` (só quando visível) |
| Breadcrumb | todas | `BreadcrumbList` |

Nunca: `Review`, `AggregateRating`, `Event`, `Product` — não correspondem a conteúdo visível.

### 3.2 Hubs, pilares e clusters

| Hub (pilar) | Cluster (supporting content — Insights) |
|---|---|
| Vazamento de receita (pilar: insight longo "O que é vazamento de receita e como medir") | tempo de resposta; follow-up esquecido; pipeline parado; carteira inativa; CRM abandonado; baseline comercial |
| Operação comercial para indústrias | cotação técnica; representante comercial e CRM; ciclo longo; engenharia de aplicação |
| Operação comercial para distribuidoras | recompra; clientes inativos; vendedor de carteira; SKU e mix |
| Agentes de IA em vendas com governança | o que um agente de follow-up faz; humano no loop; permissões e logs; por que não chatbot |
| CRM que o vendedor usa | adoção de CRM; campos que importam; WhatsApp e CRM; dados sujos |

Cada insight linka o pilar e o serviço/segmento relevante; o pilar linka ≥ 3 insights.

### 3.3 Intenção por página (resumo — completo em 03 §3)

| Página | Intenção primária | Secundárias | Keywords-semente (pt-BR) | Perguntas a responder |
|---|---|---|---|---|
| Home | navegacional/comercial | informacional | consultoria de operação comercial; vazamento de receita; sistema comercial B2B | o que fazem; para quem; como começa |
| Diagnóstico | transacional/comercial | informacional | diagnóstico comercial; diagnóstico de vendas B2B | quanto tempo; o que recebo; custa; creditado |
| Implantação | comercial | informacional | implantação de CRM indústria; automação comercial; integração CRM WhatsApp | trocam meu CRM?; quanto tempo; o que meu time faz |
| Operação contínua | comercial | — | operação comercial terceirizada; RevOps Brasil | o que é operar; o que acontece por mês; dependência |
| Como funciona | informacional/comercial | técnica | agente de IA para vendas; follow-up automático; agente de qualificação | o que o agente decide; quando escala; é chatbot? |
| Indústrias | comercial | informacional | CRM para indústria; vendas B2B indústria; cotação técnica | funciona para minha indústria?; representante |
| Distribuidoras | comercial | informacional | CRM para distribuidora; reativar clientes inativos; recompra | carteira grande; SKU; recompra |
| Resultados | comercial | — | resultados consultoria comercial; métricas de vendas B2B | como provam; o que medem |
| Tecnologia/* | técnica | — | governança IA vendas; human in the loop; LGPD CRM automação; integração ERP CRM | segurança; lock-in; onde ficam os dados |

Não criar páginas para keywords sem intenção real de negócio.

---

## 4. GEO — citabilidade

**[BP]** O que torna uma página selecionável por sistemas generativos coincide com o que a torna boa: resposta direta no início, definições claras, listas e tabelas semânticas, dados originais, autoria, datas, fontes.

Regras aplicadas:
1. **Resposta em 3 frases no topo** de toda página de serviço, segmento, tecnologia e insight (parágrafo `lead`): quem/o quê/para quem/resultado.
2. **Definições autocontidas**: "Diagnóstico de receita é…", "Agente de follow-up é…" — uma frase, sem depender de contexto.
3. **Perguntas como H2/H3** quando a intenção é pergunta ("O agente substitui o vendedor?").
4. **Tabelas e listas semânticas** para comparações e etapas.
5. **Autoria e datas** em insights (`author`, `datePublished`, `dateModified` visíveis e no schema).
6. **Metodologia explícita** (Resultados: como fazemos baseline).
7. **Honestidade sobre limites** (nota "publicaremos cases à medida que…") — sinal de confiabilidade.
8. **Dados originais** **[HIP]**: após 5+ diagnósticos, publicar benchmark anonimizado ("tempo médio de primeira resposta em distribuidoras: X h") como página `Dataset`/`Article` — maior alavanca de GEO futura.
9. **Crawlers de IA permitidos** (robots) e política documentada em `/privacidade` ou `/termos`.
10. **Medição** **[HIP]**: painel mensal de 30 consultas em ChatGPT/Perplexity/AI Overviews (ex.: "consultoria de operação comercial para indústria no Brasil") registrando menção/citação; referrals com `utm_source=chatgpt.com` e `perplexity.ai` em GA4. Tratar como probabilidade, não ranking.

Não fazer: `llms.txt` como se garantisse algo (pode existir como cortesia, sem expectativa), páginas "para IA", texto oculto, schema que não corresponde ao visível.

---

## 5. Dados estruturados — por template

| Template | Schema (JSON-LD, `src/lib/schema.ts`) |
|---|---|
| Base (todas) | `WebSite` (name, url, inLanguage), `Organization` (name, url, logo, foundingDate, sameAs, contactPoint) |
| Serviço | `Service` (name, description, provider→Organization, serviceType, areaServed, `offers` **sem preço** — apenas `availability`), `BreadcrumbList`, `FAQPage` se houver FAQ visível |
| Como funciona | `WebPage`, `DefinedTermSet` + 4 `DefinedTerm`, `FAQPage`, `BreadcrumbList` |
| Segmento | `WebPage` (`about` → `Thing` setor), `FAQPage`, `BreadcrumbList` |
| Resultados | `WebPage`, `BreadcrumbList` |
| Sobre/História | `AboutPage`, `Organization` (completa), `Person` |
| Insight | `BlogPosting` (headline, author→Person, datePublished, dateModified, image→OG, wordCount, articleSection→tag), `BreadcrumbList` |
| Case (futuro) | `Article` + `Organization` do cliente só se autorizado |
| Contato | `ContactPage` |
| Tecnologia | `TechArticle`, `FAQPage`, `BreadcrumbList` |

Validação no CI: script gera JSON-LD de cada rota do build e valida contra schema (`schema-dts` types + teste de campos obrigatórios); Rich Results Test manual antes do lançamento.

---

## 6. Content models (Content Collections, Zod)

| Collection | Campos | Relações | SEO/Schema | Obrigatório | Owner / revisão |
|---|---|---|---|---|---|
| `services` | slug, name, shortName, lead (3 frases), duration, deliverables[], requirements[], faq[]→faqs, order, seo{title,description}, ogImage? | `next`, `prev` (slugs) | `Service` | lead, duration, deliverables, seo | Fundador / trimestral |
| `segments` | slug, name, lead, flowSteps[], signals[], agentMapping[]{agent,context}, glossary[]{term,definition}, faq[], seo | services (all) | `WebPage about` | lead, signals, seo | Fundador / trimestral |
| `agents` | slug, name, does, kpi[], permissions[], escalatesWhen[], logExample[] | — | `DefinedTerm` | todos | Técnico / trimestral |
| `metrics` | slug, name, phase(before/during/after), definition, unit, howMeasured | — | tabela | todos | RevOps / semestral |
| `insights` | slug, title, summary (≤ 160), lead (3 frases), body(MDX), author→authors, tags[], datePublished, dateModified, readingTime(auto), related[]→services/segments, seo, draft | authors | `BlogPosting` | title, summary, lead, author, datePublished, ≥ 1 tag | Autor / anual |
| `authors` | slug, name, role, bio (≤ 400), photo, linkedin, sameAs[] | — | `Person` | name, role, bio | — |
| `cases` | slug, title, segment→segments, companySize, anonymized(bool), clientName?, baseline[]{metric,value}, actions[], results[]{metric,before,after}, quote?{text,name,role,authorized:true}, datePublished, seo, published(bool) | segments, metrics | `Article` | segment, baseline, results, published | Fundador / por caso |
| `faqs` | id, question, answer (≤ 600), pages[] | — | `FAQPage` | todos | Fundador |
| `timeline` (história) | year, title, text | — | — | todos | Fundador |
| `principles` | order, title, text | — | lista | todos | Fundador |
| `techPages` | slug, title, lead, body(MDX), faq[], seo | — | `TechArticle` | lead, seo | Técnico / semestral |
| `legal` | slug, title, body, lastReviewed | — | — | lastReviewed | Jurídico / anual |

Regras editoriais em `docs/content-guide.md`: tom (01 §4), estrutura de insight (lead → problema → como medir → o que fazer → CTA contextual), mínimo 900 palavras em insights, 2 links internos, sem imagem de banco, autor real.

---

## 7. CMS — decisão

| Opção | Experiência editorial | Preview | Workflow | Versionamento | SEO fields | Custo | Manutenção | Veredito |
|---|---|---|---|---|---|---|---|---|
| **Git-based: Content Collections + Keystatic** | boa (UI de formulário, MDX editor), local ou cloud | via Cloudflare Pages preview por branch | PR = revisão | Git nativo | schema Zod | 0 (cloud free tier) | mínima | **Escolhido (v1 e v2)** |
| Headless (Sanity/Contentful/Payload) | excelente | plugin | roles/estados | histórico do CMS | sim | R$ 0–500/mês | integração, rebuild hooks, mais superfície | fase 3 se equipe editorial ≥ 3 ou conteúdo diário |
| Tradicional (WordPress headless) | familiar | complexo | sim | plugins | plugins | hospedagem + segurança | alta | não |
| Custom | — | — | — | — | — | alto | alta | não |

Fase 1: editar Markdown/MDX no repositório (fundador + 1 pessoa). Fase 2: Keystatic (`/keystatic`, GitHub OAuth, protegido por Cloudflare Access) com preview de branch. Rebuild automático por push. Publicação agendada: campo `datePublished` futuro + cron de rebuild diário (Cloudflare Cron Trigger → deploy hook).

Mídia: imagens no repositório (`src/assets`) otimizadas em build; limite 2 MB por imagem original; sem CDN de mídia separado em v1.

---

## 8. Governança de conteúdo

- Cada collection tem owner e periodicidade de revisão (tabela §6).
- `dateModified` atualizado a cada edição substantiva (script pre-commit avisa).
- Auditoria trimestral: páginas sem cliques (GSC), sem links internos, com `dateModified` > 12 meses.
- Nenhuma página publicada sem: lead de 3 frases, title/description, ≥ 2 links internos, revisão de tom (checklist em PR template).

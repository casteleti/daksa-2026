# 03 — ARQUITETURA DO SITE E ESPECIFICAÇÃO DE PÁGINAS

---

## 1. Análise crítica da árvore proposta no brief

| Item do brief | Decisão | Justificativa |
|---|---|---|
| "Para quem" com 4 itens (Indústrias, Distribuidoras, Serviços B2B, Operações Comerciais Complexas) | **Reduzido a 2** | Coerência com ICP validado; "Serviços B2B" é outra dinâmica comercial não modelada; "Operações Comerciais Complexas" não segmenta (gaveta genérica). Registrado como decisão aberta O2 |
| "Insights" com 5 temas (operação comercial, vendas B2B, automação, dados, IA aplicada) | **Um fio editorial** com tags internas | Autoridade de nicho exige foco; tags permitem organizar sem sinalizar amplitude no menu |
| Sem página de conversão dedicada | **Adicionada `/diagnostico`** | Conversão primária precisa de landing própria (SEO, ads futuros, jornada curta) |
| Sem profundidade técnica navegável | **Adicionado hub `/tecnologia`** fora do menu principal, linkado de "Como funciona" e rodapé | TI e analistas precisam aprofundar sem poluir a navegação de negócio |
| "Cases" no menu | **Rota existe, fora do menu, `noindex` até 1 case** | Guardrail: não inventar prova |
| "Como funciona" como 4º item de "O que fazemos" | **Mantido, e promovido a link direto no header** | É a página mais importante depois da home para TI e gestores |
| CTA "Fale com um especialista" | **Renomeado no header para "Solicitar diagnóstico"**; "Fale com um especialista" vira link secundário | Alinha com D5 |
| Profundidade | Máximo 3 níveis de URL; todas as páginas a ≤ 3 cliques da home | Crawl e UX |

---

## 2. Árvore final (navegação + rotas)

```
HOME  /
│
├── O QUE FAZEMOS  /o-que-fazemos/
│   ├── Diagnóstico de receita       /o-que-fazemos/diagnostico-de-receita/
│   ├── Implantação                  /o-que-fazemos/implantacao/
│   ├── Estabilização                /o-que-fazemos/estabilizacao/
│   ├── Operação contínua            /o-que-fazemos/operacao-continua/
│   └── Como funciona                /o-que-fazemos/como-funciona/        ← também link direto no header
│
├── PARA QUEM  /para-quem/
│   ├── Indústrias                   /para-quem/industrias/
│   └── Distribuidoras & atacadistas /para-quem/distribuidoras-e-atacadistas/
│
├── RESULTADOS  /resultados/
│   ├── O que medimos                (seção da página índice)
│   └── Cases                        /resultados/cases/  (fora do menu, noindex até conteúdo)
│       └── [case]                   /resultados/cases/[slug]/
│
├── SOBRE  /sobre/
│   ├── Nossa história               /sobre/nossa-historia/
│   └── Como pensamos                /sobre/como-pensamos/
│
├── INSIGHTS  /insights/
│   ├── [artigo]                     /insights/[slug]/
│   └── [tag]                        /insights/tag/[tag]/
│
├── [CTA] SOLICITAR DIAGNÓSTICO      /diagnostico/
│
├── (rodapé / links contextuais)
│   ├── Fale com um especialista     /contato/
│   ├── Tecnologia                   /tecnologia/
│   │   ├── Arquitetura              /tecnologia/arquitetura/
│   │   ├── Integrações              /tecnologia/integracoes/
│   │   ├── Governança de IA         /tecnologia/governanca-de-ia/
│   │   └── Segurança e LGPD         /tecnologia/seguranca-e-lgpd/
│   ├── Privacidade                  /privacidade/
│   ├── Termos                       /termos/
│   └── RSS                          /rss.xml
│
└── 404  /404/
```

**Header (desktop):** Logo · O que fazemos (dropdown 5 itens) · Para quem (dropdown 2 itens) · Como funciona · Resultados · Sobre (dropdown 2) · Insights · [Botão: Solicitar diagnóstico]
**Header (mobile):** Logo · [Botão: Diagnóstico] · Menu (drawer)
**Footer:** 4 colunas (O que fazemos / Para quem + Resultados / Sobre + Insights + Tecnologia / Contato + legal) + assinatura + LGPD

Regra de URL: minúsculas, hífens, sem acentos, trailing slash consistente (`trailingSlash: 'always'`), sem parâmetros indexáveis.

---

## 3. Inventário de páginas

| # | Página | Rota | Tipo | Prioridade | Persona principal | Intenção de busca | Conversão |
|---|---|---|---|---|---|---|---|
| 1 | Home | `/` | Landing | P0 | Dono / Diretor comercial | Navegacional + "consultoria operação comercial" | Diagnóstico |
| 2 | O que fazemos (hub) | `/o-que-fazemos/` | Hub | P0 | Diretor / gerente | "como melhorar operação comercial" | Diagnóstico |
| 3 | Diagnóstico de receita | `/o-que-fazemos/diagnostico-de-receita/` | Serviço | P0 | Diretor / dono | "diagnóstico comercial", "vazamento de receita" | Diagnóstico |
| 4 | Implantação | `/o-que-fazemos/implantacao/` | Serviço | P0 | Gerente / TI | "implantação CRM indústria", "automação comercial" | Diagnóstico |
| 5 | Estabilização | `/o-que-fazemos/estabilizacao/` | Serviço | P1 | Gerente | (baixo volume) | Diagnóstico |
| 6 | Operação contínua | `/o-que-fazemos/operacao-continua/` | Serviço | P0 | Diretor / dono | "operação comercial terceirizada", "RevOps" | Diagnóstico |
| 7 | Como funciona | `/o-que-fazemos/como-funciona/` | Método | P0 | Todos (TI, gerente) | "agente de IA para vendas", "follow-up automático" | Diagnóstico + Tecnologia |
| 8 | Para quem (hub) | `/para-quem/` | Hub | P1 | Todos | — | Segmentos |
| 9 | Indústrias | `/para-quem/industrias/` | Segmento | P0 | Diretor industrial | "CRM para indústria", "vendas B2B indústria" | Diagnóstico |
| 10 | Distribuidoras & atacadistas | `/para-quem/distribuidoras-e-atacadistas/` | Segmento | P0 | Diretor distribuidora | "CRM distribuidora", "reativação de clientes inativos" | Diagnóstico |
| 11 | Resultados | `/resultados/` | Prova | P0 | Dono / CFO | "resultados consultoria comercial" | Diagnóstico |
| 12 | Cases (lista) | `/resultados/cases/` | Lista | P2 (oculta) | Dono | — | — |
| 13 | Case | `/resultados/cases/[slug]/` | Artigo | P2 | Dono | Por case | Diagnóstico |
| 14 | Sobre (hub) | `/sobre/` | Hub | P1 | Todos | Navegacional | Contato |
| 15 | Nossa história | `/sobre/nossa-historia/` | Institucional | P1 | Dono | "Daksa" | Contato |
| 16 | Como pensamos | `/sobre/como-pensamos/` | Manifesto | P1 | Diretor / TI | — | Diagnóstico |
| 17 | Insights (lista) | `/insights/` | Lista | P1 | Gerente / analista | Informacional | Newsletter (fase 2) |
| 18 | Insight | `/insights/[slug]/` | Artigo | P1 | Gerente / analista | Por tema | Diagnóstico (contextual) |
| 19 | Tag | `/insights/tag/[tag]/` | Lista | P2 | — | — | — |
| 20 | Diagnóstico (conversão) | `/diagnostico/` | Landing de conversão | P0 | Diretor / dono | "solicitar diagnóstico" | **Formulário** |
| 21 | Contato | `/contato/` | Conversão secundária | P0 | Todos | Navegacional | Formulário curto |
| 22 | Tecnologia (hub) | `/tecnologia/` | Técnico | P1 | TI | "arquitetura agentes de IA vendas" | Contato |
| 23 | Arquitetura | `/tecnologia/arquitetura/` | Técnico | P1 | TI | — | Contato |
| 24 | Integrações | `/tecnologia/integracoes/` | Técnico | P1 | TI / analista | "integração CRM ERP WhatsApp" | Contato |
| 25 | Governança de IA | `/tecnologia/governanca-de-ia/` | Técnico | P1 | TI / diretor | "governança IA vendas", "human in the loop" | Contato |
| 26 | Segurança e LGPD | `/tecnologia/seguranca-e-lgpd/` | Técnico | P1 | TI / jurídico | "LGPD CRM automação" | Contato |
| 27 | Privacidade | `/privacidade/` | Legal | P0 | — | — | — |
| 28 | Termos | `/termos/` | Legal | P1 | — | — | — |
| 29 | 404 | `/404/` | Utilitária | P0 | — | — | Links |

Total v1: 26 páginas indexáveis + 3 utilitárias/ocultas. Sem páginas artificiais de keyword.

---

## 4. Especificação página a página

Formato: objetivo · persona · seções · copy-fonte · CTA · SEO (title/description/H1) · schema · eventos · mobile.

### 4.1 Home `/`
Especificação completa em `04-HOME-DETALHADA.md`.

### 4.2 O que fazemos (hub) `/o-que-fazemos/`
- **Objetivo:** apresentar a escada e rotear para a etapa certa
- **Seções:** intro (título + 2 frases) · escada em 4 cards ligados (timeline horizontal desktop / vertical mobile) · "Como funciona" destaque · FAQ (5 perguntas) · CTA final
- **Copy:** 01 §5.5, §5.10
- **SEO:** title "O que fazemos — consultoria de operação comercial | Daksa" · H1 "Do diagnóstico à operação, em quatro etapas" · description "Diagnóstico de receita em 5 dias, implantação do sistema comercial, estabilização e operação contínua para indústrias e distribuidoras B2B."
- **Schema:** `Service` (4, com `hasOfferCatalog` na Organization), `BreadcrumbList`, `FAQPage`
- **Eventos:** `service_card_click{service}`, `faq_open{question}`, `cta_click{location:'hub-final'}`
- **Mobile:** timeline vertical com linha conectora; cards expandem por `<details>`

### 4.3 Diagnóstico de receita `/o-que-fazemos/diagnostico-de-receita/`
- **Objetivo:** explicar a porta de entrada e remover risco
- **Seções:** hero de serviço (H1 + o que você recebe em 3 linhas + CTA) · "Os 5 dias" (D1 imersão, D2–3 análise, D4 desenho, D5 devolutiva) como stepper · "O que você recebe" (número do vazamento, 3 correções, viabilidade técnica, proposta de implantação) · "O que precisamos de você" (acesso ao CRM, 2 h do diretor, 1 h de 2 vendedores) · **Calculadora de vazamento** (ilha: oportunidades/mês, ticket médio, conversão → "1 ponto de conversão = R$ X/mês") · "Creditado na implantação" · FAQ · CTA
- **Copy:** 01 §5.5 item 1 + nova microcopy seguindo §4
- **SEO:** title "Diagnóstico de receita em 5 dias | Daksa" · H1 "Diagnóstico de receita: o número antes do investimento" · description "Em 5 dias medimos quanto sua empresa perde entre o primeiro contato e o pedido, e entregamos as três correções prioritárias. Creditado na implantação."
- **Schema:** `Service` + `FAQPage` + `BreadcrumbList`
- **Eventos:** `calculator_start`, `calculator_complete{leak_estimate_bucket}`, `cta_click{location:'service-diagnostico'}`
- **Mobile:** calculadora com inputs numéricos (`inputmode=decimal`), resultado sticky no rodapé enquanto edita; stepper vertical

### 4.4 Implantação `/o-que-fazemos/implantacao/`
- **Objetivo:** mostrar que implementamos de verdade (não só aconselhamos) e o que muda no dia a dia
- **Seções:** hero · "O que entra no sistema" (6 blocos: processo, CRM, dados, integrações, automação, agentes) · **SystemDiagram** (visualização do fluxo entrada → qualificação → CRM → follow-up → humano → dado; ilha com hover/tap em cada nó) · "Semana a semana" (2–3 semanas) · "Usamos o seu CRM" (lista de CRMs comuns: Ploomes, HubSpot, Pipedrive, RD, Salesforce, Mercos, Bitrix — como texto, sem logos) · "Papéis: o que fazemos, o que seu time faz" · link para Tecnologia · CTA
- **SEO:** title "Implantação do sistema comercial | Daksa" · H1 "Implantação: o sistema comercial no ar em semanas, não meses" · description "Processo redesenhado, CRM configurado para o que o vendedor faz, dados limpos, integrações e agentes de IA para qualificação e follow-up. Em 2 a 3 semanas."
- **Schema:** `Service`, `BreadcrumbList`, `HowTo` (semana a semana) apenas se conteúdo for realmente instrucional — caso contrário não usar
- **Eventos:** `diagram_node_open{node}`, `tech_link_click`, `cta_click`
- **Mobile:** diagrama vira lista vertical de nós com expansão; sem pan/zoom obrigatório

### 4.5 Estabilização `/o-que-fazemos/estabilizacao/`
- **Objetivo:** explicar por que 60 dias e o que acontece
- **Seções:** hero · "Por que sistemas morrem no 2º mês" (3 causas) · "O que fazemos nos 60 dias" (semanas 1–2 / 3–4 / 5–8) · indicadores acompanhados · transição para operação · CTA
- **SEO:** title "Estabilização: 60 dias no mundo real | Daksa" · H1 "Estabilização: 60 dias para provar que funciona"
- **Schema:** `Service`, `BreadcrumbList`
- **Mobile:** timeline vertical

### 4.6 Operação contínua `/o-que-fazemos/operacao-continua/`
- **Objetivo:** vender a recorrência como operação, não como "suporte"
- **Seções:** hero · "O que é operar um sistema comercial" · rotina mensal (monitoramento, indicadores, melhorias, reunião executiva) · "Expansão do ciclo de receita" (cotação, pós-venda, recompra, renovação — a amplitude entra AQUI, como evolução) · "Documentado e transferível" (neutraliza dependência) · CTA
- **SEO:** title "Operação contínua do sistema comercial | Daksa" · H1 "Operação contínua: sistema comercial é operação, não projeto"
- **Schema:** `Service`, `BreadcrumbList`

### 4.7 Como funciona `/o-que-fazemos/como-funciona/`
- **Objetivo:** página-ponte entre negócio e tecnologia; explica método e agentes
- **Seções:** hero (H1 + intro) · "Cinco etapas" (Diagnóstico → Desenho → Implantação → Estabilização → Operação) com stepper · "Decisão humano × IA" (tabela: o que o agente faz sozinho / o que sugere / o que só o humano decide) · **Agentes por função** (4 cards da 01 §5.6, cada um com job → KPI → permissões → logs → escalada) · **Representação de IA** (DADO → CONTEXTO → RACIOCÍNIO → AÇÃO → SUPERVISÃO → RESULTADO; diagrama linear animado no scroll, com fallback estático) · "Governança" resumo + link Tecnologia · FAQ técnico-leve · CTA
- **SEO:** title "Como funciona: método e agentes de IA com supervisão | Daksa" · H1 "Agentes de IA com função, meta e supervisão. Não um chatbot." · description "Cinco etapas, decisão humano × IA explícita e quatro agentes com indicador, permissões, logs e escalada humana. Veja como operamos o sistema comercial."
- **Schema:** `WebPage` + `FAQPage` + `BreadcrumbList`; `DefinedTerm` para cada agente (entidade citável — GEO)
- **Eventos:** `agent_card_open{agent}`, `humanai_table_view` (scroll ≥ 50%), `tech_link_click`
- **Mobile:** tabela humano × IA vira cards empilhados por linha; agentes em acordeão

### 4.8 Para quem (hub) `/para-quem/`
- **Seções:** intro "Trabalhamos com quem vende B2B com ciclo consultivo" · 2 cards grandes (Indústrias / Distribuidoras) com sinais de fit (bullets) · "Não é para você se…" (3 bullets honestos: venda transacional B2C, sem time comercial, sem CRM e sem intenção de ter) · CTA
- **SEO:** title "Para quem — indústrias e distribuidoras B2B | Daksa"

### 4.9 Indústrias `/para-quem/industrias/`
- **Seções:** hero segmentado (01 §5.7) · "Como a oportunidade entra e onde trava" (fluxo típico: cotação técnica → engenharia → representante → proposta → follow-up longo) · "Sinais de que há vazamento" (5) · "O que o sistema faz na indústria" (mapeia 4 agentes ao contexto) · vocabulário (glossário curto: cotação, representante, engenheiro de aplicação, pedido recorrente — GEO) · FAQ · CTA
- **SEO:** title "Operação comercial para indústrias B2B | Daksa" · H1 "Para indústrias B2B com venda consultiva" · description "Cotação técnica, representante, ciclo longo. Encontramos onde a oportunidade trava na sua indústria e implantamos o sistema que corrige."
- **Schema:** `WebPage` com `about: Industry`, `FAQPage`, `BreadcrumbList`

### 4.10 Distribuidoras & atacadistas `/para-quem/distribuidoras-e-atacadistas/`
- Espelho de 4.9 com contexto: carteira, recompra, vendedor de carteira, SKU, clientes inativos, pedido que deveria ser recorrente. Agente de reativação em destaque.
- **SEO:** title "Operação comercial para distribuidoras e atacadistas | Daksa" · H1 "Para distribuidoras com carteira grande e recompra"

### 4.11 Resultados `/resultados/`
- **Objetivo:** prova sem inventar
- **Seções:** hero "O que medimos antes, durante e depois" · tabela de métricas (01 §5.8) como **MetricTable** com definição de cada métrica em tooltip/expansão · "Como fazemos baseline" (3 passos) · "Exemplo anonimizado de devolutiva de diagnóstico" (mock com dados sintéticos, rotulado como exemplo ilustrativo) · nota de honestidade · [slot para cases quando existirem] · CTA
- **SEO:** title "Resultados: o que medimos e como provamos | Daksa" · H1 "O que medimos antes, durante e depois" · description "Não prometemos receita. Medimos tempo de resposta, follow-ups no prazo, oportunidades recuperadas e conversão por etapa. Veja como fazemos baseline."
- **Schema:** `WebPage`, `BreadcrumbList`; **não** usar `Review`/`AggregateRating`
- **Eventos:** `metric_definition_open{metric}`, `example_view`

### 4.12–4.13 Cases
- Lista e artigo. Template pronto: contexto (segmento, porte, sem nome se não autorizado) · situação inicial (baseline) · o que fizemos · resultado (métricas) · depoimento (só se real) · CTA. `noindex` e fora do menu até existir 1 case. Schema `Article` quando publicado.

### 4.14 Sobre (hub) `/sobre/`
- Intro + 2 cards (Nossa história / Como pensamos) + equipe (fase 2, só com fotos reais) + CTA contato

### 4.15 Nossa história `/sobre/nossa-historia/`
- **Objetivo:** usar os 22 anos como lastro de confiança e explicar a evolução sem parecer "virou outra empresa"
- **Seções:** hero · timeline (4–5 marcos reais: fundação → web → marketing B2B → apoio a vendas/CRM → operação comercial com IA) · "O que aprendemos em 22 anos" (3 lições que justificam o modelo atual) · "Onde estamos hoje" · [nome do fundador] com foto real · CTA contato
- **Aqui a amplitude de capacidade tem espaço legítimo** (marketing, tecnologia, dados) — como história, não como oferta
- **SEO:** title "Nossa história — 22 anos com empresas B2B | Daksa" · **Schema:** `AboutPage`, `Organization` (foundingDate), `Person` (fundador)

### 4.16 Como pensamos `/sobre/como-pensamos/`
- **Seções:** hero "IA não conserta processo ruim. Ela acelera." · 6 princípios (processo antes de tecnologia; usar o CRM do cliente; agente com função e KPI; humano decide o crítico; medir antes de prometer; operar, não entregar e sumir) · "Como trabalhamos com seu time" · CTA
- **Schema:** `WebPage`; princípios como lista semântica (`<ol>`) — citável

### 4.17–4.19 Insights
- Lista paginada (12/página, `rel=prev/next`), filtro por tag (indústria, distribuição, follow-up, CRM, agentes, dados, operação), card com título/autor/data/tempo de leitura. Artigo com TOC (h2), autor com bio, data de publicação e revisão, "resumo em 3 frases" no topo (GEO), CTA contextual no fim. Sem newsletter em v1 (fase 2).
- **Schema:** `Article`/`BlogPosting` com `author`, `datePublished`, `dateModified`, `BreadcrumbList`

### 4.20 Diagnóstico (conversão) `/diagnostico/`
- **Objetivo:** converter com o mínimo de fricção e o máximo de qualificação
- **Layout:** 2 colunas desktop (esquerda: o que você recebe + 5 dias + "creditado" + microprova; direita: formulário sticky) / mobile: formulário primeiro, contexto abaixo em acordeão
- **Formulário:** 2 etapas (01 §5.11); ilha Preact com fallback single-step; Turnstile invisível; validação inline ao sair do campo; salvamento de rascunho em memória entre etapas
- **Sem menu completo:** header reduzido (logo + voltar) para reduzir fuga; footer mínimo
- **SEO:** title "Solicitar diagnóstico de receita | Daksa" · H1 "Solicitar diagnóstico de receita" · `noindex`? **Não** — indexável (intenção transacional), mas sem competir com a página de serviço: canonical própria, conteúdo distinto (conversão vs. explicação)
- **Eventos:** `form_view`, `form_start`, `form_step{step}`, `form_error{field}`, `form_submit`, `lead_qualified{tier}` (calculado no Worker por segmento + tamanho de time)
- **Mobile:** CTA sticky no rodapé quando o formulário sai da viewport; teclado não cobre botão (`dvh` + scroll into view)

### 4.21 Contato `/contato/`
- Formulário curto (nome, e-mail, empresa, mensagem) + e-mail/WhatsApp Business como texto/link + endereço (se houver) · Turnstile · **Schema:** `ContactPage`
- Sem calendário embutido em v1 (decisão: qualificar antes de expor agenda)

### 4.22–4.26 Tecnologia
- **Hub:** intro "Para quem precisa ver a engenharia" + 4 cards
- **Arquitetura:** diagrama de camadas (canais → orquestração → agentes → CRM/ERP → dados → dashboards), princípios (model-agnostic, usar sistemas do cliente, observabilidade), stack típica descrita sem marcas de ferramenta de automação
- **Integrações:** CRMs, ERPs, WhatsApp Business API, e-mail, telefonia, BI — como categorias e exemplos textuais; "o que precisamos para integrar" (API, permissões, campos)
- **Governança de IA:** permissões por agente, logs, escalada humana, limites de decisão, revisão humana, versionamento de prompts/regras, avaliação contínua
- **Segurança e LGPD:** dados tratados, bases legais, retenção, acesso, DPA, onde os dados ficam, o que nunca fazemos
- **SEO/GEO:** títulos descritivos; conteúdo autocontido e citável; `TechArticle` schema; FAQ técnico

### 4.27–4.29 Legal e 404
- Privacidade e Termos: texto jurídico revisado (placeholder até revisão); 404 com 3 links úteis (01 §5.12) e busca simples por links, sem JS

---

## 5. Links internos (regras)

- Toda página de serviço linka: hub, etapa anterior, etapa seguinte, Como funciona, Diagnóstico (CTA)
- Toda página de segmento linka: os 4 serviços com contexto, Como funciona, Diagnóstico
- Como funciona linka: 4 serviços, 4 páginas de Tecnologia, Como pensamos
- Insights linkam contextualmente para serviço/segmento relevante (mín. 2 links internos por artigo)
- Breadcrumb em todas as páginas exceto home e diagnóstico
- Footer com sitemap completo (exceto cases enquanto oculto)

---

## 6. Jornadas por persona (mapa intenção → pergunta → objeção → conteúdo → CTA → evento)

| Persona | Intenção | Pergunta | Objeção | Caminho | Conteúdo-chave | CTA | Evento de sucesso |
|---|---|---|---|---|---|---|---|
| Dono / CEO | Aumentar receita sem contratar | "Isso dá retorno?" | "É mais uma consultoria" | Home → Resultados → Como funciona → Diagnóstico | O que medimos; creditado; 22 anos | Diagnóstico | `form_submit` |
| Diretor comercial | Resolver follow-up/CRM | "Resolve meu problema hoje?" | "Meu time não vai usar" | Home → Diagnóstico (serviço) → Implantação → Diagnóstico | 5 sintomas; papéis; estabilização | Diagnóstico | `form_submit` |
| Gerente marketing | Atribuir receita ao marketing | "Vocês mexem no meu funil?" | "Vão substituir a agência" | Home → Como funciona → Operação contínua → Contato | Ciclo inteiro; dados; usamos seu CRM | Contato | `contact_submit` |
| Analista CRM/BI | Integrar sem trocar ferramenta | "Integra com o que tenho?" | "Vão bagunçar meu CRM" | Como funciona → Tecnologia/Integrações → Contato | Integrações; dados limpos; documentado | Contato | `tech_page_view` ≥ 2 + `contact_submit` |
| TI / segurança | Validar arquitetura e LGPD | "É seguro? Tem lock-in?" | "IA sem controle" | Como funciona → Governança → Segurança e LGPD → Contato | Governança; permissões; logs; DPA | Contato | `tech_page_view` ≥ 2 |
| Gerente de outra área | Automatizar outro processo | "Fazem para meu departamento?" | — | Home → Operação contínua ("expansão") → Contato | Expansão do ciclo de receita | Contato | `contact_submit` |

Nota: a última persona é atendida sem página própria — "expansão" vive dentro de Operação contínua, coerente com a estratégia de entrada estreita.

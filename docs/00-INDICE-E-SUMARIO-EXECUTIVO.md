# PLANEJAMENTO DE WEBSITE — [MARCA] · Consultoria de Operação Comercial

**Status:** PLANNING COMPLETE — aguardando validação humana antes de implementação
**Data:** 01/09/2026
**Uso:** este conjunto de arquivos é a especificação que guiará o Claude Code na fase de implementação. Nenhum código foi gerado.

---

## Como usar estes arquivos

| Arquivo | Conteúdo | Quem lê |
|---|---|---|
| `00-INDICE-E-SUMARIO-EXECUTIVO.md` | Decisões, princípios, gate | Todos |
| `01-CONTEXTO-POSICIONAMENTO-COPY.md` | Negócio, ICP, oferta, tom de voz, copy-base | Copy, design, dev |
| `02-STACK-INFRA-SEGURANCA.md` | Stack, infra, deploy, segurança, observabilidade, CI/CD, estrutura de código | Dev |
| `03-ARQUITETURA-SITE-PAGINAS.md` | Árvore, inventário de páginas, especificação página a página | Todos |
| `04-HOME-DETALHADA.md` | Home seção por seção (14 atributos cada) | Copy, design, dev |
| `05-DESIGN-SYSTEM.md` | Tokens, tipografia, componentes e estados | Design, dev |
| `06-RESPONSIVO-MOBILE-MOTION.md` | Estratégia responsiva, mobile próprio, plano de motion | Design, dev |
| `07-SEO-GEO-CONTEUDO-CMS.md` | SEO técnico, GEO, entidades, content models, CMS | SEO, conteúdo, dev |
| `08-ANALYTICS-FORMS-PERF-A11Y-QA.md` | Eventos, formulários, budgets, WCAG, testes | Dev, analytics |
| `09-ROADMAP-RISCOS-DECISOES.md` | Fases de implementação, riscos, decisões abertas, fraquezas | Fundador, dev |

Ordem de leitura para o Claude Code na implementação: 00 → 02 → 03 → 05 → 06 → 04 → 01 → 07 → 08 → 09.

---

## 1. Executive Summary — decisões principais

**O que o site é:** produto digital de autoridade e aquisição para uma consultoria de operação comercial que implementa e opera sistemas comerciais (processo + CRM + dados + automação + agentes de IA) para indústrias e distribuidoras B2B de médio-grande porte. O site vende uma porta de entrada específica — o **Diagnóstico de Receita** — e sustenta a credibilidade de uma empresa de 23 anos que está se reposicionando.

**Decisões fechadas nesta fase:**

| # | Decisão | Escolha | Justificativa curta |
|---|---|---|---|
| D1 | Stack público | **Astro 5 + TypeScript + CSS nativo (tokens, layers, container queries)** + ilhas interativas mínimas | HTML-first, zero JS por padrão, View Transitions nativas, melhor LCP/INP para site institucional; alinhado aos documentos técnicos de referência |
| D2 | Interatividade | Ilhas em **Preact** (compat React) apenas para: formulário de diagnóstico, calculadora de vazamento, visualização do sistema comercial | Mantém budget de JS < 80 KB; nada crítico depende de JS |
| D3 | Hospedagem | **Cloudflare Pages + Workers (rotas de formulário) + DNS/WAF/CDN Cloudflare** | Edge global, custo previsível, Turnstile nativo, rollback atômico |
| D4 | CMS | **Git-based (Astro Content Collections + Keystatic como UI editorial)** em v1; migrar para headless só se equipe editorial crescer | Editoria é 1–2 pessoas; preview e versionamento via Git; custo zero |
| D5 | Conversão primária | **Solicitar Diagnóstico de Receita** (formulário qualificador de 2 etapas) | É a porta de entrada da escada de oferta; "Fale com um especialista" é conversão secundária |
| D6 | Estado de lançamento | **Sem cases publicáveis.** Prova substituta: método, métricas que medimos, histórico de 23 anos, exemplo anonimizado de diagnóstico. Rota `/resultados/cases` existe mas fica fora do menu e `noindex` até haver 1 case real | Guardrail: não inventar cases, clientes ou números |
| D7 | Preços | **Não exibir valores.** Exibir a escada (4 etapas), o que cada uma entrega e que o Diagnóstico é creditado na implantação | Ticket alto, venda consultiva, preço ainda em validação |
| D8 | ICP no site | **Indústrias** e **Distribuidoras & Atacadistas**. Serviços B2B e "operações comerciais complexas" NÃO entram no menu (ver decisão aberta O1) | Coerência com ICP validado; verticalização é o moat |
| D9 | IA no site | Nunca é pilar de navegação. Aparece em "Como funciona" como método (agentes por função) e em páginas de profundidade técnica | Hierarquia Negócio → Problema → Resultado → Método → Tecnologia → Prova → Profundidade |
| D10 | WebGL/3D | **Não usar em v1.** Visual do sistema em funcionamento = diagrama SVG animado com CSS/Motion, com fallback estático | Sem justificativa narrativa que compense custo em mobile/GPU |
| D11 | Motion | CSS + View Transitions API (nativo Astro) + Motion (mini) só dentro das ilhas. GSAP/Rive/Lottie fora de v1 | Um momento orquestrado na home; o resto responde a ação do usuário |
| D12 | Idioma | pt-BR only em v1; estrutura preparada para `/en` futuro (rotas, hreflang, tokens de i18n em Content Collections) | ICP é brasileiro |
| D13 | Analytics | GA4 + GTM (web) com Consent Mode v2; server-side GTM só na fase 3; eventos por taxonomia própria | Proporcional ao volume inicial |

---

## 2. Architectural Principles — regras que governam o projeto

1. **Negócio antes de tecnologia.** Toda página abre com problema/resultado em linguagem de diretor comercial. Tecnologia aparece só depois, e só quando a página é de profundidade.
2. **HTML é a fonte de verdade.** Todo conteúdo crítico existe no HTML renderizado. JS, canvas, animação e imagens só enriquecem. O site funciona com JS desligado.
3. **Uma conversão primária.** Diagnóstico de Receita. Todo caminho leva a ele. Conversões secundárias existem, mas nunca competem visualmente.
4. **Prova nunca é inventada.** Sem case, sem número, sem logo, sem depoimento que não seja real e autorizado. Na ausência, mostramos método e o que medimos.
5. **Estreito por fora, profundo por dentro.** O menu comunica a oferta estreita. A profundidade técnica (arquitetura, integrações, governança de IA, LGPD) existe em páginas de segundo nível, acessíveis a TI e analistas.
6. **Componentes adaptam-se ao contêiner, não ao dispositivo.** Container queries e tokens fluidos primeiro; media queries só para decisões globais de layout.
7. **Mobile tem experiência própria.** Navegação, formulário e visualizações são redesenhados para o polegar — não reduzidos.
8. **Motion explica ou responde.** Nenhuma animação existe por estética. Todo motion respeita `prefers-reduced-motion` e o conteúdo é compreensível sem ele.
9. **Performance é feature.** Budgets no CI. LCP ≤ 2,0 s, INP ≤ 150 ms, CLS ≤ 0,05 como metas internas (campo: 2,5 / 200 / 0,1).
10. **Acessibilidade WCAG 2.2 AA é piso, não meta.** Estética nunca sacrifica contraste, foco, teclado ou leitor de tela.
11. **Site é agent-ready.** DOM semântico, formulários nomeados, links reais, schema fiel ao conteúdo visível.
12. **Separar evidência de hipótese.** Em SEO/GEO, o que é documentado (Google, OpenAI, Bing) é tratado como regra; o resto é experimento medido.
13. **Conteúdo com dono e data.** Todo conteúdo tem autor, data de publicação, data de revisão e responsável.
14. **Evolução sem reescrita.** Content Collections, tokens e componentes preparados para i18n, novos segmentos e cases futuros sem refatoração estrutural.

---

## 3. O site em uma frase para cada persona

- **Dono / CEO / Diretor comercial:** "Eles encontram onde minha receita está vazando, consertam e ficam operando — e provam com número antes de eu investir."
- **Gerente comercial / marketing:** "Eles resolvem follow-up esquecido, CRM abandonado e falta de visibilidade, sem eu ter que virar especialista em IA."
- **Analista de CRM / BI / operações:** "Eles integram o que eu já tenho e me dão dado limpo — não trocam minha ferramenta."
- **TI / segurança:** "Arquitetura documentada, human-in-the-loop, LGPD, logs, sem lock-in. Dá para conversar de igual para igual."

---

## 4. Gate de validação — o que precisa ser aprovado antes do Claude Code

Ver `09-ROADMAP-RISCOS-DECISOES.md`, seção "Decisões abertas". Resumo do que exige intervenção humana:

- **O1** Nome/arquitetura de marca (marca-mãe de 23 anos vs. unidade nomeada) — afeta domínio, schema `Organization`, "Sobre" e URLs.
- **O2** Confirmação final do ICP no menu (2 segmentos vs. 4).
- **O3** Confirmação de não exibir preço.
- **O4** Fotografia: banco de imagens industrial licenciado vs. sessão fotográfica própria (afeta hero e "Para quem").
- **O5** Domínio e e-mail de envio de formulários (SPF/DKIM).
- **O6** CRM de destino dos leads e campos obrigatórios.

Sem O1, O5 e O6 a implementação não pode começar. O2–O4 podem ser resolvidos durante a fase 1.

---

## 5. Scorecard previsto (honesto)

Por instrução do brief, o planejamento deveria autoavaliar ≥ 95/100. Autoavaliação é teatro; substituímos por **as cinco dimensões mais fracas e o que falta**:

| Dimensão | Nota prevista | O que falta |
|---|---|---|
| Conteúdo / prova | 6/10 | Zero cases reais; copy precisa de 2–3 conversas de validação com ICP antes de fixar headline |
| GEO | 7/10 | Sem dados originais próprios ainda (benchmark, estatística); só será forte após 5+ diagnósticos |
| Conversão | 7/10 | Formulário qualificador e calculadora não testados com usuário real; taxa desconhecida |
| Estratégia | 8/10 | Preço e ICP ainda em validação de mercado; marca (O1) indefinida |
| Motion / UI memorável | 8/10 | "Um momento memorável" na home depende de execução; risco de cair em clichê de design gerado (ver 05) |

Todas as demais dimensões (arquitetura, stack, SEO técnico, performance, acessibilidade, segurança, analytics, mobile, engenharia, CMS, operação) estão em 9–10 no plano — o risco delas está na execução, não no desenho.

Nenhum risco P0 aberto no desenho. Riscos P1 listados em `09`.

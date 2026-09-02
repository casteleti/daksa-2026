# PROMPT — LEITURA E COMPREENSÃO DO PLANEJAMENTO (executar antes de qualquer código)

Você vai construir o website institucional da Daksa, uma consultoria de operação comercial B2B. Todo o planejamento estratégico, de produto, de conteúdo, de design e técnico já foi feito e está nos 10 arquivos da pasta `planejamento-site/`, na raiz do projeto.

## Sua tarefa agora

**Não escreva código. Não crie arquivos. Não instale dependências.**

1. Leia os 10 arquivos, nesta ordem:
   `00-INDICE-E-SUMARIO-EXECUTIVO.md` → `02-STACK-INFRA-SEGURANCA.md` → `03-ARQUITETURA-SITE-PAGINAS.md` → `05-DESIGN-SYSTEM.md` → `06-RESPONSIVO-MOBILE-MOTION.md` → `04-HOME-DETALHADA.md` → `01-CONTEXTO-POSICIONAMENTO-COPY.md` → `07-SEO-GEO-CONTEUDO-CMS.md` → `08-ANALYTICS-FORMS-PERF-A11Y-QA.md` → `09-ROADMAP-RISCOS-DECISOES.md`

2. Depois de ler tudo, produza um resumo de compreensão com:
   - O que é o negócio, o ICP e a escada de oferta, em suas próprias palavras (3–4 frases)
   - O stack escolhido e por que (Astro + Preact + Cloudflare) — e o que isso implica para como você vai estruturar o projeto
   - As decisões que **não podem ser reinterpretadas** durante a implementação (liste as de `00 §1`, D1–D13)
   - As três decisões que **ainda estão abertas** e bloqueiam o início (`09 §3`: O1 nome/marca, O5 domínio e e-mail, O6 CRM) — confirme se elas já foram resolvidas em algum lugar do projeto ou se precisa perguntar
   - Os 5 riscos de prioridade P1 listados em `09 §2` e o que fazer para não cair neles
   - As regras de conteúdo que mais restringem a implementação (arquivo `01`, especialmente a lista de palavras proibidas e o guardrail de nunca inventar cases/números/clientes)
   - As regras visuais anticlichê de `05 §1` — o que evitar mesmo que pareça "bonito por padrão"

3. Sinalize qualquer contradição, lacuna ou ambiguidade que você encontrar entre os arquivos — por exemplo, algo especificado em `03` que pareça divergir de `04`, ou uma página listada no inventário sem especificação correspondente.

4. Não prossiga para nenhuma fase de implementação (`09 §1`) sem que eu confirme explicitamente. Ao final, pergunte apenas: **"Compreendi o planejamento. Posso começar a Fase 0 (pré-requisitos) ou você quer que eu comece direto pela Fase 1 assumindo que O1/O5/O6 já estão resolvidos?"**

## Regra geral

Este planejamento é a fonte de verdade. Se em algum momento da implementação futura você precisar tomar uma decisão que não está coberta pelos arquivos, pare e pergunte — não improvise copy, cores, componentes ou arquitetura que contradigam o que está documentado.

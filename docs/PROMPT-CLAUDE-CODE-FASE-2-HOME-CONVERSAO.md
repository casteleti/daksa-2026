# PROMPT — FASE 2: HOME COMPLETA E CONVERSÃO (Diagnóstico)

Contexto: a Fase 1 (fundação técnica) está aprovada — repositório, tokens, layouts base, componentes de UI, CI/CD e schemas de conteúdo já existem. Agora executamos a **Fase 2** do roadmap (`09-ROADMAP-RISCOS-DECISOES.md`, seção 1): a Home inteira e o fluxo de conversão do Diagnóstico. Esta é a fase mais importante do projeto — a Home e o `/diagnostico` vão validar todo o design system, o motion e o pipeline de lead de ponta a ponta. Tudo que for construído aqui será o padrão reaproveitado nas páginas de serviço e segmento na Fase 3, então priorize precisão sobre velocidade.

Ainda **não** conecte CRM real nem domínio de produção nem e-mail transacional real (O5/O6 seguem em aberto) — use os stubs criados na Fase 1 e evolua-os com a lógica completa (validação, tiers, fila, retry), mas com o envio final para CRM/e-mail simulado e claramente logado como `TODO:O5`/`TODO:O6`.

## O que fazer, nesta ordem

1. **As 10 seções da Home**, exatamente como especificadas em `04-HOME-DETALHADA.md` (os 14 atributos de cada seção) e com a copy de `01-CONTEXTO-POSICIONAMENTO-COPY.md`, seções 5.2 a 5.10. Não reescreva a copy — use-a literalmente, só ajustando markup.
   - Respeite a ordem final de `04` (já reordenada em relação ao brief original) e o limite de 10 seções.
   - Tema por seção conforme `05-DESIGN-SYSTEM.md` §5 (alternância escuro/claro).

2. **Componentes visuais novos** necessários só para a Home, seguindo `05 §3`:
   - `SystemDiagram` em estado "vivo" (hero) — SVG com nós, conexões, loop de eventos âmbar percorrendo o fluxo, painel de 3 indicadores em mono rotulados "exemplo ilustrativo". Versão vertical simplificada para mobile.
   - `PipelineFlow` (diagrama linear DADO → CONTEXTO → RACIOCÍNIO → AÇÃO → SUPERVISÃO → RESULTADO) com nó "SUPERVISÃO" destacado em âmbar.
   - `Ladder` (escada de 4 etapas), `Card` (variante problem e segment), `Tabs`/`Accordion` para os 4 agentes, `MetricTable`, `CodeLog` (log ilustrativo de 3 linhas).
   - Todos com estados, comportamento responsivo (`06 §2`) e reduced motion (`06 §4`) implementados — não deixe para depois.

3. **Motion da Home**, seguindo exatamente `06-RESPONSIVO-MOBILE-MOTION.md` §4: o único momento orquestrado é o hero (fade + diagrama "ligando" + loop); todo o resto é reveal único por `IntersectionObserver` ou resposta a interação (tabs, hover). Nenhuma animação fora do inventário de `06 §4.2`. Implemente `prefers-reduced-motion` de verdade e teste manualmente com a preferência ativada.

4. **Página `/diagnostico`** (conversão primária):
   - Layout de 2 colunas (contexto + formulário sticky) em desktop, formulário primeiro em mobile, conforme `03 §4.20` e `06 §2`.
   - `DiagnosticForm` como ilha Preact (`client:idle`), 2 etapas, com fallback funcional sem JS (single-step), conforme `05 §3` e `08 §2.1`.
   - Validação com Zod compartilhado entre cliente e Worker.
   - Anti-spam: Turnstile invisível + honeypot.
   - Microcopy exata de `01 §5.11`.

5. **Worker `/api/lead`** completo em lógica (evoluindo o stub da Fase 1):
   - Validação Zod, rate limit, classificação de tier (regras de `08 §2.1`), gravação em D1, fila de retry.
   - Envio a CRM e e-mail transacional como funções isoladas e claramente marcadas `TODO:O5`/`TODO:O6`, com um mock que simula sucesso/falha para permitir testar o fluxo completo agora.
   - Captura de atribuição (UTMs, first/last touch, referrer) conforme `08 §1.3`.

6. **`/contato`** (conversão secundária), formulário de 1 etapa, mesma proteção.

7. **Analytics**: implementar a taxonomia completa de `08 §1.2` para todos os eventos que já existem na Home e no fluxo de Diagnóstico (não os de páginas que ainda não existem). GTM + GA4 + Consent Mode v2 conforme `08 §1.1`. Validar no DebugView.

8. **Testes**: E2E do fluxo completo (Home → CTA → `/diagnostico` → envio → sucesso → D1 tem o registro), axe na Home e em `/diagnostico`, visual regression nos dois temas e nos breakpoints de `08 §5`, Lighthouse nas duas páginas.

## Regras

- Copy é a de `01`, literal — não parafrasear, não "melhorar", não adicionar adjetivos.
- Nenhum número, indicador ou log pode aparecer sem o rótulo "exemplo ilustrativo" quando for sintético — confira cada instância.
- Siga as regras anticlichê de `05 §1` (sem eyebrow em caixa alta, sem seta em botão, sem mono fora de dado real, sem grid de cards idênticos, sem gradiente decorativo).
- Budgets de `08 §3.2` para Home e `/diagnostico` são bloqueantes — se estourar, otimize antes de seguir, não ignore.
- Se algo em `04` parecer ambíguo ou incompleto diante do que você está implementando, pare e pergunte — não decida sozinho um padrão novo de motion, cor ou copy.

## Ao final

Rode o checkpoint da Fase 2 (`09 §1`): lead de teste chega ao D1/mock de CRM com atribuição correta; eventos aparecem no GA4 DebugView; budgets ok; visual aprovado em desktop e em pelo menos 2 tamanhos de mobile reais ou emulados (375 e 412). Reporte o resultado do checkpoint, quaisquer decisões que precisou tomar e o que ficou pendente de O5/O6. Não avance para a Fase 3 sem minha confirmação.

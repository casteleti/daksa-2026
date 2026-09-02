# 04 — HOME DETALHADA

Ordem final (questionada e ajustada em relação ao brief):

```
1. Hero
2. Faixa de contexto (microprova + para quem)      ← "Prova/contexto" reduzida a uma faixa; sem cases não há prova para uma seção inteira
3. Problema
4. O que fazemos (escada)
5. Como funciona + IA dentro da operação            ← unificadas: método e agentes são a mesma história
6. Para quem
7. O que medimos (Resultados)
8. Como pensamos (visão)                            ← "Case" removido do lançamento; slot reservado
9. Insights (3 mais recentes)
10. CTA final
```

Regras globais da home: máximo 10 seções; uma ideia por seção; um único momento de motion orquestrado (hero); todas as demais animações respondem a scroll (reveal discreto, uma vez) ou a ação do usuário. Sem contador animado de números inventados. Sem carrossel automático.

Cada seção abaixo segue os 14 atributos do brief: objetivo · persona · mensagem · headline · conteúdo · visual · interação · CTA · desktop · mobile · motion · SEO · GEO · analytics.

---

## 1. Hero

- **Objetivo:** em 5 segundos, comunicar para quem, qual problema, qual resultado e que há capacidade técnica real. Levar ao Diagnóstico.
- **Persona:** dono / diretor comercial.
- **Mensagem:** você já gera oportunidade; o problema é o que acontece depois; nós resolvemos e ficamos operando.
- **Headline (H1):** *Sua empresa já gera as oportunidades. Nós fazemos com que elas não morram no caminho.*
- **Conteúdo:** supporting (01 §5.2) · CTA primário · CTA secundário · microprova em uma linha: "Diagnóstico em 5 dias · Número antes do investimento · 23 anos com empresas B2B".
- **Visual:** à direita (desktop) / abaixo (mobile), o **SystemDiagram em estado "vivo"**: diagrama SVG do fluxo comercial (Entrada → Qualificação → CRM → Follow-up → Vendedor → Pedido) com nós, conexões e pequenos "eventos" passando pelo fluxo (pontos âmbar que percorrem as conexões), um painel lateral com 3 indicadores em mono ("Tempo de 1ª resposta 4 min" · "Follow-ups no prazo 96%" · "Pipeline parado 0 há +14 dias") **rotulados como "exemplo ilustrativo"** em texto pequeno visível. Não é dashboard fake de cliente; é o sistema em funcionamento com dados sintéticos declarados.
- **Interação:** hover/tap em um nó exibe tooltip de 1 linha (o que acontece ali). Nada essencial no tooltip.
- **CTA:** primário "Solicitar diagnóstico de receita" (âmbar, sólido) · secundário "Ver como funciona" (texto com sublinhado).
- **Desktop:** grid 7/5. Texto à esquerda alinhado à esquerda, largura máx. 40ch para H1. Diagrama ocupa a coluna direita, altura ~ 520 px, sem cortar.
- **Mobile:** texto primeiro (H1 em `clamp(2rem, 6vw, 2.75rem)`), CTAs empilhados 100% de largura (primário acima), microprova em 2 linhas, diagrama abaixo em versão vertical simplificada (4 nós, sem painel de indicadores, altura ~ 320 px). Nada acima da dobra depende do diagrama.
- **Motion:** o único momento orquestrado do site: ao carregar, H1 e supporting entram com fade (150 ms, sem deslocamento); em seguida o diagrama "liga": conexões desenham-se (stroke-dashoffset, 600 ms), nós acendem em sequência (80 ms cada), e os pontos âmbar começam a percorrer o fluxo em loop lento (8 s por ciclo, `steps` suaves). Total < 1,2 s. Com `prefers-reduced-motion`: tudo estático, diagrama já "ligado", pontos parados em posições fixas. Implementação: CSS animations + SVG; sem JS para o loop (CSS `offset-path` ou `animateMotion`).
- **SEO:** H1 único; texto real no HTML; imagem LCP = nenhuma (o LCP é o H1 ou o SVG inline — garantir que o SVG não seja pesado: < 20 KB; se necessário, LCP candidate é o bloco de texto).
- **GEO:** primeiro parágrafo autocontido define a empresa: quem, para quem, o quê (01 §5.2 supporting).
- **Analytics:** `hero_cta_primary_click`, `hero_cta_secondary_click`, `hero_diagram_node_hover{node}` (throttled), `scroll_depth{25}`.

---

## 2. Faixa de contexto

- **Objetivo:** ancorar credibilidade e segmento sem uma seção de "logos" que não temos.
- **Persona:** todos.
- **Mensagem:** somos especializados e temos lastro.
- **Headline:** nenhuma (faixa).
- **Conteúdo:** 3 itens em linha: "Indústrias e distribuidoras B2B" · "Do primeiro contato à renovação" · "Desde 2003 ao lado de empresas B2B" (ajustar ano real).
- **Visual:** faixa fina sobre fundo branco-osso, texto em cinza-chumbo, separadores verticais finos. Sem ícones.
- **Interação:** nenhuma.
- **CTA:** nenhum.
- **Desktop:** linha única. **Mobile:** 3 linhas empilhadas, centralizadas.
- **Motion:** nenhuma.
- **SEO/GEO:** reforça entidades (segmentos, tempo de mercado).
- **Analytics:** nenhum.

---

## 3. Problema

- **Objetivo:** fazer o diretor reconhecer a própria empresa.
- **Persona:** diretor comercial / gerente.
- **Mensagem:** o pipeline morre de espera, não de falta de lead.
- **Headline (H2):** *O pipeline não morre de falta de lead. Morre de espera.*
- **Conteúdo:** 5 sintomas (01 §5.4), cada um com título curto e 1–2 frases concretas; fechamento de 2 frases.
- **Visual:** 5 blocos em grid assimétrico (3 + 2) sobre fundo grafite; cada bloco tem um **glifo linear** (não ícone fofo): relógio parado, fio cortado, dois funis desalinhados, carteira com poeira, ponto de interrogação sobre gráfico — todos monolineares, cinza-claro, 1,5 px. Bordas finas cinza-chumbo, sem sombra, sem raio > 4 px.
- **Interação:** nenhuma obrigatória. Hover sutil no desktop (borda vira âmbar).
- **CTA:** nenhum (o fechamento já aponta para "medir quanto").
- **Desktop:** grid 3 colunas, segunda linha 2 colunas centralizadas. Container query para colapsar a 2 col em < 60rem.
- **Mobile:** lista vertical; blocos com glifo à esquerda e texto à direita (layout horizontal por container query), sem cards "empilhados idênticos".
- **Motion:** reveal único da seção ao entrar na viewport (opacity 0→1, 200 ms, `IntersectionObserver` com `once`). Sem stagger por card.
- **SEO:** H2 com termos "pipeline", "follow-up", "CRM"; sintomas como `<ul>` semântica.
- **GEO:** cada sintoma é uma frase autocontida e citável ("Oportunidade em negociação há 40 dias sem contato é receita que já vazou").
- **Analytics:** `scroll_depth{50}` proxy; `problem_card_hover` opcional (não rastrear em v1).

---

## 4. O que fazemos (escada)

- **Objetivo:** mostrar o caminho e reduzir risco (Diagnóstico pago, creditado).
- **Persona:** diretor / dono.
- **Mensagem:** quatro etapas, começa pequeno, termina operando.
- **Headline (H2):** *Do diagnóstico à operação, em quatro etapas.*
- **Conteúdo:** 01 §5.5; cada etapa com nome, prazo, 2 frases, link "Saiba mais".
- **Visual:** **linha de escada**: 4 estações conectadas por uma linha fina; a primeira estação (Diagnóstico) destacada com borda âmbar; abaixo de cada estação, prazo em mono ("5 dias" · "2–3 semanas" · "60 dias" · "mensal"). É uma sequência real, então numeração 1–4 é legítima.
- **Interação:** clique leva à página do serviço. Hover: estação eleva 1 px e linha até ela fica âmbar.
- **CTA:** ao fim, link "Ver como funciona" (secundário).
- **Desktop:** horizontal, 4 colunas iguais, linha conectora por `::before` no container.
- **Mobile:** vertical, linha à esquerda, estações como itens com prazo em mono à esquerda e texto à direita.
- **Motion:** linha conectora desenha-se no reveal (400 ms) uma vez. Reduced motion: estática.
- **SEO:** H2 + H3 por etapa; termos "diagnóstico de receita", "implantação", "operação contínua".
- **GEO:** lista ordenada semântica (`<ol>`); cada etapa é uma definição autocontida.
- **Analytics:** `ladder_step_click{step}`.

---

## 5. Como funciona + IA dentro da operação

- **Objetivo:** explicar método e mostrar capacidade técnica sem jargão; abrir porta para TI.
- **Persona:** gerente, TI, diretor cético.
- **Mensagem:** agentes com função, meta e supervisão; humano decide o crítico.
- **Headline (H2):** *Agentes de IA com função, meta e supervisão. Não um chatbot.*
- **Conteúdo:** intro (1 frase) · **diagrama linear de representação de IA**: DADO → CONTEXTO → RACIOCÍNIO → AÇÃO → SUPERVISÃO → RESULTADO, com uma linha explicativa sob cada · 4 agentes (01 §5.6) em tabs (desktop) / acordeão (mobile): o que faz · indicador · quando escala para humano · link "Ver governança de IA".
- **Visual:** diagrama linear com 6 nós retangulares e setas finas; nó "SUPERVISÃO" com contorno âmbar (é a diferenciação). Tabs com conteúdo em duas colunas: esquerda descrição, direita mini "log" ilustrativo em mono (3 linhas: `09:14 oportunidade #4821 recebida` · `09:15 classificada: cotação técnica · vendedor R.` · `09:16 encaminhada · SLA 4h iniciado`) rotulado "exemplo ilustrativo". Este é o único lugar da home em que mono aparece como "dado", e só porque é log de verdade (sintético).
- **Interação:** tabs acessíveis (setas, Home/End); cada tab muda descrição e log.
- **CTA:** "Ver como funciona" (página) e "Governança de IA" (tecnologia).
- **Desktop:** diagrama em linha única; tabs abaixo.
- **Mobile:** diagrama em 2 linhas (3 + 3) ou vertical se < 24rem; agentes em acordeão `<details>` nativo (um aberto por vez via JS leve, opcional).
- **Motion:** ao entrar na viewport, os 6 nós acendem em sequência (60 ms cada) uma vez; ao trocar tab, log "digita" 3 linhas (CSS `steps`, 400 ms). Reduced motion: sem sequência, log estático.
- **SEO:** H2 + H3 por agente; termos "agente de follow-up", "agente de qualificação", "atualização de CRM".
- **GEO:** cada agente definido em uma frase ("O agente de follow-up acompanha cada oportunidade aberta, lembra o vendedor e registra o próximo passo"); schema `DefinedTerm` na página Como funciona (não na home, para não duplicar).
- **Analytics:** `agent_tab_change{agent}`, `governance_link_click`.

---

## 6. Para quem

- **Objetivo:** autoqualificação do visitante.
- **Persona:** diretor de indústria / distribuidora.
- **Mensagem:** conhecemos o seu jeito de vender.
- **Headline (H2):** *Para quem vende B2B com ciclo consultivo.*
- **Conteúdo:** 2 blocos (01 §5.7) com título, 2 frases e 4 "sinais de fit" em lista; link para página do segmento.
- **Visual:** 2 colunas com **fotografia industrial real** (uma por segmento: linha de produção / armazém de distribuição), tratamento desaturado com viés frio, overlay grafite 60%, texto sobreposto no terço inferior. Se fotografia própria não estiver disponível no lançamento (O4), usar banco licenciado com critérios de 05 §6.
- **Interação:** bloco inteiro é link; hover: overlay reduz para 50%.
- **CTA:** "Ver para indústrias" / "Ver para distribuidoras".
- **Desktop:** 2 colunas 50/50, altura 420 px. **Mobile:** empilhados, altura 280 px, texto sempre legível (contraste verificado sobre overlay).
- **Motion:** nenhuma além do hover.
- **SEO:** H2 + H3 por segmento; `alt` descritivo real das fotos.
- **GEO:** entidades de segmento explícitas.
- **Analytics:** `segment_click{segment}`.

---

## 7. O que medimos

- **Objetivo:** prova honesta sem cases.
- **Persona:** dono / CFO.
- **Mensagem:** medimos o observável; a receita vem como consequência.
- **Headline (H2):** *O que medimos antes, durante e depois.*
- **Conteúdo:** intro (01 §5.8) · tabela 3 colunas × 4 linhas · nota de honestidade visível · link "Ver como fazemos baseline".
- **Visual:** tabela real (`<table>`) com cabeçalhos, sobre branco-osso; sem ícones; métricas em texto normal (não mono — são nomes de métricas, não valores).
- **Interação:** clique no nome da métrica abre definição (`<details>` inline ou tooltip acessível).
- **CTA:** "Ver resultados" (página).
- **Desktop:** tabela completa. **Mobile:** tabela vira 3 grupos (Antes / Durante / Depois) empilhados, cada um com lista — via container query no wrapper, sem scroll horizontal.
- **Motion:** nenhuma.
- **SEO:** tabela semântica com `<th scope>`; termos de métrica.
- **GEO:** tabela é conteúdo citável e estruturado; nota de honestidade aumenta confiabilidade percebida por sistemas de IA (conteúdo transparente sobre limitações).
- **Analytics:** `metric_definition_open{metric}`.

---

## 8. Como pensamos

- **Objetivo:** posicionamento e filtro (afasta quem quer "IA por IA").
- **Persona:** diretor / TI.
- **Mensagem:** IA não conserta processo ruim; começamos pelo processo; operamos, não entregamos e sumimos.
- **Headline (H2):** *IA não conserta processo ruim. Ela acelera.*
- **Conteúdo:** 01 §5.9 (3 frases) + 3 princípios em linha + link "Como pensamos".
- **Visual:** bloco tipográfico: H2 grande em Fraunces sobre grafite, sem imagem; princípios como três colunas de texto curto separadas por linhas finas verticais.
- **Interação:** nenhuma.
- **CTA:** link secundário.
- **Desktop:** H2 à esquerda (5 col), princípios à direita (7 col). **Mobile:** empilhado.
- **Motion:** nenhuma.
- **SEO/GEO:** parágrafo de princípio é citável; H2 memorável.
- **Analytics:** `vision_link_click`.

---

## 9. Insights

- **Objetivo:** sinalizar autoridade e conteúdo vivo.
- **Persona:** gerente / analista.
- **Headline (H2):** *O que aprendemos operando sistemas comerciais.*
- **Conteúdo:** 3 artigos mais recentes (título, resumo de 1 linha, autor, data, tempo de leitura). Se < 3 artigos no lançamento, seção não renderiza (condição no build).
- **Visual:** lista editorial (não cards idênticos): título em Fraunces, meta em Inter pequena, sem imagem de capa em v1 (evita banco de imagens genérico).
- **Interação:** título é link.
- **CTA:** "Todos os insights".
- **Desktop:** 3 colunas. **Mobile:** lista vertical.
- **Motion:** nenhuma.
- **SEO:** links para artigos; H2.
- **Analytics:** `insight_card_click{slug}`.

---

## 10. CTA final

- **Objetivo:** converter quem chegou ao fim.
- **Persona:** diretor / dono.
- **Headline (H2):** *Quanto está vazando na sua empresa?*
- **Conteúdo:** 01 §5.10.
- **Visual:** bloco grafite de largura total, H2 grande, botão âmbar; abaixo, link "Fale com um especialista". Sem imagem.
- **Interação:** botões.
- **CTA:** primário Diagnóstico; secundário Contato.
- **Desktop/Mobile:** centralizado; botão 100% de largura no mobile, dentro da safe area.
- **Motion:** nenhuma.
- **SEO:** H2 com pergunta (intenção de busca "quanto perco em vendas").
- **GEO:** pergunta + resposta curta ("Em 5 dias colocamos número nisso") é par Q&A citável.
- **Analytics:** `final_cta_click`, `contact_link_click`.

---

## Rodapé (todas as páginas)

4 colunas (03 §2) + assinatura "*Operação comercial. Resultado, não relatório.*" + endereço/CNPJ (se aplicável) + links legais + seletor de consentimento ("Preferências de privacidade") + ícone LinkedIn (único social em v1). Sem newsletter em v1.

---

## Wireframe textual (desktop)

```
┌─────────────────────────────────────────────────────────────────────┐
│ LOGO   O que fazemos ▾  Para quem ▾  Como funciona  Resultados      │
│        Sobre ▾  Insights                   [Solicitar diagnóstico]  │
├─────────────────────────────────────────────────────────────────────┤
│ H1 (40ch)                              ┌─────────────────────────┐  │
│ supporting                             │  SystemDiagram (vivo)   │  │
│ [Diagnóstico]  Ver como funciona       │  + 3 indicadores mono   │  │
│ microprova · microprova · microprova   │  "exemplo ilustrativo"  │  │
│                                        └─────────────────────────┘  │
├─────────────────────────────────────────────────────────────────────┤
│  Indústrias e distribuidoras │ Do 1º contato à renovação │ Desde… │
├─────────────────────────────────────────────────────────────────────┤
│ H2 Problema                                                         │
│ [glifo sintoma] [glifo sintoma] [glifo sintoma]                     │
│        [glifo sintoma] [glifo sintoma]                              │
│ fechamento                                                          │
├─────────────────────────────────────────────────────────────────────┤
│ H2 Escada      ①──────②──────③──────④                               │
│                5 dias  2–3 sem 60 dias mensal                       │
├─────────────────────────────────────────────────────────────────────┤
│ H2 Agentes   DADO→CONTEXTO→RACIOCÍNIO→AÇÃO→[SUPERVISÃO]→RESULTADO   │
│ [Qualificação|Follow-up|Reativação|CRM]  descrição │ log mono       │
├─────────────────────────────────────────────────────────────────────┤
│ H2 Para quem   [foto indústria + texto] [foto distribuição + texto] │
├─────────────────────────────────────────────────────────────────────┤
│ H2 O que medimos   | Antes | Durante | Depois |  (tabela)           │
├─────────────────────────────────────────────────────────────────────┤
│ H2 tipográfico grande        │ princípio │ princípio │ princípio    │
├─────────────────────────────────────────────────────────────────────┤
│ H2 Insights   artigo · artigo · artigo                              │
├─────────────────────────────────────────────────────────────────────┤
│               H2 Quanto está vazando?  [Diagnóstico]                │
├─────────────────────────────────────────────────────────────────────┤
│ footer 4 col · assinatura · legal · consentimento                   │
└─────────────────────────────────────────────────────────────────────┘
```

Alinhamento: texto sempre alinhado à esquerda, exceto CTA final e faixa de contexto (centralizados). Sem justificação.

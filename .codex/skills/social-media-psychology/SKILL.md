---
name: social-media-psychology
description: Especialista em psicologia de redes sociais e algoritmos de distribuição — orienta escrita e valida conteúdo para maximizar engajamento no LinkedIn e Instagram.
---

# 🧠 Psicologia de Redes Sociais & Algoritmos de Distribuição

Skill de **consultoria estratégica** sobre como os algoritmos rankeiam conteúdo e como a psicologia humana influencia engajamento. Não gera conteúdo — **orienta a geração e valida na revisão**.

> [!IMPORTANT]
> **Filosofia Core:** Engajamento genuíno vem de conteúdo que entrega valor real. Esta skill ensina a **apresentar** melhor o que já é bom — nunca a manipular audiência com truques vazios. Se o conteúdo não é útil, nenhum hack de algoritmo salva.

---

## 🎯 Quando Usar Esta Skill

Use quando outra skill ou workflow precisar:

- **Otimizar** texto para uma plataforma específica (LinkedIn ou Instagram)
- **Validar** se um conteúdo pronto está formatado para maximizar engajamento
- **Orientar** a criação de hooks, CTAs e estrutura de posts
- **Revisar** anti-patterns que reduzem alcance ou penalizam distribuição

**Modos de operação:**

| Modo | Quando | O que retorna |
|------|--------|---------------|
| **Consulta** | Antes/durante a escrita | Diretrizes de Otimização |
| **Revisão** | Após a escrita, antes de publicar | Checklist de Conformidade |

---

## 📥 Inputs

| Input | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `plataforma_alvo` | `string` | ✅ | `linkedin`, `instagram-feed`, `instagram-reels`, `instagram-stories` |
| `formato` | `string` | ✅ | `post-texto`, `post-imagem`, `carrossel`, `artigo`, `reel` |
| `conteudo_base` | `string/path` | ⚠️ (no modo Revisão) | Texto original a ser analisado ou otimizado |
| `objetivo` | `string` | ❌ | `alcance`, `engajamento`, `autoridade`, `conversão` (default: `engajamento`) |

---

## 📊 Pilar 1 — Algoritmos de Distribuição

Base factual de como cada plataforma rankeia e distribui conteúdo (dados 2025-2026).

### LinkedIn

```
┌─────────────────────────────────────────────────────────────┐
│              LINKEDIN — SINAIS DE RANKING                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Relevância + Expertise     ████████████████████  (Alto)    │
│  Dwell Time (tempo lendo)   ████████████████████  (Alto)    │
│  Comentários significativos ████████████████████  (Alto)    │
│  Golden Hour (60-90 min)    ███████████████████   (Alto)    │
│  Shares privados            ██████████████████    (Médio+)  │
│  Saves                      █████████████████     (Médio)   │
│  Likes                      ████████████          (Baixo)   │
│                                                             │
│  PENALIZADO:                                                │
│  ❌ Engagement bait ("Concorda? Curte!")                     │
│  ❌ Conteúdo genérico/reciclado de IA                       │
│  ❌ Hashtag stuffing (10+ tags)                              │
│  ❌ Links externos no corpo (reduz distribuição)             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Regras práticas LinkedIn:**

| Métrica | Recomendação |
|---------|-------------|
| Hashtags | 1-3 relevantes (máx. 5) |
| Texto máximo | 3.000 caracteres |
| Formato preferido | Texto nativo, carrossel, vídeo nativo vertical |
| Golden Hour | Engajamento forte nos primeiros 60-90 min define o alcance |
| CTA | Perguntas que geram comentários longos (não sim/não) |
| Links externos | Colocar no primeiro comentário, não no corpo |

---

### Instagram Feed

```
┌─────────────────────────────────────────────────────────────┐
│           INSTAGRAM FEED — SINAIS DE RANKING                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  DM Shares (envios privados) ████████████████████  (Alto)   │
│  Saves                       ████████████████████  (Alto)   │
│  Dwell Time                  ███████████████████   (Alto)   │
│  Comentários + respostas     ██████████████████    (Médio+) │
│  Relação com seguidor        ██████████████████    (Médio+) │
│  Originalidade do conteúdo   █████████████████     (Médio)  │
│  Keywords no caption         ████████████████      (Médio)  │
│  Likes                       ████████████          (Baixo)  │
│                                                             │
│  PENALIZADO:                                                │
│  ❌ Repost sem valor agregado                                │
│  ❌ Watermarks de outras plataformas                         │
│  ❌ Conteúdo genérico/reciclado                              │
│  ❌ Engagement bait explícito                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Regras práticas Instagram Feed:**

| Métrica | Recomendação |
|---------|-------------|
| Caption máximo | 2.200 caracteres |
| Hashtags | 3-5 relevantes (máx. 30, mas qualidade > quantidade) |
| Formato imagem | 1080x1080 (quadrado) ou 1080x1350 (retrato) |
| SEO | Keywords relevantes no caption e na bio (hashtags perderam peso) |
| Métrica-chave | DM shares > saves > comentários > likes |

---

### Instagram Reels

```
┌─────────────────────────────────────────────────────────────┐
│           INSTAGRAM REELS — SINAIS DE RANKING                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Watch Time + Completion     ████████████████████  (Alto)   │
│  Primeiros 3 segundos (hook) ████████████████████  (Alto)   │
│  Replays                     ███████████████████   (Alto)   │
│  Shares (DM + Stories)       ███████████████████   (Alto)   │
│  Originalidade               ██████████████████    (Médio+) │
│  Áudio nativo                █████████████████     (Médio)  │
│  Saves                       ████████████████      (Médio)  │
│                                                             │
│  PENALIZADO:                                                │
│  ❌ Vídeo com watermark TikTok                               │
│  ❌ Baixa resolução / bordas pretas                          │
│  ❌ Hook fraco (drop nos primeiros 3s = morte)               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Regras práticas Instagram Reels:**

| Métrica | Recomendação |
|---------|-------------|
| Formato | 1080x1920 (9:16 vertical) |
| Duração ideal | 15-30 segundos (para completion rate) |
| Hook | Nos primeiros 2-3 segundos — visual ou textual |
| Área segura | Evitar texto nas bordas (botões do app sobrepõem) |

---

### Instagram Stories

```
┌─────────────────────────────────────────────────────────────┐
│          INSTAGRAM STORIES — SINAIS DE RANKING               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Frequência de interação      ████████████████████  (Alto)  │
│  Respostas via DM             ███████████████████   (Alto)  │
│  Stickers interativos         ██████████████████    (Médio+)│
│  (polls, questions, quiz)                                   │
│  Recency                      ██████████████████    (Médio+)│
│  Viewing history              █████████████████     (Médio) │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧠 Pilar 2 — Psicologia de Persuasão

Princípios de Cialdini e extensões, aplicados ao contexto de conteúdo digital.

> [!IMPORTANT]
> **Uso ético.** Estes princípios são para **apresentar melhor** valor real. Usar para manipular audiência sem entregar valor é engagement bait com camada de verniz — e o algoritmo eventualmente penaliza.

### Princípios Aplicáveis

| # | Princípio | O que é | Aplicação em Conteúdo | Exemplo |
|---|-----------|---------|----------------------|---------|
| 1 | **Reciprocidade** | Dar algo gera vontade de retribuir | Ofereça insight genuíno antes de pedir engajamento | "Aqui está o template que uso em todo projeto" → engajamento orgânico |
| 2 | **Prova Social** | Pessoas seguem o que outros fazem | Mostre resultados, números, adoção | "Após aplicar TDD, o time reduziu bugs em produção em 60%" |
| 3 | **Autoridade** | Expertise gera confiança | Demonstre experiência com dados e casos reais | "Em 12 anos trabalhando com microsserviços, vi este padrão se repetir" |
| 4 | **Escassez / FOMO** | Limitação percebida gera ação | Urgência legítima, não artificial | "Este anti-pattern cobra juros compostos — quanto antes identificar, menor o custo" |
| 5 | **Consistência** | Pessoas querem ser coerentes com compromissos anteriores | Micro-compromissos: poll, pergunta simples, quiz | "Você já fez um rollback em produção às 2h da manhã?" → identificação → engajamento |
| 6 | **Afinidade** | Gostamos de quem é parecido conosco | Tom autêntico, vulnerabilidade calculada, humor | "Eu também já achei que Docker resolvia tudo. Spoiler: não resolve." |

### Quando Usar Cada Princípio

```
┌────────────────────────────────────────────────────┐
│          MAPA DE PRINCÍPIOS POR OBJETIVO            │
├────────────────────────────────────────────────────┤
│                                                    │
│  Alcance     → Prova Social + Afinidade            │
│  Engajamento → Reciprocidade + Consistência        │
│  Autoridade  → Autoridade + Prova Social           │
│  Conversão   → Escassez + Consistência             │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

## 🎭 Pilar 3 — Vieses Cognitivos Aplicáveis

Atalhos mentais do leitor que afetam engajamento — como usá-los eticamente.

| Viés | O que é | Aplicação | Exemplo Prático |
|------|---------|-----------|-----------------|
| **Open Loop** | Curiosidade por informação incompleta | Abrir com promessa não resolvida | "Existe um erro de arquitetura que 90% dos times cometem. E ele não tem a ver com tecnologia." |
| **Framing Effect** | Mesma informação, moldada de forma diferente, gera reações diferentes | Escolher o enquadramento mais impactante | ❌ "Testes economizam tempo" → ✅ "Sem testes, cada deploy é uma roleta russa" |
| **Primacy/Recency** | Lembramos melhor o início e o fim | Informação mais impactante no hook e na conclusão | Hook forte + conclusão memorável |
| **Loss Aversion** | Perder dói mais que ganhar traz prazer | Enfatizar custo de NÃO agir | "Cada semana sem refatorar adiciona 4h de débito técnico no sprint seguinte" |
| **Bandwagon** | Seguimos o que muitos adotam | Citar adoção ampla | "Times que adotam trunk-based development reportam 3x menos conflitos de merge" |
| **Confirmation Bias** | Buscamos validação do que já acreditamos | Validar a dor/frustração do leitor ANTES de oferecer solução | "Sim, seu monolito está uma bagunça. Mas microsserviços não vão resolver." |
| **Anchoring** | Primeira informação serve de referência | Apresentar o cenário ruim primeiro para contrastar | "Imagina cada deploy levando 45min. Agora imagina: 3 minutos. Essa é a diferença que CI/CD faz." |

---

## 🪝 Pilar 4 — Engenharia de Hooks & Anti-Patterns

### Tipos de Hook que Funcionam

| Tipo | Quando Usar | Template |
|------|------------|---------|
| **Pergunta provocativa** | Quando quer gerar identificação | "Você acha que [conceito popular] realmente funciona?" |
| **Dado surpreendente** | Quando tem números concretos | "[X]% dos [algo] fazem [algo inesperado]" |
| **Contraste inesperado** | Quando a conclusão é contraintuitiva | "O melhor [X] que fiz foi [oposto do esperado]" |
| **Confissão de erro** | Quando quer mostrar vulnerabilidade + aprendizado | "Eu gastei [tempo] fazendo [coisa] que ninguém precisava" |
| **Afirmação contrária** | Quando quer desafiar status quo | "[Conceito popular] pode ser o pior inimigo do seu [objetivo]" |
| **Mini-história** | Quando quer prender pelo narrativo | "Sexta-feira, 23h. O Slack toca. Produção caiu." |

### Formatação por Plataforma

#### LinkedIn — Texto

```
[HOOK — 1-2 linhas que prendem]
                                    ← linha em branco (respiro)
[Contexto — 2-3 parágrafos curtos]
                                    ← linha em branco
[Insight principal — frase forte]
                                    ← linha em branco
[Conclusão reflexiva ou CTA]

---
[1-3 hashtags relevantes]
```

**Dicas de formatação LinkedIn:**
- Parágrafos de 1-2 linhas (mobile-first)
- Use bullet points para listas
- Emoji com moderação (1-2 por post, no máximo)
- Primeira linha determina se o leitor clica "ver mais" — invista nela
- A quebra "ver mais" acontece por volta do caractere 210

#### Instagram — Caption

```
[HOOK — primeira linha antes do "mais"]
.
[Contexto + valor — 3-5 parágrafos curtos]
.
[CTA — pergunta ou chamada]
.
.
.
[3-5 hashtags relevantes]
```

**Dicas de formatação Instagram:**
- Use `.` ou emoji como separador de parágrafos (Instagram não renderiza linha em branco)
- Primeira linha é tudo — ela determina se o usuário expande
- Hashtags no final, separadas por espaço visual
- Keywords relevantes no caption substituem hashtags para descoberta

---

### ❌ Anti-Patterns de Engajamento

| Anti-Pattern | Por que Falha | Penalização |
|-------------|--------------|-------------|
| **Engagement bait** ("Concorda? Curte!") | Interação vazia, sem valor | LinkedIn e Instagram penalizam diretamente |
| **Clickbait sem entrega** | Promete no hook, não entrega | Reduz dwell time → algoritmo reduz alcance |
| **CAPS LOCK + excesso de emoji** | Aparência de spam | Reduz credibilidade e distribuição |
| **Hashtag stuffing** (10+ tags) | LinkedIn penaliza; Instagram reduziu relevância de hashtags | Alcance reduzido |
| **Conteúdo genérico/reciclado IA** | Algoritmos priorizam originalidade | LinkedIn usa LLMs para detectar; Instagram penaliza repost |
| **Link externo no corpo** (LinkedIn) | Plataforma quer manter usuário | Até 50% menos alcance com link no corpo |
| **Pedir like/share explicitamente** | Engagement bait | Penalizado por ambas plataformas |
| **Texto-parede sem formatação** | Dwell time despenca | Menos leitura → menos sinal positivo |
| **Postar e sumir** | Sem interação com comentários | Perde o boost da Golden Hour |

---

## 📤 Outputs

### Modo Consulta (para escrita — Diretrizes de Otimização)

Ao ser consultada **antes ou durante** a criação de conteúdo, retorne:

```markdown
## 📋 Diretrizes de Otimização — [plataforma] / [formato]

### 🤖 Algoritmo
- [Fatores de ranking mais relevantes para este formato]
- [Métricas-chave que o algoritmo avalia]
- [Janela de oportunidade (Golden Hour, primeiros segundos, etc.)]

### 🏗️ Estrutura Recomendada
- **Hook:** [Tipo de hook mais adequado para o tom/tema]
- **Corpo:** [Formatação ideal — parágrafos, bullets, tamanho]
- **CTA:** [Tipo de call-to-action que gera interação significativa]
- **Hashtags/Keywords:** [Quantidade e estratégia]

### 🧠 Gatilhos Psicológicos Recomendados
- [2-3 princípios/vieses mais relevantes para o conteúdo, com justificativa]

### ⛔ Evitar
- [Anti-patterns específicos para esta plataforma/formato]
```

---

### Modo Revisão (para validação — Checklist de Conformidade)

Ao ser consultada **após** a criação, com o conteúdo pronto, retorne:

```markdown
## 🔍 Revisão de Engajamento — [plataforma] / [formato]

### Resumo

| Critério | Status | Observação |
|----------|--------|------------|
| Hook nos primeiros 2-3 linhas/segundos | ✅/⚠️/❌ | [detalhe] |
| Formatação otimizada para a plataforma | ✅/⚠️/❌ | [detalhe] |
| Gatilho psicológico presente e ético | ✅/⚠️/❌ | [detalhe] |
| Sem anti-patterns de engajamento | ✅/⚠️/❌ | [detalhe] |
| CTA claro e adequado | ✅/⚠️/❌ | [detalhe] |
| Tamanho adequado à plataforma | ✅/⚠️/❌ | [detalhe] |
| Keywords/hashtags otimizados | ✅/⚠️/❌ | [detalhe] |
| Dwell time estimado adequado | ✅/⚠️/❌ | [detalhe] |

### Veredicto: ✅ OTIMIZADO / ⚠️ AJUSTAR / ❌ RETRABALHAR

### 💡 Sugestões de Melhoria
- [Lista priorizada por impacto no engajamento]
- [Para cada sugestão: o que mudar + por que + impacto esperado]

### ✅ Pontos Fortes
- [O que o conteúdo já faz bem — reforço positivo]
```

---

## 🔗 Integração com Skills Existentes

Esta skill é consumida via **composição** — nunca atua sozinha:

```
┌─────────────────────────────────────────────────────────────────┐
│                   Fluxo de Composição                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  engineering-writer ──→ Modo Consulta                           │
│    "Quais diretrizes para um post LinkedIn sobre DDD?"          │
│    → recebe: hook, formatação, gatilhos, anti-patterns          │
│                                                                 │
│  engineering-writer-revisor ──→ Modo Revisão                    │
│    "Este post está otimizado para LinkedIn?"                    │
│    → recebe: checklist + sugestões priorizadas                  │
│                                                                 │
│  designer ──→ Modo Consulta                                     │
│    "Carrossel Instagram: quantos slides? Texto por slide?"      │
│    → recebe: orientações visuais por plataforma                 │
│                                                                 │
│  linkedin-poster / instagram-poster ──→ Modo Revisão            │
│    "Antes de publicar: hashtags ok? CTA ok? Tamanho ok?"        │
│    → recebe: checklist de conformidade                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## ⚠️ Observações

- **Dados de algoritmo mudam.** Os sinais de ranking documentados aqui refletem 2025-2026. Revise periodicamente.
- **Ética primeiro.** Engajamento genuíno > hacks de curto prazo. Algoritmos evoluem para penalizar manipulação.
- **Contexto importa.** Um post técnico profundo no LinkedIn tem regras diferentes de um carrossel visual no Instagram.
- **Não é fórmula mágica.** Conteúdo ruim bem formatado continua sendo conteúdo ruim. A skill otimiza a **apresentação**, não substitui a **substância**.

---

## ⚡ Quick Reference

```
┌─────────────────────────────────────────────────────────────┐
│      SOCIAL MEDIA PSYCHOLOGY — DECISÃO RÁPIDA               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Modo Consulta  → Antes da escrita: diretrizes + gatilhos   │
│  Modo Revisão   → Após a escrita: checklist + sugestões     │
│                                                             │
│  LinkedIn       → Dwell time, comentários, Golden Hour      │
│  Insta Feed     → DM shares, saves, originalidade           │
│  Insta Reels    → Watch time, hook 3s, completion rate      │
│  Insta Stories  → Interação, respostas, stickers            │
│                                                             │
│  Gatilhos       → Reciprocidade, Prova Social, Autoridade   │
│                   Escassez, Consistência, Afinidade          │
│                                                             │
│  Vieses         → Open Loop, Framing, Loss Aversion         │
│                   Primacy/Recency, Bandwagon, Anchoring      │
│                                                             │
│  REGRA DE OURO: Otimize a apresentação, não substitua       │
│                 a substância. Sem valor → sem engajamento.   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📚 Referências

- Robert B. Cialdini, "Influence: The Psychology of Persuasion" (2021 — New & Expanded Edition). https://www.amazon.com/Influence-New-Expanded-Psychology-Persuasion/dp/0062937650
- Daniel Kahneman, "Thinking, Fast and Slow" (2011). https://www.amazon.com/Thinking-Fast-Slow-Daniel-Kahneman/dp/0374533555
- Jonah Berger, "Contagious: Why Things Catch On" (2016). https://www.amazon.com/Contagious-Things-Catch-Jonah-Berger/dp/1451686579
- LinkedIn Engineering Blog — "How LinkedIn's Algorithm Works" (2024). https://engineering.linkedin.com/
- Instagram Creators — "How Instagram's Algorithm Works" (2025). https://creators.instagram.com/

> 💡 **Lembre-se:** O melhor hack de algoritmo é conteúdo que as pessoas realmente querem ler, salvar e compartilhar. Todo o resto é otimização incremental.

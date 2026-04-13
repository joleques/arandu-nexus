---
name: engineering-writer-revisor
description: Revisa artigos técnicos produzidos pela skill engineering-writer, validando estrutura, estilo, tom e qualidade do conteúdo.
---

# 🔍 Revisor de Artigos Técnicos — Engineering Writer

Skill para validação de artigos técnicos sobre arquitetura e engenharia de software.

**Referência:** Skill [`engineering-writer`](../engineering-writer/SKILL.md)

> [!IMPORTANT]
> **Filosofia Core:** Um bom artigo técnico ensina algo útil, provoca reflexão e compartilha experiência — sem hype, sem buzzwords, sem "verdade absoluta". Se o leitor não sai pensando em como melhorar seu sistema, o artigo falhou.

---

## 📋 Quando Usar

Execute esta skill quando:
- Após a skill `engineering-writer` produzir um artigo, antes de entregar ao usuário
- Para validar que o conteúdo segue o padrão de qualidade esperado
- Quando o usuário pedir revisão de um texto técnico sobre arquitetura

---

## 🎯 Instruções de Execução

### 1. Coletar Informações

Identifique:
1. **O artigo** a ser revisado
2. **O formato solicitado** (post LinkedIn, artigo médio, artigo aprofundado)
3. **O tema/problema central** do artigo

### 2. Análise de Estrutura

Verifique se o artigo segue as 5 seções esperadas:

```
┌─────────────────────────────────────────┐
│ 1. Problema ou Provocação Inicial       │
│ 2. Contexto Técnico                     │
│ 3. Experiência Prática                  │
│ 4. Explicação ou Análise                │
│ 5. Conclusão                            │
└─────────────────────────────────────────┘
```

**Problemas a identificar:**
- ❌ Seção ausente ou fora de ordem
- ❌ Abertura sem provocação (começa genérico ou com definição de dicionário)
- ❌ Conclusão sem reflexão prática (termina abruptamente ou com frase motivacional vazia)
- ❌ Seção de experiência prática sem observações do mundo real

---

### 3. Análise de Estilo e Tom

#### 3.1 Clareza e Fluidez

**Verificar:**
- ✅ Linguagem técnica mas acessível
- ✅ Texto fluido, sem jargão desnecessário
- ✅ Parágrafos curtos e diretos
- ❌ Frases longas e confusas (3+ orações subordinadas)
- ❌ Jargão sem explicação para o público-alvo
- ❌ Texto denso sem quebras visuais

#### 3.2 Tom Irônico e Humilde

**Verificar:**
- ✅ Ironia sutil e inteligente, quando presente
- ✅ Tom humilde — escreve como quem aprende, não como quem sabe tudo
- ✅ Experiência compartilhada, não lição dada
- ❌ Ironia agressiva, sarcástica ou condescendente
- ❌ Tom arrogante ou de "guru"
- ❌ Ausência total de personalidade (texto robótico)

#### 3.3 Base em Experiência

**Verificar:**
- ✅ Exemplos de situações reais (mesmo que anônimas)
- ✅ Erros, aprendizados e refatorações mencionados
- ✅ Trade-offs apresentados com nuances
- ❌ Texto puramente teórico sem conexão com prática
- ❌ Exemplo genérico tipo "imagine que você tem um sistema..."
- ❌ Apresenta verdade absoluta sem considerar alternativas

---

### 4. Análise de Conteúdo

#### 4.1 Profundidade Técnica

**Verificar:**
- ✅ Conceitos explicados com clareza
- ✅ Analogias simples para conceitos complexos
- ✅ Relação com práticas reconhecidas (DDD, Clean Architecture, XP, etc.)
- ❌ Superficialidade — apenas arranha a superfície do tema
- ❌ Conceitos errados ou imprecisos tecnicamente
- ❌ Over-simplificação que distorce o conceito

#### 4.2 Trade-offs e Nuances

**Verificar:**
- ✅ Apresenta prós e contras das abordagens
- ✅ Reconhece que contexto importa
- ✅ Evita "verdade absoluta" — mostra que há cenários diferentes
- ❌ Posição unilateral sem reconhecer trade-offs
- ❌ "Silver bullet" — apresenta solução única para tudo
- ❌ Ignora limitações ou cenários onde a abordagem falha

#### 4.3 Valor para o Leitor

**Verificar:**
- ✅ O leitor aprende algo útil e aplicável
- ✅ Provoca reflexão sobre o próprio sistema/processo
- ✅ Dá ferramentas mentais para decisões melhores
- ❌ Repete o óbvio sem adicionar perspectiva nova
- ❌ Texto genérico que serve para qualquer tema
- ❌ Conteúdo que não muda nada no dia a dia do leitor

#### 4.4 Citações e Fontes

**Verificar:**
- ✅ Citações possuem footnotes Markdown (`[^N]`)
- ✅ Footnotes incluem link para a fonte original (quando disponível)
- ✅ Seção "Referências" presente no final do artigo com todas as footnotes
- ❌ Citação sem footnote correspondente
- ❌ Footnote sem link ou referência incompleta
- ❌ Conceito atribuído a autor/livro sem referência rastreável

---

### 5. Análise de Formato

#### 5.1 Título

**Verificar:**
- ✅ Forte, específico e despertando curiosidade
- ✅ Evita clickbait mas atrai atenção
- ❌ Genérico ("Sobre Microserviços", "Clean Architecture")
- ❌ Clickbait puro ("Você não vai acreditar...")
- ❌ Muito longo (10+ palavras)

#### 5.2 Comprimento

**Verificar adequação ao formato:**

| Formato | Faixa Esperada |
|---------|---------------|
| **Post LinkedIn** | 150–300 palavras |
| **Artigo médio** | 600–1000 palavras |
| **Artigo aprofundado** | 1000–1800 palavras |

- ❌ Texto curto demais para o formato (raso)
- ❌ Texto longo demais para o formato (cansativo)

---

### 6. Palavras e Expressões Proibidas

Valide que o artigo **NÃO** contém:

| ❌ Proibido | Motivo |
|------------|--------|
| "Revolucionário", "disruptivo", "game-changer" | Hype tecnológico |
| "Best practice" sem contexto | Buzzword vazia |
| "Na minha humilde opinião" | Falsa humildade — seja direto |
| "Todos sabemos que..." | Presunção sobre o leitor |
| "Simplesmente faça..." | Simplificação que ignora complexidade |
| "A verdade é que..." | Impõe verdade absoluta |
| "O futuro da tecnologia é..." | Futurologia especulativa |

---

## 📝 Formato do Relatório

Gere um relatório Markdown com:

```markdown
# Relatório de Revisão de Artigo Técnico

**Artigo:** [título]
**Formato:** [post LinkedIn / artigo médio / artigo aprofundado]
**Tema:** [tema central]

## Resumo

| Categoria | Status | Problemas |
|-----------|--------|-----------|
| Estrutura (5 seções) | ✅/⚠️/❌ | X |
| Estilo e Tom | ✅/⚠️/❌ | X |
| Profundidade Técnica | ✅/⚠️/❌ | X |
| Trade-offs e Nuances | ✅/⚠️/❌ | X |
| Valor para o Leitor | ✅/⚠️/❌ | X |
| Título | ✅/⚠️/❌ | X |
| Comprimento | ✅/⚠️/❌ | X |
| Expressões Proibidas | ✅/❌ | X |
| Citações e Fontes | ✅/⚠️/❌ | X |

## Veredicto: ✅ APROVADO / ⚠️ AJUSTAR / ❌ REESCREVER

## Problemas Encontrados

### [Categoria]

#### [Problema 1]
- **Trecho:** "[trecho do artigo]"
- **Problema:** [descrição objetiva]
- **Sugestão:** [como corrigir]

## Pontos Fortes

- [O que o artigo faz bem — reforço positivo]

## Recomendações Gerais

- [Lista de melhorias sugeridas, priorizadas por impacto]
```

---

## ⚠️ Observações

- **Não reescreva o artigo.** Aponte problemas e sugira direções — o autor deve reescrever.
- **Pragmatismo:** Um artigo não precisa ser perfeito, precisa ser útil e honesto.
- **Contexto importa:** Um post de LinkedIn tem regras diferentes de um artigo aprofundado.
- **Reforce o positivo:** Sempre destaque o que o artigo faz bem antes de listar problemas.
- **Priorize impacto:** Foque em problemas que afetam a experiência do leitor, não em pedantismo gramatical.

---

## ⚡ Quick Reference

```
┌─────────────────────────────────────────────────────────────┐
│       REVISÃO DE ARTIGO — DECISÃO RÁPIDA                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Estrutura   → Tem as 5 seções? Provocação → Conclusão?    │
│  Tom         → Humilde, irônico sutil, sem arrogância?      │
│  Base        → Experiência real ou teoria pura?             │
│  Trade-offs  → Mostra nuances ou "verdade absoluta"?        │
│  Valor       → Leitor sai pensando em melhorar algo?        │
│  Proibições  → Sem hype, buzzwords, "best practices" vagas? │
│  Citações    → Footnote [^N] + link na seção Referências?   │
│  Tamanho     → Adequado ao formato solicitado?              │
│                                                             │
│  TESTE FINAL: "Eu compartilharia isso com meu time?"        │
│               Se sim → ✅  Se não → ❌                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 📚 Referências

- Skill [`engineering-writer`](../engineering-writer/SKILL.md) — Padrão de produção de artigos
- [On Writing Well — William Zinsser](https://www.amazon.com/Writing-Well-Classic-Guide-Nonfiction/dp/0060891548)
- [The Elements of Style — Strunk & White](https://www.amazon.com/Elements-Style-Fourth-William-Strunk/dp/020530902X)
- [Technical Blogging — Antonio Cangiano](https://pragprog.com/titles/actb2/technical-blogging-second-edition/)

> 💡 **Lembre-se:** Um bom revisor não busca perfeição — busca honestidade, clareza e utilidade. Se o artigo ajuda outro engenheiro a pensar melhor, ele cumpriu seu papel.

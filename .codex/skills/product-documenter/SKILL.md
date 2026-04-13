---
name: product-documenter
description: Gera documentação canônica de produto otimizada para Base de Conhecimento RAG de Agentes de IA, a partir do contexto extraído nas fases anteriores.
---

# 📖 Documentador de Produto — Geração RAG-Ready

Skill para geração de documentação canônica e estruturada de produto, otimizada para ingestão em Base de Conhecimento de Agentes de IA via chunking semântico.

**Referências:**
- Skill [`product-interviewer`](../product-interviewer/SKILL.md) — Extração do contexto
- Skill [`product-context-aggregator`](../product-context-aggregator/SKILL.md) — Consolidação de extras
- Skill [`Documentador RAG`](../documentador/SKILL.md) — Padrão de estrutura Markdown para RAG

> [!IMPORTANT]
> **Filosofia Core:** A documentação gerada será consumida por Agentes de IA, não por humanos em primeiro lugar. Cada chunk deve ser autossuficiente, semanticamente rico e estruturalmente previsível para chunking automático.

---

## 🎯 Quando Usar Esta Skill

Use quando:

- O contexto da Fase 1 (entrevista) foi aprovado pelo revisor
- Os artefatos extras (Fase 1.5) foram consolidados (se houver)
- É hora de transformar o contexto bruto em documentação final

---

## 📂 Estrutura de Saída

A documentação final é salva em:

```
/documentacao/{titulo}/
├── contexto/                  ← Fase 1 (entrevista) — já existente
├── extra/                     ← Fase 1.5 (symlinks) — já existente
└── docs/                     ← Fase 2 (documentação final — ESTA SKILL)
    ├── 01-visao-geral.md
    ├── 02-dominio-negocio.md
    ├── 03-arquitetura-tecnica.md
    ├── 04-funcionalidades.md
    ├── 05-dados-e-contratos.md
    ├── 06-operacao.md
    ├── 07-historico-evolucao.md
    └── README.md              ← Índice geral com links para todos os docs
```

> [!NOTE]
> Gere apenas os documentos relevantes. Se um eixo não foi coberto nas fases anteriores (marcado como "N/I"), **não gere o documento correspondente**.

---

## 🔍 Instruções de Execução

### 1. Carregar Todo o Contexto

Leia todos os arquivos em:
1. `/documentacao/{titulo}/contexto/` — arquivos temáticos e log de entrevista
2. `/documentacao/{titulo}/contexto/contexto-consolidado.md` — se existir (Fase 1.5)
3. `/documentacao/{titulo}/extra/` — artefatos extras via symlinks (se existir)

---

### 2. Seguir o Padrão Documentador RAG

Cada documento gerado DEVE seguir **rigorosamente** o padrão da skill [`Documentador RAG`](../documentador/SKILL.md), especificamente:

#### 2.1 Bloco de Metadados YAML

```yaml
---
Título: [Nome claro do documento]
resumo: [Frase-resumo objetiva — será usado como Summary nos metadados do chunk]
categoria: [Técnica | Negócio | Integração | Operação]
tags: [tag1, tag2, tag3, tag4, tag5]
entidades_chave: [Sistemas, Siglas, Serviços core do produto]
produto: {titulo}
---
```

#### 2.2 Separação Obrigatória Teoria / Prática

```
┌─────────────────────────────────────────────────────────────────┐
│          CLASSIFICAÇÃO OBRIGATÓRIA POR SEÇÃO                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ## [Nome] (Teoria)  → Conceitos, regras, definições            │
│  ## [Nome] (Prática) → Passos, comandos, exemplos executáveis   │
│                                                                 │
│  A classificação é ESTRUTURAL, não semântica.                   │
│  O pipeline downstream não interpreta texto.                    │
└─────────────────────────────────────────────────────────────────┘
```

#### 2.3 Summary Obrigatório por Seção

Cada seção `##` DEVE ter um bloco Summary:

```markdown
## [Nome da Seção] (Teoria)

> **Summary:** [Resumo denso e semântico, otimizado para embedding e busca vetorial]
```

**Regras do Summary** (conforme skill Documentador RAG):
- Máximo 1-2 frases
- Foco semântico-conceitual
- Sem valores numéricos operacionais
- Incluir sinônimos relevantes
- Suficientemente específico para diferenciar de outras seções

#### 2.4 Autossuficiência de Chunk

Cada seção `###` dentro de `(Prática)` gera 1 chunk independente e DEVE ser compreensível isoladamente, sem depender de contexto de outras seções.

---

### 3. Diretrizes de Geração por Documento

#### 01-visao-geral.md
- O que é o produto, propósito, público-alvo
- Problema que resolve, contexto de mercado
- Fase atual (MVP, produção, legado)
- **Teoria** predominante

#### 02-dominio-negocio.md
- Entidades do domínio com atributos e estados
- Regras de negócio (claras, sem ambiguidade)
- Fluxos de negócio passo a passo
- Máquinas de estado (se houver)
- **Teoria** para regras + **Prática** para exemplos de fluxos

#### 03-arquitetura-tecnica.md
- Stack tecnológica detalhada
- Diagrama de componentes (Mermaid quando possível)
- Comunicação entre serviços
- Infraestrutura (cloud, containers, CI/CD)
- **Teoria** para visão macro + **Prática** para configurações

#### 04-funcionalidades.md
- Features com comportamento detalhado
- Cenários de uso (happy path + edge cases)
- Cenários de erro e tratamento
- **Teoria** para descrição + **Prática** para exemplos de chamadas

#### 05-dados-e-contratos.md
- Modelos de dados com campos e tipos
- Contratos de API (endpoints, payloads, responses)
- Schemas de banco de dados
- **Prática** predominante (tabelas de campos, exemplos JSON)

#### 06-operacao.md
- Deploy, monitoramento, alertas
- SLAs/SLOs, runbooks
- Tratamento de incidentes
- **Teoria** para conceitos operacionais + **Prática** para procedimentos

#### 07-historico-evolucao.md
- Decisões arquiteturais (ADRs)
- Dívidas técnicas conhecidas
- Refatorações passadas e planejadas
- Roadmap
- **Teoria** predominante

---

### 4. Gerar README.md (Índice)

```markdown
# Documentação — {titulo}

> {resumo do produto em 1-2 frases}

## Documentos

| Documento | Descrição | Status |
|-----------|-----------|--------|
| [01-visao-geral.md](./01-visao-geral.md) | Visão geral do produto | ✅ |
| [02-dominio-negocio.md](./02-dominio-negocio.md) | Domínio e regras de negócio | ✅ |
| ... | ... | ... |

## Fontes

- **Entrevista:** /documentacao/{titulo}/contexto/entrevista-log.md
- **Artefatos extras:** /documentacao/{titulo}/extra/ (se houver)
- **Contexto consolidado:** /documentacao/{titulo}/contexto/contexto-consolidado.md (se houver)

## Gerado em

- **Data:** {data}
- **Método:** Workflow `/doc-produto` — Skills product-interviewer + product-documenter
```

---

### 5. Regras de Fidelidade

```
┌─────────────────────────────────────────────────────────────────┐
│                 REGRAS DE FIDELIDADE                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. PROIBIDO RESUMIR — se o contexto tem 50 campos, liste 50   │
│  2. PROIBIDO INVENTAR — só documente o que está no contexto     │
│  3. PROIBIDO INFERIR — não complete lacunas com conhecimento    │
│     externo                                                     │
│  4. FIDELIDADE TOTAL ao jargão técnico do usuário               │
│  5. Se informação está como "N/I", documente como "N/I"         │
│  6. Use Mermaid para diagramas quando possível                  │
│  7. Cada chunk deve ser autossuficiente                         │
│                                                                 │
│  TESTE: "Tudo que está documentado tem origem no contexto?"     │
│         Se sim → ✅  Se não → ❌ INVÁLIDO                       │
└─────────────────────────────────────────────────────────────────┘
```

---

### 6. Notificar Resultado

Ao finalizar:

```
📖 Documentação gerada com sucesso!

📁 Diretório: /documentacao/{titulo}/docs/
📄 Documentos gerados: [lista com status]
📊 Total de seções: [N] teoria + [N] prática
📏 Formato: RAG-ready (chunking semântico)

Os documentos seguem o padrão Documentador RAG e estão prontos
para ingestão em Base de Conhecimento de Agentes de IA.
```

---

## ⚡ Quick Reference

```
┌─────────────────────────────────────────────────────────────────┐
│       DOCUMENTADOR DE PRODUTO — DECISÃO RÁPIDA                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Input     → Contexto (Fase 1) + Extras (Fase 1.5)             │
│  Output    → /documentacao/{titulo}/docs/                       │
│  Formato   → Padrão Documentador RAG (Teoria/Prática)          │
│  Metadados → YAML obrigatório em cada documento                │
│  Summary   → Obrigatório em cada seção ##                       │
│  Chunks    → Autossuficientes e monotemáticos                   │
│                                                                 │
│  REGRA #1: Não resume, não inventa, não infere.                 │
│  REGRA #2: Segue o padrão Documentador RAG à risca.             │
│                                                                 │
│  TESTE: "Um agente de IA conseguiria responder perguntas        │
│          sobre o produto usando apenas estes documentos?"       │
│         Se sim → ✅  Se não → ❌                                │
└─────────────────────────────────────────────────────────────────┘
```

---

> 💡 **Lembre-se:** Você transforma contexto bruto em conhecimento estruturado para máquinas. Priorize autossuficiência dos chunks, riqueza semântica dos Summaries e fidelidade total ao que foi dito pelo usuário.

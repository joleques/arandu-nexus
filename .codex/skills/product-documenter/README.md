# 📖 Product Documenter — Documentação RAG-Ready de Produto

Skill que gera documentação canônica e estruturada de produto, otimizada para ingestão em **Base de Conhecimento de Agentes de IA** via chunking semântico.

## Objetivo

Transformar o contexto bruto (entrevista + artefatos extras) em documentação final no padrão Documentador RAG, com chunks autossuficientes, metadados YAML e summaries semânticos por seção.

## O Que a Skill Faz

1. **Carrega todo o contexto** — Fase 1 (entrevista) + Fase 1.5 (extras consolidados)
2. **Gera documentos temáticos** — seguindo rigorosamente o padrão Documentador RAG
3. **Classifica seções** — separação obrigatória Teoria / Prática
4. **Gera summaries** — densos e semânticos para cada seção `##`, otimizados para embedding
5. **Produz README-índice** — com links para todos os documentos gerados

## Documentos Gerados

```
/documentacao/{titulo}/docs/
├── 01-visao-geral.md          ← O que é, propósito, público-alvo
├── 02-dominio-negocio.md      ← Entidades, regras, fluxos
├── 03-arquitetura-tecnica.md  ← Stack, componentes, comunicação
├── 04-funcionalidades.md      ← Features, cenários, erros
├── 05-dados-e-contratos.md    ← Modelos, APIs, schemas
├── 06-operacao.md             ← Deploy, monitoramento, SLAs
├── 07-historico-evolucao.md   ← ADRs, dívidas técnicas, roadmap
└── README.md                  ← Índice geral
```

> Apenas documentos com cobertura no contexto são gerados. Eixos "N/I" são omitidos.

## Regras de Fidelidade

- **Proibido resumir** — se o contexto tem 50 campos, os 50 são documentados
- **Proibido inventar** — só documenta o que está no contexto
- **Proibido inferir** — não completa lacunas com conhecimento externo
- **Fidelidade total** ao jargão técnico do usuário
- **Chunks autossuficientes** — cada seção `###` prática é compreensível isoladamente

## Formato RAG Obrigatório

Cada documento inclui:
- **Metadados YAML** — título, resumo, categoria, tags, entidades-chave
- **Seções `##`** — classificadas como `(Teoria)` ou `(Prática)`
- **Summary por seção** — resumo denso para busca vetorial
- **Mermaid** — diagramas quando possível

## Workflow Relacionado

Esta skill é a **Fase 2** do workflow [`/doc-produto`](../../workflows/doc-produto.md), executada após a consolidação de contexto.

## Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `SKILL.md` | Instruções completas para o agente |
| `README.md` | Este arquivo |

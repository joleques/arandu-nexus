# 🎙️ Product Interviewer — Extração de Conhecimento de Produto

Skill que conduz uma **entrevista estruturada** com o usuário para extrair conhecimento tácito sobre um produto, sistema ou serviço. Regra inviolável: **nunca supõe, nunca inventa** — apenas pergunta e registra.

## Objetivo

Capturar todo o conhecimento que está na cabeça do especialista e transformá-lo em contexto estruturado, servindo de base para geração de documentação RAG-ready para Agentes de IA.

## O Que a Skill Faz

1. **Coleta dados iniciais** — título e resumo do produto
2. **Conduz entrevista** — 7 eixos temáticos com perguntas progressivas
3. **Registra tudo** — log bruto sem edição em `entrevista-log.md`
4. **Consolida contexto** — gera arquivos temáticos organizados por eixo
5. **Apresenta resumo** — lista arquivos gerados, status e pontos em aberto

## Eixos Temáticos

| Eixo | Cobertura |
|------|-----------|
| 1. Visão Geral | O que é, público-alvo, problema que resolve |
| 2. Domínio de Negócio | Entidades, regras, fluxos, integrações |
| 3. Arquitetura | Stack, comunicação, infra, CI/CD |
| 4. Funcionalidades | Features, cenários, erros, processos batch |
| 5. Dados e Modelos | Bancos, schemas, contratos de API, cache |
| 6. Operação | Deploy, monitoramento, SLAs, incidentes |
| 7. Histórico | Decisões, dívidas técnicas, roadmap |

## Estrutura de Saída

```
/documentacao/{titulo}/contexto/
├── 01-visao-geral.md
├── 02-dominio-negocio.md
├── 03-arquitetura.md
├── 04-funcionalidades.md
├── 05-dados-e-modelos.md
├── 06-operacao.md
├── 07-historico.md
└── entrevista-log.md         ← Log bruto obrigatório
```

## Regras de Condução

- **1 a 3 perguntas por vez** — aprofunda antes de mudar de eixo
- **Respostas vagas** → pede exemplo concreto
- **Contradições** → aponta e pede resolução
- **"N/I"** (Não Informado) → nunca preenche por conta própria
- **Entrevista-log** → registro bruto, sem paráfrase

## Workflow Relacionado

Esta skill é a **Fase 1** do workflow [`/doc-produto`](../../workflows/doc-produto.md), seguida pela revisão via [`product-interviewer-revisor`](../product-interviewer-revisor/).

## Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `SKILL.md` | Instruções completas para o agente |
| `README.md` | Este arquivo |

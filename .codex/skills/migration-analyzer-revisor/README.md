# 🕵️ Migration Analyzer Revisor — Auditoria de Planos de Migração AWS

Skill que atua como **Staff/Principal Engineer Checker**, auditando os relatórios gerados pela skill [`migration-analyzer`](../migration-analyzer/) antes de serem repassados aos times de DevOps e Engenharia.

## Objetivo

Validar a qualidade, completude e coesão dos artefatos de migração (grafo de dependências, matriz de impacto, migration waves), prevenindo incidentes catastróficos por omissões ou erros de ordenação no plano.

## O Que a Skill Faz

1. **Lê os relatórios** — `matriz-impacto.md`, `alertas-aws.md`, `migration-waves.md`
2. **Avaliação estrutural** — verifica se a ordem das Waves faz sentido (core antes de BFFs)
3. **Cross-checking** — cruza DNS, dependencies e Waves para detectar Race Conditions
4. **Emite laudo** — gera `review-migration-analyzer.md` com parecer `[APROVADO ✅]` ou `[REPROVADO ❌]`

## Parâmetros

| Parâmetro | Obrigatório | Descrição |
|-----------|:-----------:|-----------|
| **Diretório de análise** | ✅ | Caminho da pasta `analise/` com os artefatos da skill Maker |

## Artefatos Gerados

| Arquivo | Descrição |
|---------|-----------|
| `review-migration-analyzer.md` | Laudo com parecer, vulnerabilidades omitidas e action items |

## Restrições

- **Imutabilidade** — nunca altera os relatórios originais do Maker
- **Tom analítico** — ironia sênior saudável quando a arquitetura é questionável
- **Fuga de escopo** — não acessa arquivos fora de `/analise/` (exceto `/repos/` para dúvidas incisivas)

## Workflow Relacionado

Esta skill é orquestrada pelo workflow [`/analise-migracao-aws`](../../workflows/analise-migracao-aws.md) no ciclo Maker/Checker (máx. 5 iterações).

## Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `SKILL.md` | Instruções completas para o agente |
| `README.md` | Este arquivo |

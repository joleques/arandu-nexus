# 🔍 Product Interviewer Revisor — Validação de Contexto de Produto

Skill que atua como **Advogado do Diabo**, validando o contexto extraído pela skill [`product-interviewer`](../product-interviewer/) para garantir que a extração está completa, precisa e livre de invenções.

## Objetivo

Barrar a passagem de contexto insuficiente para a fase de documentação. Se o material não é bom o suficiente para um Agente de IA operar com confiança, não está pronto.

## O Que a Skill Faz

1. **Análise de completude** — cada eixo temático foi coberto com profundidade?
2. **Análise de fidelidade** — cruza arquivos temáticos vs. `entrevista-log.md` para detectar invenções
3. **Análise de profundidade** — um agente de IA operaria com confiança com esse contexto?
4. **Análise de coerência** — sem contradições entre arquivos?
5. **Gera relatório** — com veredicto: ✅ APROVADO / ⚠️ APROFUNDAR / ❌ INSUFICIENTE

## Parâmetros

| Parâmetro | Obrigatório | Descrição |
|-----------|:-----------:|-----------|
| **Diretório de contexto** | ✅ | `/documentacao/{titulo}/contexto/` com artefatos da Fase 1 |

## Veredictos Possíveis

| Veredicto | Ação |
|-----------|------|
| ✅ APROVADO | Prossegue para Fase 1.5 / Fase 2 |
| ⚠️ APROFUNDAR | Gera perguntas de detalhamento para nova rodada |
| ❌ INSUFICIENTE | Lacunas críticas que impedem documentação confiável |

## Restrições

- **Não inventa respostas** — apenas gera perguntas para o usuário
- **Pragmatismo** — nem todo eixo precisa de profundidade máxima
- **Prioridade RAG** — foca em lacunas que afetam a capacidade do agente

## Workflow Relacionado

Esta skill é usada na **Fase 1 (revisão)** do workflow [`/doc-produto`](../../workflows/doc-produto.md), em loop de até 5 iterações com a skill [`product-interviewer`](../product-interviewer/).

## Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `SKILL.md` | Instruções completas para o agente |
| `README.md` | Este arquivo |

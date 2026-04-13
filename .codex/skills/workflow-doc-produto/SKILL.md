---
name: workflow-doc-produto
description: Orquestra product-interviewer, product-interviewer-revisor, product-context-aggregator e product-documenter para documentação de produto RAG-ready no padrão Codex.
---

# Workflow Skill: Doc Produto

Use quando o usuário pedir "doc produto", "documentar produto" ou mencionar `/doc-produto`.

## Compatibilidade Codex
- Sem `notify_user`; reporte status e caminhos diretamente em resposta.
- Mantenha dois modos: completo e rápido (herdado de /hermes).

## Fluxo
1. Triagem de modo: `completo` (recomendado) ou `rapido`.
2. Modo rápido:
- Ler fontes `.md` indicadas.
- Rodar `documentador` e depois `documentador_revisor`.
- Fazer loop de correção (max 3).
- Salvar resultado no diretório de saída informado.
3. Modo completo:
- Coletar `titulo`, resumo em uma frase e recursos depreciados.
- Criar `/documentacao/{titulo}/contexto`, `/extra`, `/docs`.
- Rodar `product-interviewer` (fase 1).
- Rodar `product-interviewer-revisor` com loop de aprofundamento (max 5).
- Rodar `product-context-aggregator` para anexos extras.
- Rodar `product-documenter` para saída final RAG-ready.
4. Entrega: informar caminhos gerados, status de aprovação e pendências.

## Regra de Qualidade
- Nunca inventar contexto.
- Em qualquer reprovação, aplicar somente os ajustes apontados pelo revisor.

---
name: workflow-doc-api
description: Orquestra api-documentador e api-documentador-revisor em ciclo Maker/Checker (max 5) para gerar documentação de API em camadas no padrão Codex.
---

# Workflow Skill: Doc API

Use esta skill quando o usuário pedir "doc api", "documentar API" ou mencionar `/doc-api`.

## Compatibilidade Codex
- Não use `notify_user` nem `PathsToReview`; responda no chat com status, caminhos e pendências.
- Execute a orquestração chamando as skills `api-documentador` e `api-documentador-revisor`.

## Fluxo
1. Coletar parâmetros: `titulo` (obrigatório), `tipo` (`tecnica|nao-tecnica|ambas`, default `ambas`), descrição de negócio (opcional), contexto adicional (opcional).
2. Executar `api-documentador` (iteração 1), salvando em `./doc-apis/{titulo}/`.
3. Executar `api-documentador-revisor` e salvar revisão em `./doc-apis/{titulo}/{titulo}-revision-v{N}.md`.
4. Se revisão for `AJUSTAR`/`REESCREVER`, voltar ao documentador com os pontos do revisor.
5. Repetir até `APROVADO` ou atingir 5 iterações.
6. Gerar `./doc-apis/{titulo}/index.md` conforme regra da skill documentadora.
7. Entregar ao usuário: status final (aprovado/ressalvas), número de iterações, lista de arquivos e caminho do índice.

## Regra de Loop
- Máximo 5 iterações para evitar loop infinito.
- Se atingir limite sem aprovação, entregar com ressalvas e listar pendências da última revisão.

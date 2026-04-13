---
name: workflow-init-bounded-context
description: Orquestra bounded-context-analyzer e devcontainer-merger para inicializar contexto com services/ por symlink e gerar context.md.
---

# Workflow Skill: Init Bounded Context

Use quando o usuário pedir "init bounded context" ou mencionar `/init-bounded-context`.

## Compatibilidade Codex
- Sem `notify_user`; resposta final com resumo e caminhos.

## Fluxo
1. Coletar caminhos dos serviços.
2. Coletar contexto de negócio (ou aceitar `pular`).
3. Criar `services/`.
4. Validar caminhos e criar symlinks em `services/<nome>`.
5. Rodar `bounded-context-analyzer` com `services/` e contexto de negócio.
6. Rodar `devcontainer-merger` opcionalmente.
7. Entregar resumo de domínio + caminhos (`services/`, `context.md`, `.devcontainer/` quando existir).

## Regras
- Não inventar informações de negócio.
- Se caminho inválido, sinalizar e continuar com os válidos.

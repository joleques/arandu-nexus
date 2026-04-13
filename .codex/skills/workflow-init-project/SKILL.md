---
name: workflow-init-project
description: Orquestra inicializacao de projeto com go-initializer (condicional), devcontainer e kubernetes no padrão Codex.
---

# Workflow Skill: Init Project

Use quando o usuário pedir "init project" ou mencionar `/init-project`.

## Compatibilidade Codex
- Este workflow não depende de `notify_user`.
- A referência de Jenkins do workflow antigo é opcional e deve ser tratada como "não disponível" se skill não existir.

## Fluxo
1. Coletar parâmetros do projeto (nome, diretório, stack, extensões padrão, parâmetros Kubernetes).
2. Apresentar resumo e confirmar.
3. Se stack for Go, rodar `go-initializer`.
4. Rodar `devcontainer`.
5. Rodar `kubernetes`.
6. Se usuário pedir Jenkins e a skill não existir, informar limitação explicitamente.
7. Entregar estrutura criada e próximos ajustes manuais.

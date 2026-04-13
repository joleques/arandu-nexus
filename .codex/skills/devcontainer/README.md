# 🐳 Devcontainer Specialist

**Skill para criar, atualizar e melhorar configurações de Dev Container** (`.devcontainer`) seguindo o padrão da empresa.

## Para que serve?

Esta skill instrui o agente a gerenciar ambientes de desenvolvimento containerizados, criando configurações `.devcontainer` padronizadas, completas e funcionais para projetos.

## O que é gerado?

```
.devcontainer/
├── devcontainer.json    # Configuração principal
└── Dockerfile.dev       # Imagem customizada

scripts/
├── install-extensions.sh   # Script bash wrapper
└── install-extensions.js   # Instalador de extensões VS Code
```

## Stacks Suportadas

- **Go** — imagem baseada em `mcr.microsoft.com/devcontainers/go`
- **Node.js/TypeScript** — imagem baseada em `node:22-bookworm-slim`
- **Python** — imagem baseada em `mcr.microsoft.com/devcontainers/python`
- **Multi-stack** — Go + Node.js combinados

## Funcionalidades

- Templates pré-configurados por stack (Go, Node, Python)
- Extensões VS Code padrão da empresa (core + específicas por stack)
- Script automatizado de instalação de extensões
- Suporte a Antigravity e VS Code Server
- Configuração de permissões, SSH e git safe directory

## Quando usar?

- Ao iniciar um novo projeto que precisa de Dev Container
- Para padronizar o ambiente de desenvolvimento de um projeto existente
- Para atualizar ou melhorar Dockerfiles e extensões de um devcontainer

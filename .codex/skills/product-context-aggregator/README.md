# 📎 Product Context Aggregator — Consolidação de Artefatos Extras

Skill que agrega artefatos de referência extras do produto (specs, Swagger, diagramas, wikis) via **symlinks** e consolida com o contexto extraído na Fase 1 (entrevista).

## Objetivo

Enriquecer o contexto de produto incorporando documentação existente que o usuário já possui, sem gerar conhecimento novo — apenas lendo, cruzando e consolidando.

## O Que a Skill Faz

1. **Pergunta ao usuário** — se há diretórios com documentação existente
2. **Cria symlinks** — em `/documentacao/{titulo}/extra/` para cada diretório informado
3. **Analisa artefatos** — lê arquivos relevantes (`.md`, `.json`, `.yaml`, `.swagger`, `.proto`, etc.)
4. **Gera consolidado** — `contexto-consolidado.md` com complementos, confirmações e inconsistências
5. **Detecta inconsistências** — entre o que o usuário disse na entrevista e o que os artefatos mostram

## Parâmetros

| Parâmetro | Obrigatório | Descrição |
|-----------|:-----------:|-----------|
| **Título do produto** | ✅ | `{titulo}` do produto (kebab-case) |
| **Diretório base** | ✅ | `/documentacao/{titulo}/` |
| **Diretórios extras** | ❌ | Caminhos absolutos com docs existentes |

## Estrutura Resultante

```
/documentacao/{titulo}/extra/
├── docs     -> /home/user/projeto/docs (symlink)
├── swagger  -> /home/user/projeto/api/swagger (symlink)
└── wiki     -> /home/user/outro-repo/wiki (symlink)
```

## Artefatos Gerados

| Arquivo | Descrição |
|---------|-----------|
| `contexto-consolidado.md` | Mapa completo: complementos, confirmações e inconsistências |

## Restrições

- **Não gera conhecimento novo** — apenas consolida o que já existe
- **Sem diretórios extras** → pula direto para Fase 2

## Workflow Relacionado

Esta skill é a **Fase 1.5** do workflow [`/doc-produto`](../../workflows/doc-produto.md), executada entre a revisão da entrevista e a geração de documentação final.

## Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `SKILL.md` | Instruções completas para o agente |
| `README.md` | Este arquivo |

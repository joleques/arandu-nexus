# 🐳 DevContainer Merger — Unificação de Ambientes de Desenvolvimento

Skill que analisa os serviços de um Bounded Context e, quando existem configurações de DevContainer individuais, **consolida em um único Root DevContainer** na raiz do contexto — sem imagens inchadas, sem achismo.

## Objetivo

Criar um ambiente de desenvolvimento unificado que reflita exatamente as stacks e infraestrutura dos serviços do Bounded Context, partindo das configurações reais de DevContainer de cada repositório.

## O Que a Skill Faz

1. **Validação Fail-Fast** — busca por `devcontainer.json` nos serviços; se nenhum existir, aborta com mensagem clara
2. **Análise de Requisitos** — identifica linguagens/SDKs, extensões VS Code e serviços de infra declarados nos devcontainers
3. **Merge de Imagem** — escolhe a stack primária como base e instala dependências secundárias via Dockerfile customizado
4. **Infraestrutura Estrita** — adiciona containers de infra (Postgres, Mongo, etc.) **somente** se declarados no escopo do `devcontainer.json` de cada serviço
5. **Geração do Root DevContainer** — cria `.devcontainer/` na raiz com `devcontainer.json`, `Dockerfile` e `docker-compose.yml` unificados

## Parâmetros

| Parâmetro | Obrigatório | Descrição |
|-----------|:-----------:|-----------|
| **Diretório de serviços** | ✅ | Pasta contendo symlinks dos repositórios (ex: `services/`) |

## Artefatos Gerados

| Arquivo | Descrição |
|---------|-----------|
| `.devcontainer/devcontainer.json` | Configuração unificada com extensões mescladas e port forwarding |
| `.devcontainer/Dockerfile` | Imagem customizada fundindo as stacks dos serviços |
| `.devcontainer/docker-compose.yml` | Serviços de infra consolidados (apenas os comprovados) |

## Restrições

- **Zero achismo** — infra não declarada em `devcontainer.json` é ignorada
- **Fail-Fast** — se nenhum serviço tem devcontainer, a skill não gera nada
- **Sem imagens universais** — proibido usar `mcr.microsoft.com/devcontainers/universal` e similares
- **Docker Compose estrito** — `docker-compose.yml` soltos na raiz dos serviços são ignorados se não referenciados pelo `devcontainer.json`

## Workflow Relacionado

Esta skill é orquestrada pelo workflow [`/init-bounded-context`](../../workflows/init-bounded-context.md) como etapa opcional/condicional após a análise de domínio.

## Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `SKILL.md` | Instruções completas para o agente |
| `README.md` | Este arquivo |

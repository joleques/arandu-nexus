# 🧠 Bounded Context Analyzer — Análise de Domínio, Negócio e Linguagem Ubíqua

Skill que realiza **análise arquitetural profunda** de múltiplos serviços agrupados em um Bounded Context. Combina **entrevista de negócio** com **varredura de código** para gerar um `context.md` completo — Fonte da Verdade técnica **e** de negócio.

## Objetivo

Analisar repositórios de microsserviços (via symlinks em `services/`) combinando contexto de negócio extraído do usuário com varredura dinâmica de código, produzindo um documento canônico que represente a **Fonte da Verdade completa** do domínio.

## O Que a Skill Faz

1. **Reconhecimento do Terreno** — identifica os serviços no diretório alvo (APIs, Workers, Lambdas)
2. **Entrevista de Negócio** — extrai do usuário: propósito, personas, fluxos e regras de negócio (opcional, pode ser pulada)
3. **Ingestão de Arquitetura** — varre controladores, routers, entidades, modelos, protos gRPC, DTOs, adaptadores, configs e dependências
4. **Mapeamento de Domínio** — extrai a Linguagem Ubíqua e identifica Agregados Raiz com detalhes de atributos e relacionamentos
5. **Mapa de Integração** — documenta fronteiras externas (tabela) e comunicação interna (diagrama ASCII)
6. **Revisão de Qualidade** — valida coerência entre camada de negócio e técnica
7. **Geração do `context.md`** — consolida tudo em um artefato Markdown estruturado na raiz do workspace

## Parâmetros

| Parâmetro | Obrigatório | Descrição |
|-----------|:-----------:|-----------|
| **Diretório de serviços** | ✅ | Pasta contendo symlinks dos repositórios (ex: `services/`) |
| **Contexto de negócio** | ❌ | Respostas da entrevista de negócio (se coletadas pelo workflow) |

## Artefatos Gerados

| Arquivo | Descrição |
|---------|-----------|
| `context.md` | Documento canônico com camada de negócio e técnica do Bounded Context |

## Estrutura do `context.md`

O artefato gerado segue 8 seções:

**Camada de Negócio** (via entrevista):
- **🎯 Propósito de Negócio** — o que o domínio resolve no mundo real
- **👥 Personas** — quem interage com os serviços e como (tabela)
- **🔄 Fluxos de Negócio Principais** — jornadas de ponta a ponta
- **⚖️ Regras de Negócio** — restrições e invariantes do domínio

**Camada Técnica** (via análise de código):
- **📖 Linguagem Ubíqua (Glossário)** — termos de negócio mapeados do código
- **🏢 Modelos e Agregados Principais** — entidades, responsabilidades, atributos e relacionamentos
- **🧩 Serviços Analisados** — lista de serviços com stack, responsabilidade, endpoints e bancos
- **📡 Mapa de Integração e Fronteiras** — comunicação interna (diagrama) e fronteiras externas (tabela)

## Restrições

- **Modo leitura estrita** — nunca modifica código fonte dos repositórios
- **Sem alucinação** — documenta apenas o que é encontrado no código real
- **Nunca inventa negócio** — seções de negócio só contêm o que o usuário disse; se puladas, ficam com `[A ser documentado]`
- **Zero over-engineering** — foco pragmático, sem abstrações desnecessárias

## Workflow Relacionado

Esta skill é orquestrada pelo workflow [`/init-bounded-context`](../../workflows/init-bounded-context.md) como etapa principal de análise de domínio.

## Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `SKILL.md` | Instruções completas para o agente |
| `README.md` | Este arquivo |

# 🏗️ Migration Analyzer — Análise de Impacto para Migração AWS

Skill que realiza **engenharia reversa** e **análise de impacto** em repositórios de microsserviços para migração de contas AWS. Mapeia dependências, variáveis de ambiente, hardcodes de ARNs e comunicação K8s/DNS para desenhar um plano de migração seguro.

## Objetivo

Escanear um Bounded Context de microsserviços (via symlinks), identificar todo o acoplamento externo e gerar artefatos de migração que garantam uma transição segura entre contas AWS.

## O Que a Skill Faz

1. **Assimila o Bounded Context** — recebe o diretório com symlinks dos repositórios
2. **Varre `/infra/`** — extrai variáveis de ambiente, ARNs, filas SQS, tópicos SNS, Services K8s
3. **Engenharia reversa no código** — mapeia onde as variáveis são consumidas (`os.Getenv`, HTTP clients, SDKs AWS)
4. **Cruza dados** — gera o grafo de dependência entre serviços e propõe Migration Waves
5. **Gera relatórios** — produz 3 artefatos em `/analise/`

## Parâmetros

| Parâmetro | Obrigatório | Descrição |
|-----------|:-----------:|-----------|
| **Diretório de contexto** | ✅ | Pasta com symlinks dos repositórios (ex: `migracao-financeiro/repos/`) |
| **Padrões da empresa** | ✅ | Sufixo DNS interno, nomes de vars padrão, formatos de Ingress |

## Artefatos Gerados

| Arquivo | Descrição |
|---------|-----------|
| `matriz-impacto.md` | Lista minuciosa das conexões e dependências entre serviços |
| `alertas-aws.md` | Itens críticos: ARNs hardcoded, Account IDs estáticos, domínios fixos |
| `migration-waves.md` | Ordem de deploy por onda — do core de plataforma até BFFs |

## Restrições

- **Modo leitura estrita** — nunca modifica código fonte dos repositórios
- **Limites de contexto** — opera apenas nos repositórios do Bounded Context designado
- **Transparência** — variáveis não rastreáveis são sinalizadas como "Uso dinâmico"

## Workflow Relacionado

Esta skill é orquestrada pelo workflow [`/analise-migracao-aws`](../../workflows/analise-migracao-aws.md) em conjunto com a skill revisora [`migration-analyzer-revisor`](../migration-analyzer-revisor/).

## Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `SKILL.md` | Instruções completas para o agente |
| `README.md` | Este arquivo |

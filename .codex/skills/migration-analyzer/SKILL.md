---
name: migration-analyzer
description: Realiza engenharia reversa e análise de impacto em repositórios para migração de contas AWS. Mapeia dependências, variáveis de ambiente, hardcodes e comunicação K8s/DNS.
---

# 🏗️ Analista de Migração AWS (Migration Analyzer)

Skill responsável por mapear o Bounded Context de uma arquitetura de microsserviços, identificando todo o acoplamento externo, uso de infraestrutura AWS e ordem de dependências para desenhar uma migração segura de conta AWS (Lift and Shift ou refactory de IaC). Esta skill atua como um Arquiteto de Cloud/Software focado em mitigar indisponibilidade.

---

## 🎯 OBJETIVOS

- Escanear a infraestrutura como código (Arquivos em `/infra`) para extrair definições de URLs externas, variáveis de ambiente injetadas, filas predefinidas e Endpoints K8s.
- Realizar engenharia reversa no código-fonte da aplicação (`src/`, `cmd/`, `internal/` etc) para encontrar integrações de bibliotecas (HTTP Clients, AWS SDKs, gRPC stubs).
- Identificar uso perigoso de recursos fixos, como **ARNs AWS hardcoded** ou domínios estáticos.
- Criar a **Matriz de Impacto** e a **Árvore de Dependência** para a correta ordem de Deploy (Migration Waves).

---

## 📋 PREPARAÇÃO DO CONTEXTO (INPUT)

A análise nunca deve rodar solta na máquina para evitar sobrecarga e misturar Bounded Contexts.
Antes da skill rodar, certifique-se de que o usuário forneceu:
1. **O Diretório do Contexto:** Uma pasta estruturada com Symlinks apontando para os repos originais (ex: `migracao-pagamentos/repos/svc-a`).
2. **Padrões da Empresa (Guidelines):** Sufixo DNS interno (ex: `*.internal`), Nomes de Vars Padrões (ex: `AWS_ACCOUNT_ID`, `SQS_URL`), ou formatos esperados pelo Ingress.

---

## 🔄 FLUXO OBRIGATÓRIO (PASSO-A-PASSO)

### Passo 1: Assimilação do Bounded Context
1. Receba do usuário o caminho absoluto do diretório contendo os symlinks dos repositórios (ex: `migracao-financeiro/repos`).
2. Liste os serviços presentes utilizando comandos de terminal (`ls`) no diretório fornecido.

### Passo 2: Varredura de Infraestrutura (`/infra/`)
1. Limite a sua busca estritamente aos diretórios de infraestrutura dentro dos repositórios do contexto fornecido (`/infra/`).
2. Identifique manifests do Kubernetes (Deployments, ConfigMaps, Services, Ingresses) ou arquivos de Infra-as-Code (Terraform, Helm, Crossplane).
3. Catalogue e extraia:
   - Varíaveis de ambiente carregando valores de URLs, ARNs, nomes de filas SQS ou tópicos SNS.
   - Nomes de Serviço Kubernetes criados no cluster (ex: `name: svc-pagamentos` em manifestos tipo `Service`).

### Passo 3: Varredura de Código (Engenharia Reversa)
1. Efetue varredura no código da linguagem nativa nos diretórios do repositório respectivo.
2. Procure onde as variáveis extraídas no Passo 2 são injetadas (ex: `os.Getenv()`, `process.env`):
   - Mapear de onde saem/para onde vão os Stubs gRPC.
   - Identifique quem consome a URL de integração via HTTP Client.
   - Ache instâncias isoladas usando SDK do provedor de nuvem (ex: AWS CLI invocations, struct init com resource strings puras).

### Passo 4: Cruzamento e Grafo de Dependência
Cruze as descobertas feitas nos dois focos:
- Identifique a rede entre projetos: Se `Serviço A` consome o DNS/Variável do `Serviço B` (`A -> B`).
- Exponha APIs publicas ou serviços SaaS que são consumidos, pois eles exigem liberação em novos WAFs/SecurityGroups.
- Proporcione as **Waves de Deploy** sugerindo o empilhamento do mais fundamental para a "borda" (BFFs, Aggregators).

### Passo 5: Geração de Relatórios
Você DEVE gerar artefatos/arquivos físicos no disco em uma pasta `analise/` adjacente a pasta `repos/` original em formato Markdown (ex: `migracao-financeiro/analise/`):
1. **`matriz-impacto.md`**: Lista minuciosa das conexões e descobertas.
2. **`alertas-aws.md`**: Itens críticos em **VERMELHO** (`[!] Ação Imediata Necessária!`), como IDs/Account-IDs pre-fixados que vão falhar em outra conta.
3. **`migration-waves.md`**: Lista da ordem de deploy por onda e dependência de "subir" junto com a pipeline.

---

## 🚫 RESTRIÇÕES

- **Modo Leitura Estrita:** NUNCA modifique código fonte da aplicação em repositórios inspecionados. Somente use leitura (`cat`, `view_file`, `grep_search`).
- **Limites de Contexto:** Não desvie da pasta designada para aquele Bounded Context, exceto sob total instrução explícita.
- **Transparência de Detalhes Analíticos:** Caso não consiga conectar dinamicamente a definição no `/infra` ao código por inversão de controle/DI obscuro, elogie o código complexo de maneira irônica/didática e especifique a variável como "Uso dinâmico (não detectado no source path explicitamente)".

---

## ⚡ QUICK REFERENCE

```
┌─────────────────────────────────────────────────────────────┐
│       MIGRATION ANALYZER — CHECKLIST RÁPIDO                 │
│                                                             │
│ Passo 1: Receber e listar os Symlinks do Contexto           │
│ Passo 2: Investigar em `/infra/` (Catálogo Variables/ARNs)  │
│ Passo 3: Pesquisar código-fonte `.go/.ts/.java` consumindo  │
│ Passo 4: Montar grafo de links internos A -> B              │
│ Passo 5: Gerar output em pasta `/analise/` relatórios em md │
│                                                             │
│ OBRIGATÓRIO: Alertar IDs de Conta/ARNs antigos estáticos🚨   │
└─────────────────────────────────────────────────────────────┘
```

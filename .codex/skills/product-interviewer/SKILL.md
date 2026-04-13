---
name: product-interviewer
description: Extrai conhecimento de produto do usuário via entrevista estruturada — nunca supõe, nunca inventa, apenas pergunta e registra o que foi dito.
---

# 🎙️ Entrevistador de Produto — Extração de Conhecimento

Skill para extração rigorosa de conhecimento tácito do usuário sobre um produto, sistema ou serviço.

> [!CAUTION]
> **Regra Inviolável:** Esta skill **NUNCA supõe, NUNCA acha, NUNCA inventa informações.** Absolutamente TUDO deve ter sido dito explicitamente pelo usuário. Se falta informação, **PERGUNTE** — jamais preencha lacunas por conta própria. Qualquer inferência ou "achismo" invalida o artefato produzido.

---

## 🎯 Quando Usar Esta Skill

Use quando o usuário pedir para:

- Documentar um produto, sistema ou serviço
- Extrair conhecimento sobre um domínio de negócio
- Iniciar a base de conhecimento de um produto para Agentes de IA
- Gerar contexto estruturado sobre algo que só o usuário conhece

---

## 📂 Estrutura de Saída

Todo o contexto extraído é salvo em:

```
/documentacao/{titulo}/contexto/
├── 01-visao-geral.md         ← O que é o produto, propósito, público-alvo
├── 02-dominio-negocio.md     ← Regras de negócio, entidades, fluxos
├── 03-arquitetura.md         ← Stack, serviços, integrações, infra
├── 04-funcionalidades.md     ← Features, comportamentos, cenários
├── 05-dados-e-modelos.md     ← Modelos de dados, schemas, contratos
├── 06-operacao.md            ← Deploy, monitoramento, incidentes, SLAs
├── 07-historico.md           ← Decisões passadas, dívidas técnicas, evolução
└── entrevista-log.md         ← Log bruto de todas as respostas do usuário
```

> [!NOTE]
> Nem todos os arquivos precisam ser gerados. Gere apenas os que forem relevantes com base nas respostas do usuário. O `entrevista-log.md` é **sempre obrigatório**.

---

## 🔍 Instruções de Execução

### 1. Coletar Informações Iniciais

Pergunte ao usuário:

1. **Título do produto/sistema** — será usado como `{titulo}` no diretório
2. **Resumo em uma frase** — "O que é esse produto em uma frase?"

Aguarde a resposta antes de prosseguir.

Após receber, crie o diretório `/documentacao/{titulo}/contexto/` e inicie o `entrevista-log.md` com os dados coletados.

---

### 2. Conduzir Entrevista Estruturada

Conduza a entrevista seguindo os **eixos temáticos** abaixo. Para cada eixo, faça perguntas progressivas — comece amplo e aprofunde conforme as respostas.

#### Eixo 1 — Visão Geral e Propósito

- O que o produto faz?
- Quem são os usuários finais?
- Qual problema ele resolve?
- Existe algum produto similar / referência de mercado?
- Quando foi criado? Qual a fase atual (MVP, produção, legado)?

#### Eixo 2 — Domínio de Negócio

- Quais são as entidades principais do domínio? (ex: Pedido, Cliente, Produto)
- Quais são as regras de negócio mais críticas?
- Existem fluxos automáticos? Quais?
- Quais são os estados possíveis das entidades? (máquinas de estado)
- Existem integrações com outros sistemas? Quais e como?

#### Eixo 3 — Arquitetura e Tecnologia

- Qual a stack tecnológica? (linguagem, framework, banco, cloud)
- É monolito, microsserviços, serverless? Estrutura geral?
- Como os serviços se comunicam? (HTTP, mensageria, eventos)
- Onde roda? (AWS, GCP, on-premise, Kubernetes?)
- Como é o pipeline de CI/CD?

#### Eixo 4 — Funcionalidades e Comportamento

- Quais são as funcionalidades principais?
- Como cada funcionalidade é acionada? (API, UI, cron, evento?)
- Existem cenários de erro conhecidos? Como são tratados?
- Existem fluxos que envolvem aprovação humana?
- Existem processos batch ou agendados?

#### Eixo 5 — Dados e Modelos

- Quais bancos de dados são usados?
- Existe um schema/modelo de dados documentado?
- Como são feitas migrations?
- Existem contratos de API? (Swagger, gRPC, GraphQL?)
- Como é a estratégia de cache?

#### Eixo 6 — Operação e Observabilidade

- Como é feito o deploy?
- Existe monitoramento? Quais ferramentas?
- Quais os SLAs / SLOs do sistema?
- Como são tratados incidentes em produção?
- Existem runbooks ou playbooks de operação?

#### Eixo 7 — Histórico e Evolução

- Quais foram as decisões arquiteturais mais importantes?
- Existem dívidas técnicas conhecidas?
- O que já foi refatorado? O que precisa ser?
- Existem planos de evolução? Roadmap?

---

### 3. Regras de Condução da Entrevista

```
┌─────────────────────────────────────────────────────────────────┐
│                 REGRAS DE CONDUÇÃO                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. NUNCA supor — se não foi dito, PERGUNTE                     │
│  2. NUNCA inventar — se o usuário não sabe, registre "N/I"      │
│  3. Faça UMA PERGUNTA por vez (máx 3 relacionadas)              │
│  4. Aprofunde antes de mudar de eixo                            │
│  5. Se a resposta for vaga, peça exemplo concreto               │
│  6. Se a resposta contradiz algo anterior, aponte e peça        │
│     para o usuário resolver a contradição                       │
│  7. Registre TUDO no entrevista-log.md — sem editar,            │
│     sem parafrasear                                             │
│  8. Seja "chato" — não encerre até que cada eixo               │
│     relevante esteja coberto com profundidade                   │
│  9. Eixos podem ser pulados se o usuário disser que não         │
│     se aplica — registre isso também                            │
│ 10. O usuário pode adicionar arquivos ao diretório de contexto  │
│     a qualquer momento — aceite e integre                       │
│                                                                 │
│  N/I = Não Informado (registre como tal, nunca preencha)        │
└─────────────────────────────────────────────────────────────────┘
```

---

### 4. Consolidar Contexto

Após cobrir todos os eixos relevantes:

1. **Gere os arquivos temáticos** (`01-visao-geral.md`, `02-dominio-negocio.md`, etc.) com base nas respostas
2. Cada arquivo deve conter **apenas o que o usuário disse**, organizado e estruturado
3. Use **marcadores** para indicar informações não coletadas:

```markdown
> ⚠️ **N/I** — Informação não fornecida pelo usuário neste eixo.
```

4. Ao final de cada arquivo, inclua uma seção:

```markdown
## Pontos em Aberto

- [Lista de perguntas que ainda não foram respondidas sobre este eixo]
```

---

### 5. Apresentar Resumo ao Usuário

Ao finalizar a entrevista, apresente:

```
📋 Resumo da Extração de Contexto

📁 Diretório: /documentacao/{titulo}/contexto/

Arquivos gerados:
  ✅ 01-visao-geral.md — [breve resumo]
  ✅ 02-dominio-negocio.md — [breve resumo]
  ⚠️ 03-arquitetura.md — [parcial, faltam detalhes de X]
  ❌ 06-operacao.md — [usuário indicou que não se aplica]

Pontos em aberto: [N] perguntas pendentes

Status: PRONTO PARA REVISÃO
```

---

## 📝 Formato do `entrevista-log.md`

```markdown
# Log de Entrevista — {titulo}

**Data:** {data}
**Entrevistado:** Usuário

---

## Sessão 1

### Pergunta 1
**P:** [pergunta feita]
**R:** [resposta literal do usuário]

### Pergunta 2
**P:** [pergunta feita]
**R:** [resposta literal do usuário]

---

## Sessão N
(...)
```

> [!IMPORTANT]
> O log deve registrar as respostas do usuário **sem paráfrase e sem edição**. A consolidação nos arquivos temáticos é onde a organização acontece — o log é o registro bruto.

---

## ⚡ Quick Reference

```
┌─────────────────────────────────────────────────────────────────┐
│          ENTREVISTADOR DE PRODUTO — DECISÃO RÁPIDA              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Objetivo    → Extrair 100% do conhecimento do usuário          │
│  Regra #1    → NUNCA supor, achar ou inventar                   │
│  Regra #2    → Se não sabe, pergunta; se o usuário não sabe,    │
│                registra "N/I"                                   │
│  Saída       → /documentacao/{titulo}/contexto/                 │
│  Log         → entrevista-log.md (registro bruto obrigatório)   │
│  Eixos       → 7 eixos temáticos, aprofundar antes de avançar   │
│  Estilo      → Seja "chato" — não encerre cedo demais           │
│                                                                 │
│  TESTE FINAL: "Tudo que está escrito foi dito pelo usuário?"    │
│               Se sim → ✅  Se não → ❌ INVÁLIDO                 │
└─────────────────────────────────────────────────────────────────┘
```

---

> 💡 **Lembre-se:** Você é um extrator, não um criador. Seu trabalho é fazer o usuário verbalizar tudo que sabe — a documentação vem depois. Se algo não foi dito, não existe.

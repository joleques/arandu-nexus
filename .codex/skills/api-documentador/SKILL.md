---
name: api-documentador
description: Gera documentação completa de APIs em camadas (técnica, não-técnica ou ambas), particionável por contexto e domínio, atendendo múltiplos públicos-alvo.
---

# 📖 Documentação de APIs em Camadas

Skill para geração de documentação de APIs que atende **múltiplos públicos**: desenvolvedores, analistas, suporte e produto.

> [!IMPORTANT]
> **Filosofia Core:** A melhor documentação de API não é a que tem mais informação — é aquela que cada público encontra o que precisa sem se perder no que não precisa. Documentação boa é **em camadas**.

---

## 🎯 Quando Usar Esta Skill

Use quando o usuário pedir para:

- Documentar uma **API REST, GraphQL ou gRPC**
- Criar documentação **técnica** para integradores e desenvolvedores
- Criar documentação **não-técnica** para analistas, suporte e produto
- Gerar documentação **completa** (ambas) de uma API
- Estruturar documentação existente de API em camadas

---

## 🧑‍💻 Inputs do Usuário

### Obrigatórios

| Input | Descrição |
|---|---|
| **Título** | Nome da documentação. Define o diretório e prefixo dos arquivos de saída |

### Opcionais

| Input | Default | Descrição |
|---|---|---|
| **Tipo** | `ambas` | `tecnica`, `nao-tecnica` ou `ambas` |
| **Descrição de negócio** | — | O que a API resolve (linguagem de negócio). Importante para camadas não-técnicas |
| **Contexto adicional** | — | Links, specs OpenAPI, observações, qualquer informação que ajude a entender o projeto |

---

## 📐 Tipos de Documentação

| Tipo | Camadas Geradas |
|---|---|
| `tecnica` | Referência Técnica |
| `nao-tecnica` | Getting Started + Guias de Caso de Uso + Suporte |
| `ambas` | Todas as 4 camadas |

---

## 🔍 Instruções de Execução

### 1. Coleta de Inputs

Pergunte ao usuário:

```
┌─────────────────────────────────────────────────┐
│ 1. Qual o TÍTULO da documentação?               │
│    (obrigatório)                                 │
├─────────────────────────────────────────────────┤
│ 2. Qual o TIPO?                                  │
│    (tecnica / nao-tecnica / ambas)               │
│    Default: ambas                                │
├─────────────────────────────────────────────────┤
│ 3. Descrição de negócio da API?                  │
│    (opcional — o que a API resolve)              │
├─────────────────────────────────────────────────┤
│ 4. Algum contexto adicional?                     │
│    (links, specs, observações — opcional)        │
└─────────────────────────────────────────────────┘
```

### 2. Análise do Projeto

Investigue o projeto para coletar informações automaticamente:

| O que procurar | Onde procurar |
|---|---|
| **Rotas/Controllers** | Arquivos de rotas (Go: `routes.go`, `handler.go`; Node: `routes.ts`, `controller.ts`; Java: `@RestController`, `@RequestMapping`) |
| **Specs OpenAPI/Swagger** | `.yaml`, `.json` com `openapi` ou `swagger` no conteúdo |
| **Models/DTOs** | Structs, interfaces, classes de modelo |
| **Auth/Middlewares** | Middlewares de autenticação, guards, interceptors |
| **Handlers de Erro** | Formatadores de erro, error handlers, exception filters |
| **Rate Limiting** | Configurações de throttle/rate limit |
| **Variáveis de Ambiente** | `.env`, `config.yaml`, variáveis de ambientes (prod, sandbox) |

### 3. Decisão de Particionamento

Avalie a complexidade da API e decida se a documentação deve ser:

| Cenário | Decisão |
|---|---|
| API simples (poucos endpoints, 1 domínio) | Documento único `{titulo}.md` |
| API média (múltiplos recursos, 1-2 domínios) | Poucos documentos por camada |
| API complexa (múltiplos domínios/bounded contexts) | Particionado por contexto + domínio |

**Critérios para particionar:**
- Muitos endpoints (10+) com domínios distintos
- Bounded contexts claros (ex: pedidos, catálogo, pagamentos)
- Públicos-alvo distintos para partes diferentes da API
- Complexidade que tornaria um documento único difícil de navegar

### 4. Geração

Gere os documentos seguindo os templates das camadas correspondentes ao tipo escolhido.

### 5. Saída

Salve os arquivos na seguinte estrutura:

```
./doc-apis/
└── {titulo}/
    ├── index.md                                 ← índice com links para todos os docs
    ├── {titulo}.md                              ← documento principal ou único
    ├── {titulo}-{contexto}-{dominio}.md         ← quando particionado
    └── ...
```

### 6. Geração do Índice (`index.md`)

**Obrigatório.** Após gerar todos os documentos, crie o `index.md` na raiz do diretório `./doc-apis/{titulo}/`.

Este arquivo é o **ponto de entrada** da documentação — qualquer pessoa que acesse a pasta deve começar por aqui.

#### Template do `index.md`

```markdown
# 📖 {Nome da API} — Documentação

> {Descrição de negócio da API em uma frase}

**Tipo:** {tecnica / nao-tecnica / ambas}
**Data de Geração:** {YYYY-MM-DD}

---

## 📑 Índice de Documentos

### 🟢 Getting Started

- [{titulo}.md](./{titulo}.md) — Introdução, primeiros passos e ambientes

### 🟡 Guias de Caso de Uso

- [{titulo}-{contexto}-casos-de-uso.md](./{titulo}-{contexto}-casos-de-uso.md) — [Breve descrição]
- [...]

### 🔴 Referência Técnica

- [{titulo}-{contexto}-tecnica.md](./{titulo}-{contexto}-tecnica.md) — [Breve descrição]
- [...]

### 📞 Suporte

- [{titulo}-suporte.md](./{titulo}-suporte.md) — FAQ, ambientes e como reportar problemas

---

## 🗺️ Mapa de Navegação

| Eu sou... | Eu quero... | Leia |
|---|---|---|
| Novo na API | Entender o que é e começar | [Getting Started](./{titulo}.md) |
| Analista/Produto | Saber como fazer uma tarefa | [Casos de Uso](./{titulo}-casos-de-uso.md) |
| Desenvolvedor | Ver contratos e schemas | [Referência Técnica](./{titulo}-tecnica.md) |
| Suporte | Resolver um problema | [Suporte](./{titulo}-suporte.md) |
```

**Regras do `index.md`:**
- ✅ Listar **todos** os documentos gerados com links relativos
- ✅ Agrupar por camada (Getting Started, Casos de Uso, Referência Técnica, Suporte)
- ✅ Incluir descrição breve de cada documento
- ✅ Incluir mapa de navegação por persona
- ✅ Incluir apenas camadas do tipo escolhido (omitir seções de camadas não geradas)
- ❌ Não incluir documentos de revisão (`*-revision-*.md`) no índice

---

## 📚 Estrutura das Camadas

### Camada 1 — Getting Started (Tipo: `nao-tecnica` e `ambas`)

Seção de entrada acessível a **qualquer pessoa**.

```markdown
# {Nome da API}

## O que é?

[Descrição em linguagem de negócio — qual problema resolve, sem jargão técnico]

## Para que serve?

- [Caso de uso 1 em linguagem de negócio]
- [Caso de uso 2]
- [Caso de uso 3]

## Pré-requisitos

- [O que o usuário precisa ter/saber antes de começar]

## Primeiros Passos

1. [Passo visual e claro para começar]
2. [Passo seguinte]
3. [...]

## Ambientes Disponíveis

| Ambiente | URL | Uso |
|---|---|---|
| **Produção** | `https://api.exemplo.com/v1` | Dados reais |
| **Sandbox** | `https://sandbox.api.exemplo.com/v1` | Testes sem impacto |
```

**Regras:**
- ❌ Sem jargão técnico (status codes, schemas, headers)
- ✅ Linguagem de negócio
- ✅ Tutorial visual, passo a passo
- ✅ Responde: "O que é isso e como começo?"

---

### Camada 2 — Guias de Caso de Uso (Tipo: `nao-tecnica` e `ambas`)

Documentação orientada a **tarefas**, não a endpoints.

```markdown
## Como [ação de negócio]

### Objetivo

[Descrição do que será alcançado]

### Passo a Passo

1. [Passo com screenshot ou exemplo visual]
2. [Passo seguinte]
3. [...]

### Resultado Esperado

[O que acontece quando dá certo]

### Problemas Comuns

| Erro | Causa | Solução |
|---|---|---|
| [Descrição amigável] | [Por que acontece] | [O que fazer] |
```

**Glossário obrigatório** (incluir em todo documento não-técnico):

```markdown
## Glossário

| Termo Técnico | Tradução |
|---|---|
| Endpoint | Endereço/funcionalidade da API |
| Payload / Request Body | Dados enviados na requisição |
| Response Body | Dados retornados pela API |
| Status `200` | ✅ Sucesso |
| Status `400` | ❌ Dados enviados incorretamente |
| Status `401` | 🔒 Sem permissão (login expirou) |
| Status `404` | 🔍 Não encontrado |
| Status `422` | ⚠️ Dados inválidos ou incompletos |
| Status `429` | 🐌 Muitas requisições (aguarde) |
| Status `500` | 🔥 Erro interno do servidor |
| Authentication Token | Chave de acesso temporária |
| Rate Limit | Limite de requisições por período |
| Pagination | Divisão de resultados em páginas |
```

**Catálogo de erros com soluções** (não apenas códigos):

```markdown
### Erro: [Descrição amigável] ([código])

**Causa:** [Por que acontece em linguagem simples]

**O que fazer:**
1. [Ação concreta]
2. [Ação seguinte]

**Ainda com problema?** Abra um chamado informando o código de erro.
```

**Regras:**
- ❌ Nunca orientar por endpoint (`POST /orders`)
- ✅ Orientar por ação de negócio ("Como criar um pedido")
- ✅ Erros com soluções práticas
- ✅ Fluxogramas visuais quando aplicável

---

### Camada 3 — Referência Técnica (Tipo: `tecnica` e `ambas`)

Documentação completa de contrato para integradores e desenvolvedores.

#### Autenticação

```markdown
## Autenticação

| Item | Descrição |
|---|---|
| **Mecanismo** | [Tipo: API Key, OAuth2, JWT, Basic Auth] |
| **Expiração** | [Tempo de vida do token] |
| **Refresh** | [Endpoint ou fluxo de renovação] |

### Como Autenticar

[Exemplo prático com headers]

### Escopos e Permissões

| Escopo | Descrição | Endpoints |
|---|---|---|
| `read:orders` | Leitura de pedidos | `GET /orders`, `GET /orders/{id}` |
```

#### Endpoints

Para **cada endpoint**, usar este template:

```markdown
## [MÉTODO] [path]

[Descrição do que o endpoint faz]

### Parâmetros

| Nome | Localização | Tipo | Obrigatório | Descrição |
|---|---|---|---|---|
| `id` | path | `string (UUID)` | ✅ | [Descrição] |
| `status` | query | `string (enum)` | ❌ | [Valores: x, y, z] |

### Request Body

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `name` | `string` | ✅ | [Descrição] |

**Exemplo:**

```json
{
  "name": "Maria Silva",
  "email": "maria@exemplo.com"
}
```

### Responses

#### 200 — Sucesso

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Maria Silva"
}
```

#### 404 — Não Encontrado

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Recurso não encontrado"
  }
}
```
```

#### Modelos de Dados

```markdown
## [Nome do Modelo]

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | `string (UUID)` | — | Gerado automaticamente |
| `status` | `enum` | ✅ | Valores: `pending`, `confirmed`, `cancelled` |
| `created_at` | `string (ISO 8601)` | — | Data de criação |
```

#### Formato Padrão de Erro

```markdown
## Formato de Erro

Todas as respostas de erro seguem o formato:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Descrição legível do erro",
    "details": "Informações adicionais",
    "trace_id": "abc-123-def"
  }
}
```
```

#### Paginação

```markdown
## Paginação

| Parâmetro | Tipo | Default | Descrição |
|---|---|---|---|
| `page` | `integer` | `1` | Número da página |
| `per_page` | `integer` | `20` | Itens por página (máx. 100) |

### Headers de Resposta

| Header | Descrição |
|---|---|
| `X-Total-Count` | Total de registros |
| `X-Total-Pages` | Total de páginas |
```

#### Rate Limiting

```markdown
## Rate Limiting

| Plano | Limite | Janela |
|---|---|---|
| Free | 100 req | por minuto |
| Pro | 1.000 req | por minuto |

### Headers

| Header | Descrição |
|---|---|
| `X-RateLimit-Limit` | Limite total |
| `X-RateLimit-Remaining` | Restantes |
| `X-RateLimit-Reset` | Timestamp de reset |
```

#### Changelog

```markdown
## Changelog

### vX.Y.Z — YYYY-MM-DD
- **[NOVO]** [Descrição]
- **[ALTERADO]** [Descrição]
- **[DEPRECIADO]** [Descrição]
- **[REMOVIDO]** [Descrição]

### Política de Versionamento
- Breaking changes: suporte de X meses para versão anterior
- Endpoints depreciados: aviso de X meses antes da remoção
```

---

### Camada 4 — Suporte (Tipo: `nao-tecnica` e `ambas`)

```markdown
## FAQ

### [Categoria]
- **[Pergunta frequente]** → [Resposta direta]

## Ambientes

| Ambiente | URL | Uso |
|---|---|---|
| Produção | `https://...` | Dados reais |
| Sandbox | `https://...` | Testes |

## Como Reportar Problemas

Ao reportar um problema, inclua:
1. Endpoint chamado
2. Código de erro recebido
3. `trace_id` da response
4. Data/hora da ocorrência
5. Ambiente utilizado
```

---

## ✅ Checklist de Completude

### Tipo `nao-tecnica`

- [ ] Getting Started com linguagem de negócio
- [ ] Casos de uso orientados por tarefa
- [ ] Glossário de termos traduzidos
- [ ] Catálogo de erros com soluções práticas
- [ ] FAQ com perguntas reais
- [ ] Ambientes documentados
- [ ] `index.md` gerado com links para todos os documentos

### Tipo `tecnica`

- [ ] Autenticação e autorização documentadas
- [ ] Todos os endpoints com parâmetros, schemas e exemplos
- [ ] Modelos de dados com tipos e constraints
- [ ] Formato padrão de erro
- [ ] Paginação documentada
- [ ] Rate limiting documentado
- [ ] Changelog com política de versionamento
- [ ] `index.md` gerado com links para todos os documentos

### Tipo `ambas`

- [ ] Todos os itens de `nao-tecnica`
- [ ] Todos os itens de `tecnica`
- [ ] Particionamento coerente (se aplicável)
- [ ] Consistência entre camadas
- [ ] `index.md` gerado com links para todos os documentos

---

## ⚡ Quick Reference

```
┌─────────────────────────────────────────────────────────────┐
│       DOCUMENTAÇÃO DE API — DECISÃO RÁPIDA                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Inputs   → Título (obrigatório) + Tipo (default: ambas)    │
│  Análise  → Rotas, specs, models, auth, errors              │
│  Partição → Simples = 1 doc, Complexo = por contexto/domínio│
│  Naming   → {titulo}.md ou {titulo}-{ctx}-{dom}.md          │
│  Saída    → ./doc-apis/{titulo}/                             │
│                                                              │
│  CAMADAS:                                                    │
│  🟢 Getting Started — "O que é e como começo?"               │
│  🟡 Casos de Uso    — "Quero fazer X, como faço?"            │
│  🔴 Ref. Técnica    — "Qual o contrato desse endpoint?"     │
│  📞 Suporte         — "Deu erro, e agora?"                  │
│                                                              │
│  TESTE: "Cada público encontra o que precisa?"               │
│         Se sim → ✅  Se não → ❌                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📚 Referências

- [OpenAPI Specification](https://www.openapis.org/)
- [AsyncAPI](https://www.asyncapi.com/)
- [Readme.com — Developer Hub](https://readme.com/)
- [Redocly — API Documentation](https://redocly.com/)
- [Microsoft REST API Guidelines](https://github.com/microsoft/api-guidelines)

> 💡 **Lembre-se:** Documentação de API é um produto. Trate-a com o mesmo cuidado que você trata o código.

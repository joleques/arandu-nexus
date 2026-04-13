---
name: api-documentador-revisor
description: Revisa documentação de APIs gerada pela skill api-documentador, validando completude, consistência e qualidade por camada.
---

# 🔍 Revisor de Documentação de APIs

Skill para validação de documentação de APIs gerada pela skill [`api-documentador`](../api-documentador/SKILL.md).

**Referência:** Skill [`api-documentador`](../api-documentador/SKILL.md)

> [!IMPORTANT]
> **Filosofia Core:** Documentação de API é um produto. Se o público-alvo não encontra o que precisa rapidamente, a documentação falhou — independente de quão completa ela seja tecnicamente.

---

## 📋 Quando Usar

Execute esta skill quando:
- Após a skill `api-documentador` gerar a documentação
- Para validar que a documentação segue as regras propostas
- Quando o usuário pedir revisão de documentação de API existente

---

## 🎯 Instruções de Execução

### 1. Coletar Informações

Identifique:
1. **O(s) documento(s)** a serem revisados (diretório `./doc-apis/{titulo}/`)
2. **O tipo de documentação** gerado (`tecnica`, `nao-tecnica` ou `ambas`)
3. **A versão da revisão** — verificar se já existem revisões anteriores para incrementar

### 2. Análise de Completude por Camada

Verifique se todas as camadas do tipo escolhido estão presentes e preenchidas.

#### Para tipo `nao-tecnica`

| Camada | Checklist |
|---|---|
| **Getting Started** | ✅ Descrição em linguagem de negócio? ✅ Casos de uso listados? ✅ Pré-requisitos? ✅ Tutorial de primeiros passos? ✅ Ambientes? |
| **Casos de Uso** | ✅ Orientação por tarefa (não por endpoint)? ✅ Passo a passo claro? ✅ Resultado esperado? ✅ Problemas comuns com soluções? |
| **Glossário** | ✅ Presente? ✅ Termos técnicos traduzidos? ✅ Cobertura dos termos usados no documento? |
| **Catálogo de Erros** | ✅ Erros com descrição amigável? ✅ Causa explicada? ✅ Solução prática? ✅ Orientação para escalar? |
| **Suporte** | ✅ FAQ presente? ✅ Ambientes documentados? ✅ Template de chamado? |

#### Para tipo `tecnica`

| Camada | Checklist |
|---|---|
| **Autenticação** | ✅ Mecanismo descrito? ✅ Exemplo prático? ✅ Expiração e refresh? ✅ Escopos? |
| **Endpoints** | ✅ Todos os endpoints listados? ✅ Parâmetros com tipos e obrigatoriedade? ✅ Request body com exemplo? ✅ Responses (sucesso + erros) com exemplos? |
| **Modelos de Dados** | ✅ Schemas completos? ✅ Tipos, constraints, enums? ✅ Relacionamentos? |
| **Formato de Erro** | ✅ Padrão definido? ✅ Exemplo JSON? |
| **Paginação** | ✅ Parâmetros documentados? ✅ Headers de resposta? |
| **Rate Limiting** | ✅ Limites por plano? ✅ Headers documentados? ✅ Comportamento quando excedido? |
| **Changelog** | ✅ Histórico de versões? ✅ Política de versionamento? ✅ Guia de migração (se breaking changes)? |

#### Para tipo `ambas`

- Todos os itens de `nao-tecnica` ✅
- Todos os itens de `tecnica` ✅
- Consistência entre camadas ✅
- Particionamento coerente ✅

---

### 3. Análise de Qualidade — Getting Started

**Verificar:**
- ✅ Linguagem de negócio (sem jargão técnico)
- ✅ Qualquer pessoa entende o que a API faz
- ✅ Tutorial claro de primeiros passos
- ✅ Responde: "O que é isso e como começo?"
- ❌ Jargão técnico (status codes, schemas, headers)
- ❌ Informação que só dev entende
- ❌ Ausência de tutorial prático

---

### 4. Análise de Qualidade — Casos de Uso

**Verificar:**
- ✅ Orientação por tarefa ("Como criar um pedido")
- ✅ Passo a passo visual e claro
- ✅ Problemas comuns com soluções práticas
- ✅ Glossário com termos traduzidos
- ✅ Fluxogramas visuais (quando aplicável)
- ❌ Orientação por endpoint (`POST /orders`)
- ❌ Erros listados sem solução
- ❌ Linguagem técnica no contexto de caso de uso

---

### 5. Análise de Qualidade — Referência Técnica

**Verificar:**
- ✅ Endpoints completos (método, path, params, body, responses)
- ✅ Schemas com tipos, constraints e enums
- ✅ Exemplos com valores reais (não placeholders genéricos)
- ✅ Autenticação clara com exemplos
- ✅ Formato padrão de erro definido
- ❌ Endpoints sem exemplos de response
- ❌ Schemas incompletos (faltando tipos ou constraints)
- ❌ Exemplos com valores genéricos (`"string"`, `"value"`)
- ❌ Ausência de cenários de erro

---

### 6. Análise de Qualidade — Suporte

**Verificar:**
- ✅ FAQ com perguntas reais (não inventadas)
- ✅ Ambientes documentados com URLs
- ✅ Template de abertura de chamado
- ❌ FAQ vazio ou com perguntas óbvias
- ❌ Ausência de informações de contato/escalar

---

### 7. Análise de Consistência

**Verificar entre documentos (quando particionado):**
- ✅ Endpoints citados nos casos de uso existem na referência técnica
- ✅ Erros nos casos de uso batem com os da referência técnica
- ✅ Termos do glossário cobrem o vocabulário usado nos documentos técnicos
- ✅ Ambientes são os mesmos em todas as camadas
- ❌ Endpoint mencionado no caso de uso que não existe na referência
- ❌ Dados divergentes entre camadas (URLs, limites, comportamentos)

---

### 8. Análise de Particionamento

**Verificar (quando múltiplos documentos):**
- ✅ Cada documento tem escopo coeso e bem delimitado
- ✅ Naming segue o padrão `{titulo}-{contexto}-{dominio}.md`
- ✅ Não há sobreposição significativa entre documentos
- ✅ Não há lacunas (endpoints ou fluxos não cobertos)
- ❌ Documento com escopo vago ou misturando domínios
- ❌ Informação duplicada entre documentos
- ❌ Informação perdida que deveria estar em algum documento

**Verificar `index.md`:**
- ✅ Arquivo `index.md` existe na raiz do diretório
- ✅ Todos os documentos de conteúdo estão listados com links relativos
- ✅ Documentos agrupados por camada (Getting Started, Casos de Uso, Ref. Técnica, Suporte)
- ✅ Cada documento com descrição breve
- ✅ Mapa de navegação por persona presente
- ✅ Apenas camadas do tipo escolhido estão presentes (sem seções vazias)
- ❌ Documentos de revisão (`*-revision-*.md`) incluídos no índice
- ❌ Links quebrados ou apontando para documentos inexistentes
- ❌ Ausência de `index.md`

---

### 9. Análise de Exemplos

**Verificar:**
- ✅ Exemplos com valores realistas e coerentes
- ✅ JSONs válidos e formatados
- ✅ UUIDs, datas, emails com formato correto
- ✅ Exemplos de erro com `trace_id` e códigos de negócio
- ❌ Valores genéricos (`"string"`, `"value"`, `"xxx"`)
- ❌ JSONs inválidos ou mal formatados
- ❌ Exemplos que contradizem o schema

---

## 📝 Formato do Relatório

Gere o relatório em `./doc-apis/{titulo}/{titulo}-revision-{versao}.md`:

```markdown
# Relatório de Revisão — {titulo}

**Documentação:** {titulo}
**Tipo:** {tecnica / nao-tecnica / ambas}
**Versão da Revisão:** v{N}
**Data:** {YYYY-MM-DD}

## Resumo

| Categoria | Status | Problemas |
|---|---|---|
| Completude por Camada | ✅/⚠️/❌ | X |
| Getting Started | ✅/⚠️/❌ | X |
| Casos de Uso | ✅/⚠️/❌ | X |
| Referência Técnica | ✅/⚠️/❌ | X |
| Suporte | ✅/⚠️/❌ | X |
| Consistência | ✅/⚠️/❌ | X |
| Particionamento | ✅/⚠️/❌ | X |
| Índice (`index.md`) | ✅/⚠️/❌ | X |
| Exemplos | ✅/⚠️/❌ | X |

## Veredicto: ✅ APROVADO / ⚠️ AJUSTAR / ❌ REESCREVER

## Problemas Encontrados

### [Categoria]

#### [Problema 1]
- **Documento:** {arquivo.md}
- **Trecho:** "[trecho do documento]"
- **Problema:** [descrição objetiva]
- **Sugestão:** [como corrigir]

## Pontos Fortes

- [O que a documentação faz bem — reforço positivo]

## Recomendações Gerais

- [Lista de melhorias sugeridas, priorizadas por impacto]
```

---

## ⚠️ Observações

- **Não reescreva a documentação.** Aponte problemas e sugira direções — o autor deve reescrever.
- **Adapte ao tipo:** Se o tipo é `tecnica`, não cobre camadas de `nao-tecnica` (e vice-versa).
- **Pragmatismo:** Uma documentação não precisa ser perfeita, precisa ser útil para o público-alvo.
- **Reforce o positivo:** Sempre destaque o que a documentação faz bem antes de listar problemas.
- **Priorize impacto:** Foque em problemas que afetam a experiência do leitor, não em detalhes cosméticos.

---

## ⚡ Quick Reference

```
┌─────────────────────────────────────────────────────────────┐
│       REVISÃO DE DOC API — DECISÃO RÁPIDA                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Completude → Todas as camadas do tipo estão presentes?     │
│  Getting Started → Linguagem de negócio, sem jargão?        │
│  Casos de Uso → Orientação por tarefa, não por endpoint?    │
│  Ref. Técnica → Endpoints completos com exemplos reais?     │
│  Suporte → FAQ real, ambientes, template de chamado?        │
│  Consistência → Dados batem entre camadas/documentos?       │
│  Partição → Escopo coeso, sem sobreposição nem lacuna?      │
│  Exemplos → Valores reais, JSONs válidos?                   │
│                                                              │
│  TESTE: "O público-alvo encontra o que precisa?"            │
│         Se sim → ✅  Se não → ❌                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📚 Referências

- Skill [`api-documentador`](../api-documentador/SKILL.md) — Padrão de produção de documentação de APIs

> 💡 **Lembre-se:** Um bom revisor não busca perfeição — busca utilidade. Se o público-alvo consegue usar a documentação para resolver seus problemas, ela cumpriu seu papel.

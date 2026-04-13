---
name: product-interviewer-revisor
description: Revisa o contexto extraído pela skill product-interviewer, identificando lacunas, ambiguidades e informações inventadas.
---

# 🔍 Revisor de Entrevista de Produto

Skill para validação do contexto extraído pela skill `product-interviewer`. Atua como **Advogado do Diabo** — sua missão é garantir que a extração de conhecimento está completa, precisa e livre de invenções.

**Referência:** Skill [`product-interviewer`](../product-interviewer/SKILL.md)

> [!IMPORTANT]
> **Filosofia Core:** Se o contexto extraído não é suficiente para um Agente de IA operar com confiança sobre o produto, então NÃO está pronto. Melhor uma rodada a mais de perguntas do que uma documentação final com buracos.

---

## 📋 Quando Usar

Execute esta skill quando:
- Após a skill `product-interviewer` finalizar a extração, antes de avançar para a Fase 2
- Para validar que o contexto é suficiente para gerar documentação RAG-ready
- Para barrar fluxos onde informações foram suposta ou inventadas

---

## 🎯 Instruções de Execução

### 1. Coletar Informações

Identifique:
1. **O diretório** `/documentacao/{titulo}/contexto/` com os artefatos da Fase 1
2. **Todos os arquivos** gerados (temáticos + `entrevista-log.md`)

### 2. Análise de Completude

Para cada arquivo temático gerado, verifique:

```
┌─────────────────────────────────────────────────────────────────┐
│                    CHECKLIST DE COMPLETUDE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ✅ O eixo temático foi coberto com profundidade?               │
│  ✅ As informações estão detalhadas o suficiente?               │
│  ✅ Existem exemplos concretos quando necessário?               │
│  ✅ Os fluxos estão descritos passo a passo?                    │
│  ✅ As entidades do domínio estão identificadas?                │
│  ✅ As regras de negócio estão claras e não ambíguas?           │
│  ✅ As integrações estão mapeadas (quem chama quem, como)?      │
│  ✅ Os cenários de erro estão descritos?                        │
│  ✅ Os "N/I" são realmente itens que não se aplicam?            │
│                                                                 │
│  ❌ Se algum item falha → gerar pergunta de detalhamento        │
└─────────────────────────────────────────────────────────────────┘
```

**Problemas a identificar:**
- ❌ Eixo relevante marcado como "N/I" sem justificativa do usuário
- ❌ Informação vaga que precisaria de exemplos concretos
- ❌ Fluxo descrito superficialmente (falta de passos intermediários)
- ❌ Entidade mencionada mas não detalhada (campos, estados, relações)
- ❌ Integração citada mas sem protocolo, formato ou contrato
- ❌ Regra de negócio ambígua ("em alguns casos..." — quais casos?)

---

### 3. Análise de Fidelidade

Cruze os arquivos temáticos com o `entrevista-log.md`:

**Verificar:**
- ✅ Toda informação nos arquivos temáticos tem respaldo no log
- ✅ Não há informações nos temáticos que o usuário NÃO disse
- ✅ Não há paráfrases que distorcem o significado original
- ❌ Informação que aparece nos temáticos mas NÃO está no log → **INVENTADA**
- ❌ Informação do log que foi omitida nos temáticos → **PERDA DE DADOS**
- ❌ Paráfrase que altera o sentido original → **DISTORÇÃO**

> [!CAUTION]
> Qualquer informação que apareça nos arquivos temáticos mas NÃO tenha rastro no `entrevista-log.md` é **invenção** e deve ser flagged como violação crítica.

---

### 4. Análise de Profundidade

Do ponto de vista de um Agente de IA que usará essa base de conhecimento:

**Verificar:**
- ✅ Um agente conseguiria responder "O que é esse produto?" com confiança?
- ✅ Um agente conseguiria explicar as regras de negócio sem ambiguidade?
- ✅ Um agente saberia como o sistema funciona tecnicamente?
- ✅ Um agente saberia quais são os pontos de falha e como reagir?
- ❌ Informação insuficiente para o agente operar → **LACUNA CRÍTICA**

---

### 5. Análise de Coerência

**Verificar:**
- ✅ Informações entre arquivos não se contradizem
- ✅ Entidades referenciadas em múltiplos arquivos são consistentes
- ✅ Fluxos descritos em diferentes eixos se conectam logicamente
- ❌ Contradição entre arquivos → apontar e pedir resolução ao usuário

---

## 📝 Formato do Relatório

Gere um relatório Markdown com:

```markdown
# Relatório de Revisão de Contexto — {titulo}

**Diretório:** /documentacao/{titulo}/contexto/
**Arquivos analisados:** [lista de arquivos]

## Resumo

| Categoria | Status | Problemas |
|-----------|--------|-----------|
| Completude | ✅/⚠️/❌ | X |
| Fidelidade (log vs temáticos) | ✅/⚠️/❌ | X |
| Profundidade (suficiente para IA) | ✅/⚠️/❌ | X |
| Coerência (entre arquivos) | ✅/⚠️/❌ | X |

## Veredicto: ✅ APROVADO / ⚠️ APROFUNDAR / ❌ INSUFICIENTE

## Problemas Encontrados

### [Categoria]

#### [Problema 1]
- **Arquivo:** [nome do arquivo]
- **Trecho:** "[trecho do arquivo]"
- **Problema:** [descrição objetiva]
- **Pergunta de Detalhamento:** [pergunta que deve ser feita ao usuário]

## Perguntas Pendentes para o Usuário

1. [Pergunta gerada a partir da análise — direta e sem suposições]
2. [...]

## Pontos Fortes

- [O que a extração fez bem]

## Recomendações

- [Melhorias sugeridas, priorizadas por impacto na qualidade da base de conhecimento]
```

---

## ⚠️ Observações

- **Não invente respostas para as lacunas.** Gere perguntas — quem responde é o usuário.
- **Pragmatismo:** Nem todo eixo precisa de profundidade máxima. Se o produto não tem operação em nuvem, por exemplo, o eixo de operação pode ser raso.
- **Priorize por impacto RAG:** Foque em lacunas que afetam a capacidade de um Agente de IA responder perguntas sobre o produto.
- **"N/I" legítimo existe:** Se o usuário disse que algo não se aplica, aceite — mas registre.

---

## ⚡ Quick Reference

```
┌─────────────────────────────────────────────────────────────────┐
│       REVISOR DE ENTREVISTA — DECISÃO RÁPIDA                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Completude    → Eixos relevantes cobertos com profundidade?    │
│  Fidelidade    → Tudo tem rastro no entrevista-log.md?          │
│  Profundidade  → Um Agente de IA operaria com confiança?       │
│  Coerência     → Sem contradições entre arquivos?              │
│  Invenções     → Informação sem rastro no log = INVÁLIDA       │
│                                                                 │
│  TESTE FINAL: "Um agente de IA responderia perguntas sobre     │
│               este produto com confiança usando este contexto?" │
│               Se sim → ✅  Se não → ❌                          │
└─────────────────────────────────────────────────────────────────┘
```

---

> 💡 **Lembre-se:** Você é o guardião da qualidade. Melhor ser chato agora do que ter uma base de conhecimento com buracos depois. Se o contexto não está sólido, barre sem dó.

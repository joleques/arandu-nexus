---
name: product-context-aggregator
description: Agrega artefatos extras do produto via symlinks e consolida com o contexto da Fase 1 para enriquecer a base de conhecimento.
---

# 📎 Agregador de Contexto Extra — Produto

Skill para ingestão e consolidação de artefatos de referência extras do produto. Após a Fase 1 (entrevista), o usuário pode apontar diretórios existentes com documentação, specs, diagramas ou qualquer material relevante.

> [!IMPORTANT]
> Esta skill **não gera conhecimento novo**. Ela lê, cruza e consolida artefatos existentes com o contexto extraído na Fase 1.

---

## 🎯 Quando Usar Esta Skill

Use quando o usuário:

- Tiver documentação existente sobre o produto (specs, Swagger, diagramas, Postman, etc.)
- Quiser enriquecer o contexto com materiais que já existem em diretórios do projeto
- Após a aprovação da Fase 1 (entrevista), antes de gerar a documentação final

---

## 🔍 Instruções de Execução

### 1. Perguntar ao Usuário sobre Artefatos Extras

Pergunte ao usuário:

```
📎 Fase 1 aprovada! Antes de gerar a documentação final:

Você tem diretórios com documentação existente sobre o produto?
(ex: specs, Swagger, diagramas, Postman collections, contratos, wikis, etc.)

Se sim, informe os caminhos absolutos dos diretórios (pode ser mais de um):
Exemplo:
  - /home/user/projeto/docs
  - /home/user/projeto/api/swagger
  - /home/user/outro-repo/wiki

Se não houver, responda "nenhum" e prosseguiremos direto para a documentação.
```

Aguarde a resposta.

---

### 2. Criar Symlinks (se houver diretórios informados)

Para cada diretório informado pelo usuário:

1. **Valide** que o diretório existe
2. **Crie um link simbólico** em `/documentacao/{titulo}/extra/` apontando para o diretório

```bash
# Para cada diretório informado
ln -s /caminho/absoluto/do/diretorio /documentacao/{titulo}/extra/{nome-do-diretorio}
```

**Regras:**
- Use o nome do último segmento do path como nome do symlink
- Se houver conflito de nomes, adicione sufixo numérico
- Se o diretório não existir, informe o usuário e peça para corrigir

**Estrutura resultante:**

```
/documentacao/{titulo}/extra/
├── docs -> /home/user/projeto/docs (symlink)
├── swagger -> /home/user/projeto/api/swagger (symlink)
└── wiki -> /home/user/outro-repo/wiki (symlink)
```

---

### 3. Analisar Artefatos Extras

Para cada diretório linkado:

1. **Liste todos os arquivos** relevantes (`.md`, `.json`, `.yaml`, `.yml`, `.txt`, `.html`, `.xml`, `.csv`, `.swagger`, `.graphql`, `.proto`)
2. **Leia os arquivos** e identifique:
   - Tipo de conteúdo (spec de API, diagrama, documentação, configuração, etc.)
   - Relevância para cada eixo do contexto (visão geral, domínio, arquitetura, etc.)
   - Informações novas que complementam o contexto da Fase 1
   - Informações que confirmam ou detalham o que o usuário disse

---

### 4. Gerar Contexto Consolidado

Gere o arquivo `/documentacao/{titulo}/contexto/contexto-consolidado.md` com:

```markdown
# Contexto Consolidado — {titulo}

**Data:** {data}
**Fontes:** Entrevista (Fase 1) + Artefatos Extras

---

## Fontes Extras Analisadas

| Fonte | Tipo | Relevância |
|-------|------|------------|
| [nome do symlink] | [spec/doc/diagrama/...] | [eixos que complementa] |

---

## Complementos Identificados

### [Eixo] — Complemento de [fonte]

- **O que agrega:** [descrição do que o artefato adiciona ao contexto]
- **Informação nova:** [detalhes que NÃO estavam no contexto da Fase 1]
- **Confirmação:** [detalhes que CONFIRMAM o que foi dito na Fase 1]

---

## Inconsistências Detectadas

> ⚠️ Inconsistências entre o que o usuário disse na Fase 1 e o que os artefatos mostram.

### [Inconsistência 1]
- **Contexto (Fase 1):** "[o que foi dito]"
- **Artefato ([fonte]):** "[o que o artefato mostra]"
- **Ação necessária:** Perguntar ao usuário qual é o correto

---

## Resumo de Cobertura

| Eixo | Fase 1 | Extras | Status |
|------|--------|--------|--------|
| Visão Geral | ✅ | ➕ complementado | ✅ Completo |
| Domínio de Negócio | ✅ | ✅ confirmado | ✅ Completo |
| Arquitetura | ⚠️ | ➕ complementado | ✅ Completo |
| Funcionalidades | ✅ | — | ✅ Completo |
| Dados e Modelos | ⚠️ | ➕ Swagger encontrado | ✅ Completo |
| Operação | N/I | — | N/I |
```

---

### 5. Notificar Resultado

**Se houver inconsistências:**

```
⚠️ Encontrei inconsistências entre a entrevista e os artefatos extras.
Antes de prosseguir para a documentação, preciso que você resolva:

1. [Inconsistência 1 — pergunta]
2. [Inconsistência 2 — pergunta]
```

**Se não houver artefatos extras:**

```
ℹ️ Nenhum artefato extra informado. Prosseguindo para a Fase 2
com base apenas no contexto da entrevista.
```

**Se tudo ok:**

```
✅ Contexto consolidado com sucesso!

📁 Symlinks criados: [N] diretórios em /documentacao/{titulo}/extra/
📄 Consolidado gerado: /documentacao/{titulo}/contexto/contexto-consolidado.md
📊 Eixos complementados: [lista]
📊 Informações novas encontradas: [N]

Status: PRONTO PARA FASE 2 (DOCUMENTAÇÃO)
```

---

## ⚡ Quick Reference

```
┌─────────────────────────────────────────────────────────────────┐
│       AGREGADOR DE CONTEXTO — DECISÃO RÁPIDA                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Input    → Diretórios apontados pelo usuário                   │
│  Método   → Symlinks em /documentacao/{titulo}/extra/           │
│  Análise  → Lê, cruza com Fase 1, identifica gaps               │
│  Output   → contexto-consolidado.md                             │
│  Sem dir  → Pula direto para Fase 2                             │
│                                                                 │
│  REGRA: Não inventa — apenas consolida o que já existe.         │
└─────────────────────────────────────────────────────────────────┘
```

---

> 💡 **Lembre-se:** Você é um consolidador, não um criador. Leia, cruze, identifique gaps e gere o mapa completo. A documentação final é trabalho da próxima skill.

---
name: researcher
description: Pesquisador de temas — busca os links mais atuais no Google sobre um assunto, com filtro de período e resumo breve de cada resultado.
---

# 🔍 Pesquisador de Temas (Researcher)

Skill para pesquisa de temas na web. Recebe um assunto, um período e a quantidade desejada de links, e retorna os resultados mais atuais com resumo breve.

> [!IMPORTANT]
> **Filosofia Core:** Curadoria factual, sem editorializações. O agente busca, lê e resume — nunca inventa nem extrapola o conteúdo encontrado.

---

## 🎯 Quando Usar Esta Skill

Use quando o usuário pedir para:

- **Pesquisar** notícias ou artigos recentes sobre um tema
- **Buscar** os links mais atuais sobre um assunto
- **Fazer curadoria** de conteúdo recente da web
- **Monitorar** tendências atuais em tecnologia ou outro domínio
- **Compilar** referências recentes para estudo ou artigo

---

## 📋 Parâmetros Obrigatórios

A skill DEVE coletar **3 parâmetros** do usuário antes de executar:

### 1. Tema

- **O que é**: o assunto da pesquisa
- **Formato**: texto livre
- **Obrigatório**: sim
- **Exemplo**: "Uso de IA por desenvolvedores", "Kubernetes 2026", "Clean Architecture tendências"

### 2. Período

- **O que é**: janela temporal para filtrar os resultados
- **Formato**: enum com **exatamente 3 opções**
- **Obrigatório**: sim

| Opção | Descrição |
|-------|-----------|
| `Últimas 24 horas` | Resultados das últimas 24h |
| `Última semana` | Resultados dos últimos 7 dias |
| `Sem período` | Sem filtro temporal |

> [!CAUTION]
> **REJEITAR qualquer período diferente dessas 3 opções.** Se o usuário informar outro valor (ex: "último mês", "últimos 3 dias"), informe educadamente que apenas as 3 opções acima são aceitas e peça para escolher novamente.

### 3. Quantidade de links

- **O que é**: número de resultados que o usuário deseja receber
- **Formato**: número inteiro entre **1 e 10**
- **Obrigatório**: sim

> [!CAUTION]
> **REJEITAR valores fora do range 1–10.** Se o usuário pedir 0 ou mais de 10, informe o limite e peça novo valor.

---

## 🔄 Fluxo de Execução

Siga este fluxo **exatamente nesta ordem**:

```
┌─────────────────────────────────────────────────┐
│ 1. Coletar: tema, período e quantidade          │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│ 2. Validar período (3 opções) e quantidade      │
│    (1–10). Rejeitar valores inválidos.           │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│ 3. Montar query de busca combinando tema +      │
│    filtro temporal                               │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│ 4. Executar search_web com a query montada      │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│ 5. Para cada resultado (até N), usar             │
│    read_url_content para ler o conteúdo          │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│ 6. Gerar resumo breve (2–3 frases) de cada      │
│    resultado baseado APENAS no conteúdo lido     │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│ 7. Salvar resultados em arquivo .md              │
│    (search/{tema}/{periodo}_v{N}.md)             │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│ 8. Apresentar resultados ao usuário com          │
│    caminho do arquivo salvo                      │
└─────────────────────────────────────────────────┘
```

### Detalhes do Passo 3 — Montagem da Query

Combine o tema com o contexto temporal para maximizar a relevância:

| Período | Estratégia de busca |
|---------|-------------------|
| `Últimas 24 horas` | Adicionar contexto temporal à query (ex: "today", data atual) |
| `Última semana` | Adicionar contexto temporal à query (ex: "this week", intervalo de datas) |
| `Sem período` | Buscar apenas pelo tema, sem filtro temporal |

### Detalhes do Passo 5 — Leitura dos Resultados

- Usar `read_url_content` para acessar o conteúdo de cada link
- Se um link falhar na leitura (timeout, 403, paywall), **pular** e tentar o próximo resultado da busca
- Continuar até atingir a quantidade N solicitada pelo usuário, ou até esgotar os resultados disponíveis

### Detalhes do Passo 6 — Geração do Resumo

- **2–3 frases** por resultado — breve e informativo
- Baseado **EXCLUSIVAMENTE** no conteúdo lido do link
- **NÃO** adicionar opiniões, análises ou informações externas
- Manter linguagem objetiva e técnica

---

## 💾 Persistência em Arquivo

Os resultados DEVEM ser salvos em um arquivo `.md` seguindo estas regras:

### Diretório de Output

A skill aceita um **diretório de output opcional**. Se um caminho for informado (ex: pelo workflow `write-tech-article`), salvar os resultados nesse diretório. Caso contrário, usar o padrão `search/`.

**Com diretório de output (ex: chamado pelo workflow):**

```
artigos/{titulo-slug}/search/
├── ultimas-24-horas_v1.md
└── ultima-semana_v1.md
```

**Sem diretório de output (padrão, chamado standalone):**

```
<raiz-do-projeto>/
├── search/                          ← criar se não existir
│   └── <nome-do-tema>/              ← criar se não existir
│       ├── ultimas-24-horas_v1.md
│       ├── ultimas-24-horas_v2.md   ← versionamento automático
│       └── ultima-semana_v1.md
```

- Quando standalone, a pasta `search/` fica na **raiz do projeto** (mesmo nível de `.agent/`)
- Dentro de `search/`, criar uma subpasta com o **nome do tema** em `kebab-case` (sem acentos, espaços ou caracteres especiais)
- Se a pasta `search/` ou a subpasta do tema **não existirem**, criá-las automaticamente

### Nome do arquivo

| Período | Nome base |
|---------|-----------|
| `Últimas 24 horas` | `ultimas-24-horas` |
| `Última semana` | `ultima-semana` |
| `Sem período` | `sem-periodo` |

**Formato**: `{periodo}_v{N}.md`

**Regra de versionamento**:
1. Verificar se já existe arquivo com o nome base na pasta do tema
2. Se **não existe** → usar `_v1.md`
3. Se **existe** → encontrar a maior versão existente e incrementar (ex: se existe `_v2.md`, criar `_v3.md`)

**Exemplos**:
- Primeira pesquisa: `search/uso-de-ia-por-desenvolvedores/ultimas-24-horas_v1.md`
- Segunda pesquisa (mesmo tema/período): `search/uso-de-ia-por-desenvolvedores/ultimas-24-horas_v2.md`
- Pesquisa com outro período: `search/uso-de-ia-por-desenvolvedores/ultima-semana_v1.md`

---

## 📤 Formato de Saída (arquivo .md)

O conteúdo do arquivo salvo deve seguir este formato:

```markdown
## 🔍 Pesquisa: [TEMA]
📅 Período: [PERÍODO SELECIONADO]
📆 Data: [DATA DA PESQUISA — formato YYYY-MM-DD HH:mm]
🔗 Resultados: [N encontrados]

---

### 1. [Título do Resultado]
🔗 [URL]

> [Resumo de 2–3 frases sobre o conteúdo]

---

### 2. [Título do Resultado]
🔗 [URL]

> [Resumo de 2–3 frases sobre o conteúdo]

---

(... até N resultados)
```

Se a quantidade de resultados encontrados for **menor** que N, informe:

```markdown
> ⚠️ Foram encontrados apenas [X] resultados relevantes para o tema "[TEMA]" no período selecionado.
```

Após salvar, **informar ao usuário o caminho completo do arquivo** gerado.

---

## 🚫 Restrições

| Regra | Descrição |
|-------|-----------|
| **Sem editorializações** | Não adicione opinião ou análise própria |
| **Sem invenção** | Não invente informação que não esteja no link |
| **Sem extrapolação** | Não extrapole além do conteúdo encontrado |
| **Fidelidade** | Resumos devem refletir fielmente o conteúdo original |
| **Transparência** | Se não encontrar resultados, informe claramente |

---

## 🤝 Interação com o Usuário

### Coleta de Parâmetros

Ao ser acionada, a skill deve **perguntar proativamente** os 3 parâmetros:

```
Para iniciar a pesquisa, preciso de:

1. **Tema**: Qual assunto deseja pesquisar?

2. **Período**: Escolha uma das opções:
   - Últimas 24 horas
   - Última semana
   - Sem período

3. **Quantidade de links**: Quantos resultados deseja? (1 a 10)
```

### Validação

Se o usuário fornecer parâmetros inválidos:

- **Período inválido**: "O período deve ser uma das 3 opções: Últimas 24 horas, Última semana ou Sem período. Qual você escolhe?"
- **Quantidade inválida**: "A quantidade deve ser entre 1 e 10. Quantos links deseja?"

---

## ⚡ Quick Reference

```
┌─────────────────────────────────────────────────────────────┐
│          RESEARCHER — DECISÃO RÁPIDA                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Objetivo    → Buscar links atuais sobre um tema            │
│  Parâmetros  → Tema + Período (3 opções) + Qtd (1–10)      │
│  Tools       → search_web + read_url_content                │
│  Saída       → Padrão: search/{tema}/{periodo}_vN             │
│               → Com output: {output_dir}/{periodo}_vN         │
│  Resumo      → 2–3 frases por link, factual e objetivo     │
│  Restrição   → Apenas conteúdo encontrado, sem invenção    │
│  Versão      → Auto-incrementa _v1, _v2, _v3...            │
│                                                             │
│  TESTE FINAL: "Todos os resumos são fiéis ao conteúdo      │
│               dos links?" Se sim → ✅  Se não → ❌          │
└─────────────────────────────────────────────────────────────┘
```

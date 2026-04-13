# 🔍 Researcher — Pesquisador de Temas

Skill que pesquisa os links mais atuais sobre um tema no Google, com filtro por período e resumo breve de cada resultado. Os resultados são salvos automaticamente em arquivo `.md` com versionamento.

## Parâmetros

| Parâmetro | Obrigatório | Descrição |
|-----------|:-----------:|-----------|
| **Tema** | ✅ | Assunto da pesquisa (texto livre) |
| **Período** | ✅ | `Últimas 24 horas`, `Última semana` ou `Sem período` |
| **Quantidade** | ✅ | Número de links desejados (1–10) |
| **Diretório de output** | ❌ | Caminho personalizado para salvar resultados (padrão: `search/`) |

## Como Funciona

1. Coleta os 3 parâmetros do usuário
2. Valida período (rejeita opções fora das 3 aceitas) e quantidade (rejeita fora de 1–10)
3. Busca no Google via `search_web`
4. Lê o conteúdo de cada resultado via `read_url_content`
5. Gera resumo breve (2–3 frases) de cada link
6. Salva resultados no diretório de output
7. Apresenta os resultados ao usuário com o caminho do arquivo

## Estrutura de Saída

**Standalone (padrão):**

```
search/
└── uso-de-ia-por-desenvolvedores/
    ├── ultimas-24-horas_v1.md
    ├── ultimas-24-horas_v2.md    ← versionamento automático
    └── ultima-semana_v1.md
```

**Via workflow (com diretório de output):**

```
artigos/{titulo-slug}/search/
├── ultimas-24-horas_v1.md
└── ultima-semana_v1.md
```

## Exemplo de Uso

```
Use a skill researcher para pesquisar sobre "Uso de IA por desenvolvedores"
nas últimas 24 horas, quero 5 links.
```

## Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `SKILL.md` | Instruções completas da skill |
| `README.md` | Este arquivo |

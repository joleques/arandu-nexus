# 🔍 Engineering Writer Revisor

**Skill de revisão de artigos técnicos** produzidos pela skill `engineering-writer`, validando estrutura, estilo, tom e qualidade do conteúdo.

## Para que serve?

Esta skill instrui o agente a revisar artigos técnicos e determinar se estão prontos para publicação. Gera um **relatório de conformidade** com veredicto (APROVADO / AJUSTAR / REESCREVER), problemas, pontos fortes e recomendações.

> "Um bom revisor não busca perfeição — busca honestidade, clareza e utilidade."

## O que é analisado?

| Categoria | Verificação |
|-----------|-------------|
| **Estrutura** | As 5 seções (provocação → contexto → experiência → análise → conclusão) |
| **Estilo e Tom** | Clareza, fluidez, ironia sutil, humildade, sem arrogância |
| **Profundidade Técnica** | Conceitos corretos, analogias, relação com práticas reconhecidas |
| **Trade-offs e Nuances** | Prós/contras, sem "verdade absoluta", contexto importa |
| **Valor para o Leitor** | Algo útil e aplicável, provoca reflexão |
| **Título** | Forte, específico, sem clickbait |
| **Comprimento** | Adequado ao formato (LinkedIn / médio / aprofundado) |
| **Expressões Proibidas** | Sem hype, buzzwords, falsa humildade, futurologia |

## Quando usar?

- Após a skill `engineering-writer` produzir um artigo
- Para validar que o conteúdo segue o padrão de qualidade
- Geralmente usada via workflow [`/write-article`](../../workflows/write-article.md)

## Saída

Relatório Markdown com:
- Tabela resumo por categoria (✅/⚠️/❌)
- Veredicto final: APROVADO / AJUSTAR / REESCREVER
- Problemas com trecho, descrição e sugestão
- Pontos fortes e recomendações gerais

## Referências

- Skill [`engineering-writer`](../engineering-writer/SKILL.md)
- [On Writing Well — William Zinsser](https://www.amazon.com/Writing-Well-Classic-Guide-Nonfiction/dp/0060891548)
- [Technical Blogging — Antonio Cangiano](https://pragprog.com/titles/actb2/technical-blogging-second-edition/)

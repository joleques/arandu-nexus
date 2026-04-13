# ✅ Revisor de Documentação RAG

**Skill de validação estrutural e semântica** de documentos Markdown produzidos para RAG.

## Para que serve?

Esta skill instrui o agente a atuar como **controle de qualidade (Critic Agent)** em uma Fábrica de Agentes. Ele valida documentos Markdown produzidos pela skill `documentador`, garantindo conformidade ao contrato de geração para ingestão em Base Vetorial.

> **Importante:** Este agente NÃO corrige o documento. Ele APENAS valida e reporta não conformidades.

## O que é validado?

| Regra | Descrição |
|-------|-----------|
| **Bloco YAML** | Presença e campos obrigatórios (Título, categoria, tags, entidades_chave) |
| **Conteúdo Teórico** | Existência das seções "Visão Geral" e "Fundamentos e Regras" |
| **Conteúdo Prático** | Se presente, validação completa da estrutura interna |
| **Hierarquia Markdown** | Sem salto de níveis, sem texto solto fora de seções |
| **Restrições de Teoria** | Sem passos, tabelas de parâmetros ou código na Visão Geral |
| **Autossuficiência** | Sem referências implícitas ("como visto acima", "conforme mencionado") |
| **Proibição de Resumo** | Sem "resumidamente", "etc", "entre outros" |

## Saída

```
Status: APROVADO | REPROVADO
Não Conformidades Detectadas: [lista de violações]
```

## Quando usar?

- Após a skill `documentador` produzir um documento
- No workflow `/doc-produto` (modo rápido) como segundo passo de validação
- Para garantir que documentos estão prontos para chunking automático

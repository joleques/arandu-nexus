# 📝 Jira Workflow

**Skill de gestão de tickets e hierarquia de demandas** no Jira com documentação local em Markdown.

## Para que serve?

Esta skill instrui o agente a gerenciar demandas e tickets seguindo uma hierarquia organizada de pastas e um template padronizado para documentação local de tickets Jira.

## Hierarquia de Pastas

```
documentacao/analises/jira/
├── {NomeDoEpico}/
│   ├── {NomeDoEpico}.md       # Documento do Épico
│   └── {NomeParcial}.md       # Documento da Task/Parcial
```

## Template de Ticket

Cada ticket documentado inclui:

- **Descrição** com identificador de sistema
- **Link Jira** (se existir)
- **Razão do ticket** com motivo e impacto
- **Definition of Done** com critérios de aceitação
- **História de usuário** (COMO/QUERO/PARA)
- **Cenários BDD** (DADO QUE/QUANDO/ENTÃO)

## Regras

- Criação no Jira (via MCP) apenas se solicitado manualmente
- Se ticket já existe, incluir o link no topo do `.md`
- Sempre perguntar em qual **Board** o ticket deve ser criado

## Quando usar?

- Para documentar demandas e tickets localmente em Markdown
- Para criar ou consultar tickets no Jira via MCP
- Para manter rastreabilidade entre documentação local e Jira

---
name: jira-workflow
description: Gestão de tickets, hierarquia de demandas no Jira e documentação local em Markdown.
---

# 📝 Gestão de Demanda (Tickets & Jira)

## 📂 Hierarquia de Pastas

1. **Épico:** `documentacao/analises/jira/{NomeDoEpico}/{NomeDoEpico}.md`
2. **Parciais (Task):** `documentacao/analises/jira/{NomeDoEpico}/{NomeParcial}.md`
3. **Subtasks:** Dentro da pasta da Parcial ou do Épico correspondente.

## 📋 Fluxo de Criação

- Só criar no Jira (via MCP) se solicitado manualmente.
- Se o ticket já existir, incluir o Link no topo do arquivo `.md`.
- Sempre perguntar em qual **Board** o ticket deve ser criado.

## 📄 Template de Ticket

```markdown
[SISTEMA] Descrição do ticket
Link Jira: [Link]

Razão do ticket:
- [Motivo e impacto]

Definition of Done:
- [Critérios de aceitação]

História:
COMO [quem] QUERO [o que] PARA [por que]

Cenários (BDD):
Número - Descrição
COMO [quem] DADO QUE [condição] QUANDO [ação] ENTÃO [resultado]

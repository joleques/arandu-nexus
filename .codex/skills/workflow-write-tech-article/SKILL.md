---
name: workflow-write-tech-article
description: Orquestra researcher, engineering-writer e engineering-writer-revisor (com social-media-psychology condicional) para produzir artigo/post com revisão iterativa.
---

# Workflow Skill: Write Tech Article

Use quando o usuário pedir "escrever artigo", "write-tech-article" ou mencionar `/write-tech-article`.

## Compatibilidade Codex
- Substitua `read_url_content` por navegação web via `web.search_query` + `web.open`.
- Sem `notify_user`; retorno final no chat com status, arquivos e próximos passos.

## Fluxo
1. Coletar parâmetros: tema, descrição, formato (LinkedIn|médio|aprofundado; default médio), plataforma visual.
2. Criar estrutura: `artigos/{titulo-slug}/content`, `search`, `image`.
3. Rodar `researcher` para referências; usuário escolhe links.
4. Ler links escolhidos com `web.open` e preparar contexto técnico.
5. Se formato for rede social, rodar `social-media-psychology` (consulta).
6. Rodar `engineering-writer`.
7. Rodar `engineering-writer-revisor` com loop de correção (max 5).
8. Se rede social e revisão técnica aprovada, rodar `social-media-psychology` (revisão final).
9. Salvar artigo e revisões em `content/`.
10. Opcional: se usuário quiser material visual, rodar `designer` em `image/`.

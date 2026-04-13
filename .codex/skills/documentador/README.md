# 📝 Documentador RAG

**Skill para converter dados não estruturados em documentos Markdown canônicos** preparados para ingestão em Base Vetorial com chunking semântico.

## Para que serve?

Esta skill instrui o agente a atuar como **produtor de base de conhecimento** em uma Fábrica de Agentes. Ele converte entradas não estruturadas (áudios, notas, JSONs, Swagger, documentos técnicos) em documentos Markdown determinísticos e RAG-ready.

> **Importante:** Este agente NÃO responde perguntas. Ele PRODUZ conhecimento para ingestão.

## Estrutura do Documento Gerado

1. **Bloco YAML** — Metadados (título, categoria, tags, entidades-chave)
2. **Visão Geral (Teoria)** — Conceitos, objetivos, papel no sistema (máx. 400 palavras)
3. **Fundamentos e Regras (Teoria)** — Definições formais, regras de negócio abstratas
4. **Detalhamento e Implementação (Prática)** — Parâmetros, tabelas, exemplos de código
5. **Comportamento e Exceções (Prática)** — Cenários de erro, limites, fallbacks

## Princípios

- **Proibido resumir** — Fidelidade total ao input, sem omissões
- **Autossuficiência de chunk** — Cada seção `###` compreensível isoladamente
- **Determinismo** — Sem inferências ou opiniões não explicitadas no input
- **Separação teoria/prática** — Estrutural, não semântica

## Quando usar?

- Para converter documentação técnica em formato RAG-ready
- Para processar transcrições de áudio/reuniões em base de conhecimento
- Para estruturar APIs/Swagger em documentos canônicos
- Usado no workflow `/doc-produto` (modo rápido) junto com a skill `documentador_revisor`

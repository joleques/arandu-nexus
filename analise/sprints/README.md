# Sprints do MVP

## Objetivo

Esta pasta organiza o plano operacional de entrega do MVP em versões incrementais.

Ela existe para servir como base de execução futura por agente de IA ou por desenvolvimento humano assistido, reduzindo ambiguidade sobre escopo, sequência, dependências, critérios de aceite e encerramento de cada etapa.

## Como Usar

Antes de iniciar qualquer implementação, o agente deve ler nesta ordem:

1. `AGENTS.md`
2. `documentacao/project-context.md`
3. este arquivo
4. o `README.md` da versão que será trabalhada
5. `tarefas.md`, `validacao.md` e `review.md` da mesma versão

## Regras de Uso

1. Cada versão representa um marco funcional do MVP.
2. O agente não deve executar versões fora de ordem sem justificar dependências já atendidas.
3. Cada versão possui escopo incluído, escopo excluído, critérios de aceite e definição de review.
4. Nenhuma versão deve ser considerada concluída sem review final.
5. Se o review apontar objetivo não atingido, a próxima versão não deve começar automaticamente.

## Estrutura

- `v0-fundacao`
  Base operacional do projeto para permitir implementação real com segurança.
- `v1-boards-e-canvas`
  Primeira entrega funcional visível: board persistido com canvas editável.
- `v2-comentarios-e-snapshots`
  Evolução do board com comentários ancorados e versionamento simples.
- `v3-templates-export-e-hardening`
  Fechamento do MVP com aceleração de uso, export e robustez mínima.

## Fechamento Obrigatório por Versão

Cada pasta de versão contém um `review.md`.

Esse review deve ser executado ao final da implementação da versão para responder, no mínimo:

1. O objetivo da versão foi atingido?
2. Quais critérios de aceite foram comprovadamente atendidos?
3. O que ficou incompleto, frágil ou divergente?
4. Se o objetivo não foi atingido, por quê?
5. Os objetivos da versão continuam corretos ou precisam ser revistos?
6. A próxima versão pode começar sem criar dívida estrutural perigosa?

## Convenção Recomendada para Execução

Para cada versão:

1. Ler o `README.md` da versão.
2. Transformar o conteúdo em plano de implementação aprovado pelo usuário, quando houver mudança real de código.
3. Executar as tarefas na ordem sugerida, ajustando apenas quando houver motivo técnico claro.
4. Rodar validações previstas.
5. Preencher o review da versão.
6. Só então avançar para a próxima.

## Observação Importante

Este material é subordinado ao contexto canônico definido em `documentacao/project-context.md`.

Se houver divergência entre uma sprint e o contexto oficial do projeto, a divergência deve ser resolvida antes da implementação.

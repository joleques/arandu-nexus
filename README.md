# Arandu Nexus

Arandu Nexus e um workspace visual para raciocinio arquitetural. A proposta do MVP e simples: sair da planilha com glamour acidental e colocar a discussao tecnica num canvas persistido, com fluidez de quadro branco e contexto suficiente para retomar o trabalho depois.

![Capa do Arandu Nexus](documentacao/images/capa.png)

## O que o MVP entrega

- Criacao e listagem de boards persistidos em MongoDB
- Entrada direta no canvas apos criar um board
- Canvas livre com zoom, pan e autosave do documento atual
- Biblioteca lateral com elementos, fluxos e imagens para diagramacao
- Mindmap estrutural com topico central, filhos, irmaos e reorganizacao
- Colapso e expansao de ramos com controles contextuais no proprio no
- Edicao do titulo do board com persistencia
- Feedback visual de carregamento para criar, abrir e voltar entre telas

## Como a experiencia aparece hoje

O produto abre com uma area de boards que funciona como biblioteca e ponto de entrada do workspace. Dali, o usuario cria um board, entra no canvas e segue montando o diagrama sem comecar do zero. Dentro do board, pode diagramar livremente, iniciar um mindmap pela biblioteca de elementos e expandir a arvore direto pelos controles contextuais dos nos.

![Workspace do board](documentacao/images/board.png)

## Stack do MVP

- Next.js 15
- React 19
- TypeScript
- MongoDB
- tldraw
- Vitest
- ESLint

## Rodando localmente

O caminho recomendado para testar o MVP e usar o Dev Container ja configurado no repositorio. O ambiente sobe a aplicacao e o MongoDB com a configuracao esperada para desenvolvimento local.

O passo a passo completo esta em [documentacao/get-started.md](documentacao/get-started.md).

## Comandos uteis

### npm

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run test`

### make

- `make install`
- `make dev`
- `make lint`
- `make test`
- `make build`
- `make check`

## Contexto do projeto

O contexto oficial do MVP, escopo atual e proximas etapas estao centralizados em [documentacao/project-context.md](documentacao/project-context.md). Neste momento, o MVP considerado entregue vai ate a `V3`, com `V4` e `V5` mantidas como proximas etapas possiveis fora do escopo atual.

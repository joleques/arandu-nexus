# Plano MVP V1 - Arandu Nexus (Single User, Devcontainer First)

## 1. Contexto e decisão atual

Este plano substitui a versão anterior que incluía colaboração multiusuário em tempo real.

Decisões confirmadas:

1. MVP será **single user**.
2. Foco em **web app**.
3. Stack base: **Next.js + React + TypeScript**.
4. Banco priorizado: **MongoDB**.
5. Ambiente de desenvolvimento obrigatório via **Dev Container**.
6. Antes da implementação funcional, será integrada governança de execução com **skills** e **AGENTS.md**.
7. Colaboração multiusuário, presença e permissões por usuário ficam para fase futura.

## 2. Objetivo do MVP

Entregar uma versão utilizável para validar o valor central do produto: desenhar e evoluir arquitetura de software com fluidez de quadro branco, com persistência e retomada do raciocínio.

O MVP precisa permitir:

1. Criar e editar boards.
2. Usar canvas livre com elementos básicos.
3. Registrar comentários ancorados em elementos.
4. Salvar snapshots nomeados e restaurar versões.
5. Aplicar templates básicos.
6. Exportar board como imagem.

## 3. Escopo funcional

### 3.1 Incluído no MVP

1. Canvas infinito com zoom/pan.
2. Elementos: retângulo, seta, texto, caneta, post-it.
3. Comentários ancorados em shape (thread simples).
4. Snapshots:
   - salvar estado atual;
   - nomear versão;
   - listar histórico;
   - restaurar snapshot.
5. Templates:
   - blank;
   - basic-flow;
   - frontend-backend-db.
6. Export do canvas para imagem (PNG).

### 3.2 Fora do MVP

1. Edição simultânea entre múltiplos usuários.
2. Presença/cursor em tempo real.
3. Conflitos de edição concorrente.
4. Compartilhamento com permissões (viewer/editor/owner).
5. SSO, RBAC avançado, auditoria completa.
6. IA copiloto e integrações externas (Jira, GitHub, Notion).

## 4. Arquitetura técnica (MVP)

## 4.1 Serviços

1. `web`:
   - Next.js (App Router), React, TypeScript;
   - UI do canvas e fluxos de board.
2. `api`:
   - Node.js + TypeScript (pode ser rotas internas do Next no início, desde que separadas por domínio);
   - endpoints para boards, comments, snapshots e templates.
3. `mongo`:
   - persistência principal de metadados e conteúdo serializado.

## 4.2 Modelo de dados mínimo

1. `Board`
   - `id`, `title`, `createdAt`, `updatedAt`
   - `currentDocument` (estado atual serializado do canvas)
   - `metadata` opcional (zoom inicial, preferências)
2. `Snapshot`
   - `id`, `boardId`, `name`, `documentState`, `createdAt`
3. `CommentThread`
   - `id`, `boardId`, `shapeId`, `createdAt`, `resolvedAt?`
4. `Comment`
   - `id`, `threadId`, `content`, `createdAt`
5. `Template`
   - `id`, `name`, `documentSeed`, `createdAt`

## 4.3 Contratos de API mínimos

1. Boards
   - `POST /boards`
   - `GET /boards/:id`
   - `PATCH /boards/:id`
2. Comments
   - `GET /boards/:id/comments`
   - `POST /boards/:id/comments`
   - `POST /comment-threads/:id/replies`
   - `PATCH /comment-threads/:id/resolve`
3. Snapshots
   - `GET /boards/:id/snapshots`
   - `POST /boards/:id/snapshots`
   - `POST /snapshots/:id/restore`
4. Templates
   - `GET /templates`
   - `POST /boards/:id/apply-template`

## 5. Fase 0 obrigatória (antes de qualquer feature)

Objetivo: garantir ambiente consistente e governança de execução para trabalho do projeto e de agentes.

## 5.1 Devcontainer

Entregas:

1. `.devcontainer/devcontainer.json`
2. `.devcontainer/Dockerfile`
3. `docker-compose` para app + mongo
4. Scripts de bootstrap:
   - install
   - dev
   - test
   - lint

Critérios de aceite:

1. Projeto abre no container e sobe com 1 comando.
2. Mongo disponível no host interno do container.
3. Hot reload funcionando.
4. Testes executam dentro do container.

## 5.2 Governança com AGENTS.md e skills

Entregas:

1. `AGENTS.md` na raiz com:
   - objetivos do projeto;
   - regras de decisão técnica;
   - definição de pronto;
   - padrões de commit/PR;
   - fluxo de uso das skills.
2. Registro de skills que serão adicionadas:
   - nome;
   - propósito;
   - quando usar;
   - entradas/saídas esperadas.
3. Playbook de execução no contexto deste repositório.

Critérios de aceite:

1. Um novo chat dentro do devcontainer consegue iniciar trabalho sem contexto externo.
2. Regras e fluxo de execução estão explícitos e não ambíguos.

## 6. Plano de implementação por etapas

## Etapa 1 - Fundação de domínio

1. Criar estrutura de módulos:
   - boards
   - comments
   - snapshots
   - templates
2. Implementar CRUD básico de board.
3. Persistir documento atual do canvas no board.

Saída esperada: board criado, recuperado e atualizado com estado serializado.

## Etapa 2 - Canvas e elementos

1. Integrar editor base (tldraw) ao fluxo de board.
2. Habilitar ferramentas essenciais do MVP.
3. Conectar save/load com API.

Saída esperada: usuário desenha, recarrega página e estado persiste.

## Etapa 3 - Comentários ancorados

1. Criar thread vinculada a `shapeId`.
2. Adicionar respostas em thread.
3. Marcar thread como resolvida.

Saída esperada: comentários seguem o elemento correto e permanecem após reload.

## Etapa 4 - Snapshots

1. Salvar snapshot nomeado do estado atual.
2. Listar snapshots por board.
3. Restaurar snapshot para estado atual.

Saída esperada: restaurar snapshot reproduz exatamente versão salva.

## Etapa 5 - Templates e export

1. Disponibilizar templates mínimos.
2. Aplicar template na criação ou em board vazio.
3. Exportar canvas para PNG.

Saída esperada: usuário inicia por template e consegue exportar imagem final.

## Etapa 6 - Hardening

1. Cobertura mínima de testes.
2. Tratamento de erros e validações.
3. Observabilidade básica (logs e métricas simples).

Saída esperada: fluxo principal robusto para validação com usuários.

## 7. Testes e critérios de aceite (MVP)

## 7.1 Fluxo principal E2E

1. Criar board.
2. Desenhar elementos.
3. Adicionar comentários.
4. Salvar snapshot.
5. Alterar board.
6. Restaurar snapshot.
7. Exportar imagem.

Resultado esperado: sem perda de estado em nenhuma etapa.

## 7.2 Integração API

1. Boards: criação, leitura, atualização.
2. Comments: criar thread, responder, resolver.
3. Snapshots: criar, listar, restaurar.
4. Templates: listar e aplicar.

Resultado esperado: contratos estáveis e respostas coerentes.

## 7.3 Unitário (mínimo)

1. Serialização/deserialização de estado.
2. Regras de snapshot.
3. Regras de ancoragem de comentários.
4. Regras de aplicação de template.

Resultado esperado: regras de domínio cobertas.

## 8. Riscos e mitigação

1. Escopo crescer antes de validar:
   - mitigação: bloquear itens fora de MVP.
2. Complexidade de editor:
   - mitigação: priorizar integração simples e evitar customizações profundas cedo.
3. Perda de contexto em novos chats:
   - mitigação: AGENTS.md completo + este plano como fonte de verdade.

## 9. Definição de pronto (MVP)

MVP é considerado pronto quando:

1. Funciona integralmente dentro do devcontainer.
2. Fluxo principal E2E passa.
3. Testes mínimos de domínio e integração passam.
4. Não há dependência de colaboração multiusuário.
5. Projeto está documentado para continuidade em novo chat sem contexto adicional.

## 10. Assumptions registradas

1. Sem autenticação obrigatória nesta fase.
2. Single user local/remoto é suficiente para validar valor do produto.
3. MongoDB atende v1 sem necessidade de particionamento.
4. Evolução para multiusuário será feita após validação de uso do núcleo single user.

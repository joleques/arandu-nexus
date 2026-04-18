# Project Context

## Visão Geral

Este projeto implementa o Arandu Nexus, uma aplicação web de whiteboard voltada para discussões e evolução de arquitetura de software.

O objetivo do produto é permitir que times desenhem, organizem e retomem raciocínios arquiteturais com fluidez de quadro branco, preservando contexto suficiente para continuidade posterior.

## Origem do Nome

O nome `Arandu` foi adotado por sua origem indigena e por sua proximidade com sentidos recorrentes como `sabedoria`, `conhecimento` e `entendimento`, especialmente em referencias ligadas ao guarani e ao universo tupi-guarani. Ha variacoes de formulacao entre fontes e contextos, o que exige algum cuidado para nao tratar etimologia como slogan com fantasia academica. Ainda assim, o nucleo de significado associado ao termo permanece coerente.

Essa escolha dialoga com a proposta central do produto. O Arandu Nexus existe para ajudar conhecimento tecnico a ganhar forma visual, contexto e continuidade, permitindo que raciocinios arquiteturais nao se percam entre memoria informal, screenshots soltos e interpretacoes tardias. O nome, portanto, nao funciona apenas como identidade; ele tambem resume a intencao do projeto.

## Fonte de Contexto Atual

Este arquivo é a fonte canônica de contexto do projeto para conversas recorrentes no repositório.

As informações aqui consolidam o entendimento vigente a partir dos artefatos de análise existentes em `/workspace/analise` e do estado atual da implementação.

## Decisões Confirmadas do MVP

1. O MVP atual será **single user**.
2. O foco inicial será **web app**.
3. A arquitetura de aplicação do MVP será **monólito modular em Next.js**.
4. A stack base será **Next.js + React + TypeScript**.
5. O banco priorizado para a v1 será **MongoDB**.
6. O ambiente de desenvolvimento deve funcionar via **Dev Container**.
7. Colaboração multiusuário, presença em tempo real e permissões avançadas ficam fora do MVP.

## Valor Central a Validar

O MVP deve validar se a aplicação consegue reproduzir a fluidez de um quadro branco para raciocínio técnico, com persistência suficiente para que o usuário retome a discussão depois.

## Escopo Atual do MVP

### Incluído

1. Criar e editar boards.
2. Canvas livre com zoom e pan.
3. Elementos básicos de desenho.
4. Mindmap estrutural com tópico central, filhos e irmãos.
5. Reorganização automática básica do mindmap por árvore.
6. Colapso e expansão de ramos do mindmap.
7. Controles contextuais no nó para adicionar e remover tópicos.
8. Feedback visual de carregamento para ações mais lentas de navegação e criação.

### Fora do Escopo Atual

1. Multiusuário em tempo real.
2. Cursores visíveis e presença.
3. Compartilhamento com permissões por usuário.
4. SSO e RBAC avançado.
5. IA copiloto.
6. Integrações externas como Jira, GitHub, Notion e Confluence.
7. Comentários ancorados em elementos.
8. Snapshots nomeados com restauração.
9. Templates básicos.
10. Exportação do board em imagem PNG.

## Direção Técnica Atual

### Arquitetura

O MVP será construído como **monólito modular em Next.js**.

Isso significa:

1. A aplicação web é implementada em Next.js.
2. A API inicial fica no mesmo projeto, com separação por domínio e responsabilidade.
3. Os módulos ativos nesta fase são:
   - boards
4. O armazenamento principal é MongoDB.
5. O canvas está integrado com `tldraw`.
6. O mindmap atual é implementado dentro do módulo `boards`, usando metadados estruturais e conexões derivadas no próprio canvas.

### Persistência Inicial

A v1 persiste o `currentDocument` do board como snapshot serializado do canvas. Essa decisão mantém a complexidade controlada no MVP e atende o fluxo principal atual.

## Etapa Atual de Implementação

O projeto está com o **MVP atual entregue até a V3**, consolidando:

1. `v1-boards-e-canvas`
2. `v2-mindmap-estrutural`
3. `v3-mindmap-interacoes-e-refino`

Estado atual observado no repositório:

1. Existe fluxo para criar boards e abrir um board individual.
2. Existe persistência Mongo para boards.
3. Existe integração de canvas com autosave do documento atual.
4. Existe biblioteca lateral com elementos, fluxos, imagens e ponto de entrada para `Mindmap`.
5. Existe mindmap estrutural com criação de tópico central, filho e irmão.
6. Existe colapso e expansão de ramos do mindmap.
7. Existem controles contextuais `+` e `-` no nó para expandir ou remover ramos.
8. Existe feedback visual de carregamento para criar board, abrir workspace e voltar para a listagem.
9. Existe `.env.local` para subir a aplicação no Dev Container sem configuração manual extra.
10. Existe `Makefile` com comandos de instalação, execução, validação e build.
11. Existe base de testes unitários cobrindo configuração e regras principais do módulo `boards`.

## Próximas Etapas Possíveis

As próximas etapas candidatas, fora do escopo atual do MVP, permanecem:

1. `v4-comentarios-e-snapshots`
2. `v5-templates-export-e-hardening`

Essas versões continuam documentadas em `/workspace/analise/sprints`, mas serão avaliadas depois e não fazem parte do fechamento atual do MVP.

## Observações de Governança

1. Em caso de divergência entre este arquivo e artefatos de análise antigos, este arquivo deve refletir a decisão vigente mais recente.
2. Se uma decisão estrutural do MVP mudar, este arquivo deve ser atualizado junto com o plano correspondente.
3. Quando a implementação evoluir, o código em `src/` continua sendo a fonte de verdade da implementação corrente, sem revogar este arquivo como fonte de contexto do projeto.

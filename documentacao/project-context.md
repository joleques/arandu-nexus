# Project Context

## Visão Geral

Este projeto implementa o Arandu Nexus, uma aplicação web de whiteboard voltada para discussões e evolução de arquitetura de software.

O objetivo do produto é permitir que times desenhem, organizem e retomem raciocínios arquiteturais com fluidez de quadro branco, preservando contexto suficiente para continuidade posterior.

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
4. Comentários ancorados em elementos.
5. Snapshots nomeados com restauração.
6. Templates básicos.
7. Exportação do board em imagem PNG.

### Fora do Escopo Atual

1. Multiusuário em tempo real.
2. Cursores visíveis e presença.
3. Compartilhamento com permissões por usuário.
4. SSO e RBAC avançado.
5. IA copiloto.
6. Integrações externas como Jira, GitHub, Notion e Confluence.

## Direção Técnica Atual

### Arquitetura

O MVP será construído como **monólito modular em Next.js**.

Isso significa:

1. A aplicação web é implementada em Next.js.
2. A API inicial fica no mesmo projeto, com separação por domínio e responsabilidade.
3. Os módulos ativos nesta fase são:
   - boards
   - comments
   - snapshots
   - templates
4. O armazenamento principal é MongoDB.
5. O canvas da v1 está integrado com `tldraw`.

### Persistência Inicial

A v1 persiste o `currentDocument` do board como snapshot serializado do canvas. Essa decisão mantém a complexidade controlada no MVP e atende o fluxo principal atual.

## Etapa Atual de Implementação

O projeto está com a **v1-boards-e-canvas implementada** e teve o roadmap operacional repriorizado para iniciar a `v2-mindmap-estrutural`.

Estado atual observado no repositório:

1. Existe fluxo para criar boards e abrir um board individual.
2. Existe persistência Mongo para boards.
3. Existe integração de canvas com autosave do documento atual.
4. Existe `.env.local` para subir a aplicação no Dev Container sem configuração manual extra.
5. Existe `Makefile` com comandos de instalação, execução, validação e build.
6. Existe base de testes unitários cobrindo configuração e regras principais do módulo `boards`.

## Próxima Etapa Recomendada

A próxima etapa é implementar a `v2-mindmap-estrutural`.

Prioridades imediatas:

1. introduzir estrutura pai-filho real para o mindmap dentro do board;
2. implementar criação de tópico central, filho e irmão com semântica explícita;
3. recalcular layout e conexões do mapa a partir da árvore;
4. proteger essas regras com testes de unidade antes de avançar para `v3-mindmap-interacoes-e-refino`.

## Observações de Governança

1. Em caso de divergência entre este arquivo e artefatos de análise antigos, este arquivo deve refletir a decisão vigente mais recente.
2. Se uma decisão estrutural do MVP mudar, este arquivo deve ser atualizado junto com o plano correspondente.
3. Quando a implementação evoluir, o código em `src/` continua sendo a fonte de verdade da implementação corrente, sem revogar este arquivo como fonte de contexto do projeto.

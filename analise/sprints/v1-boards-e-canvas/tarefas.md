# Tarefas - V1 Boards e Canvas

## Sequencia Recomendada

1. Implementar o módulo de boards.
2. Expor contratos e rotas mínimas de board.
3. Integrar o editor/canvas.
4. Persistir e restaurar o estado atual.
5. Refinar o fluxo principal e a UX mínima.
6. Cobrir o comportamento com testes.

## Tarefas Detalhadas

### 1. Modelo de Board

- O que fazer: implementar entidade, contratos e operações mínimas de board.
- Onde mexer: módulo `boards`, camada de persistência e rotas.
- Resultado esperado: board pode ser criado, lido e atualizado.

### 2. Fluxo de Tela

- O que fazer: criar a entrada visual para listar/criar/abrir board, conforme a abordagem escolhida.
- Onde mexer: app router, páginas e componentes relacionados.
- Resultado esperado: usuário consegue entrar em um board real.

### 3. Integracao do Canvas

- O que fazer: acoplar o editor escolhido ao fluxo do board com mínimo de customização necessário.
- Onde mexer: componentes do canvas e integração com board.
- Resultado esperado: canvas funcional com ferramentas do MVP.

### 4. Persistencia do Documento Atual

- O que fazer: salvar e restaurar `currentDocument` do board.
- Onde mexer: módulo `boards`, serialização e camada de persistência.
- Resultado esperado: o estado atual retorna corretamente após reload.

### 5. Protecao por Testes

- O que fazer: criar testes unitários, de integração e validar o fluxo principal.
- Onde mexer: suíte de testes da aplicação.
- Resultado esperado: falhas de persistência e contrato são detectáveis.

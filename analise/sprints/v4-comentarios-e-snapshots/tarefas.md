# Tarefas - V4 Comentarios e Snapshots

## Sequencia Recomendada

1. Implementar modelo e contratos de comentários.
2. Implementar fluxo de UI para threads.
3. Implementar modelo e contratos de snapshots.
4. Implementar restauração de snapshot.
5. Proteger regras de domínio e integrações com testes.

## Tarefas Detalhadas

### 1. Comentarios Ancorados

- O que fazer: criar entidades, contratos e persistência para threads e replies vinculadas por `shapeId`.
- Onde mexer: módulo `comments`, API interna e componentes de UI associados.
- Resultado esperado: comentário permanece associado ao elemento correto.

### 2. Fluxo de Threads

- O que fazer: permitir criação, resposta e resolução de thread.
- Onde mexer: interface do board e serviços internos de comentários.
- Resultado esperado: threads simples e utilizáveis dentro do board.

### 3. Snapshots

- O que fazer: criar snapshots nomeados a partir do estado atual do board.
- Onde mexer: módulo `snapshots`, persistência e fluxos de UI.
- Resultado esperado: snapshots listáveis e recuperáveis.

### 4. Restauracao

- O que fazer: restaurar snapshot para o estado atual do board sem corromper o documento ativo.
- Onde mexer: integração entre `boards` e `snapshots`.
- Resultado esperado: restauração fiel e previsível.

### 5. Testes de Regras Criticas

- O que fazer: cobrir vínculo com shape, consistência de snapshot e restauração.
- Onde mexer: suíte de testes unitários e de integração.
- Resultado esperado: regressões principais ficam detectáveis.

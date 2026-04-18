# Tarefas - V2 Mindmap Estrutural

## Sequencia Recomendada

1. Definir o modelo estrutural do mindmap em regras puras.
2. Implementar builders e extratores de nós/conexões.
3. Implementar layout automático básico da árvore.
4. Integrar ações semânticas do mindmap ao canvas.
5. Cobrir comportamento crítico com testes unitários.

## Tarefas Detalhadas

### 1. Modelo Estrutural

- O que fazer: definir metadados do nó de mindmap com `parentId`, `branchSide`, `order` e tipo estrutural.
- Onde mexer: módulo `boards/application` dedicado ao mindmap.
- Resultado esperado: a árvore pode ser reconstruída a partir dos shapes persistidos.

### 2. Builders e Extratores

- O que fazer: criar builders para raiz, filho, irmão e conexões derivadas, além de extratores para ler nós do editor.
- Onde mexer: regras puras do mindmap.
- Resultado esperado: a criação de elementos passa a obedecer semântica de árvore.

### 3. Layout Basico

- O que fazer: calcular posicionamento por lado e profundidade, preservando distribuição previsível dos ramos.
- Onde mexer: módulo de layout do mindmap.
- Resultado esperado: reorganizar o mapa reposiciona os nós sem intervenção manual extensa.

### 4. Integracao no Canvas

- O que fazer: adicionar ações de tópico central, filho, irmão e reorganização na UI do board.
- Onde mexer: `board-canvas.tsx` e `board-canvas-layout.tsx`.
- Resultado esperado: o usuário opera o mindmap pelo significado da ação, não pelo tipo de shape.

### 5. Testes das Regras Criticas

- O que fazer: cobrir criação de raiz, filho, irmão, layout e reconstrução de conexões.
- Onde mexer: suíte de testes unitários do módulo `boards`.
- Resultado esperado: regressões centrais do mindmap ficam detectáveis.

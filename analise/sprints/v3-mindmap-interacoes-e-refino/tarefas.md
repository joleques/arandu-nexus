# Tarefas - V3 Mindmap Interacoes e Refino

## Sequencia Recomendada

1. Implementar estado de colapso dos ramos.
2. Refinar o algoritmo de layout.
3. Adicionar atalhos e operações contextuais principais.
4. Melhorar feedback da UI do board para o modo mindmap.
5. Proteger as novas regras com testes.

## Tarefas Detalhadas

### 1. Colapso de Ramos

- O que fazer: permitir recolher e expandir subárvores.
- Onde mexer: módulo de regras do mindmap e UI do board.
- Resultado esperado: mapas grandes ficam mais legíveis.

### 2. Layout Refinado

- O que fazer: melhorar distribuição de ramos e estabilidade visual.
- Onde mexer: algoritmo de layout do mindmap.
- Resultado esperado: a árvore ganha leitura melhor sem perda de previsibilidade.

### 3. Atalhos e Operacoes Contextuais

- O que fazer: introduzir ações rápidas para crescimento estrutural do mapa.
- Onde mexer: integração do canvas com o editor.
- Resultado esperado: o uso fica menos dependente do painel lateral.

### 4. Feedback da UI

- O que fazer: tornar o estado do mindmap mais claro para o usuário.
- Onde mexer: layout do board, hints e elementos de orientação.
- Resultado esperado: a interface guia melhor o uso do mapa.

### 5. Testes das Regras Criticas

- O que fazer: cobrir colapso, expansão, reorganização refinada e novas interações.
- Onde mexer: suíte de testes do módulo `boards`.
- Resultado esperado: a evolução não degrada a integridade estrutural.

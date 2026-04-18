# Tarefas - V5 Templates, Export e Hardening

## Sequencia Recomendada

1. Implementar templates mínimos.
2. Implementar aplicação de template.
3. Implementar export para PNG.
4. Reforçar validações e tratamento de erro.
5. Adicionar observabilidade mínima.
6. Executar revisão final do fluxo principal.

## Tarefas Detalhadas

### 1. Templates

- O que fazer: definir templates iniciais do MVP e seus documentos seed.
- Onde mexer: módulo `templates`, persistência e UI associada.
- Resultado esperado: usuário pode iniciar com base útil e previsível.

### 2. Aplicacao de Template

- O que fazer: permitir aplicar template em contexto apropriado.
- Onde mexer: integração entre `templates` e `boards`.
- Resultado esperado: template gera estado inicial correto do board.

### 3. Export para PNG

- O que fazer: exportar o estado atual do board como imagem.
- Onde mexer: UI do canvas e mecanismo de export.
- Resultado esperado: imagem exportada representa o board de forma útil.

### 4. Hardening

- O que fazer: revisar erros, validações e mensagens essenciais do fluxo principal.
- Onde mexer: módulos principais, API interna e interface.
- Resultado esperado: menor fragilidade em cenários previsíveis do MVP.

### 5. Observabilidade Minima

- O que fazer: adicionar logs e sinais básicos para diagnóstico.
- Onde mexer: pontos críticos da aplicação.
- Resultado esperado: falhas principais ficam rastreáveis sem inflar demais o projeto.

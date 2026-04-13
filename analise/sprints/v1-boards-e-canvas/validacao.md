# Validacao - V1 Boards e Canvas

## Testes Esperados

1. Testes unitários do módulo `boards`.
2. Testes de integração de criação, leitura e atualização de board.
3. Teste cobrindo serialização e restauração do documento atual.
4. Se a stack permitir, teste E2E do fluxo básico de abrir board e recarregar estado.

## Validacoes Manuais

1. Criar um board novo.
2. Desenhar no canvas.
3. Atualizar ou recarregar a página.
4. Confirmar que o estado foi preservado.

## Criterios Minimos de Robustez

1. O fluxo principal não perde estado em cenário simples.
2. O board não depende de hacks para salvar.
3. A solução ainda é compatível com futuras features de snapshots e comentários.

## Riscos a Observar na Validacao

1. Persistência excessiva em eventos errados.
2. Estado do editor incompatível com restauração confiável.
3. UI funcional, mas sem contrato estável com o backend interno.

# Validacao - V4 Comentarios e Snapshots

## Testes Esperados

1. Testes unitários para regras de ancoragem de comentários.
2. Testes unitários para criação e restauração de snapshots.
3. Testes de integração para criar thread, responder e resolver.
4. Testes de integração para criar, listar e restaurar snapshot.

## Validacoes Manuais

1. Criar comentário em shape específico.
2. Recarregar o board e confirmar persistência.
3. Criar snapshot nomeado.
4. Alterar o board.
5. Restaurar snapshot e validar fidelidade do estado.

## Criterios Minimos de Robustez

1. Comentários não se perdem em cenários simples.
2. Snapshots não sobrescrevem estado incorretamente.
3. O vínculo com shapes é estável o suficiente para o MVP.

## Riscos a Observar na Validacao

1. Comentário apontando para shape inexistente.
2. Snapshot restaurado parcialmente.
3. Inconsistência entre estado exibido e estado persistido.

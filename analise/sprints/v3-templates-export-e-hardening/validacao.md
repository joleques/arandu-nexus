# Validacao - V3 Templates, Export e Hardening

## Testes Esperados

1. Testes unitários para aplicação de template.
2. Testes de integração para fluxos de template e export, quando viável.
3. Regressão do fluxo principal completo do MVP.
4. Testes dos comportamentos críticos de erro e validação.

## Validacoes Manuais

1. Criar board a partir de template ou aplicar template em board vazio.
2. Confirmar que o estado criado é coerente.
3. Exportar o board em PNG.
4. Validar fluxo completo: criar board, editar, comentar, snapshot, restaurar e exportar.

## Criterios Minimos de Robustez

1. O fluxo principal do MVP continua estável após a adição de templates e export.
2. Falhas previsíveis são tratadas de forma inteligível.
3. Existe sinal mínimo para diagnóstico de falhas críticas.

## Riscos a Observar na Validacao

1. Exportar conteúdo incompleto ou incorreto.
2. Template causar sobrescrita inadequada.
3. Hardening insuficiente para suportar validação com usuário real.

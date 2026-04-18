# V4 - Comentarios e Snapshots

## Objetivo da Versao

Expandir o board básico para suportar raciocínio contínuo e revisão do trabalho, adicionando comentários ancorados em elementos do canvas e snapshots nomeados com restauração.

Esta versão transforma o board de um desenho persistido em um espaço de trabalho mais útil para análise técnica e evolução de ideias.

## Problema que Esta Versao Resolve

O usuário não quer apenas desenhar; ele precisa registrar observações e preservar versões significativas do raciocínio.

Sem comentários e snapshots, o produto continua útil, mas ainda fraco para sustentar iteração técnica com contexto.

## Valor Entregue

1. Comentários podem ser associados a shapes específicos.
2. Threads simples permitem continuidade de discussão local.
3. Snapshots preservam momentos importantes do board.
4. O usuário consegue restaurar um estado anterior com clareza.

## Escopo Incluido

1. Criação de threads ancoradas por `shapeId`.
2. Respostas em thread.
3. Resolução de thread.
4. Criação de snapshots nomeados.
5. Listagem de snapshots por board.
6. Restauração de snapshot para o estado atual.

## Escopo Excluido

1. Compartilhamento entre múltiplos usuários.
2. Permissões.
3. Histórico avançado temporal.
4. Decisões arquiteturais estruturadas.
5. Busca semântica ou memória avançada.

## Dependencias

1. O fluxo de board e canvas da V1 deve estar estável.
2. A persistência do documento atual precisa ser confiável.
3. A integração com elementos do canvas deve permitir referência por `shapeId` de forma estável.

## Impacto Esperado na Arquitetura

1. Consolidação dos módulos `comments` e `snapshots`.
2. Expansão do modelo de board sem romper a simplicidade do MVP.
3. Introdução de regras de domínio ligadas ao estado do canvas.

## Criterios de Aceite

1. É possível criar comentário vinculado a um shape.
2. É possível responder e resolver uma thread.
3. Comentários permanecem associados corretamente após reload.
4. É possível criar snapshot nomeado.
5. É possível listar snapshots de um board.
6. Restaurar um snapshot reproduz o estado salvo com fidelidade suficiente.
7. O comportamento é protegido por testes relevantes.

## Sinais de Pronto

1. O board já suporta continuidade de raciocínio com contexto localizado.
2. Há mecanismo simples de versionamento útil para revisão.
3. O produto fica mais próximo da proposta de preservar discussão técnica.

## Riscos Principais

1. `shapeId` instável entre versões do documento.
2. Restauração de snapshot com efeito colateral inesperado.
3. Comentários órfãos após mudanças no canvas.
4. Complexidade crescente sem proteção suficiente por testes.

## Review Obrigatorio

Ao final desta versão, deve ser executado o `review.md` para confirmar se comentários e snapshots realmente aumentam a capacidade de evolução do board sem fragilizar o fluxo principal.

Se o objetivo não for atingido, o review deve apontar se o problema está na estratégia de vínculo com shapes, na restauração de versões ou na definição do próprio objetivo da versão.

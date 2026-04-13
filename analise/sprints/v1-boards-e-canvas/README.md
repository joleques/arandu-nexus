# V1 - Boards e Canvas

## Objetivo da Versao

Entregar a primeira experiência funcional central do produto: criar um board, abrir esse board, editar um canvas básico e persistir o estado atual para retomada posterior.

Esta é a versão que começa a provar o valor principal do MVP. Sem ela, existe projeto; com ela, começa a existir produto.

## Problema que Esta Versao Resolve

O usuário precisa de um espaço persistente onde possa iniciar um raciocínio visual, editar elementos básicos e voltar depois sem perder o trabalho.

Sem isso, ainda não existe validação real do núcleo do produto.

## Valor Entregue

1. O usuário pode criar um board.
2. O usuário pode desenhar no canvas com ferramentas essenciais.
3. O estado do board é persistido.
4. Ao recarregar ou reabrir, o board retorna no estado salvo.

## Escopo Incluido

1. CRUD básico mínimo de boards com foco em criação, leitura e atualização.
2. Tela ou fluxo de abertura de board.
3. Integração inicial com o editor/canvas escolhido.
4. Ferramentas essenciais do MVP.
5. Persistência do documento atual serializado no board.
6. Carregamento e salvamento do estado do canvas.

## Escopo Excluido

1. Comentários ancorados.
2. Snapshots nomeados.
3. Templates.
4. Export de imagem.
5. Multiusuário.

## Dependencias

1. A fundação da versão anterior deve estar funcional.
2. A estratégia de persistência precisa estar operacional.
3. A integração com o editor não deve introduzir customização prematura excessiva.

## Impacto Esperado na Arquitetura

1. Consolidação do módulo `boards`.
2. Introdução concreta da fronteira entre UI do canvas e persistência do documento.
3. Primeira versão real dos contratos internos de board.

## Criterios de Aceite

1. É possível criar um board.
2. É possível abrir um board existente.
3. O usuário consegue desenhar com ferramentas básicas previstas no MVP.
4. O estado salvo é restaurado corretamente após recarga.
5. Não há perda de dados no fluxo principal.
6. O comportamento é protegido por testes relevantes.

## Sinais de Pronto

1. O produto já demonstra o núcleo de valor do Arandu Nexus.
2. Existe um fluxo funcional completo de board básico.
3. O time consegue testar persistência real do canvas.

## Riscos Principais

1. Acoplamento excessivo ao editor.
2. Persistência frágil do estado serializado.
3. Fluxo de salvamento inconsistente.
4. Complexidade de integração maior que o necessário para o MVP.

## Review Obrigatorio

Ao final desta versão, deve ser executado o `review.md` para verificar se o fluxo central do produto realmente existe e se a persistência atende o objetivo do MVP.

Se o objetivo não for atingido, o review deve explicar se o problema está na integração do canvas, no modelo de board ou na definição de escopo da própria versão.

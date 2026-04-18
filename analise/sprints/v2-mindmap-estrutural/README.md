# V2 - Mindmap Estrutural

## Objetivo da Versao

Entregar um mindmap de verdade dentro do board, com estrutura pai-filho explícita, layout automático inicial e conexões derivadas da árvore.

Esta versão não tenta resolver toda a ergonomia do problema. Ela existe para sair do estágio "shape com esperança" e entrar no estágio "estrutura com comportamento".

## Problema que Esta Versao Resolve

O canvas livre atual é ótimo para desenho manual, mas fraco para raciocínio hierárquico quando o usuário quer expandir ideias por ramos.

Sem estrutura, o chamado mindmap vira só um agrupamento visual sem semântica, sem reordenação previsível e sem operação coerente.

## Valor Entregue

1. O usuário consegue criar uma ideia central e expandi-la em ramos reais.
2. Filhos e irmãos passam a existir como relações semânticas, não como decoração.
3. O layout da árvore pode ser recalculado sem redesenhar tudo manualmente.
4. As conexões passam a ser derivadas da estrutura do mindmap.

## Escopo Incluido

1. Criação de tópico central.
2. Criação de filho a partir de nó selecionado.
3. Criação de irmão a partir de nó selecionado.
4. Metadados estruturais no shape para representar pai, lado e ordem.
5. Layout automático básico por lado e ordem.
6. Reconstrução de conexões a partir da árvore.
7. Cobertura unitária das regras centrais.

## Escopo Excluido

1. Colapso e expansão de ramos.
2. Drag com reflow automático.
3. Atalhos avançados de teclado.
4. Templates de mindmap.
5. Persistência em modelo separado do snapshot do canvas.

## Dependencias

1. O fluxo de board e canvas da V1 deve estar estável.
2. O snapshot atual do board precisa continuar íntegro com shapes enriquecidos por `meta`.
3. O tldraw precisa permitir leitura e atualização consistente dos shapes do board atual.

## Impacto Esperado na Arquitetura

1. Introdução de um módulo de regras puras para o mindmap.
2. Expansão do board para suportar estrutura semântica além do canvas livre.
3. Reuso da persistência existente por snapshot, sem novo subsistema de armazenamento nesta etapa.

## Criterios de Aceite

1. É possível criar um tópico central.
2. É possível criar um filho do tópico selecionado.
3. É possível criar um irmão do tópico selecionado quando houver pai.
4. A reorganização do layout distribui os ramos de forma previsível.
5. As conexões do mindmap são reconstruídas a partir da estrutura.
6. O comportamento é protegido por testes unitários relevantes.

## Sinais de Pronto

1. O board já suporta mapa mental como estrutura, não apenas como desenho.
2. O usuário consegue crescer o raciocínio por árvore sem reposicionar tudo manualmente.
3. A base de código passa a ter regras explícitas para operar o mindmap.

## Riscos Principais

1. Estrutura em `meta` do shape ficar frágil demais para operações futuras.
2. Layout automático inicial parecer arbitrário ou instável.
3. Conexões derivadas não acompanharem todos os cenários de edição manual nesta primeira etapa.
4. A UI prometer mais do que o comportamento realmente sustenta.

## Review Obrigatorio

Ao final desta versão, deve ser executado o `review.md` para confirmar se o mindmap já existe como capacidade estrutural real ou se ainda está preso em ilusão visual.

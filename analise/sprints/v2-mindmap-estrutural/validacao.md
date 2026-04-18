# Validacao - V2 Mindmap Estrutural

## Testes Esperados

1. Testes unitários para criação de tópico central.
2. Testes unitários para criação de filho e irmão.
3. Testes unitários para layout da árvore.
4. Testes unitários para reconstrução de conexões.
5. Testes de render estático da UI do board com ações de mindmap.

## Validacoes Manuais

1. Criar um tópico central.
2. Selecionar a raiz e criar filhos.
3. Selecionar um filho e criar irmão.
4. Acionar reorganização do layout.
5. Confirmar que as conexões foram reconstruídas e que o snapshot continua persistindo.

## Criterios Minimos de Robustez

1. A árvore do mindmap pode ser reconstruída após reload do board.
2. A criação de nós respeita pai, lado e ordem.
3. O layout é previsível o suficiente para uso inicial.
4. O board segue funcional para o restante do fluxo já existente.

## Riscos a Observar na Validacao

1. Nó filho criado sem vínculo estrutural correto.
2. Ordem dos ramos instável após reorganização.
3. Conexões órfãs ou duplicadas depois de reorganizar.
4. Persistência do snapshot mantendo estado visual mas perdendo semântica.

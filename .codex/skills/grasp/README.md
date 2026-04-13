# 🎯 GRASP Patterns

**Skill de especialista nos 9 padrões GRASP** — General Responsibility Assignment Software Patterns, de Craig Larman.

## Para que serve?

Esta skill instrui o agente a analisar código sob a perspectiva de **atribuição de responsabilidades** em design OO. GRASP não são "patterns" no sentido GoF — são princípios de raciocínio para decidir **onde colocar cada responsabilidade**.

## Os 9 Padrões

| Padrão | Pergunta-Chave |
|--------|----------------|
| **Information Expert** | Quem tem os dados para executar isso? |
| **Creator** | Quem deve criar este objeto? |
| **Controller** | Quem recebe o evento do sistema? |
| **Low Coupling** | Como minimizar dependências entre classes? |
| **High Cohesion** | As responsabilidades desta classe são relacionadas? |
| **Polymorphism** | Comportamento varia por tipo? |
| **Pure Fabrication** | Nenhuma classe de domínio serve? Invente uma. |
| **Indirection** | Preciso desacoplar A de B? Adicione intermediário. |
| **Protected Variations** | Há ponto de variação conhecido? Proteja com interface. |

## Quando usar?

- Ao revisar código para identificar responsabilidades mal atribuídas
- Para decidir em qual classe colocar um novo método ou comportamento
- Para identificar controllers inchados, experts violados ou acoplamento alto

## Referências

- Applying UML and Patterns — Craig Larman
- Object Design — Rebecca Wirfs-Brock

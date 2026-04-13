# 🏗️ Architectural Principles

**Skill de especialista em princípios arquiteturais** para análise e recomendação de decisões de arquitetura de software.

## Para que serve?

Esta skill instrui o agente a analisar código e projetos sob a ótica dos **princípios fundamentais de arquitetura**, identificando violações e recomendando correções. É útil para revisões arquiteturais e para garantir que decisões caras de mudar estejam bem fundamentadas.

## Princípios Cobertos

| Princípio | Essência |
|-----------|----------|
| **Separation of Concerns (SoC)** | Separe apresentação, negócio e infraestrutura |
| **Dependency Rule (Clean Architecture)** | Dependências apontam sempre para o domínio |
| **Ports & Adapters (Hexagonal)** | Domínio define interfaces, infraestrutura as implementa |
| **Bounded Context (DDD)** | Cada contexto tem seu modelo e linguagem próprios |
| **Hollywood Principle** | Inversão de controle — o framework te chama |
| **Convention over Configuration** | Convenções sensatas reduzem decisões e configuração |

## Quando usar?

- Ao revisar a arquitetura de um projeto
- Para validar se dependências entre camadas estão corretas
- Para identificar acoplamentos indevidos entre domínio e infraestrutura
- Para analisar se bounded contexts estão bem separados

## Referências

- Clean Architecture — Robert C. Martin
- Hexagonal Architecture — Alistair Cockburn
- Domain-Driven Design — Eric Evans

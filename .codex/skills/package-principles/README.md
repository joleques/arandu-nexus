# 📦 Package Principles

**Skill de especialista nos 6 princípios de pacotes** de Robert C. Martin — coesão e acoplamento.

## Para que serve?

Esta skill instrui o agente a analisar a organização de pacotes/módulos de um projeto, identificando violações aos princípios de empacotamento e recomendando reestruturações.

## Princípios Cobertos

### Coesão de Pacotes

| Princípio | Essência |
|-----------|----------|
| **REP** — Release/Reuse Equivalency | Reuse = Release — classes reutilizadas juntas no mesmo pacote |
| **CCP** — Common Closure | Muda junto, fica junto (SRP para pacotes) |
| **CRP** — Common Reuse | Usa junto, fica junto (ISP para pacotes) |

### Acoplamento de Pacotes

| Princípio | Essência |
|-----------|----------|
| **ADP** — Acyclic Dependencies | Sem ciclos no grafo de dependências |
| **SDP** — Stable Dependencies | Dependa na direção da estabilidade |
| **SAP** — Stable Abstractions | Estável = abstrato, Instável = concreto |

## Quando usar?

- Para revisar a estrutura de pacotes de um projeto
- Para identificar ciclos de dependência
- Para analisar se pacotes estão na "Zona de Dor" (estáveis mas concretos)
- Para decidir entre organização por feature vs. por camada técnica

## Referências

- Agile Software Development — Robert C. Martin
- Clean Architecture — Robert C. Martin

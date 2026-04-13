---
name: package-principles
description: Especialista nos 6 princípios de pacotes de Robert C. Martin — coesão (REP, CCP, CRP) e acoplamento (ADP, SDP, SAP).
---

# 📦 Princípios de Pacotes

Skill para análise e recomendação baseada nos 6 princípios de empacotamento de Robert C. Martin.

> [!IMPORTANT]
> **Filosofia Core:** Pacotes/módulos são a unidade de organização acima de classes. Se as classes estão bem distribuídas mas os pacotes estão mal organizados, o sistema ainda será difícil de manter.

---

## 🧲 Princípios de Coesão de Pacotes

### REP — Release/Reuse Equivalency Principle

> A unidade de reuso é a unidade de release.

Classes que são reutilizadas juntas devem estar no mesmo pacote e ser versionadas/liberadas juntas.

| ✅ Aderente | ❌ Violação |
|------------|-----------|
| Pacote tem versão e changelog próprio | Classes reutilizáveis espalhadas em pacotes diferentes |
| Todas as classes do pacote fazem sentido juntas para o consumidor | Consumidor importa pacote mas só usa 1 classe |

**Pergunta-chave:** *"Faz sentido para um consumidor reutilizar TODAS as classes deste pacote juntas?"*

---

### CCP — Common Closure Principle

> Classes que mudam juntas ficam no mesmo pacote.

É o **SRP aplicado a pacotes**: um pacote deve ter apenas um motivo para mudar.

| ✅ Aderente | ❌ Violação |
|------------|-----------|
| Mudança de regra de negócio afeta 1 pacote | Mudança simples requer alterar 5 pacotes |
| Features agrupadas por domínio/contexto | Classes agrupadas por tipo técnico (`models/`, `services/`, `controllers/`) |

**Teste prático:** *"Quando mudo a feature X, quantos pacotes preciso alterar?"* → Idealmente 1.

> [!TIP]
> CCP geralmente favorece **organização por feature/domínio** sobre **organização por camada técnica**.

---

### CRP — Common Reuse Principle

> Classes usadas juntas ficam no mesmo pacote. Classes NÃO usadas juntas NÃO ficam.

É o **ISP aplicado a pacotes**: não force consumidores a depender de classes que não usam.

| ✅ Aderente | ❌ Violação |
|------------|-----------|
| Consumidor usa a maioria das classes do pacote | Pacote "util" com classes sem relação |
| Dependências internas fortes entre as classes | Classes independentes agrupadas por conveniência |

**Teste prático:** *"Se eu remover esta classe do pacote, algum consumidor seria afetado?"* → Se não, ela não deveria estar aqui.

---

### ⚖️ Tensão entre REP, CCP e CRP

Os 3 princípios de coesão competem entre si:

```
        REP
       /    \
      /      \
    CCP ──── CRP
```

| Foco | Sacrifica |
|------|----------|
| REP + CCP | Pacotes grandes, pouco granulares (CRP sofre) |
| CCP + CRP | Difícil versionar e reutilizar (REP sofre) |
| REP + CRP | Muitas mudanças cruzando pacotes (CCP sofre) |

**Regra prática para projetos em desenvolvimento ativo:** Priorize **CCP** (minimize pacotes afetados por mudanças). Conforme o sistema amadurece e estabiliza, mova o foco para **REP** (reuso e versionamento).

---

## 🔗 Princípios de Acoplamento de Pacotes

### ADP — Acyclic Dependencies Principle

> O grafo de dependências entre pacotes não deve conter ciclos.

```
✅ Acíclico (DAG):
  A → B → C
  A → C

❌ Cíclico:
  A → B → C → A   (ciclo!)
```

**Como quebrar ciclos:**
1. **Dependency Inversion:** Extraia interface no pacote dependido
2. **Novo pacote:** Mova classes compartilhadas para um pacote separado
3. **Mediator/Events:** Use eventos para inverter a direção

**Teste:** *"Consigo compilar/testar cada pacote de forma independente?"* → Se não, provavelmente há ciclo.

---

### SDP — Stable Dependencies Principle

> Dependa na direção da estabilidade.

**Estabilidade** = dificuldade de mudar (medida pela quantidade de dependentes).

```
Instável (fácil de mudar)
    │
    ▼ depende de
Estável (difícil de mudar, muitos dependentes)
```

| Métrica | Fórmula | Significado |
|---------|---------|-------------|
| Ca (Afferent Coupling) | Pacotes que dependem de mim | "Popularidade" |
| Ce (Efferent Coupling) | Pacotes de quem eu dependo | "Dependência" |
| **Instabilidade (I)** | Ce / (Ca + Ce) | 0 = máx. estável, 1 = máx. instável |

**Regra:** Um pacote deve depender apenas de pacotes com **I menor ou igual** ao seu.

**Violação típica:** Pacote estável (muitos dependentes) importando pacote instável (muda frequentemente) → mudanças cascateiam.

---

### SAP — Stable Abstractions Principle

> Pacotes estáveis devem ser abstratos. Pacotes instáveis devem ser concretos.

| Estabilidade | Abstração | Resultado |
|-------------|-----------|-----------|
| Alta (I ≈ 0) | Alta (interfaces, abstrações) | ✅ Zona saudável |
| Baixa (I ≈ 1) | Baixa (implementações concretas) | ✅ Zona saudável |
| Alta (I ≈ 0) | Baixa (concreto e estável) | ❌ **Zona de Dor** — difícil de mudar |
| Baixa (I ≈ 1) | Alta (abstrato e instável) | ❌ **Zona Inútil** — abstrações que ninguém usa |

```
Abstração
    1 ┌──────────────────────┐
      │ Zona    ╲  ✅       │
      │ Inútil    ╲ Sequência│
      │             ╲ Principal
      │               ╲     │
    0 │  ✅ Zona      ╲    │
      │  de Dor    Zona ╲  │
      └──────────────────────┘
      0        I →          1
               Instabilidade
```

**Objetivo:** Manter pacotes na **Sequência Principal** (diagonal).

---

## 🔍 Instruções de Análise

### Ao Revisar Estrutura de Pacotes

Procure por:
- **Pacotes "util":** Violam CRP — classes sem relação juntas
- **Organização só por camada:** `models/`, `services/` → pode violar CCP
- **Dependências cíclicas:** A → B → C → A
- **Pacote estável concreto:** Muitos dependentes mas sem abstrações (Zona de Dor)
- **Mudança cascateada:** Alterar 1 feature requer tocar em 5+ pacotes

### Formato de Recomendação

```markdown
## Análise de Pacote

**Pacote:** [Nome do pacote]
**Princípio:** [REP/CCP/CRP/ADP/SDP/SAP]

### Veredicto: ✅ Aderente / ⚠️ Questionável / ❌ Violação

### Evidência
- [Descrição da violação com classes/dependências envolvidas]

### Métricas (quando aplicável)
- Ca: [valor] | Ce: [valor] | I: [valor]
- Abstração: [% de interfaces/abstrações]

### Recomendação
- [Reorganização sugerida ou refatoração]
```

---

## ⚡ Quick Reference

```
┌──────────────────────────────────────────────────────────────┐
│              PRINCÍPIOS DE PACOTES — RESUMO                  │
├────────────────────┬─────────────────────────────────────────┤
│  COESÃO            │  ACOPLAMENTO                            │
│                    │                                         │
│  REP: Reuse=Release│  ADP: Sem ciclos no grafo               │
│  CCP: Muda junto,  │  SDP: Dependa do mais estável           │
│       fica junto   │  SAP: Estável = abstrato                │
│  CRP: Usa junto,   │       Instável = concreto               │
│       fica junto   │                                         │
├────────────────────┴─────────────────────────────────────────┤
│  PRIORIDADE EM PROJETOS ATIVOS: CCP > CRP > REP             │
│  PRIORIDADE EM LIBS/FRAMEWORKS:  REP > CRP > CCP            │
└──────────────────────────────────────────────────────────────┘
```

---

## 📚 Referências

- [Agile Software Development — Robert C. Martin](https://www.amazon.com/Agile-Software-Development-Principles-Practices/dp/0135974445)
- [Clean Architecture — Robert C. Martin](https://www.amazon.com/Clean-Architecture-Craftsmans-Software-Structure/dp/0134494164)

> 💡 **Lembre-se:** A organização de pacotes é tão importante quanto o design de classes. Pacotes mal organizados geram o mesmo tipo de dor que código espaguete — só em escala maior.

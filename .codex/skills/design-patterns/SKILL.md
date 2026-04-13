---
name: design-patterns-specialist
description: Especialista pragmático em GoF — sabe quando usar e quando NÃO usar patterns para evitar over-engineering
---

# 🎯 Especialista Pragmático em Design Patterns (GoF)

Skill para análise e recomendação de Design Patterns com foco em **simplicidade primeiro**.

> [!IMPORTANT]
> **Filosofia Core:** "O melhor código é aquele que não precisa de um pattern. Patterns são ferramentas, não objetivos."
>
> Para princípios GRASP, consulte a skill **grasp-patterns**.

---

## 🧠 Mentalidade do Especialista

### Princípios Fundamentais

1. **YAGNI (You Aren't Gonna Need It)**
   - Não adicione patterns para "problemas futuros" que podem nunca existir
   - Flexibilidade antecipada geralmente vira complexidade desnecessária

2. **KISS (Keep It Simple, Stupid)**
   - A solução mais simples que funciona é geralmente a melhor
   - Patterns adicionam indireção — indireção tem custo

3. **Regra dos 3**
   - Antes de abstrair: veja o problema acontecer **3 vezes**
   - Duplicação é melhor que abstração errada

4. **Código legível > Código "elegante"**
   - Se precisa explicar o pattern para novos devs, questione se ele é necessário

---

## ❌ Sinais de Que NÃO Deve Usar um Pattern

### Anti-Patterns de Uso

| Sinal de Alerta | Problema |
|-----------------|----------|
| "E se no futuro..." | Especulação sobre requisitos inexistentes |
| "É uma boa prática" | Cargo cult sem análise de contexto |
| "Torna mais flexível" | Flexibilidade que ninguém pediu |
| "Vi em um projeto grande" | Escala diferente, problemas diferentes |
| Único local de uso | Pattern para 1 caso = over-engineering |
| Código ficou maior/mais complexo | Patterns devem simplificar, não complicar |

### Perguntas de Validação

Antes de aplicar qualquer pattern, responda:

1. ❓ **Qual problema concreto estou resolvendo AGORA?**
2. ❓ **A solução simples já foi tentada?**
3. ❓ **Quantos lugares do código se beneficiam?**
4. ❓ **Um dev junior entenderia sem explicação?**
5. ❓ **Se eu remover o pattern, o que quebra?**

> Se não conseguir responder com clareza → **NÃO USE O PATTERN**

---

## ✅ Quando REALMENTE Usar Patterns

### GoF (Gang of Four)

#### Creational Patterns

| Pattern | Use Quando | ⚠️ Evite Quando |
|---------|------------|-----------------|
| **Factory Method** | Múltiplos tipos concretos com criação complexa | Apenas 1-2 tipos simples com `new` |
| **Abstract Factory** | Famílias de objetos relacionados que mudam juntos | Não há famílias, só tipos isolados |
| **Builder** | Objeto com 5+ parâmetros opcionais ou construção em etapas | Objeto simples com poucos campos |
| **Singleton** | Recurso verdadeiramente único (config, pool de conexão) | "Conveniência global" — use DI |
| **Prototype** | Clonagem frequente mais barata que criação | Objetos baratos de criar |

#### Structural Patterns

| Pattern | Use Quando | ⚠️ Evite Quando |
|---------|------------|-----------------|
| **Adapter** | Integrar código legado ou biblioteca externa incompatível | Código seu que pode ser refatorado |
| **Bridge** | Variação independente em 2 dimensões (abstração + implementação) | Uma única dimensão de variação |
| **Composite** | Hierarquias árvore genuínas (UI, filesystem, org charts) | Estrutura flat ou lista simples |
| **Decorator** | Adicionar comportamento dinamicamente em runtime | Comportamento fixo — use herança ou composição |
| **Facade** | Simplificar subsistema complexo para clientes | Sistema já é simples |
| **Flyweight** | Milhares de objetos similares com dados compartilháveis | Dezenas de objetos — não otimize prematuramente |
| **Proxy** | Controle de acesso, lazy loading, caching transparente | Acesso direto é suficiente |

#### Behavioral Patterns

| Pattern | Use Quando | ⚠️ Evite Quando |
|---------|------------|-----------------|
| **Chain of Responsibility** | Pipeline de handlers onde cada um pode processar ou passar adiante | Apenas 1-2 handlers fixos |
| **Command** | Undo/redo, filas de operação, logging de ações | Ação única sem necessidade de desfazer |
| **Iterator** | Atravessar coleções complexas sem expor estrutura interna | Arrays/listas simples com for-each |
| **Mediator** | Muitos objetos com comunicação complexa N:N | Comunicação 1:1 ou poucos objetos |
| **Memento** | Snapshots para undo/restore de estado | Estado simples copiável diretamente |
| **Observer** | Notificação 1:N com subscribers dinâmicos | Notificação 1:1 — callback direto |
| **State** | Objeto com 4+ estados e transições definidas em máquina de estados | 2-3 estados — use switch/if |
| **Strategy** | Algoritmos intercambiáveis em runtime via configuração | Algoritmo fixo — inline o código |
| **Template Method** | Algoritmo com estrutura fixa e passos customizáveis | Sem variação de passos |
| **Visitor** | Operações frequentes novas sobre estrutura estável de tipos | Tipos mudam frequentemente |

---

## 🔍 Instruções de Análise

### 1. Ao Revisar Código Existente

Procure por:
- **Patterns desnecessários:** Abstrações usadas em 1 lugar só
- **Interfaces órfãs:** Interface com única implementação sem motivo
- **Factories sem propósito:** `new` seria suficiente
- **Observers para 1 listener:** Callback direto resolve
- **Strategies nunca trocadas:** Inline o código
- **Builders para objetos simples:** Construtor resolve

### 2. Ao Sugerir Novos Patterns

**Siga este fluxo:**

```
┌─────────────────────────────────────────┐
│ Existe problema concreto AGORA?         │
└─────────────────┬───────────────────────┘
                  │
         ┌───────▼────────┐
         │      SIM       │         NÃO → PARE
         └───────┬────────┘
                 │
┌────────────────▼────────────────────────┐
│ Solução simples (if/switch) não resolve?│
└────────────────┬────────────────────────┘
                 │
         ┌───────▼────────┐
         │      SIM       │         NÃO → Use solução simples
         └───────┬────────┘
                 │
┌────────────────▼────────────────────────┐
│ O pattern beneficia 3+ locais?          │
└────────────────┬────────────────────────┘
                 │
         ┌───────▼────────┐
         │      SIM       │         NÃO → Aguarde crescer
         └───────┬────────┘
                 │
         ┌───────▼────────┐
         │  APLIQUE COM   │
         │   PARCIMÔNIA   │
         └────────────────┘
```

---

## 📝 Formato de Recomendação

Ao sugerir ou revisar uso de patterns:

```markdown
## Análise de Design Pattern

**Pattern:** [Nome]
**Contexto:** [Onde está ou seria aplicado]

### Veredicto: ✅ Apropriado / ⚠️ Questionável / ❌ Desnecessário

### Justificativa
- **Problema concreto:** [Descreva ou "Não há"]
- **Beneficiários:** [Quantos locais usam/usariam]
- **Alternativa simples:** [Existe? Qual?]

### Recomendação
[Manter/Aplicar/Remover/Simplificar]

### Se for remover/simplificar:
[Código sugerido sem o pattern]
```

---

## ⚡ Quick Reference — Decisão Rápida

```
┌─────────────────────────────────────────────────────────┐
│                    DEVO USAR PATTERN?                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  "E se precisar no futuro?" ────────────────────→ NÃO  │
│  "É boa prática" ───────────────────────────────→ NÃO  │
│  "Torna mais flexível" ─────────────────────────→ NÃO  │
│  "O código tá duplicado em 3+ lugares" ─────────→ TALVEZ│
│  "O switch tá com 5+ cases e crescendo" ────────→ TALVEZ│
│  "Preciso trocar implementação em runtime" ─────→ SIM  │
│  "Biblioteca externa tem interface incompatível"→ SIM  │
│  "Tenho máquina de estados complexa" ───────────→ SIM  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📚 Referências

- [Design Patterns - GoF (1994)](https://www.amazon.com/Design-Patterns-Elements-Reusable-Object-Oriented/dp/0201633612)
- [GRASP Patterns - Craig Larman](https://www.craiglarman.com/wiki/index.php?title=Books_Applying_UML_and_Patterns)
- [Refactoring to Patterns - Joshua Kerievsky](https://industriallogic.com/xp/refactoring/)
- [Simple Design - Kent Beck](https://www.martinfowler.com/bliki/BeckDesignRules.html)

> 💡 **Lembre-se:** Código simples e direto que funciona é melhor que código "arquitetado" que ninguém entende.

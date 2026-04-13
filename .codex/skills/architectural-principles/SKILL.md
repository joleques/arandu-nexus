---
name: architectural-principles
description: Especialista em princípios arquiteturais — Separation of Concerns, Dependency Rule, Hexagonal, DDD Bounded Contexts e mais.
---

# 🏗️ Princípios Arquiteturais

Skill para análise e recomendação baseada nos princípios fundamentais de arquitetura de software.

> [!IMPORTANT]
> **Filosofia Core:** Arquitetura é sobre decisões que são caras de mudar. Princípios arquiteturais protegem o domínio e permitem que detalhes técnicos sejam substituíveis.

---

## 🧱 Os Princípios

### 1. Separation of Concerns (SoC)

> Divida o sistema em partes com responsabilidades distintas e bem definidas.

É o princípio mais fundamental — quase todos os outros derivam dele.

| Dimensão | Separação |
|----------|-----------|
| **Vertical (camadas)** | Apresentação → Aplicação → Domínio → Infraestrutura |
| **Horizontal (features)** | Pedidos, Pagamentos, Notificações |
| **Cross-cutting** | Logging, Segurança, Transações (tratados via AOP ou middleware) |

**Teste:** *"Posso mudar a UI sem tocar na lógica de negócio? Posso trocar o banco sem mudar o domínio?"* → Se não, SoC violado.

---

### 2. Dependency Rule (Clean Architecture)

> Dependências de código-fonte apontam **sempre para dentro**, na direção das políticas de alto nível.

```
┌─────────────────────────────────────────┐
│           Frameworks & Drivers          │  ← Camada mais externa
│  ┌───────────────────────────────────┐  │
│  │       Interface Adapters          │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │     Application / Use Cases │  │  │
│  │  │  ┌───────────────────────┐  │  │  │
│  │  │  │    Domain / Entities  │  │  │  │  ← Centro: regras de negócio
│  │  │  └───────────────────────┘  │  │  │
│  │  └─────────────────────────────┘  │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

**Regras:**
- Camadas internas **nunca** importam camadas externas
- Entidades não conhecem use cases
- Use cases não conhecem controllers/frameworks
- Dados cruzam fronteiras via **DTOs/interfaces**

**Violação típica:** Entidade de domínio com anotação `@Entity` (JPA) ou `@Document` (Mongo) — o domínio está acoplado à infraestrutura.

---

### 3. Ports & Adapters (Hexagonal Architecture)

> O domínio define **portas** (interfaces). A infraestrutura implementa **adaptadores**.

```
           ┌──────── Adaptadores Driving ────────┐
           │  REST Controller                     │
           │  CLI                                 │
           │  Event Consumer                      │
           │         │                            │
           ▼         ▼                            │
      ┌────────────────────────┐                  │
      │    Portas de Entrada   │ (interfaces)     │
      │    ┌──────────────┐    │                  │
      │    │   DOMÍNIO    │    │                  │
      │    └──────────────┘    │                  │
      │    Portas de Saída     │ (interfaces)     │
      └────────┬───────────────┘                  │
               │                                  │
           ┌───▼──── Adaptadores Driven ─────────┘
           │  Repository (MongoDB, PostgreSQL)
           │  HTTP Client (APIs externas)
           │  Message Publisher (SQS, Kafka)
           └──────────────────────────────────
```

| Conceito | Papel |
|----------|-------|
| **Porta de Entrada** | Interface que o domínio expõe (ex: `CreateOrderUseCase`) |
| **Porta de Saída** | Interface que o domínio precisa (ex: `OrderRepository`) |
| **Adaptador Driving** | Quem chama o domínio (REST, CLI, eventos) |
| **Adaptador Driven** | Quem o domínio chama via porta (banco, APIs) |

**Benefício central:** O domínio é **100% independente** de tecnologia. Pode testar com mocks, trocar banco, trocar framework.

---

### 4. Bounded Context (DDD)

> Cada contexto delimitado tem seu próprio **modelo**, **linguagem** e **fronteira**.

```
┌─ Contexto: Pedidos ──┐   ┌─ Contexto: Entregas ──┐
│  Cliente = quem pede  │   │  Cliente = endereço    │
│  Produto = SKU+preço  │   │  Produto = peso+volume │
│  Pedido = items+total │   │  Remessa = rota+prazo  │
└───────────┬───────────┘   └───────────┬────────────┘
            │     Anti-Corruption Layer │
            └───────────────────────────┘
```

**Regras:**
- Cada contexto tem sua **Ubiquitous Language** — mesma palavra pode ter significados diferentes
- Comunicação entre contextos via **contratos explícitos** (eventos, APIs, ACL)
- **Nunca** compartilhe entidades entre contextos
- Use **Anti-Corruption Layer** para traduzir entre modelos

**Sinais de contextos misturados:**
- Classe `User` com 30+ campos usados em cenários diferentes
- Mudança em um módulo quebra outro inesperadamente
- Debates sobre "o significado correto" de um termo

---

### 5. Hollywood Principle

> "Don't call us, we'll call you" — inversão de controle.

O framework/container chama seu código, não o contrário.

| Implementação | Exemplo |
|---------------|---------|
| **Dependency Injection** | Container injeta dependências |
| **Template Method** | Superclasse chama métodos da subclasse |
| **Event-Driven** | Publicador emite, subscribers reagem |
| **Hooks/Callbacks** | Framework chama seus handlers |

**Relação com DIP:** Hollywood Principle é a manifestação prática do DIP — o fluxo de controle é invertido para que módulos de alto nível comandem.

---

### 6. Convention over Configuration

> Use convenções sensatas para reduzir decisões e configuração explícita.

| ✅ Bom Uso | ❌ Mau Uso |
|-----------|----------|
| Estrutura de pastas padronizada | Cada dev organiza diferente |
| Nomes de arquivos seguem padrão (`*UseCase`, `*Repository`) | Nomes inconsistentes |
| Defaults razoáveis, override quando necessário | Tudo precisa de configuração explícita |

**Exemplos:**
- Spring Boot: `application.yml` com defaults sensatos
- Maven: `src/main/java`, `src/test/java`
- Projeto com skill `arquitetura-proposta`: convenções de pastas domain/use_case/infra

---

## 🔍 Instruções de Análise

### Ao Revisar Arquitetura

Procure por:
- **SoC violado:** Lógica de negócio em controllers ou em adaptadores de infra
- **Dependency Rule violada:** Domain importando classes de infra (JPA, HTTP client, etc.)
- **Portas ausentes:** Use case acessando banco diretamente sem interface
- **Contextos misturados:** Entidades compartilhadas entre módulos com semânticas diferentes
- **Configuração excessiva:** Boilerplate que poderia ser convenção

### Formato de Recomendação

```markdown
## Análise Arquitetural

**Princípio:** [Nome]
**Camada/Contexto:** [Onde está o problema]

### Veredicto: ✅ Aderente / ⚠️ Parcial / ❌ Violação

### Evidência
- [Classes/pacotes afetados com descrição]

### Impacto Arquitetural
- [Consequências: testabilidade, substituibilidade, complexidade]

### Recomendação
- [Refatoração sugerida com direção de dependências corrigida]
```

---

## ⚡ Quick Reference

```
┌─────────────────────────────────────────────────────────────┐
│             PRINCÍPIOS ARQUITETURAIS — RESUMO               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  SoC            → Separe apresentação, negócio e infra      │
│  Dependency Rule→ Dependências apontam para o domínio       │
│  Ports&Adapters → Domínio define interfaces, infra adapta   │
│  Bounded Context→ Cada contexto tem seu modelo e linguagem  │
│  Hollywood      → Inversão de controle: framework te chama  │
│  Convention     → Convenções > configuração explícita       │
│                                                             │
│  TESTE FINAL: "Posso trocar a infra sem mudar o domínio?"   │
│               Se sim → ✅  Se não → ❌                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 📚 Referências

- [Clean Architecture — Robert C. Martin](https://www.amazon.com/Clean-Architecture-Craftsmans-Software-Structure/dp/0134494164)
- [Hexagonal Architecture — Alistair Cockburn](https://alistair.cockburn.us/hexagonal-architecture/)
- [Domain-Driven Design — Eric Evans](https://www.amazon.com/Domain-Driven-Design-Tackling-Complexity-Software/dp/0321125215)
- [Implementing DDD — Vaughn Vernon](https://www.amazon.com/Implementing-Domain-Driven-Design-Vaughn-Vernon/dp/0321834577)

> 💡 **Lembre-se:** Arquitetura boa é aquela que permite adiar decisões técnicas. Se seu domínio funciona sem banco, sem framework e sem HTTP — sua arquitetura está no caminho certo.

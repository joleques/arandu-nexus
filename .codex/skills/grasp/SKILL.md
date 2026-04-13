---
name: grasp-patterns
description: Especialista em GRASP — 9 padrões de atribuição de responsabilidade para design OO pragmático e coeso.
---

# 🎯 GRASP — General Responsibility Assignment Software Patterns

Skill para análise e recomendação baseada nos 9 padrões GRASP de Craig Larman.

> [!IMPORTANT]
> **Filosofia Core:** GRASP não são "patterns" no sentido GoF — são **princípios de raciocínio** para decidir onde colocar responsabilidades. São a base de todo bom design OO.

---

## 🧩 Os 9 Padrões GRASP

### 1. Information Expert

> Atribua a responsabilidade à classe que tem a **informação** necessária para cumpri-la.

| ✅ Aplique | ❌ Evite |
|-----------|---------|
| A classe tem os dados para executar a operação | Dados estão em outra classe (virou "Tell, Don't Ask") |
| Comportamento e dados ficam juntos | Expert geraria acoplamento excessivo com infra |

```java
// ❌ Lógica fora do expert
double total = 0;
for (OrderItem item : order.getItems()) {
    total += item.getPrice() * item.getQuantity();
}

// ✅ Expert: Order sabe calcular seu total
double total = order.calculateTotal();
```

**Exceção:** Quando o expert natural é uma entidade de domínio mas a operação é técnica (persistência, envio de e-mail), use **Pure Fabrication**.

---

### 2. Creator

> Quem deve criar o objeto `B`? A classe `A` que:
> - Contém ou agrega `B`
> - Registra `B`
> - Usa `B` diretamente
> - Tem os dados para inicializar `B`

```java
// ✅ Order cria OrderItem — relação de agregação
class Order {
    OrderItem addItem(Product product, int qty) {
        OrderItem item = new OrderItem(product, qty);
        this.items.add(item);
        return item;
    }
}
```

**Quando NÃO usar:** Criação complexa com muitas dependências → use **Factory** (GoF).

---

### 3. Controller

> Um objeto não-UI que recebe e coordena eventos/operações do sistema.

| Tipo | Quando |
|------|--------|
| **Facade Controller** | Poucos eventos — um controller por subsistema |
| **Use Case Controller** | Muitos eventos — um controller por caso de uso |

```java
// ✅ Use Case Controller — um por caso de uso
class CreateOrderUseCase {
    OrderResponse execute(CreateOrderCommand cmd) {
        // coordena: validação → criação → persistência → eventos
    }
}
```

**Sinais de Controller "inchado":**
- Tem lógica de negócio (deveria estar no domínio)
- Tem acesso direto a banco (deveria usar repository)
- Faz muitas coisas não relacionadas (SRP violado)

---

### 4. Low Coupling

> Minimize dependências entre classes para reduzir impacto de mudanças.

| ✅ Baixo Acoplamento | ❌ Alto Acoplamento |
|---------------------|-------------------|
| Depende de interfaces/abstrações | Depende de classes concretas |
| Poucos imports de outros pacotes | Importa de muitos pacotes |
| Mudança em A não quebra B | Efeito cascata de mudanças |

**Métricas práticas:**
- Contagem de imports/dependências
- Fan-out (quantas classes esta classe conhece)
- Instabilidade do pacote (Ce / (Ca + Ce))

---

### 5. High Cohesion

> Mantenha responsabilidades focadas e relacionadas dentro de uma classe.

```
Alta Coesão:     OrderService → [createOrder, cancelOrder, updateOrder]
Baixa Coesão:    AppService   → [createOrder, sendEmail, generateReport, parseCSV]
```

**Teste:** *"Se eu descrever o que essa classe faz em uma frase, preciso da palavra 'E'?"* → Baixa coesão.

**Low Coupling + High Cohesion** são os dois princípios mais fundamentais — quase todos os outros derivam deles.

---

### 6. Polymorphism

> Use polimorfismo para lidar com variações de comportamento baseadas em tipo.

```java
// ❌ Switch por tipo — viola OCP
switch (notification.getType()) {
    case EMAIL: sendEmail(notification); break;
    case SMS:   sendSms(notification); break;
    case PUSH:  sendPush(notification); break;
}

// ✅ Polimorfismo — cada tipo sabe se enviar
notification.send();
```

**Quando NÃO usar:**
- Apenas 1-2 tipos e sem previsão de crescimento
- Switch simples e estável (YAGNI)

---

### 7. Pure Fabrication

> Crie classes "inventadas" (sem correspondente no domínio) quando nenhum expert natural serve.

| Exemplos Clássicos | Justificativa |
|-------------------|---------------|
| `Repository` | Entidade não deve saber se persistir |
| `Service` (técnico) | Orquestração não pertence a uma entidade |
| `Adapter` | Tradução entre camadas |
| `Factory` | Criação complexa extraída |

**Cuidado:** Pure Fabrication demais → sistema anêmico (objetos de domínio sem comportamento).

---

### 8. Indirection

> Adicione um intermediário para desacoplar dois componentes.

```
Sem Indireção:   Controller → Database
Com Indireção:   Controller → Repository (interface) ← DatabaseRepository
```

**Use quando:** O acoplamento direto traz fragilidade concreta.
**Evite quando:** A indireção adiciona complexidade sem reduzir acoplamento real.

> Toda indireção resolve um problema de acoplamento, mas cria uma camada a mais. Equilibre.

---

### 9. Protected Variations

> Proteja contra variações envolvendo pontos instáveis com interfaces/abstrações.

```java
// ✅ Ponto de variação protegido: meio de pagamento
interface PaymentGateway {
    PaymentResult charge(Money amount, PaymentDetails details);
}

// Implementações concretas podem variar sem impacto
class StripeGateway implements PaymentGateway { ... }
class PagSeguroGateway implements PaymentGateway { ... }
```

**Identifique pontos de variação:**
- Integrações externas (APIs, gateways)
- Regras que mudam por cliente/configuração
- Tecnologias que podem ser trocadas

**NÃO proteja** variações especulativas — proteja apenas pontos de variação **conhecidos** ou **altamente prováveis**.

---

## 🔍 Instruções de Análise

### Ao Revisar Código

Procure por:
- **Expert violado:** Lógica operando sobre dados de outra classe
- **Creator confuso:** Objeto criado em lugar inesperado
- **Controller inchado:** Controller com lógica de negócio
- **Alto acoplamento:** Muitas dependências concretas
- **Baixa coesão:** Classe com responsabilidades não relacionadas
- **Switch por tipo:** Candidato a Polymorphism
- **Entidade fazendo I/O:** Candidato a Pure Fabrication

### Formato de Recomendação

```markdown
## Análise GRASP

**Padrão:** [Nome do padrão GRASP]
**Local:** [Classe/Método afetado]

### Veredicto: ✅ Aderente / ⚠️ Questionável / ❌ Violação

### Evidência
- [Trecho de código ou descrição]

### Responsabilidade Correta
- **Deveria estar em:** [Classe sugerida]
- **Justificativa GRASP:** [Qual padrão justifica a movimentação]

### Recomendação
- [Ação com exemplo de código]
```

---

## ⚡ Quick Reference — Decisão de Responsabilidade

```
┌─────────────────────────────────────────────────────────────┐
│              ONDE COLOCAR ESSA RESPONSABILIDADE?             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Quem tem os dados? ──────────────────→ Information Expert  │
│  Quem agrega/contém o objeto? ────────→ Creator             │
│  Quem recebe o evento do sistema? ────→ Controller          │
│  Nenhuma classe de domínio serve? ────→ Pure Fabrication    │
│  Preciso desacoplar A de B? ──────────→ Indirection         │
│  Comportamento varia por tipo? ───────→ Polymorphism        │
│  Ponto de variação conhecido? ────────→ Protected Variations│
│                                                             │
│  SEMPRE VALIDE: Low Coupling + High Cohesion                │
└─────────────────────────────────────────────────────────────┘
```

---

## 📚 Referências

- [Applying UML and Patterns — Craig Larman](https://www.craiglarman.com/wiki/index.php?title=Books_Applying_UML_and_Patterns)
- [Object Design — Rebecca Wirfs-Brock](https://www.amazon.com/Object-Design-Roles-Responsibilities-Collaborations/dp/0201379430)

> 💡 **Lembre-se:** GRASP é sobre **raciocínio**, não sobre implementação mecânica. A pergunta certa é sempre: "Quem deveria ter essa responsabilidade e por quê?"

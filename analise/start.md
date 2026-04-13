# 📄 PRD — Arandu Nexus

## 1. Visão do Produto

**Nome do produto:** *Arandu Nexus*

**Resumo:**

Uma ferramenta colaborativa que permite times desenharem, discutirem e evoluírem arquiteturas de software em tempo real, preservando a fluidez do quadro branco físico e transformando essas conversas em conhecimento reutilizável.

---

## 2. Problema

Times de engenharia enfrentam dificuldades recorrentes:

* Discussões arquiteturais ficam presas em calls e não são bem registradas
* Diagramas formais são demorados e pouco usados no dia a dia
* Quadros brancos físicos são ótimos para pensar, mas ruins para compartilhar
* Ferramentas atuais focam em desenho, não em raciocínio colaborativo
* Decisões técnicas importantes se perdem ao longo do tempo

---

## 3. Objetivo

Criar uma ferramenta que:

* Reproduza a experiência natural do quadro branco
* Facilite pensamento coletivo em tempo real
* Capture decisões e contexto técnico
* Transforme discussões em artefatos reutilizáveis

---

## 4. Público-Alvo

### Primário

* Tech Leads
* Engenheiros de software
* Arquitetos de software
* Times de produto + engenharia

### Secundário

* Consultorias técnicas
* Times distribuídos/remotos
* Startups em fase de crescimento

---

## 5. Proposta de Valor

> “Desenhe sistemas como seu time pensa: de forma colaborativa, rápida e viva.”

Diferencial principal:

* Não é só um editor de diagramas
* É um **ambiente de raciocínio técnico colaborativo**

---

## 6. Casos de Uso Principais

### 1. Discussão de arquitetura

Time desenha uma solução em tempo real durante uma conversa.

### 2. Exploração de problemas

Mapear gargalos, dependências e falhas em sistemas existentes.

### 3. Design de novas features

Criar fluxos e interações antes da implementação.

### 4. Revisão técnica

Analisar e melhorar arquiteturas existentes.

### 5. Documentação leve

Gerar registros a partir das discussões.

---

## 7. Funcionalidades — MVP (V1)

### 🎯 Objetivo do MVP:

Validar se a ferramenta recria a sensação de “quadro branco colaborativo”

---

### 7.1 Canvas Livre

* Canvas infinito
* Navegação simples (zoom/pan)
* Sem setup obrigatório

---

### 7.2 Elementos Básicos

* Caixas (retângulos)
* Setas/conexões
* Texto
* Desenho livre (caneta)
* Post-its

---

### 7.3 Colaboração em Tempo Real

* Múltiplos usuários simultâneos
* Cursores visíveis
* Edição simultânea
* Identificação de quem está editando

---

### 7.4 Comentários

* Comentários ancorados em elementos
* Threads simples
* Marcar dúvidas

---

### 7.5 Templates Simples

* Fluxo básico
* Arquitetura simples (frontend/backend/db)
* Canvas em branco (default)

---

### 7.6 Snapshots

* Salvar estado do canvas
* Nomear versões (ex: “Proposta v1”)
* Histórico simples

---

### 7.7 Compartilhamento

* Link público/privado
* Permissão de edição ou visualização
* Exportar como imagem

---

## 8. Funcionalidades — Pós MVP (V2)

### 8.1 Componentes Semânticos

* Serviço
* Banco de dados
* Fila/evento
* API
* Usuário/sistema externo

Cada componente pode ter:

* Nome
* Responsabilidade
* Dependências

---

### 8.2 Conexões Inteligentes

* Tipos de conexão:

  * HTTP
  * Evento
  * Assíncrono
  * Banco
* Labels automáticos

---

### 8.3 Decisões Arquiteturais

* Associar decisões a partes do diagrama
* Estrutura:

  * Problema
  * Opções
  * Decisão
  * Justificativa

---

### 8.4 Organização do Canvas

* Auto-align
* Agrupamento
* Camadas

---

## 9. Funcionalidades — Futuro (V3)

### 9.1 IA como Copiloto

* Gerar diagrama a partir de texto
* Sugerir melhorias
* Detectar problemas
* Gerar documentação automática

---

### 9.2 Integrações

* Jira
* GitHub
* Notion
* Confluence

---

### 9.3 Memória Arquitetural

* Timeline de mudanças
* Busca por decisões
* Evolução da arquitetura

---

## 10. Métricas de Sucesso

### Adoção

* Número de sessões criadas
* Número de usuários ativos por sessão

### Engajamento

* Tempo médio de uso por sessão
* Número de edições por usuário

### Retenção

* Times que voltam a usar semanalmente
* Quantidade de snapshots criados

### Qualidade percebida

* “Isso substitui o quadro branco?” (feedback qualitativo)

---

## 11. Experiência Ideal (Fluxo)

1. Usuário cria uma sala
2. Compartilha link com o time
3. Todos entram instantaneamente
4. Alguém começa a desenhar
5. Outros interagem em tempo real
6. Discussão acontece em cima do desenho
7. Estado é salvo como snapshot
8. Pode ser retomado depois

---

## 12. Diferenciais Estratégicos

* Foco em **pensamento**, não só desenho
* Baixa fricção para começar
* Forte colaboração em tempo real
* Evolução do rascunho → arquitetura estruturada
* Captura de contexto e decisões

---

## 13. Riscos

### 1. Produto genérico demais

→ Mitigar focando em arquitetura de software

### 2. Complexidade precoce

→ Mitigar com MVP simples

### 3. Concorrência forte

→ Diferenciar na experiência de colaboração

---

## 14. Roadmap Inicial

### Fase 1 (0–2 meses)

* Canvas + shapes básicos
* Colaboração em tempo real
* Compartilhamento

### Fase 2 (2–4 meses)

* Comentários
* Snapshots
* Templates

### Fase 3 (4–6 meses)

* Componentes semânticos
* Conexões inteligentes

### Fase 4 (6+ meses)

* IA
* Integrações
* Memória arquitetural

---

## 15. Frase Norteadora do Produto

> “Se a ferramenta não faz alguém dizer ‘deixa eu te mostrar aqui’, ela falhou.”

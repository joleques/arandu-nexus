---
name: answers-questions-revisor
description: Revisa os arquivos de Perguntas e Respostas gerados pela skill answers-questions, com foco em garantir a qualidade e conversão para datasets de Fine-Tuning de LLM. Gera relatórios de melhorias estruturais e semânticas.
---

# answers-questions-revisor

**Objetivo:** Atuar como um supervisor de qualidade (Quality Assurance) em cima de arquivos gerados pela skill `answers-questions`. Este agente analisa o par Pergunta/Resposta visando preparar o material para uso em Fine-Tuning de LLMs (conversão para formato JSONL ou interações conversacionais).

## Instruções de Execução

1. **Coleta de Parâmetros:**
   Antes de iniciar a revisão, você deve ter ou obter:
   *   **Arquivo Alvo:** O arquivo Markdown com as perguntas e respostas gerado anteriormente (geralmente localizado em `agentAI/fine-tuning/<Titulo_Base>/respostas/`).
   *   **Título Base e Versão:** O título base para o relatório (extraído do nome do arquivo alvo ou perguntado ao usuário) e a versão da revisão (ex: `v1`).

2. **Critérios de Revisão (Foco em Fine-Tuning):**
   Leia o conteúdo do arquivo alvo e avalie rigorosamente cada par de "Pergunta" e "Resposta do Agente" utilizando os seguintes critérios:
   
   *   **Ausência de AI-splaining e Robótica:** A resposta NÃO pode ter inícios estereotipados como "Claro, aqui está a explicação", "Com base na documentação", etc. O modelo deve assumir a identidade direta do analista uMov.me.
   *   **Tom Proativo e Especialista:** O texto soa como um analista resolvendo o problema ou apenas definindo um conceito genérico? Se o texto for puramente acadêmico ("Circuit Breaker é X"), aponte falha por falta de diagnóstico/ação corretiva ("Se X, faça Y").
   *   **Proporção Pergunta vs Resposta:** Há desbalanceamento severo (ex: a pergunta é "oi" e a resposta tem 40 linhas)? Caso a resposta não se justifique ser tão longa, requisite síntese.
   *   **Formatação (Extractability):** O arquivo respeita a formatação estrita que facilita regex/parsers?
       * Deve ter a label `**Pergunta:**` e `**Resposta do Agente:**` em todos os blocos.
       * Não devem existir anotações extras do agente fora deste limite (além dos títulos HTML/MD).
   *   **Detecção de Alucinações / Erros Comuns:** Verifique se as explicações sobre regras comuns (falhas 408, 429, limites de reprocessamento, Queueing do Circuit Breaker) não distorcem os fatos ou as recomendações (ex: mandar reiniciar manualmente durante um 429 persistente é uma má prática).

3. **Geração do Relatório de Revisão:**
   *   Aponte claramente cada anomalia encontrada usando referências consistentes (como "Na Pergunta 3", "Na Pergunta 8").
   *   Para cada problema encontrado, seja claro no erro (ex: `[AI-splaining]`) e forneça a **Correção Sugerida**.
   *   Gere um arquivo final na pasta `agentAI/fine-tuning/<Titulo_Base>/respostas/` seguindo a nomenclatura obrigatória: `{titulo}-revisao-{versao}.md` (exemplo: `automacao-revisao-v1.md`).

4. **Estrutura Esperada do Relatório (`.md`):**
   ```markdown
   # Relatório de Revisão: {titulo} - {versao}

   **Resumo da Avaliação:**
   [Breve comentário sobre o estado geral do arquivo e quão pronto está para gerar o JSONL]

   ## Melhorias Pontuais

   *   **Pergunta [X]: [Breve titulo ou trecho da pergunta]**
       *   **Análise:** [Explicação do que está incorreto ou fora do padrão Fine-Tuning. Ex: Uso de AI-splaining nas 3 primeiras palavras]
       *   **Correção Sugerida:** [Nova redação da Resposta do Agente reformulando para os parâmetros adequados]
   
   *   **...**

   ## Alertas Estruturais
   [Caso falte os delimitadores corretos de **Pergunta:** e **Resposta do Agente:**, alerte o usuário para refatorar o markdown]
   ```

5. **Conclusão:**
   *   Salve o relatório no local especificado.
   *   Notifique o usuário enviando o caminho completo e sugira que, após os ajustes apontados, os dados estarão no padrão máximo para compor o System Instruction/Dataset de treinamento.

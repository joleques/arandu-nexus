---
name: workflow-fine-tuning-gemini
description: Orquestra answers-questions, answers-questions-revisor, dataset-synthesizer e dataset-synthesizer-revisor para pipeline de dataset SFT com ciclos de QA.
---

# Workflow Skill: Fine Tuning Gemini

Use quando o usuário pedir geração de dataset para fine-tuning ou mencionar `/fine-tuning-gemini`.

## Fluxo
1. Coletar insumos: titulo, arquivo de perguntas, logs, diretório de documentação e quantidade de linhas.
2. Rodar `answers-questions` para base inicial de respostas.
3. Rodar `answers-questions-revisor` com loop de correção (max 5).
4. Se usuário autorizar seguir com ressalvas após limite, prosseguir; senão parar.
5. Rodar `dataset-synthesizer` incluindo o `.md` de respostas validadas.
6. Rodar `dataset-synthesizer-revisor` com loop de correção (max 5).
7. Entregar caminho do dataset final e pendências remanescentes.

## Regra crítica
- Sem logs de interação, interromper e alertar risco de seguir sem comportamento real do usuário.

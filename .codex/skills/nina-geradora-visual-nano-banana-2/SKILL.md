---
name: nina-geradora-visual-nano-banana-2
description: Especialista de apoio para gerar imagens e sequencias de slides com Nano Banana 2 a partir de referencias visuais, descricoes detalhadas ou combinacao de ambos, com coleta obrigatoria de briefing completo antes da execucao.
---

Objetivo:
Atuar como skill de suporte para outras skills na criacao de pecas visuais, garantindo que o pedido esteja completo antes de gerar prompts e execucao no Nano Banana 2.

Quando usar:
- Quando houver necessidade de gerar imagem unica (post estatico, capa, thumb, key visual).
- Quando houver necessidade de gerar sequencia visual (carrossel, slide deck, storyboard).
- Quando a solicitacao vier com exemplos visuais, texto descritivo detalhado, ou ambos.

Entradas aceitas:
- Referencias visuais (links, arquivos, prints, moodboard).
- Descricao textual livre do resultado esperado.
- Objetivo de negocio/comunicacao da peca.

Preflight tecnico obrigatorio (sempre primeiro):
1. Verificar setup Nano Banana antes de qualquer pergunta criativa:
- chave API disponivel
- acesso a conta/plano
- endpoint respondendo
- pasta de saida com permissao de escrita
2. Executar validacao rapida:
- `python3 .codex/skills/nina-geradora-visual-nano-banana-2/scripts/gerar_imagem_nano_banana.py --preflight-only`
3. Se falhar:
- parar imediatamente a coleta de briefing
- orientar correcao objetiva (o que fazer, onde clicar e qual comando repetir)
- so retomar perguntas criativas depois do preflight aprovado

Protocolo obrigatorio de coleta (nao pular):
1. Identificar formato de entrega:
- imagem unica
- carrossel (quantidade de slides)
- slide deck/apresentacao
2. Confirmar objetivo e publico:
- objetivo principal da peca
- publico e contexto de uso
- acao esperada (CTA)
3. Definir direcao criativa:
- estilo visual (ex.: editorial, clean, dramatico, premium, documental)
- composicao (plano, enquadramento, foco)
- iluminacao e atmosfera
- paleta de cores
- tipografia (se houver texto na imagem)
4. Consolidar conteudo por slide (quando multipagina):
- tema de cada slide
- texto exato por slide
- hierarquia da mensagem
5. Validar restricoes:
- formato, proporcao e resolucao
- elementos obrigatorios/proibidos
- consistencia de marca
- idioma e tom
6. Validar referencias:
- o que copiar (linguagem visual)
- o que nao copiar (evitar semelhanca indesejada)
- nivel de fidelidade esperado

Regra de bloqueio (qualidade):
- Se faltar qualquer informacao critica da secao "Protocolo obrigatorio de coleta", interromper a geracao e continuar perguntando.
- Nao gerar prompt final incompleto.

Saidas obrigatorias:
- Briefing consolidado e aprovado (resumo final do entendimento).
- Prompt final para Nano Banana 2, pronto para execucao.
- Variantes de prompt (minimo 2) para teste A/B quando fizer sentido.
- Para slides/carrossel: plano pagina a pagina + prompts por slide.
- Checklist final de conformidade (objetivo, estilo, formato, consistencia).
- Imagens finais salvas em `output/imagem/{titulo}-{YYYY-MM-DD}-{N}/resultado/`.
- Artefatos da solicitacao em `output/imagem/{titulo}-{YYYY-MM-DD}-{N}/artefatos/`.

Padrao de resposta da skill:
1. Status do preflight tecnico (aprovado/reprovado + acao).
2. Diagnostico de lacunas de briefing (somente se preflight aprovado).
3. Perguntas objetivas para completar briefing.
4. Resumo aprovado do briefing.
5. Entregaveis finais (prompts, plano visual e imagens).

Template de coleta:
- Usar `references/formulario-briefing-nano-banana-2.md` como formulario base.
- Adaptar perguntas conforme tipo de peca (imagem unica vs multipagina).
- Nao iniciar o formulario sem preflight aprovado.
- Para preflight, usar `references/checklist-preflight-nano-banana.md`.

Execucao tecnica (geracao de imagem pronta):
1. Configurar credencial:
- O script cria `.env` automaticamente (a partir de `scripts/.env.example`) se o arquivo nao existir.
- Preencher `GEMINI_API_KEY`.
- `GEMINI_BASE_URL` e `GEMINI_API_VERSION` ja vem prontos com valores oficiais.
 - Se nao tiver chave:
 - Acessar `https://aistudio.google.com/apikey`, fazer login e criar uma API key.
 - Salvar no `.env`: `GEMINI_API_KEY=sua_chave`.
2. Executar prompt unico:
- `python3 .codex/skills/nina-geradora-visual-nano-banana-2/scripts/gerar_imagem_nano_banana.py --titulo "nome-da-peca" --prompt "seu prompt final aqui"`
3. Executar lote de slides:
- `python3 .codex/skills/nina-geradora-visual-nano-banana-2/scripts/gerar_imagem_nano_banana.py --titulo "nome-do-carrossel" --prompts-json .codex/skills/nina-geradora-visual-nano-banana-2/references/prompts-exemplo-slides.json`
4. Resultado esperado:
- Pasta criada automaticamente em `output/imagem/{titulo}-{YYYY-MM-DD}-{N}`.
- PNG finais em `resultado/`.
- Arquivos de auditoria em `artefatos/` (`manifest.json`, `prompts-usados.md` e `texto-retornado.md` quando houver).

Padrao do arquivo JSON para lote:
- Lista de objetos com campos: `name`, `prompt`, `n` (opcional) e `size` (opcional).
- Exemplo pronto em `references/prompts-exemplo-slides.json`.

Limites:
- Nao executar sem alinhamento minimo de objetivo, publico e direcao visual.
- Nao assumir detalhes de marca sem confirmacao explicita.
- Nao substituir estrategista/copywriter; apenas traduz briefing em direcao visual executavel.
- Nao editar scripts/codigo automaticamente durante a execucao da skill.
- Se houver erro tecnico, primeiro diagnosticar e orientar correcao sem alterar codigo.
- Qualquer alteracao de arquivo so pode ocorrer com solicitacao explicita do usuario.

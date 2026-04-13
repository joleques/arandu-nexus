# Checklist de Preflight - Nano Banana

Use este checklist antes de qualquer pergunta criativa.

## Criticos (bloqueiam execucao)
- `GEMINI_API_KEY` presente no `.env`
- Conta com acesso ao modelo configurado em `GEMINI_MODEL` (padrao: `gemini-3.1-flash-image-preview`)
- API oficial do Google respondendo em `generativelanguage.googleapis.com`
- Permissao de escrita em `output/imagem/`

## Comando unico de validacao
```bash
python3 .codex/skills/nina-geradora-visual-nano-banana-2/scripts/gerar_imagem_nano_banana.py --preflight-only
```

## Regra de operacao
- Se o preflight falhar: parar, orientar ajuste, repetir preflight.
- Se o preflight passar: iniciar briefing criativo completo.

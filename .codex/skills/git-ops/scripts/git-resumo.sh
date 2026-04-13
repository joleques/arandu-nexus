#!/bin/bash
# git-resumo.sh — Captura diff e informações para geração de resumo
# Gerado pela skill Git Ops
#
# Uso:
#   bash git-resumo.sh [diretório]
#
# O script:
#   1. Faz git add . (para staged)
#   2. Captura git diff --staged --stat (resumo de arquivos)
#   3. Captura git diff --staged --name-status (tipo de alteração)
#   4. Captura git diff --staged (diff completo)
#   5. Captura branch atual
#   6. Imprime tudo no stdout para o agente analisar

set -e

DIR="${1:-.}"

# Validar que é um repositório Git
if ! git -C "$DIR" rev-parse --is-inside-work-tree > /dev/null 2>&1; then
  echo "❌ Erro: '${DIR}' não é um repositório Git."
  exit 1
fi

# Stage tudo
git -C "$DIR" add .

# Verificar se há alterações
if git -C "$DIR" diff --staged --quiet 2>/dev/null; then
  echo "❌ Nenhuma alteração encontrada para enviar."
  exit 1
fi

# Info da branch
BRANCH=$(git -C "$DIR" rev-parse --abbrev-ref HEAD)
echo "===BRANCH==="
echo "$BRANCH"

# Arquivos alterados com tipo (M/A/D/R)
echo "===NAME-STATUS==="
git -C "$DIR" diff --staged --name-status

# Estatísticas (linhas +/-)
echo "===STAT==="
git -C "$DIR" diff --staged --stat

# Diff completo
echo "===DIFF==="
git -C "$DIR" diff --staged

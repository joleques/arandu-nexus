#!/bin/bash
# git-enviar.sh — Commit + push + atualização de resumo
# Gerado pela skill Git Ops
#
# Uso:
#   bash git-enviar.sh "mensagem" [diretório] [arquivo_resumo]
#
# Parâmetros:
#   $1 = mensagem do commit (obrigatório)
#   $2 = diretório do projeto (opcional, padrão: .)
#   $3 = caminho do arquivo de resumo .md (opcional)
#
# Pré-requisito: git add . já foi feito pelo git-resumo.sh
#
# O script:
#   1. git add . (garante que o resumo gerado pelo agente entra)
#   2. git commit -m "mensagem"
#   3. Captura hash do commit
#   4. Se resumo existir: atualiza hash no arquivo via sed
#   5. Se resumo existir: git add + amend (inclui resumo atualizado)
#   6. git push

set -e

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# Validação de parâmetros
if [ -z "$1" ]; then
  echo -e "${RED}❌ Erro: mensagem do commit é obrigatória.${NC}"
  echo "Uso: bash git-enviar.sh \"mensagem\" [diretório] [arquivo_resumo]"
  exit 1
fi

MENSAGEM="$1"
DIR="${2:-.}"
RESUMO="$3"

# Validar que é um repositório Git
if ! git -C "$DIR" rev-parse --is-inside-work-tree > /dev/null 2>&1; then
  echo -e "${RED}❌ Erro: '${DIR}' não é um repositório Git.${NC}"
  exit 1
fi

# Step 1: Add (inclui o resumo gerado pelo agente)
echo -e "${YELLOW}📦 Adicionando arquivos...${NC}"
git -C "$DIR" add .

# Verificar se há algo para commitar
if git -C "$DIR" diff --staged --quiet 2>/dev/null; then
  echo -e "${RED}❌ Nenhuma alteração encontrada para enviar.${NC}"
  exit 1
fi

# Step 2: Commit
echo -e "${YELLOW}📝 Commitando: ${MENSAGEM}${NC}"
git -C "$DIR" commit -m "$MENSAGEM"

# Step 3: Capturar hash
HASH=$(git -C "$DIR" log --format="%H" -n 1)
HASH_SHORT=$(git -C "$DIR" log --format="%h" -n 1)
echo -e "${CYAN}🔗 Hash: ${HASH_SHORT}${NC}"

# Step 4-5: Atualizar hash no resumo e amend (se existir)
if [ -n "$RESUMO" ] && [ -f "$RESUMO" ]; then
  echo -e "${YELLOW}📄 Atualizando resumo com hash do commit...${NC}"
  sed -i "s|🔗 Commit: .*|🔗 Commit: ${HASH_SHORT} (${HASH})|" "$RESUMO"

  git -C "$DIR" add "$RESUMO"
  git -C "$DIR" commit --amend --no-edit
  echo -e "${CYAN}📄 Resumo atualizado e incluído no commit${NC}"
fi

# Step 6: Push
echo -e "${YELLOW}🚀 Enviando para o remoto...${NC}"
git -C "$DIR" push

echo -e "${GREEN}✅ Concluído! commit → push executados com sucesso.${NC}"
if [ -n "$RESUMO" ]; then
  echo -e "${GREEN}📄 Resumo salvo em: ${RESUMO}${NC}"
fi

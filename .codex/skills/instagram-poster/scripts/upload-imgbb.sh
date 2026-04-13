#!/usr/bin/env bash
# upload-imgbb.sh — Upload de imagem local para ImgBB e retorna URL pública
# Dependências: curl, jq
# Uso: ./upload-imgbb.sh <caminho_imagem> <imgbb_api_key>

set -euo pipefail

IMAGE_PATH="${1:-}"
API_KEY="${2:-}"

# ──────────────────────────────────────────────────────────
# Validações
# ──────────────────────────────────────────────────────────

if [[ -z "$IMAGE_PATH" ]]; then
  echo '{"error": "Missing argument: image path", "usage": "./upload-imgbb.sh <image_path> <api_key>"}' >&2
  exit 1
fi

if [[ -z "$API_KEY" ]]; then
  echo '{"error": "Missing argument: ImgBB API key", "usage": "./upload-imgbb.sh <image_path> <api_key>"}' >&2
  exit 1
fi

if [[ ! -f "$IMAGE_PATH" ]]; then
  echo "{\"error\": \"File not found: $IMAGE_PATH\"}" >&2
  exit 1
fi

# Validar extensão (ImgBB aceita: jpg, jpeg, png, gif, bmp, webp, tiff)
EXTENSION="${IMAGE_PATH##*.}"
EXTENSION_LOWER=$(echo "$EXTENSION" | tr '[:upper:]' '[:lower:]')
VALID_EXTENSIONS="jpg jpeg png gif bmp webp tiff"

if [[ ! " $VALID_EXTENSIONS " =~ " $EXTENSION_LOWER " ]]; then
  echo "{\"error\": \"Unsupported image format: .$EXTENSION_LOWER. Supported: $VALID_EXTENSIONS\"}" >&2
  exit 1
fi

# ──────────────────────────────────────────────────────────
# Upload para ImgBB
# ──────────────────────────────────────────────────────────

RESPONSE=$(curl -s -X POST "https://api.imgbb.com/1/upload" \
  -F "key=$API_KEY" \
  -F "image=@$IMAGE_PATH")

# Verificar sucesso
STATUS=$(echo "$RESPONSE" | jq -r '.success // false')

if [[ "$STATUS" != "true" ]]; then
  ERROR_MSG=$(echo "$RESPONSE" | jq -r '.error.message // "Unknown error"')
  echo "{\"error\": \"ImgBB upload failed: $ERROR_MSG\"}" >&2
  exit 1
fi

# Extrair dados relevantes
IMAGE_URL=$(echo "$RESPONSE" | jq -r '.data.url')
DISPLAY_URL=$(echo "$RESPONSE" | jq -r '.data.display_url')
DELETE_URL=$(echo "$RESPONSE" | jq -r '.data.delete_url')
SIZE=$(echo "$RESPONSE" | jq -r '.data.size')
FILENAME=$(echo "$RESPONSE" | jq -r '.data.image.filename')

# Retornar JSON com os dados
jq -n \
  --arg url "$IMAGE_URL" \
  --arg display_url "$DISPLAY_URL" \
  --arg delete_url "$DELETE_URL" \
  --arg size "$SIZE" \
  --arg filename "$FILENAME" \
  '{
    "status": "success",
    "url": $url,
    "display_url": $display_url,
    "delete_url": $delete_url,
    "size": $size,
    "filename": $filename
  }'

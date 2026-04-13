#!/usr/bin/env bash
# post-linkedin.sh — Publica conteúdo no LinkedIn via Posts API v2
# Dependências: curl, jq
# Uso: ./post-linkedin.sh <config_file> <text> [type] [image_path] [article_url] [article_title]
#   config_file    — caminho do artigos/.config-social-media.json
#   text           — texto do post
#   type           — text|image|article (padrão: text)
#   image_path     — caminho da imagem local (obrigatório para type=image)
#   article_url    — URL do artigo (obrigatório para type=article)
#   article_title  — título do artigo (opcional para type=article)

set -euo pipefail

LINKEDIN_API_BASE="https://api.linkedin.com/v2"
LINKEDIN_API_VERSION="202501"

CONFIG_FILE="${1:-}"
TEXT="${2:-}"
POST_TYPE="${3:-text}"
IMAGE_PATH="${4:-}"
ARTICLE_URL="${5:-}"
ARTICLE_TITLE="${6:-}"

# ──────────────────────────────────────────────────────────
# Validações de entrada
# ──────────────────────────────────────────────────────────

if [[ -z "$CONFIG_FILE" ]] || [[ -z "$TEXT" ]]; then
  echo '{"error": "Usage: ./post-linkedin.sh <config_file> <text> [type] [image_path] [article_url] [article_title]"}' >&2
  exit 1
fi

if [[ ! -f "$CONFIG_FILE" ]]; then
  echo "{\"error\": \"Config file not found: $CONFIG_FILE\"}" >&2
  exit 1
fi

# ──────────────────────────────────────────────────────────
# Ler configuração
# ──────────────────────────────────────────────────────────

PERSON_URN=$(jq -r '.linkedin.person_urn' "$CONFIG_FILE")
ACCESS_TOKEN=$(jq -r '.linkedin.access_token' "$CONFIG_FILE")

if [[ -z "$PERSON_URN" ]] || [[ "$PERSON_URN" == "null" ]]; then
  echo '{"error": "Missing linkedin.person_urn in config file"}' >&2
  exit 1
fi

if [[ -z "$ACCESS_TOKEN" ]] || [[ "$ACCESS_TOKEN" == "null" ]]; then
  echo '{"error": "Missing linkedin.access_token in config file"}' >&2
  exit 1
fi

# ──────────────────────────────────────────────────────────
# Headers comuns
# ──────────────────────────────────────────────────────────

COMMON_HEADERS=(
  -H "Authorization: Bearer ${ACCESS_TOKEN}"
  -H "Content-Type: application/json"
  -H "X-Restli-Protocol-Version: 2.0.0"
  -H "LinkedIn-Version: ${LINKEDIN_API_VERSION}"
)

# ──────────────────────────────────────────────────────────
# Funções auxiliares
# ──────────────────────────────────────────────────────────

register_image_upload() {
  local response
  response=$(curl -s -X POST "${LINKEDIN_API_BASE}/assets?action=registerUpload" \
    -H "Authorization: Bearer ${ACCESS_TOKEN}" \
    -H "Content-Type: application/json" \
    -d '{
      "registerUploadRequest": {
        "recipes": ["urn:li:digitalmediaRecipe:feedshare-image"],
        "owner": "'"${PERSON_URN}"'",
        "serviceRelationships": [{
          "relationshipType": "OWNER",
          "identifier": "urn:li:userGeneratedContent"
        }]
      }
    }')

  local upload_url
  upload_url=$(echo "$response" | jq -r '.value.uploadMechanism["com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"].uploadUrl // empty')

  local asset_urn
  asset_urn=$(echo "$response" | jq -r '.value.asset // empty')

  if [[ -z "$upload_url" ]] || [[ -z "$asset_urn" ]]; then
    local error_msg
    error_msg=$(echo "$response" | jq -r '.message // "Unknown error"')
    echo "{\"error\": \"Failed to register upload: $error_msg\"}" >&2
    return 1
  fi

  echo "${upload_url}|${asset_urn}"
}

upload_image_binary() {
  local upload_url="$1"
  local file_path="$2"

  local http_code
  http_code=$(curl -s -o /dev/null -w "%{http_code}" -X PUT "$upload_url" \
    -H "Authorization: Bearer ${ACCESS_TOKEN}" \
    -H "Content-Type: application/octet-stream" \
    --upload-file "$file_path")

  if [[ "$http_code" != "201" ]] && [[ "$http_code" != "200" ]]; then
    echo "{\"error\": \"Image upload failed with HTTP $http_code\"}" >&2
    return 1
  fi
}

create_post() {
  local payload="$1"

  local response
  response=$(curl -s -w "\n%{http_code}" -X POST "${LINKEDIN_API_BASE}/posts" \
    "${COMMON_HEADERS[@]}" \
    -d "$payload")

  local http_code
  http_code=$(echo "$response" | tail -n1)
  local body
  body=$(echo "$response" | sed '$d')

  if [[ "$http_code" != "201" ]] && [[ "$http_code" != "200" ]]; then
    local error_msg
    error_msg=$(echo "$body" | jq -r '.message // "Unknown error"')
    echo "{\"error\": \"Failed to create post (HTTP $http_code): $error_msg\"}" >&2
    return 1
  fi

  echo "$body"
}

# ──────────────────────────────────────────────────────────
# Execução principal
# ──────────────────────────────────────────────────────────

# Escapar texto para JSON
ESCAPED_TEXT=$(echo "$TEXT" | jq -Rs '.')
# Remove aspas externas que jq -Rs adiciona
ESCAPED_TEXT="${ESCAPED_TEXT:1:${#ESCAPED_TEXT}-2}"

case "$POST_TYPE" in
  text)
    echo "📝 Publishing text post..." >&2

    PAYLOAD=$(jq -n \
      --arg author "$PERSON_URN" \
      --arg text "$TEXT" \
      '{
        "author": $author,
        "lifecycleState": "PUBLISHED",
        "visibility": "PUBLIC",
        "commentary": $text,
        "distribution": {
          "feedDistribution": "MAIN_FEED"
        }
      }')

    RESULT=$(create_post "$PAYLOAD")
    echo "✅ Text post published!" >&2

    jq -n \
      --arg type "text" \
      --arg result "$RESULT" \
      '{
        "status": "success",
        "type": $type,
        "response": $result
      }'
    ;;

  image)
    if [[ -z "$IMAGE_PATH" ]]; then
      echo '{"error": "Image post requires image_path argument"}' >&2
      exit 1
    fi

    if [[ ! -f "$IMAGE_PATH" ]]; then
      echo "{\"error\": \"Image file not found: $IMAGE_PATH\"}" >&2
      exit 1
    fi

    echo "📤 Registering image upload..." >&2
    REGISTER_RESULT=$(register_image_upload)
    UPLOAD_URL=$(echo "$REGISTER_RESULT" | cut -d'|' -f1)
    ASSET_URN=$(echo "$REGISTER_RESULT" | cut -d'|' -f2)
    echo "✅ Upload registered: $ASSET_URN" >&2

    echo "📤 Uploading image binary..." >&2
    upload_image_binary "$UPLOAD_URL" "$IMAGE_PATH"
    echo "✅ Image uploaded!" >&2

    echo "📝 Publishing image post..." >&2

    PAYLOAD=$(jq -n \
      --arg author "$PERSON_URN" \
      --arg text "$TEXT" \
      --arg asset "$ASSET_URN" \
      '{
        "author": $author,
        "lifecycleState": "PUBLISHED",
        "visibility": "PUBLIC",
        "commentary": $text,
        "distribution": {
          "feedDistribution": "MAIN_FEED"
        },
        "content": {
          "media": {
            "id": $asset
          }
        }
      }')

    RESULT=$(create_post "$PAYLOAD")
    echo "✅ Image post published!" >&2

    jq -n \
      --arg type "image" \
      --arg asset "$ASSET_URN" \
      --arg result "$RESULT" \
      '{
        "status": "success",
        "type": $type,
        "asset_urn": $asset,
        "response": $result
      }'
    ;;

  article)
    if [[ -z "$ARTICLE_URL" ]]; then
      echo '{"error": "Article post requires article_url argument"}' >&2
      exit 1
    fi

    echo "📝 Publishing article post..." >&2

    PAYLOAD=$(jq -n \
      --arg author "$PERSON_URN" \
      --arg text "$TEXT" \
      --arg url "$ARTICLE_URL" \
      --arg title "${ARTICLE_TITLE:-}" \
      '{
        "author": $author,
        "lifecycleState": "PUBLISHED",
        "visibility": "PUBLIC",
        "commentary": $text,
        "distribution": {
          "feedDistribution": "MAIN_FEED"
        },
        "content": {
          "article": {
            "source": $url,
            "title": $title
          }
        }
      }')

    RESULT=$(create_post "$PAYLOAD")
    echo "✅ Article post published!" >&2

    jq -n \
      --arg type "article" \
      --arg url "$ARTICLE_URL" \
      --arg result "$RESULT" \
      '{
        "status": "success",
        "type": $type,
        "article_url": $url,
        "response": $result
      }'
    ;;

  *)
    echo "{\"error\": \"Unknown post type: $POST_TYPE. Valid: text, image, article\"}" >&2
    exit 1
    ;;
esac

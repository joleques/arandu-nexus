#!/usr/bin/env bash
# post-instagram.sh — Publica conteúdo no Instagram via Graph API
# Dependências: curl, jq
# Uso: ./post-instagram.sh <config_file> <image_paths> <caption> [type]
#   config_file  — caminho do artigos/.config-social-media.json
#   image_paths  — caminhos das imagens separados por vírgula (ex: img1.jpg,img2.jpg)
#   caption      — texto do post
#   type         — feed|carrossel|reel (padrão: feed)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GRAPH_API_VERSION="v25.0"
GRAPH_API_BASE="https://graph.instagram.com/${GRAPH_API_VERSION}"

CONFIG_FILE="${1:-}"
IMAGE_PATHS="${2:-}"
CAPTION="${3:-}"
POST_TYPE="${4:-feed}"

# ──────────────────────────────────────────────────────────
# Validações de entrada
# ──────────────────────────────────────────────────────────

if [[ -z "$CONFIG_FILE" ]] || [[ -z "$IMAGE_PATHS" ]] || [[ -z "$CAPTION" ]]; then
  echo '{"error": "Usage: ./post-instagram.sh <config_file> <image_paths> <caption> [type]"}' >&2
  exit 1
fi

if [[ ! -f "$CONFIG_FILE" ]]; then
  echo "{\"error\": \"Config file not found: $CONFIG_FILE\"}" >&2
  exit 1
fi

# ──────────────────────────────────────────────────────────
# Ler configuração
# ──────────────────────────────────────────────────────────

INSTAGRAM_ACCOUNT_ID=$(jq -r '.instagram.account_id' "$CONFIG_FILE")
ACCESS_TOKEN=$(jq -r '.instagram.access_token' "$CONFIG_FILE")
IMGBB_API_KEY=$(jq -r '.instagram.imgbb_api_key' "$CONFIG_FILE")

if [[ -z "$INSTAGRAM_ACCOUNT_ID" ]] || [[ "$INSTAGRAM_ACCOUNT_ID" == "null" ]]; then
  echo '{"error": "Missing instagram.account_id in config file"}' >&2
  exit 1
fi

if [[ -z "$ACCESS_TOKEN" ]] || [[ "$ACCESS_TOKEN" == "null" ]]; then
  echo '{"error": "Missing instagram.access_token in config file"}' >&2
  exit 1
fi

if [[ -z "$IMGBB_API_KEY" ]] || [[ "$IMGBB_API_KEY" == "null" ]]; then
  echo '{"error": "Missing instagram.imgbb_api_key in config file"}' >&2
  exit 1
fi

# ──────────────────────────────────────────────────────────
# Funções auxiliares
# ──────────────────────────────────────────────────────────

upload_to_imgbb() {
  local image_path="$1"

  # Se já é uma URL, retornar diretamente
  if [[ "$image_path" =~ ^https?:// ]]; then
    echo "$image_path"
    return 0
  fi

  local result
  result=$("$SCRIPT_DIR/upload-imgbb.sh" "$image_path" "$IMGBB_API_KEY")

  local status
  status=$(echo "$result" | jq -r '.status')

  if [[ "$status" != "success" ]]; then
    echo "ImgBB upload failed for: $image_path" >&2
    return 1
  fi

  echo "$result" | jq -r '.url'
}

create_media_container() {
  local image_url="$1"
  local caption="${2:-}"
  local is_carousel_item="${3:-false}"
  local media_type="${4:-}"

  local params=()
  params+=("-d" "access_token=${ACCESS_TOKEN}")

  if [[ "$is_carousel_item" == "true" ]]; then
    params+=("-d" "image_url=${image_url}")
    params+=("-d" "is_carousel_item=true")
  elif [[ "$media_type" == "REELS" ]]; then
    params+=("-d" "video_url=${image_url}")
    params+=("-d" "media_type=REELS")
    params+=("-d" "caption=${caption}")
  elif [[ "$media_type" == "CAROUSEL" ]]; then
    # children já vem em image_url como IDs separados por vírgula
    params+=("-d" "media_type=CAROUSEL")
    params+=("-d" "children=${image_url}")
    params+=("-d" "caption=${caption}")
  else
    params+=("-d" "image_url=${image_url}")
    params+=("-d" "caption=${caption}")
  fi

  local response
  response=$(curl -s -X POST \
    "${GRAPH_API_BASE}/${INSTAGRAM_ACCOUNT_ID}/media" \
    "${params[@]}")

  local container_id
  container_id=$(echo "$response" | jq -r '.id // empty')

  if [[ -z "$container_id" ]]; then
    local error_msg
    error_msg=$(echo "$response" | jq -r '.error.message // "Unknown error"')
    echo "{\"error\": \"Failed to create media container: $error_msg\"}" >&2
    return 1
  fi

  echo "$container_id"
}

publish_container() {
  local creation_id="$1"

  local response
  response=$(curl -s -X POST \
    "${GRAPH_API_BASE}/${INSTAGRAM_ACCOUNT_ID}/media_publish" \
    -d "creation_id=${creation_id}" \
    -d "access_token=${ACCESS_TOKEN}")

  local post_id
  post_id=$(echo "$response" | jq -r '.id // empty')

  if [[ -z "$post_id" ]]; then
    local error_msg
    error_msg=$(echo "$response" | jq -r '.error.message // "Unknown error"')
    echo "{\"error\": \"Failed to publish: $error_msg\"}" >&2
    return 1
  fi

  echo "$post_id"
}

# ──────────────────────────────────────────────────────────
# Execução principal
# ──────────────────────────────────────────────────────────

# Converter image_paths em array
IFS=',' read -ra IMAGES <<< "$IMAGE_PATHS"

case "$POST_TYPE" in
  feed)
    # Post de imagem única
    if [[ ${#IMAGES[@]} -ne 1 ]]; then
      echo '{"error": "Feed post requires exactly 1 image"}' >&2
      exit 1
    fi

    echo "📤 Uploading image to ImgBB..." >&2
    PUBLIC_URL=$(upload_to_imgbb "${IMAGES[0]}")
    echo "✅ Image uploaded: $PUBLIC_URL" >&2

    echo "📦 Creating media container..." >&2
    CONTAINER_ID=$(create_media_container "$PUBLIC_URL" "$CAPTION")
    echo "✅ Container created: $CONTAINER_ID" >&2

    echo "🚀 Publishing post..." >&2
    POST_ID=$(publish_container "$CONTAINER_ID")
    echo "✅ Post published!" >&2

    jq -n \
      --arg post_id "$POST_ID" \
      --arg type "feed" \
      --arg image_url "$PUBLIC_URL" \
      '{
        "status": "success",
        "post_id": $post_id,
        "type": $type,
        "image_url": $image_url,
        "post_url": ("https://www.instagram.com/p/" + $post_id)
      }'
    ;;

  carrossel)
    # Post carrossel (2-10 imagens)
    if [[ ${#IMAGES[@]} -lt 2 ]] || [[ ${#IMAGES[@]} -gt 10 ]]; then
      echo '{"error": "Carousel requires 2-10 images"}' >&2
      exit 1
    fi

    CHILD_IDS=()
    for i in "${!IMAGES[@]}"; do
      echo "📤 Uploading image $((i+1))/${#IMAGES[@]} to ImgBB..." >&2
      PUBLIC_URL=$(upload_to_imgbb "${IMAGES[$i]}")
      echo "✅ Image $((i+1)) uploaded: $PUBLIC_URL" >&2

      echo "📦 Creating child container $((i+1))..." >&2
      CHILD_ID=$(create_media_container "$PUBLIC_URL" "" "true")
      CHILD_IDS+=("$CHILD_ID")
      echo "✅ Child container $((i+1)): $CHILD_ID" >&2
    done

    # Juntar IDs com vírgula
    CHILDREN_CSV=$(IFS=','; echo "${CHILD_IDS[*]}")

    echo "📦 Creating carousel container..." >&2
    CAROUSEL_ID=$(create_media_container "$CHILDREN_CSV" "$CAPTION" "false" "CAROUSEL")
    echo "✅ Carousel container: $CAROUSEL_ID" >&2

    echo "🚀 Publishing carousel..." >&2
    POST_ID=$(publish_container "$CAROUSEL_ID")
    echo "✅ Carousel published!" >&2

    jq -n \
      --arg post_id "$POST_ID" \
      --arg type "carrossel" \
      --arg image_count "${#IMAGES[@]}" \
      '{
        "status": "success",
        "post_id": $post_id,
        "type": $type,
        "image_count": ($image_count | tonumber),
        "post_url": ("https://www.instagram.com/p/" + $post_id)
      }'
    ;;

  reel)
    # Post de reel (vídeo)
    if [[ ${#IMAGES[@]} -ne 1 ]]; then
      echo '{"error": "Reel requires exactly 1 video"}' >&2
      exit 1
    fi

    echo "📤 Uploading video..." >&2
    PUBLIC_URL=$(upload_to_imgbb "${IMAGES[0]}")
    echo "✅ Video URL: $PUBLIC_URL" >&2

    echo "📦 Creating reel container..." >&2
    CONTAINER_ID=$(create_media_container "$PUBLIC_URL" "$CAPTION" "false" "REELS")
    echo "✅ Reel container: $CONTAINER_ID" >&2

    echo "🚀 Publishing reel..." >&2
    POST_ID=$(publish_container "$CONTAINER_ID")
    echo "✅ Reel published!" >&2

    jq -n \
      --arg post_id "$POST_ID" \
      --arg type "reel" \
      --arg video_url "$PUBLIC_URL" \
      '{
        "status": "success",
        "post_id": $post_id,
        "type": $type,
        "video_url": $video_url,
        "post_url": ("https://www.instagram.com/p/" + $post_id)
      }'
    ;;

  *)
    echo "{\"error\": \"Unknown post type: $POST_TYPE. Valid: feed, carrossel, reel\"}" >&2
    exit 1
    ;;
esac

---
name: instagram-poster
description: Publica conteúdo no Instagram via Instagram Graph API (Meta) — suporta posts de imagem, carrosséis e reels. Usa ImgBB para hospedagem gratuita de imagens.
---

# 📸 Publicação no Instagram via Graph API

Skill para publicar conteúdo no Instagram usando a API oficial gratuita do Meta, com upload automático de imagens locais via ImgBB.

> [!IMPORTANT]
> **Regra de Ouro:** Antes de publicar, SEMPRE pedir confirmação ao usuário com preview completo do post (caption, imagem, tipo). Nunca publicar automaticamente sem aprovação explícita.

---

## 🎯 Quando Usar Esta Skill

Use quando o usuário pedir para:

- **Publicar** um post no Instagram (imagem, carrossel ou reel)
- **Postar** conteúdo gerado pelo workflow `write-tech-article` ou pela skill `designer`
- **Enviar** imagens/vídeos para o Instagram Feed

---

## 🔧 Pré-requisitos

### Arquivo de Configuração — `artigos/.config-social-media.json`

As credenciais do Instagram ficam na seção `instagram` do arquivo unificado `artigos/.config-social-media.json`:

```json
{
  "instagram": {
    "account_id": "SEU_INSTAGRAM_BUSINESS_ID",
    "access_token": "SEU_ACCESS_TOKEN_META",
    "imgbb_api_key": "SUA_API_KEY_IMGBB"
  }
}
```

> [!CAUTION]
> Este arquivo contém credenciais sensíveis. Ele **DEVE** estar no `.gitignore` do projeto. A skill verifica e adiciona automaticamente caso não esteja.

### Dependências de Sistema

- `curl` — para chamadas HTTP
- `jq` — para parsing de JSON

---

## 🚀 Fluxo de Execução

### Passo 0: Verificar Configuração

Antes de qualquer ação, verifique se `artigos/.config-social-media.json` existe e contém a seção `instagram`.

**Se NÃO existir ou seção `instagram` ausente → Executar Onboarding Guiado (ver seção abaixo)**

**Se existir → Ler as credenciais com `jq`:**

```bash
CONFIG_FILE="artigos/.config-social-media.json"
INSTAGRAM_ACCOUNT_ID=$(jq -r '.instagram.account_id' "$CONFIG_FILE")
ACCESS_TOKEN=$(jq -r '.instagram.access_token' "$CONFIG_FILE")
IMGBB_API_KEY=$(jq -r '.instagram.imgbb_api_key' "$CONFIG_FILE")
```

---

### Passo 1: Upload de Imagem Local para ImgBB

As imagens locais (ex: geradas pela skill `designer` em `image/`) precisam de URL pública para a Graph API do Instagram.

```bash
# Upload para ImgBB
RESPONSE=$(curl -s -X POST "https://api.imgbb.com/1/upload" \
  -F "key=$IMGBB_API_KEY" \
  -F "image=@/caminho/local/imagem.jpg")

# Extrair URL pública
IMAGE_URL=$(echo "$RESPONSE" | jq -r '.data.url')
```

> [!NOTE]
> Se o usuário já tiver uma URL pública de imagem, pular esta etapa.

---

### Passo 2: Criar Media Container

```bash
# Post de imagem única (feed)
CONTAINER=$(curl -s -X POST \
  "https://graph.instagram.com/v25.0/${INSTAGRAM_ACCOUNT_ID}/media" \
  -d "image_url=${IMAGE_URL}" \
  -d "caption=${CAPTION}" \
  -d "access_token=${ACCESS_TOKEN}")

CREATION_ID=$(echo "$CONTAINER" | jq -r '.id')
```

**Para Carrossel (2-10 imagens):**

```bash
# 1. Criar container individual para cada imagem (sem caption)
CHILD_ID=$(curl -s -X POST \
  "https://graph.instagram.com/v25.0/${INSTAGRAM_ACCOUNT_ID}/media" \
  -d "image_url=${IMAGE_URL_N}" \
  -d "is_carousel_item=true" \
  -d "access_token=${ACCESS_TOKEN}" | jq -r '.id')

# 2. Criar container do carrossel (com caption + children)
CAROUSEL_ID=$(curl -s -X POST \
  "https://graph.instagram.com/v25.0/${INSTAGRAM_ACCOUNT_ID}/media" \
  -d "media_type=CAROUSEL" \
  -d "caption=${CAPTION}" \
  -d "children=${CHILD_1},${CHILD_2},${CHILD_N}" \
  -d "access_token=${ACCESS_TOKEN}" | jq -r '.id')
```

**Para Reel (vídeo):**

```bash
CONTAINER=$(curl -s -X POST \
  "https://graph.instagram.com/v25.0/${INSTAGRAM_ACCOUNT_ID}/media" \
  -d "video_url=${VIDEO_URL}" \
  -d "caption=${CAPTION}" \
  -d "media_type=REELS" \
  -d "access_token=${ACCESS_TOKEN}")
```

---

### Passo 3: Publicar o Container

```bash
RESULT=$(curl -s -X POST \
  "https://graph.instagram.com/v25.0/${INSTAGRAM_ACCOUNT_ID}/media_publish" \
  -d "creation_id=${CREATION_ID}" \
  -d "access_token=${ACCESS_TOKEN}")

POST_ID=$(echo "$RESULT" | jq -r '.id')
```

---

## 📋 Onboarding Guiado

Quando `artigos/.config-social-media.json` não existe ou não contém a seção `instagram`, apresente este guia:

```
⚠️ Configuração do Instagram não encontrada em artigos/.config-social-media.json

Para publicar no Instagram via API, você precisa configurar 3 coisas.
Vou te guiar em cada uma:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 PASSO 1 — Conta Instagram Business/Creator
   Seu Instagram precisa ser conta profissional (grátis).
   → Instagram → Configurações → Conta → Mudar para conta profissional
   → Escolha "Business" ou "Criador de conteúdo"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 PASSO 2 — Vincular ao Facebook
   A Graph API exige vínculo com uma Página do Facebook.
   → Instagram → Configurações → Conta → Contas vinculadas → Facebook
   → Vincule (ou crie) uma Página do Facebook

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 PASSO 3 — Criar Facebook App
   → Acesse: https://developers.facebook.com/
   → Botão "Criar App" → Tipo "Business"
   → Adicione o produto "Instagram Graph API"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 PASSO 4 — Gerar Access Token
   → No App Dashboard → Ferramentas → Graph API Explorer
   → Selecione seu App
   → Adicione permissões:
     • instagram_basic
     • instagram_content_publish
     • pages_read_engagement
   → Clique "Generate Access Token"
   → Converta para long-lived token (~60 dias):

   curl -s "https://graph.facebook.com/v25.0/oauth/access_token \
     ?grant_type=fb_exchange_token \
     &client_id=SEU_APP_ID \
     &client_secret=SEU_APP_SECRET \
     &fb_exchange_token=SEU_TOKEN_CURTO"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 PASSO 5 — Obter Instagram Account ID
   Com o token gerado, execute:

   # 1. Listar páginas do Facebook
   curl -s "https://graph.facebook.com/v25.0/me/accounts?access_token=SEU_TOKEN"
   # → Copie o "id" da página vinculada ao Instagram

   # 2. Obter o ID da conta Instagram
   curl -s "https://graph.facebook.com/v25.0/{PAGE_ID}?fields=instagram_business_account&access_token=SEU_TOKEN"
   # → O campo "instagram_business_account.id" é o seu account_id

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 PASSO 6 — API Key do ImgBB (para upload de imagens)
   → Crie conta grátis em: https://imgbb.com/
   → Acesse: https://api.imgbb.com/
   → Copie sua API Key

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Quando tiver os 3 valores, me informe:
1. Instagram Account ID
2. Access Token (long-lived)
3. ImgBB API Key

Eu crio/atualizo o artigos/.config-social-media.json e adiciono ao .gitignore.
```

Após o usuário fornecer os valores:

1. Criar (ou atualizar) `artigos/.config-social-media.json` com a seção `instagram`
2. Verificar `.gitignore` — se não contiver `.config-social-media.json`, adicionar
3. Confirmar ao usuário que tudo está configurado
4. Prosseguir com a publicação

---

## ⚠️ Tratamento de Erros

| Erro | Causa Provável | Ação |
|------|---------------|------|
| `OAuthException` | Token expirado ou inválido | Guiar renovação do token (Passo 4 do onboarding) |
| `Invalid image` | URL da imagem inacessível | Verificar upload no ImgBB, tentar novamente |
| `Application limit reached` | Quota da API excedida (100 posts/24h) | Informar limite e sugerir aguardar |
| `Not a Business Account` | Conta pessoal | Guiar conversão para Business/Creator |
| `Missing permission` | Permissões insuficientes no token | Guiar geração de novo token com permissões corretas |

---

## 📏 Limites da API

| Recurso | Limite |
|---------|--------|
| Posts por 24h | 100 (carrossel conta como 1) |
| Imagens por carrossel | Máx. 10 |
| Caption | Máx. 2.200 caracteres |
| Hashtags por post | Máx. 30 |
| Formato imagem | JPEG recomendado |

---

## ⚡ Quick Reference

```
┌─────────────────────────────────────────────────────────────┐
│         INSTAGRAM POSTER — DECISÃO RÁPIDA                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Config     → artigos/.config-social-media.json (instagram) │
│  Sem config → Onboarding guiado (ensina tudo ao usuário)    │
│  Upload     → ImgBB (local → URL pública)                   │
│  API        → Instagram Graph API v25.0 (grátis)            │
│  Tipos      → Feed (1 img) | Carrossel (2-10) | Reel (vid) │
│  Fluxo      → ImgBB → Container → Publish                  │
│                                                             │
│  REGRA DE OURO: Sempre pedir confirmação antes de publicar  │
│  LIMITE: 100 posts/24h | 2.200 chars caption | 30 hashtags  │
└─────────────────────────────────────────────────────────────┘
```

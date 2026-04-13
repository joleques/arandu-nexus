---
name: linkedin-poster
description: Publica conteúdo no LinkedIn via Posts API — suporta posts de texto, imagem e artigos com link preview. API gratuita com permissão Open.
---

# 💼 Publicação no LinkedIn via Posts API

Skill para publicar conteúdo no LinkedIn usando a API oficial gratuita (Posts API v2), com upload direto de imagens (sem precisar de serviço externo).

> [!IMPORTANT]
> **Regra de Ouro:** Antes de publicar, SEMPRE pedir confirmação ao usuário com preview completo do post (texto, imagem, tipo). Nunca publicar automaticamente sem aprovação explícita.

---

## 🎯 Quando Usar Esta Skill

Use quando o usuário pedir para:

- **Publicar** um post no LinkedIn (texto, imagem ou artigo com link)
- **Postar** conteúdo gerado pelo workflow `write-tech-article` ou pela skill `designer`
- **Compartilhar** artigos técnicos no LinkedIn

---

## 🔧 Pré-requisitos

### Arquivo de Configuração — `artigos/.config-social-media.json`

As credenciais do LinkedIn ficam na seção `linkedin` do arquivo unificado:

```json
{
  "linkedin": {
    "person_urn": "urn:li:person:SEU_PERSON_ID",
    "access_token": "SEU_ACCESS_TOKEN_LINKEDIN"
  }
}
```

> [!CAUTION]
> Este arquivo contém credenciais sensíveis. Ele **DEVE** estar no `.gitignore` do projeto.

### Dependências de Sistema

- `curl` — para chamadas HTTP
- `jq` — para parsing de JSON

---

## 🚀 Fluxo de Execução

### Passo 0: Verificar Configuração

Antes de qualquer ação, verifique se `artigos/.config-social-media.json` existe e contém a seção `linkedin`.

**Se NÃO existir ou seção `linkedin` ausente → Executar Onboarding Guiado (ver seção abaixo)**

**Se existir → Ler as credenciais com `jq`:**

```bash
CONFIG_FILE="artigos/.config-social-media.json"
PERSON_URN=$(jq -r '.linkedin.person_urn' "$CONFIG_FILE")
ACCESS_TOKEN=$(jq -r '.linkedin.access_token' "$CONFIG_FILE")
```

---

### Post de Texto Puro

```bash
curl -s -X POST "https://api.linkedin.com/v2/posts" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -H "X-Restli-Protocol-Version: 2.0.0" \
  -H "LinkedIn-Version: 202501" \
  -d '{
    "author": "'"${PERSON_URN}"'",
    "lifecycleState": "PUBLISHED",
    "visibility": "PUBLIC",
    "commentary": "'"${TEXT}"'",
    "distribution": {
      "feedDistribution": "MAIN_FEED"
    }
  }'
```

---

### Post com Artigo/Link (Preview Automático)

O LinkedIn gera preview automático com Open Graph tags do URL:

```bash
curl -s -X POST "https://api.linkedin.com/v2/posts" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -H "X-Restli-Protocol-Version: 2.0.0" \
  -H "LinkedIn-Version: 202501" \
  -d '{
    "author": "'"${PERSON_URN}"'",
    "lifecycleState": "PUBLISHED",
    "visibility": "PUBLIC",
    "commentary": "'"${TEXT}"'",
    "distribution": {
      "feedDistribution": "MAIN_FEED"
    },
    "content": {
      "article": {
        "source": "'"${ARTICLE_URL}"'",
        "title": "'"${ARTICLE_TITLE}"'"
      }
    }
  }'
```

---

### Post com Imagem (3 etapas)

#### Etapa 1: Registrar Upload

```bash
REGISTER=$(curl -s -X POST "https://api.linkedin.com/v2/assets?action=registerUpload" \
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

UPLOAD_URL=$(echo "$REGISTER" | jq -r '.value.uploadMechanism["com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"].uploadUrl')
ASSET_URN=$(echo "$REGISTER" | jq -r '.value.asset')
```

#### Etapa 2: Upload do Binário

```bash
curl -s -X PUT "$UPLOAD_URL" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: image/jpeg" \
  --upload-file /caminho/local/imagem.jpg
```

> [!NOTE]
> Diferente do Instagram, o LinkedIn aceita upload direto do binário — **sem precisar de ImgBB**.

#### Etapa 3: Criar Post com Imagem

```bash
curl -s -X POST "https://api.linkedin.com/v2/posts" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -H "X-Restli-Protocol-Version: 2.0.0" \
  -H "LinkedIn-Version: 202501" \
  -d '{
    "author": "'"${PERSON_URN}"'",
    "lifecycleState": "PUBLISHED",
    "visibility": "PUBLIC",
    "commentary": "'"${TEXT}"'",
    "distribution": {
      "feedDistribution": "MAIN_FEED"
    },
    "content": {
      "media": {
        "id": "'"${ASSET_URN}"'"
      }
    }
  }'
```

---

## 📋 Onboarding Guiado

Quando `artigos/.config-social-media.json` não existe ou não contém a seção `linkedin`, apresente este guia:

```
⚠️ Configuração do LinkedIn não encontrada em artigos/.config-social-media.json

Para publicar no LinkedIn via API, você precisa configurar 2 coisas.
Vou te guiar em cada uma:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 PASSO 1 — Criar LinkedIn App
   → Acesse: https://www.linkedin.com/developers/apps
   → Botão "Create App"
   → Preencha: nome, página da empresa (crie se não tiver), logo
   → Na aba "Products", adicione:
     • "Share on LinkedIn"
     • "Sign In with LinkedIn using OpenID Connect"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 PASSO 2 — Verificar Página da Empresa
   → Na aba "Settings" do seu App
   → Clique "Verify" ao lado do nome da página
   → Siga o processo de verificação (admin da página precisa aprovar)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 PASSO 3 — Gerar Access Token
   → Na aba "Auth", copie o Client ID e Client Secret
   → Abra no navegador (substitua os valores):

   https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=SEU_CLIENT_ID&redirect_uri=https://localhost&scope=openid%20profile%20w_member_social&state=random123

   → Autorize o app → Copie o "code" da URL de redirecionamento
   → Troque o code por token:

   curl -s -X POST "https://www.linkedin.com/oauth/v2/accessToken" \
     -d "grant_type=authorization_code" \
     -d "code=SEU_CODE" \
     -d "redirect_uri=https://localhost" \
     -d "client_id=SEU_CLIENT_ID" \
     -d "client_secret=SEU_CLIENT_SECRET"

   → Copie o access_token da resposta (~60 dias de validade)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 PASSO 4 — Obter Person URN
   Com o token gerado, execute:

   curl -s "https://api.linkedin.com/v2/userinfo" \
     -H "Authorization: Bearer SEU_TOKEN"

   → O campo "sub" é o seu Person ID
   → Seu Person URN será: urn:li:person:SEU_SUB

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Quando tiver os 2 valores, me informe:
1. Person URN (urn:li:person:xxx)
2. Access Token

Eu crio/atualizo o artigos/.config-social-media.json e adiciono ao .gitignore.
```

Após o usuário fornecer os valores:

1. Criar (ou atualizar) `artigos/.config-social-media.json` com a seção `linkedin`
2. Verificar `.gitignore` — se não contiver `.config-social-media.json`, adicionar
3. Confirmar ao usuário que tudo está configurado
4. Prosseguir com a publicação

---

## ⚠️ Tratamento de Erros

| Erro | Causa Provável | Ação |
|------|---------------|------|
| `401 Unauthorized` | Token expirado ou inválido | Guiar renovação do token (Passo 3 do onboarding) |
| `403 Forbidden` | Permissão `w_member_social` ausente | Verificar Products no App e gerar novo token |
| `422 Unprocessable` | Payload inválido (ex: image URN malformado) | Verificar formato do JSON |
| `429 Too Many Requests` | Rate limit excedido | Aguardar e tentar novamente |

---

## 📏 Limites da API

| Recurso | Limite |
|---------|--------|
| Posts por dia | 100 (por membro) |
| Texto do post | Máx. 3.000 caracteres |
| Imagens | Upload direto (JPEG, PNG) |
| Tamanho máx. imagem | 10 MB |

---

## ⚡ Quick Reference

```
┌─────────────────────────────────────────────────────────────┐
│          LINKEDIN POSTER — DECISÃO RÁPIDA                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Config     → artigos/.config-social-media.json (linkedin)  │
│  Sem config → Onboarding guiado (ensina tudo ao usuário)    │
│  Upload     → Direto para LinkedIn (sem serviço externo)    │
│  API        → LinkedIn Posts API v2 (grátis, Open Perm.)    │
│  Tipos      → Texto | Imagem | Artigo/Link                 │
│  Fluxo      → Register → Upload → Post                     │
│                                                             │
│  REGRA DE OURO: Sempre pedir confirmação antes de publicar  │
│  LIMITE: 100 posts/dia | 3.000 chars | 10 MB imagem        │
└─────────────────────────────────────────────────────────────┘
```

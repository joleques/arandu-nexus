# 📸 Instagram Poster — Publicação via Graph API

Skill que publica conteúdo no Instagram (posts de imagem, carrosséis e reels) usando a **Instagram Graph API** oficial do Meta (gratuita), com upload automático de imagens locais via **ImgBB** (gratuito).

## Parâmetros

| Parâmetro | Obrigatório | Descrição |
|-----------|:-----------:|-----------|
| **Caption** | ✅ | Texto do post (máx. 2.200 caracteres) |
| **Imagens** | ✅ | Caminhos locais ou URLs públicas das imagens |
| **Tipo** | ❌ | `feed` (padrão), `carrossel` ou `reel` |
| **Hashtags** | ❌ | Hashtags a concatenar ao caption (máx. 30) |

## Tipos de Post Suportados

| Tipo | Imagens | Descrição |
|------|:-------:|-----------|
| `feed` | 1 | Post de imagem única no feed |
| `carrossel` | 2–10 | Múltiplas imagens deslizáveis |
| `reel` | 1 (vídeo) | Vídeo vertical no formato Reels |

## Pré-requisitos

1. **Conta Instagram Business ou Creator** (grátis para converter)
2. **Página do Facebook** vinculada à conta Instagram
3. **Facebook App** criado no [Meta Developer Dashboard](https://developers.facebook.com/)
4. **Access Token** com permissões: `instagram_basic`, `instagram_content_publish`, `pages_read_engagement`
5. **API Key do ImgBB** (grátis em [api.imgbb.com](https://api.imgbb.com/))
6. Dependências de sistema: `curl`, `jq`

## Configuração

As credenciais ficam na seção `instagram` de `artigos/.config-social-media.json` (deve estar no `.gitignore`):

```json
{
  "instagram": {
    "account_id": "SEU_INSTAGRAM_BUSINESS_ID",
    "access_token": "SEU_ACCESS_TOKEN_META",
    "imgbb_api_key": "SUA_API_KEY_IMGBB"
  }
}
```

> **Não tem o arquivo ainda?** Ao usar a skill, ela entra em modo de onboarding guiado e ensina passo a passo como obter cada credencial.

## Fluxo de Publicação

```
Imagem Local → Upload ImgBB → URL Pública
                                  ↓
                      Criar Media Container (Graph API)
                                  ↓
                      Publicar Container → Post no Instagram
```

## Exemplos de Uso

```
Publica essa imagem no Instagram com legenda "Novo artigo sobre microserviços"
Posta essas 4 imagens como carrossel no Instagram
Publica no Instagram (a skill guia o setup se não estiver configurado)
```

## Limites da API

| Recurso | Limite |
|---------|--------|
| Posts por 24h | 100 (carrossel = 1) |
| Imagens por carrossel | Máx. 10 |
| Caption | Máx. 2.200 caracteres |
| Hashtags por post | Máx. 30 |

## Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `SKILL.md` | Instruções completas da skill para o agente |
| `README.md` | Este arquivo |
| `scripts/upload-imgbb.sh` | Upload de imagem local → ImgBB → URL pública |
| `scripts/post-instagram.sh` | Orquestra upload + container + publish no Instagram |

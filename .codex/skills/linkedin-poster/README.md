# 💼 LinkedIn Poster — Publicação via Posts API

Skill que publica conteúdo no LinkedIn (posts de texto, imagem e artigos com link preview) usando a **LinkedIn Posts API v2** oficial (gratuita com permissão Open).

## Parâmetros

| Parâmetro | Obrigatório | Descrição |
|-----------|:-----------:|-----------|
| **Texto** | ✅ | Texto do post (máx. 3.000 caracteres) |
| **Tipo** | ❌ | `text` (padrão), `image` ou `article` |
| **Imagem** | ⚠️ | Caminho local da imagem (obrigatório para `image`) |
| **URL Artigo** | ⚠️ | URL do artigo (obrigatório para `article`) |
| **Título Artigo** | ❌ | Título personalizado (LinkedIn usa Open Graph se omitido) |

## Tipos de Post Suportados

| Tipo | Descrição |
|------|-----------|
| `text` | Post de texto puro no feed |
| `image` | Post com imagem (upload direto, sem serviço externo) |
| `article` | Post com link preview automático (Open Graph) |

## Pré-requisitos

1. **LinkedIn App** criado no [Developer Portal](https://www.linkedin.com/developers/apps)
2. **Products:** "Share on LinkedIn" + "Sign In with LinkedIn using OpenID Connect"
3. **Access Token** com permissão `w_member_social` (Open Permission, sem aprovação especial)
4. **Person URN** do seu perfil LinkedIn
5. Dependências de sistema: `curl`, `jq`

## Configuração

As credenciais ficam na seção `linkedin` de `artigos/.config-social-media.json` (deve estar no `.gitignore`):

```json
{
  "linkedin": {
    "person_urn": "urn:li:person:SEU_PERSON_ID",
    "access_token": "SEU_ACCESS_TOKEN_LINKEDIN"
  }
}
```

> **Não tem o arquivo ainda?** Ao usar a skill, ela entra em modo de onboarding guiado e ensina passo a passo como obter cada credencial.

## Fluxo de Publicação

**Texto puro:**
```
Texto → POST /posts → Publicado
```

**Com imagem:**
```
Register Upload → Upload Binário → POST /posts com asset URN → Publicado
```

**Com artigo/link:**
```
Texto + URL → POST /posts → LinkedIn gera preview automático
```

## Exemplos de Uso

```
Publica esse texto no LinkedIn
Posta essa imagem no LinkedIn com legenda "Novo artigo sobre microserviços"
Compartilha o link do artigo no LinkedIn
```

## Limites da API

| Recurso | Limite |
|---------|--------|
| Posts por dia | 100 |
| Texto do post | Máx. 3.000 caracteres |
| Tamanho máx. imagem | 10 MB |
| Formatos de imagem | JPEG, PNG |

## Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `SKILL.md` | Instruções completas da skill para o agente |
| `README.md` | Este arquivo |
| `scripts/post-linkedin.sh` | Publica texto, imagem ou artigo no LinkedIn |

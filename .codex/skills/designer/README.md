# 🎨 Designer — Criação de Conteúdo Visual

Skill que transforma o agente em uma Diretora de Arte Sênior focada em marketing de conteúdo e design de alto impacto. Cria imagens, infográficos, slides e animações sempre baseadas em conteúdo textual de entrada.

## Parâmetros

| Parâmetro | Obrigatório | Descrição |
|-----------|:-----------:|-----------|
| **Conteúdo base** | ✅ | Texto, arquivo `.md` ou URL que será a fundação da imagem |
| **Plataforma** | ✅ | Instagram, LinkedIn, TikTok ou Slides |
| **Formato** | ✅ | Tipo de peça (post, carrossel, infográfico, etc.) |
| **Referências visuais** | ❌ | Até 5 exemplos (imagens, links ou posts de redes sociais) para guiar o conceito visual |
| **Diretório de output** | ❌ | Caminho personalizado para salvar materiais (padrão: `image/`) |

## Como Funciona

1. **Conteúdo Restrito:** Não inventa conteúdo — o usuário deve fornecer o texto base ou caminho de arquivo
2. **Referências Visuais:** Pergunta proativamente se o usuário tem exemplos de referência (imagens, links, posts) para alinhar o estilo — opcional, até 5
3. **Abordagem Web-First:** Cria o design em HTML/CSS antes de converter em imagem
4. **Output organizado:** Todo material é salvo no diretório de output definido

## Estrutura de Saída

**Standalone (padrão):**

```
image/
└── uso-ia-desenvolvedores/
    ├── carrossel.html
    └── carrossel.png
```

**Via workflow (com diretório de output):**

```
artigos/{titulo-slug}/image/
└── {tema}/
    ├── infografico.html
    └── infografico.png
```

## Formatos Suportados

| Plataforma | Formatos |
|------------|----------|
| **Instagram** | Posts feed (1080x1080), stories (1080x1920), carrosséis |
| **LinkedIn** | Posts únicos (1200x627), carrosséis, infográficos |
| **TikTok** | Vídeo vertical / animação (1080x1920) |
| **Slides** | Apresentações widescreen (1920x1080 / 16:9) |

## Exemplo de Uso

```
Usando a skill designer, crie um infográfico para o LinkedIn
baseado no conteúdo do arquivo artigos/meu-artigo/content/artigo.md
```

**Com referências visuais:**

```
Usando a skill designer, crie um carrossel para o Instagram
baseado no conteúdo do arquivo artigos/meu-artigo/content/artigo.md.
Use como referência visual:
- https://dribbble.com/shots/exemplo-1
- /home/jorge/imagens/referencia-estilo.png
```

## Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `SKILL.md` | Instruções completas da skill |
| `README.md` | Este arquivo |

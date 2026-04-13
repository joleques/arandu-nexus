---
name: devcontainer-specialist
description: Cria, atualiza e melhora configurações de Dev Container (.devcontainer) seguindo o padrão da empresa
---

# ROLE

Você é o **Especialista em Dev Containers**, responsável por criar, atualizar e melhorar ambientes de desenvolvimento containerizados. Sua missão é garantir que os projetos tenham configurações ``.devcontainer`` padronizadas, completas e funcionais.

---

# OBJETIVO

Gerenciar configurações de Dev Container para projetos, incluindo:

1. **Criar** nova estrutura `.devcontainer` para projetos
2. **Atualizar** configurações existentes
3. **Melhorar** Dockerfiles e scripts de extensões

---

# FLUXO OBRIGATÓRIO

## 1. PERGUNTAR O NOME DO PROJETO

Antes de qualquer ação, você **DEVE** perguntar ao usuário:

> **Qual é o nome do projeto?**
> (Este nome será usado em `"name"` e `"workspaceFolder"` do devcontainer.json)

O nome deve seguir o padrão: `lowercase-com-hifens` (ex: `meu-projeto`, `umovme-hermes`)

---

## 2. PERGUNTAR O TIPO DE STACK

Pergunte ao usuário qual stack/linguagem principal:

- **Go** (default - baseado no template)
- **Node.js/TypeScript**
- **Python**
- **Multi-stack** (Go + Node.js)
- **Outro** (especificar)

---

## 3. PERGUNTAR SOBRE EXTENSÕES

Pergunte se o usuário deseja:

1. Usar o set padrão de extensões da empresa
2. Adicionar extensões personalizadas
3. Ambos

---

# ESTRUTURA GERADA

A skill gera os seguintes arquivos no diretório do projeto:

```
.devcontainer/
├── devcontainer.json    # Configuração principal
└── Dockerfile.dev       # Imagem customizada

scripts/
├── install-extensions.sh   # Script bash wrapper
└── install-extensions.js   # Instalador de extensões
```

---

# TEMPLATE: devcontainer.json

```json
{
  "name": "{{PROJECT_NAME}}",
  "build": {
    "context": "..",
    "dockerfile": "Dockerfile.dev"
  },
  "workspaceFolder": "/workspaces/{{PROJECT_NAME}}",
  "workspaceMount": "source=${localWorkspaceFolder},target=/workspaces/{{PROJECT_NAME}},type=bind,consistency=cached",
  "runArgs": [
    "--cap-add=SYS_PTRACE",
    "--security-opt",
    "seccomp=unconfined",
    "-v",
    "${env:HOME}/.ssh:/home/vscode/.ssh:ro"
  ],
  "appPort": [
    "8080:8080",
    "9090:9090"
  ],
  "customizations": {
    "vscode": {
      "settings": {
        {{LANGUAGE_SETTINGS}}
      },
      "extensions": [
        {{EXTENSIONS_LIST}}
      ]
    }
  },
  "postStartCommand": [
    {{POST_START_COMMANDS}},
    "bash scripts/install-extensions.sh"
  ]
}
```

---

# TEMPLATE: Dockerfile.dev (Go)

```dockerfile
FROM mcr.microsoft.com/devcontainers/go:1.25-bookworm

WORKDIR /workspaces/{{PROJECT_NAME}}

# Remove Yarn repo with expired GPG key
RUN rm -f /etc/apt/sources.list.d/yarn.list || true

RUN apt-get update && apt-get install -y \
    protobuf-compiler \
    iputils-ping

# mockgen
RUN go install github.com/golang/mock/mockgen@v1.6.0

# protoc plugins
RUN go install google.golang.org/protobuf/cmd/protoc-gen-go@v1.32.0
RUN go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@v1.3.0

# Node.js 24
RUN curl -fsSL https://deb.nodesource.com/setup_24.x | bash - && \
    apt-get install -y nodejs

RUN npm install -g typescript

RUN git config --global --add safe.directory '*'

RUN go version && node -v && npm -v

# Fix permissions for vscode user
RUN chown -R vscode:vscode /go
```

---

# TEMPLATE: Dockerfile.dev (Node.js)

```dockerfile
# Usa imagem Node.js 22 baseada em Debian (não Alpine) para compatibilidade com glibc
FROM node:22-bookworm-slim

# Instala dependências necessárias
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    bash \
    curl \
    wget \
    ca-certificates \
    sudo \
    procps \
    make \
    openssh-client \
    && rm -rf /var/lib/apt/lists/*

# Configura o usuário node com sudo
RUN echo "node ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/node \
    && chmod 0440 /etc/sudoers.d/node

# Configura timezone
ENV TZ=America/Sao_Paulo

# Diretório de trabalho
WORKDIR /workspaces/{{PROJECT_NAME}}

# Configura git safe directory
RUN git config --global --add safe.directory '*'

# Configura npm global para o usuário node
RUN mkdir -p /home/node/.npm-global \
    && chown -R node:node /home/node

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=/home/node/.npm-global/bin:$PATH

# Usa o usuário node por padrão
USER node

# Mantém o container em execução
CMD ["sleep", "infinity"]
```

---

# TEMPLATE: Dockerfile.dev (Python)

```dockerfile
FROM mcr.microsoft.com/devcontainers/python:3.12-bookworm

WORKDIR /workspaces/{{PROJECT_NAME}}

RUN apt-get update && apt-get install -y \
    iputils-ping

RUN pip install --upgrade pip poetry

RUN git config --global --add safe.directory '*'

RUN python --version && pip --version
```

---

# EXTENSÕES PADRÃO DA EMPRESA

## Core (Todas as Stacks)

```json
"davidanson.vscode-markdownlint",
"shardulm94.trailing-spaces",
"IBM.output-colorizer",
"Equinusocio.vsc-material-theme-icons",
"eamodio.gitlens",
"streetsidesoftware.code-spell-checker-portuguese-brazilian",
"tal7aouy.icons",
"ms-azuretools.vscode-docker",
"jlcodes.antigravity-cockpit",
"Google.geminicodeassist",
"marp-team.marp-vscode"
```

## Go

```json
"aldijav.golangwithdidi",
"golang.go",
"neonxp.gotools",
"honnamkuan.golang-snippets"
```

## Node.js/TypeScript

```json
"dbaeumer.vscode-eslint",
"esbenp.prettier-vscode",
"bradlc.vscode-tailwindcss",
"firsttris.vscode-jest-runner"
```

## Python

```json
"ms-python.python",
"ms-python.vscode-pylance",
"ms-python.black-formatter",
"charliermarsh.ruff"
```

---

# TEMPLATE: install-extensions.sh

```bash
#!/bin/bash
# Esse arquivo possui código gerado com IA

set -e

# Garante que o diretório scripts existe
cd "$(dirname "$0")"

echo "🚀 Iniciando instalação manual de extensões..."

# Verifica se node está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado."
    exit 1
fi

# Verifica se unzip está instalado
if ! command -v unzip &> /dev/null; then
    echo "📦 Instalando unzip..."
    apt-get update && apt-get install -y unzip
fi

node install-extensions.js

echo "✅ Instalação de extensões concluída!"
echo "⚠️  Por favor, faça um 'Reload Window' para carregar as novas extensões."
```

---

# TEMPLATE: install-extensions.js

```javascript
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const https = require('https');
const os = require('os');
const zlib = require('zlib');

// Esse arquivo possui código gerado com IA

const devContainerPath = path.join(__dirname, '..', '.devcontainer', 'devcontainer.json');

// Detecta diretório correto de extensões
const homeDir = os.homedir();
let extensionsDir = path.join(homeDir, '.vscode-server', 'extensions');
const antigravityDir = path.join(homeDir, '.antigravity-server', 'extensions');

if (fs.existsSync(antigravityDir)) {
    console.log(`Detectado ambiente Antigravity. Usando: ${antigravityDir}`);
    extensionsDir = antigravityDir;
} else if (fs.existsSync(path.join(homeDir, '.vscode-remote', 'extensions'))) {
    extensionsDir = path.join(homeDir, '.vscode-remote', 'extensions');
}

if (!fs.existsSync(extensionsDir)) {
    console.log(`Criando diretório de extensões: ${extensionsDir}`);
    fs.mkdirSync(extensionsDir, { recursive: true });
} else {
    console.log(`Diretório de extensões alvo: ${extensionsDir}`);
}

function installExtension(extensionId) {
    const [publisher, name] = extensionId.split('.');
    if (!publisher || !name) {
        console.error(`ID de extensão inválido: ${extensionId}`);
        return;
    }

    const vsixUrl = `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${publisher}/vsextensions/${name}/latest/vspackage`;
    const tempFile = path.join(os.tmpdir(), `${extensionId}.vsix`);

    console.log(`Baixando ${extensionId}...`);

    const file = fs.createWriteStream(tempFile);
    const requestOptions = {
        headers: {
            'User-Agent': 'Node.js/VSCode-Extension-Installer',
            'Accept-Encoding': 'identity'
        }
    };

    const handleResponse = (response) => {
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
            console.log(`Redirecionando para ${response.headers.location}...`);
            https.get(response.headers.location, requestOptions, handleResponse).on('error', handleError);
            return;
        }

        if (response.statusCode !== 200) {
            console.error(`Falha ao baixar ${extensionId}: HTTP ${response.statusCode}`);
            file.close(() => fs.unlink(tempFile, () => { }));
            return;
        }

        if (response.headers['content-encoding'] === 'gzip') {
            console.log(`Detectado gzip para ${extensionId}, descomprimindo...`);
            const gunzip = zlib.createGunzip();
            response.pipe(gunzip).pipe(file);
        } else {
            response.pipe(file);
        }

        file.on('finish', function () {
            file.close(() => extractAndInstall(tempFile, extensionId));
        });
    };

    const handleError = (err) => {
        fs.unlink(tempFile, () => { });
        console.error(`Erro ao baixar ${extensionId}: ${err.message}`);
    };

    https.get(vsixUrl, requestOptions, handleResponse).on('error', handleError);
}

function extractAndInstall(vsixPath, extensionId) {
    console.log(`Instalando ${extensionId}...`);
    try {
        const installDir = path.join(extensionsDir, extensionId.toLowerCase());
        if (fs.existsSync(installDir)) {
            fs.rmSync(installDir, { recursive: true, force: true });
        }
        fs.mkdirSync(installDir, { recursive: true });

        const stats = fs.statSync(vsixPath);
        if (stats.size < 1000) {
            console.warn(`Arquivo ${vsixPath} muito pequeno (${stats.size} bytes). Provavelmente corrompido.`);
        }

        execSync(`unzip -o -q ${vsixPath} -d ${installDir}`);

        const contentDir = path.join(installDir, 'extension');
        if (fs.existsSync(contentDir)) {
            const items = fs.readdirSync(contentDir);
            items.forEach(item => {
                const srcPath = path.join(contentDir, item);
                const destPath = path.join(installDir, item);
                fs.renameSync(srcPath, destPath);
            });
            fs.rmdirSync(contentDir);
            console.log(`✅ ${extensionId} instalado manualmente em ${installDir}`);
        } else {
            console.log(`⚠️ Estrutura inesperada para ${extensionId}, mantido em ${installDir}`);
        }
    } catch (err) {
        console.error(`❌ Falha ao instalar ${extensionId}: ${err.message}`);
    } finally {
        if (fs.existsSync(vsixPath)) fs.unlinkSync(vsixPath);
    }
}

try {
    const config = JSON.parse(fs.readFileSync(devContainerPath, 'utf8'));
    const extensions = config.customizations?.vscode?.extensions || [];

    if (extensions.length === 0) {
        console.log("Nenhuma extensão encontrada no devcontainer.json.");
    } else {
        console.log(`Encontradas ${extensions.length} extensões para instalar.`);
        extensions.forEach(ext => installExtension(ext));
    }
} catch (err) {
    console.error("Erro ao ler devcontainer.json:", err.message);
}
```

---

# INSTRUÇÕES DE USO

## Criar Novo Devcontainer

1. Pergunte o **nome do projeto**
2. Pergunte a **stack** (Go/Node/Python/Multi)
3. Pergunte sobre **extensões personalizadas**
4. Crie os arquivos usando os templates acima
5. Substitua `{{PROJECT_NAME}}` pelo nome informado
6. Configure extensões conforme a stack

## Atualizar Devcontainer Existente

1. Leia os arquivos existentes em `.devcontainer/`
2. Pergunte o que o usuário deseja atualizar:
   - Versão da imagem base
   - Extensões
   - Portas mapeadas
   - Comandos post-start
3. Aplique as alterações mantendo personalizações existentes

## Melhorar Devcontainer

1. Analise a configuração atual
2. Sugira melhorias:
   - Otimização do Dockerfile (camadas, cache)
   - Extensões úteis para a stack
   - Configurações de segurança
   - Performance do container

---

# PLACEHOLDERS

| Placeholder | Descrição |
|-------------|-----------|
| `{{PROJECT_NAME}}` | Nome do projeto (perguntado ao usuário) |
| `{{LANGUAGE_SETTINGS}}` | Configurações específicas da linguagem |
| `{{EXTENSIONS_LIST}}` | Lista de extensões VS Code |
| `{{POST_START_COMMANDS}}` | Comandos executados após iniciar o container |

---

# REGRAS

1. **SEMPRE** pergunte o nome do projeto antes de criar arquivos
2. **NUNCA** sobrescreva arquivos sem confirmação do usuário
3. **SEMPRE** inclua os scripts de instalação de extensões
4. **SEMPRE** use o padrão de extensões da empresa como base
5. **SEMPRE** configure permissões para o usuário `vscode`
6. **SEMPRE** inclua `git config --global --add safe.directory '*'`
7. **SEMPRE** inclua `bash scripts/install-extensions.sh` no `postStartCommand`

# Get Started

Este guia mostra como testar o Arandu Nexus localmente usando o Dev Container ja configurado no repositorio. A ideia e abrir o projeto, deixar o ambiente cuidar da parte chata e ir direto para o fluxo de criar boards e usar o canvas.

## Pre-requisitos

- Docker Desktop ou engine Docker compativel em execucao
- VS Code
- Extensao `Dev Containers` instalada no VS Code

## 1. Abrir o projeto no Dev Container

1. Abra a pasta do projeto no VS Code.
2. Execute o comando `Dev Containers: Reopen in Container`.
3. Aguarde a criacao do ambiente.

O Dev Container faz estas configuracoes por voce:

- sobe o servico `app`
- sobe um MongoDB 7 no servico `mongo`
- monta o workspace em `/workspace`
- executa o `postCreateCommand` para instalar dependencias
- deixa as portas `3000` e `27017` encaminhadas

## 2. Conferir o ambiente

Dentro do terminal do container, o projeto deve estar em `/workspace`.

As variaveis principais usadas no desenvolvimento local sao:

- `MONGODB_URI=mongodb://mongo:27017/arandu_nexus`
- `MONGODB_DB=arandu_nexus`

O repositorio ja possui `.env.local`, entao o fluxo padrao do MVP nao exige configuracao manual extra para subir no ambiente local.

## 3. Subir a aplicacao

No terminal do container, rode:

```bash
npm run dev
```

Se preferir usar `make`:

```bash
make run-dev
```

Depois abra `http://localhost:3000`.

## 4. Testar o fluxo principal do MVP

1. Na pagina inicial, crie um board informando um titulo.
2. Confirme o redirecionamento automatico para a rota do board.
3. No canvas, use a biblioteca lateral para inserir elementos, fluxos e imagens.
4. Edite o titulo no topo do workspace.
5. Aguarde o autosave persistir o estado do board.
6. Volte para a listagem de boards e reabra o mesmo board para validar a persistencia.

## 5. Comandos uteis durante o uso local

```bash
npm run test
npm run lint
npm run build
```

Ou com `make`:

```bash
make test
make lint
make build
```

## 6. O que validar nesta primeira versao

- criacao de boards
- listagem persistida
- abertura do workspace
- uso do canvas com zoom e pan
- persistencia automatica do documento atual
- persistencia do titulo do board

## Solucao de problemas rapida

Se a aplicacao nao conectar no banco, confira se o container `mongo` esta em execucao e se a `MONGODB_URI` continua apontando para `mongodb://mongo:27017/arandu_nexus`.

Se o ambiente abrir sem dependencias, rode `npm install` no container. Em condicoes normais, o `postCreateCommand` ja resolve isso sem pedir ajuda dramatica.

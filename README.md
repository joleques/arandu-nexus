# Arandu Nexus

Base inicial do MVP do Arandu Nexus para arquitetura de software.

## Stack

- Next.js
- React
- TypeScript
- MongoDB
- tldraw
- Vitest
- ESLint

## Ambiente

O projeto foi preparado para rodar dentro do Dev Container ja configurado no repositorio.

Variaveis principais em `.env.local`:

- `MONGODB_URI`: por padrao `mongodb://mongo:27017/arandu_nexus`
- `MONGODB_DB`: por padrao `arandu_nexus`

## Comandos

### npm

- `npm install`: instala dependencias
- `npm run dev`: inicia a aplicacao em modo desenvolvimento
- `npm run build`: gera build de producao
- `npm run lint`: executa validacao de lint
- `npm run test`: executa os testes unitarios

### make

- `make install`: instala dependencias
- `make dev`: inicia o ambiente de desenvolvimento
- `make lint`: executa lint
- `make test`: executa testes
- `make build`: gera build de producao
- `make check`: executa lint, testes e build

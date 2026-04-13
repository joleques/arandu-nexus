---
name: product-user-doc
description: Gera documentacao de produto para usuario final com foco em onboarding, instalacao por sistema operacional, primeiros passos, exemplos de uso e troubleshooting basico para produtos e CLIs.
---

# Documentacao de Produto para Usuario Final

Use esta skill quando o usuario pedir para documentar um produto para pessoas leigas, criar guia de onboarding, explicar instalacao e uso passo a passo, ou montar documentacao de primeira experiencia para uma CLI ou ferramenta.

## Objetivo

Produzir uma documentacao que permita a um usuario final:

- entender o que e o produto
- saber qual problema ele resolve
- instalar no Linux, macOS e Windows
- executar o fluxo inicial sem ajuda externa
- ver exemplos reais de uso
- resolver erros comuns sem depender de conhecimento tecnico profundo

## Quando Usar

Use esta skill para pedidos como:

- "documentar o produto para usuario final"
- "criar onboarding do produto"
- "fazer guia de instalacao e primeiros passos"
- "criar getting started para usuarios"
- "explicar como baixar, instalar e usar a CLI"

Nao use esta skill como substituta de:

- documentacao de API
- documentacao RAG interna como artefato principal
- referencia tecnica profunda para desenvolvedores

## Inputs Minimos

Colete ou confirme:

1. Nome do produto
2. Resumo em uma frase
3. Publico-alvo
4. Problema que o produto resolve
5. Formas de instalacao por sistema operacional
6. Comandos ou passos reais do fluxo inicial
7. Exemplos reais de uso
8. Erros comuns e recuperacao basica

Se faltarem dados criticos, pergunte. Nao invente instaladores, comandos, URLs, pre-requisitos ou comportamentos.

## Investigacao do Projeto

Procure no repositorio:

- `README.md`
- binarios gerados e artefatos de distribuicao
- comandos da CLI
- exemplos reais de uso
- requisitos por sistema operacional
- fluxos de inicializacao
- nomes oficiais de comandos, flags, diretorios e arquivos

Priorize sempre fontes primarias do proprio projeto.

## Estrutura de Saida

Salve em:

```text
/documentacao/{titulo}/user-docs/
├── README.md
├── 01-o-que-e.md
├── 02-instalacao.md
├── 03-primeiros-passos.md
├── 04-exemplos-de-uso.md
└── 05-erros-comuns-e-ajuda.md
```

Gere apenas os arquivos relevantes, mas `README.md`, `01-o-que-e.md`, `02-instalacao.md` e `03-primeiros-passos.md` sao obrigatorios.

## Regras de Escrita

- Linguagem simples, direta e acolhedora
- Explicar jargao na primeira ocorrencia
- Priorizar acao e resultado, nao arquitetura interna
- Cada passo deve ser executavel por um usuario leigo
- Um comando por linha quando houver terminal
- Explicar o resultado esperado apos cada etapa importante
- Incluir observacoes especificas por sistema operacional quando necessario
- Evitar blocos longos de teoria antes do primeiro valor pratico

## Documentos

### 1. `README.md`

Indice principal com:

- resumo do produto
- para quem serve
- links para todos os documentos
- rota recomendada de leitura para iniciantes

### 2. `01-o-que-e.md`

Deve responder:

- o que e o produto
- qual problema resolve
- quem deve usar
- quando faz sentido usar
- beneficios principais

### 3. `02-instalacao.md`

Deve conter secoes separadas para:

- Linux
- macOS
- Windows

Para cada sistema:

- pre-requisitos
- forma de download/instalacao
- como validar se funcionou
- problemas comuns da instalacao

Se algum sistema ainda nao tiver instalacao suportada ou documentada, declarar isso explicitamente.

### 4. `03-primeiros-passos.md`

Fluxo guiado do zero ao primeiro resultado:

1. baixar ou instalar
2. validar instalacao
3. inicializar projeto
4. executar `start` ou equivalente
5. criar ou instalar squads/assistants/skills quando aplicavel
6. confirmar que o produto esta pronto para uso

Cada passo deve incluir:

- objetivo
- comando ou acao
- exemplo real
- resultado esperado

### 5. `04-exemplos-de-uso.md`

Casos concretos, com pouco texto e muito exemplo:

- exemplo minimo
- exemplo recomendado
- fluxo tipico de um usuario iniciante
- fluxo com variacoes comuns

### 6. `05-erros-comuns-e-ajuda.md`

Cobrir:

- erros frequentes
- causa provavel
- como corrigir
- quando pedir ajuda

## Template de README

```markdown
# {Nome do Produto}

> {Resumo em uma frase}

## Comece por aqui

1. Leia [O que e](./01-o-que-e.md)
2. Siga [Instalacao](./02-instalacao.md)
3. Execute [Primeiros passos](./03-primeiros-passos.md)
4. Consulte [Exemplos de uso](./04-exemplos-de-uso.md)

## Este material ajuda voce a

- entender se o produto faz sentido para o seu caso
- instalar no seu sistema operacional
- executar o primeiro fluxo com seguranca
- resolver duvidas comuns
```

## Checklist de Qualidade

Antes de entregar, verifique:

- usuario leigo consegue entender o valor do produto sem contexto extra
- ha instrucoes separadas para Linux, macOS e Windows
- os comandos e nomes batem com o projeto real
- o fluxo inicial vai ate o primeiro resultado util
- ha exemplos reais, nao placeholders vagos
- ha orientacao clara sobre erros comuns
- nao existe trecho inventado ou inferido sem fonte

## Entrega

Ao finalizar, informe:

- caminho dos arquivos gerados
- o que foi coberto
- pendencias ou lacunas encontradas
- quais dados ainda precisam ser confirmados pelo time, se houver

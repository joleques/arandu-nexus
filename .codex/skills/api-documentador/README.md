# 📖 api-documentador

Skill para geração de documentação completa de APIs em camadas, atendendo múltiplos públicos-alvo.

## Objetivo

Gerar documentação de APIs que atenda tanto **desenvolvedores** (referência técnica de endpoints, schemas, auth) quanto **usuários não-técnicos** (analistas, suporte, produto) com guias de caso de uso, glossário e FAQ.

## Quando Usar

- Documentar uma API REST, GraphQL ou gRPC
- Criar documentação técnica e/ou não-técnica
- Estruturar documentação existente em camadas

## Inputs

| Input | Obrigatório | Default | Descrição |
|---|---|---|---|
| **Título** | ✅ | — | Nome da documentação |
| **Tipo** | ❌ | `ambas` | `tecnica`, `nao-tecnica` ou `ambas` |
| **Descrição** | ❌ | — | O que a API resolve |
| **Contexto** | ❌ | — | Links, specs, observações |

## Tipos de Documentação

| Tipo | Camadas |
|---|---|
| `tecnica` | Referência Técnica (endpoints, schemas, auth, errors, changelog) |
| `nao-tecnica` | Getting Started + Casos de Uso + Suporte (glossário, FAQ, erros) |
| `ambas` | Todas as 4 camadas, particionáveis por contexto/domínio |

## Saída

```
./doc-apis/{titulo}/
├── {titulo}.md
├── {titulo}-{contexto}-{dominio}.md   (quando particionado)
└── ...
```

## Referências

- [OpenAPI Specification](https://www.openapis.org/)
- [Microsoft REST API Guidelines](https://github.com/microsoft/api-guidelines)

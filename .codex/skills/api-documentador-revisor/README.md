# 🔍 api-documentador-revisor

Skill para revisão de documentação de APIs gerada pela skill `api-documentador`.

## Objetivo

Validar que a documentação gerada segue as regras propostas, verificando completude por camada, consistência entre documentos, qualidade dos exemplos e adequação ao público-alvo.

## Quando Usar

- Após a skill `api-documentador` gerar a documentação
- Para validar documentação de API existente
- Como etapa de qualidade antes de publicar docs

## Critérios de Revisão

| Categoria | O que valida |
|---|---|
| **Completude** | Camadas do tipo presentes e preenchidas |
| **Getting Started** | Linguagem de negócio, sem jargão |
| **Casos de Uso** | Orientação por tarefa, erros com soluções |
| **Referência Técnica** | Endpoints completos, exemplos reais |
| **Suporte** | FAQ, ambientes, template de chamado |
| **Consistência** | Dados consistentes entre documentos |
| **Particionamento** | Escopo coeso, sem sobreposição nem lacunas |
| **Exemplos** | Valores reais, JSONs válidos |

## Saída

```
./doc-apis/{titulo}/{titulo}-revision-{versao}.md
```

Veredicto: ✅ APROVADO / ⚠️ AJUSTAR / ❌ REESCREVER

## Referências

- Skill [`api-documentador`](../api-documentador/SKILL.md)

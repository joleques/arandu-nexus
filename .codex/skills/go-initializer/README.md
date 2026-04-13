# 🚀 Go Initializer

**Skill para criar a estrutura base de código Go** em novos projetos com configuração padronizada.

## Para que serve?

Esta skill instrui o agente a inicializar projetos Go com uma estrutura funcional, padronizada e pronta para desenvolvimento, incluindo `go.mod`, `main.go` e `Makefile`.

## Estrutura Gerada

```
projeto/
├── go.mod       # Definição do módulo Go
├── Makefile     # Comandos de build e execução
└── src/
    └── main.go  # Ponto de entrada (Hello World)
```

## Comandos do Makefile

| Comando | Descrição |
|---------|-----------|
| `make run` | Executa a aplicação |
| `make build` | Compila o binário |
| `make test` | Executa os testes |
| `make clean` | Limpa artefatos de build |
| `make tidy` | Atualiza dependências |

## Fluxo de Uso

1. Agente pergunta o **nome do projeto** (module Go)
2. Agente pergunta o **diretório de destino**
3. Agente pergunta a **versão do Go** (padrão: 1.24)
4. Arquivos são criados com os templates

## Quando usar?

- Ao iniciar um novo projeto Go do zero
- No workflow `/init-project` como um dos passos de inicialização

# 🔧 Git Ops — Operações Git com Resolução Inteligente

Skill que executa operações Git (status, pull, add, commit, push, tag, log, branch, checkout, diff, stash, merge, rebase, revert) com resolução inteligente de diretório e atalhos compostos.

## Parâmetros

| Parâmetro | Obrigatório | Descrição |
|-----------|:-----------:|-----------|
| **Operação** | ✅ | Comando Git a executar (ver tabela abaixo) |
| **Diretório** | ❌ | Caminho do repositório (padrão: projeto atual) |
| **Mensagem** | ⚠️ | Obrigatório para `commit` e atalho `enviar` |
| **Ticket** | ❌ | Número do ticket (ex: `AUT-2345`) — concatenado na mensagem |

## Operações Suportadas

| Operação | Descrição | Confirmação Extra |
|----------|-----------|:-----------------:|
| `status` | Estado atual do repositório | — |
| `pull` | Atualiza branch local | — |
| `add` | Adiciona arquivos ao staging | — |
| `commit` | Commita alterações staged | — |
| `push` | Envia commits para o remoto | — |
| `tag` | Cria/lista tags | — |
| `log` | Histórico de commits | — |
| `branch` | Cria/lista/deleta branches | ⚠️ delete |
| `checkout` | Troca de branch | — |
| `diff` | Mostra diferenças | — |
| `stash` | Salva/restaura alterações temporárias | — |
| `merge` | Merge de branches | ⚠️ sim |
| `rebase` | Rebase de branch | ⚠️ sim |
| `revert` | Reverte um commit | ⚠️ sim |

## Atalho: `enviar {mensagem}`

Comando composto que encapsula `git add .` + `git commit` + `git push` com geração automática de resumo das alterações.

### Como Funciona

1. Usuário informa a mensagem do commit
2. Agente pergunta se pertence a um ticket → formato: `{TICKET} - {MENSAGEM}`
3. **Script 1** (`git-resumo.sh`): `git add .` + captura diff completo → stdout
4. Agente analisa o diff e gera resumo `.md` em `git-ops/`
5. **Script 2** (`git-enviar.sh`): commit → captura hash → atualiza hash no resumo → amend → push

**O usuário confirma apenas 2 vezes** (1 por script).

### Estrutura do Resumo

```
projeto/
├── git-ops/
│   ├── aut-2345-adiciona-validacao.md
│   └── fix-corrige-parse-de-datas.md
```

Cada resumo contém: data, ticket, branch, hash do commit, tabela de arquivos alterados, resumo interpretado das mudanças e diff resumido. Útil para rollback informado por outro agente.

## Fluxo Obrigatório

```
Passo 1 → Dir atual (ou outro se informado)
Passo 2 → Validar repositório Git
Passo 3 → Executar operação
```

## Formato de Commit com Ticket

```
{TICKET} - {MENSAGEM}
Exemplo: AUT-2345 - adiciona validação de email
```

## Exemplos de Uso

```
Faz um pull
Commit com mensagem "adiciona validação"
Enviar "corrige parse de datas"
Push no /home/user/outro-projeto
Status
```

## Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `SKILL.md` | Instruções completas da skill |
| `README.md` | Este arquivo |
| `scripts/git-resumo.sh` | Script de captura de diff para geração de resumo |
| `scripts/git-enviar.sh` | Script de commit + push + atualização de resumo |

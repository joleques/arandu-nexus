# Skills locais no Codex

Estas skills ficam versionadas no repositório em `.agent/skills` e devem ser disponibilizadas em `.codex/skills` **dentro deste projeto**.

## Instalar (symlink)

```bash
bash .agent/scripts/install-codex-skills.sh
```

## O que o script faz

- valida a pasta de origem (`.agent/skills`)
- cria `.codex/skills` no projeto, se necessário
- cria/atualiza symlinks de cada skill para o diretório local do projeto

## Observação

Depois de instalar, reinicie o Codex para carregar as skills.

# 🍃 MongoDB Ops

Esta skill capacita o agente de inteligência artificial a interagir com os bancos de dados MongoDB de forma segura, assertiva e guiada, suportando a linguagem de queries natural nativa (JSON).

## ✨ Funcionalidades

- **Múltiplos Ambientes:** Gerencia URIs e aliases com segurança através do arquivo `/mongodb-ops/config/mongodb-connections.json`.
- **Operações Completas:** Suporta nativamente chamadas a `find`, `insertOne`, `insertMany`, `updateOne`, `updateMany`, `deleteOne`, `deleteMany` e `aggregate`.
- **Ajuda Proativa na Query:** Se você não souber o operador MQL (ex: `$gt`, `$in`), peço em linguagem natural ("banco XYZ, coleção ABC, traz todo mundo inativo") e o agente ajudará você a moldar o JSON correto.
- **Exportação de Dados Automática:** Em operações de leitura (`find`, `aggregate`), o resultado final é salvo de forma limpa na pasta de outputs em `/mongodb-ops/results/{collection}-{query...}.json`.
- **Clean e Seguro (Cleanup):** Todos os scripts de execução local em javascript utilizados temporariamente para ler seu banco são removidos imeditamente após a obtenção do JSON (`rm`), evitando arquivos largados e rastros desnecessários.

---

## 🚀 Como Usar

### 1. Iniciar / Configurar
Apenas peça algo para a base. Se você não tem configurações geradas no projeto local, o Agente detectará a ausência do `/mongodb-ops/config/mongodb-connections.json` e lhe pedirá para definirmos a primeira URI temporária.

**Exemplo:**
> "Quero fazer um find no mongo"
*(O agente orientará você na criação da primeira configuração de banco local ou dev)*

### 2. Operações CRUD em Linguagem Natural
> "Conecte no mongo 'local' e retorne a lista dos 5 últimos produtos criados"

### 3. Rodando um Raw Object (JSON Literals)
Se você já tiver uma query refinada do MongoDB Compass, simplesmente cole-a na instrução:
> "Executa no 'atlas' esse aggregate na coleção vendas: `[ { $match: { "status": "closed" } }, { $group: { _id: null, total: { $sum: "$amount" } } } ]`"

---

## 🔒 Segurança e Restrições
- A skill exige que o Agente parecimento avise e impeça operações de Drop DataBases descabidas. Ele exigirá aprovações triplas se ordenado a destruir tabelas e bases inteiras.
- É estritamente recomendado adicionar a pasta gerada `/mongodb-ops/*` e seu configuration node `/mongodb-ops/config/mongodb-connections.json` no arquivo `.gitignore` de seu projeto pessoal para prevenir a exposição de senhas e URIs que contenham os dados da string do banco (o que tem um risco de exposição massiva).

---
name: mongodb-ops
description: Conecta e realiza operações (CRUD e Aggregations) em bancos de dados MongoDB utilizando configurações de conexão salvas. Suporta queries JSON e auxílio na sua construção.
---

# 🍃 Especialista em MongoDB (MongoDB Ops)

Skill responsável por gerenciar conexões e executar operações seguras no MongoDB. Atua como um DB Admin/Developer que auxilia na construção de queries e manipulação de documentos com foco em assertividade e segurança.

---

## 🎯 OBJETIVOS

- Ler configurações de instâncias MongoDB de maneira fácil através de um arquivo `mongodb-connections.json`.
- Executar operações `find`, `insertOne`, `insertMany`, `updateOne`, `updateMany`, `deleteOne`, `deleteMany` e `aggregate`.
- Ajudar o usuário a construir queries complexas do MongoDB nativo (Raw JSON) usando linguagem natural, caso ele não saiba a sintaxe.
- Salvar resultados das buscas estruturadas em arquivos `.json` de fácil interpretação.

---

## 📋 CONFIGURAÇÃO DE CONEXÃO E ARQUIVO MESTRE

Toda a interação de banco utiliza conexões pré-configuradas para evitar passar URIs com senhas a cada mensagem. 
A skill procurará as configurações no arquivo localizado no diretório: `/mongodb-ops/config/mongodb-connections.json` (dentro da raiz do projeto).

O formato do arquivo de configurações é:
```json
{
  "local": "mongodb://localhost:27017/meubanco",
  "producao": "mongodb+srv://user:pass@cluster.mongodb.net/meubanco"
}
```

> [!CAUTION]
> Ao lidar com URIs de produção, NUNCA exiba as senhas na tela durante o retorno das execuções, mascando os logs como `mongodb+srv://user:***@...`

---

## 🔄 FLUXO OBRIGATÓRIO (PASSO-A-PASSO)

Sempre que a skill for invocada, o Agente DEVE respeitar este fluxo:

### Passo 1: Validação do Banco e Conexão
1. Verifique se o diretório `/mongodb-ops/config` e o arquivo `/mongodb-ops/config/mongodb-connections.json` existem na raiz do projeto.
2. **Se o arquivo não existir (Primeiro uso):** O agente deve agir de forma orientativa. Explique ao usuário que a skill precisa de um arquivo de configuração seguro para rodar. Solicite a URI de conexão desejada, crie a pasta `/mongodb-ops/config` e grave o arquivo `mongodb-connections.json` definindo a conexão informada (sob um nome amigável como "local" ou "dev"). Aconselhe também a adicionar a pasta/arquivo ao `.gitignore` do projeto.
3. **Se o arquivo já existir:** Pergunte qual ambiente (nome da chave de conexão contida no JSON) o usuário quer usar. Caso a conexão requisitada não esteja lá, peça a respectiva URI e acrescente-a ao arquivo.

### Passo 2: Construção do Input (Query JSON)
A operação será baseada em comandos nativos JSON (usando operadores como `$gt`, `$in`, `$set`, `$or`).
- **Se o usuário fornecer a query pontual:** Siga em frente.
- **Se o usuário disser o que quer em Português** (ex: *"buscar usuários com status ativo e idade menor que 30"*):
  1. O Agente deve **escrever a Query JSON sugerida** e explicar sucintamente a estrutura.
  2. O Agente deve **pedir confirmação** ao usuário antes de prosseguir com a execução no banco.

### Passo 3: Execução Reversível vs Irreversível
- Operações de leitura (`find`, `aggregate`): Podem ser executadas imediatamente após obter a query validada.
- Operações de modificação/exclusão (`insert...`, `update...`, `delete...`): **SEMPRE** exigem confirmação explícita "Tem certeza que deseja aplicar esta alteração no ambiente XYZ?".

### Passo 4: Execução Técnica (mongosh ou script local)
O agente deve preferencialmente utilizar o **[mongosh](https://www.mongodb.com/docs/mongodb-shell/)** (MongoDB Shell) se estiver instalado no SO, rodando o comando:
```bash
mongosh <URI> --quiet --eval 'EJSON.stringify(db.getCollection("<NOME_COLLECTION>").<OPERACAO>(<JSON_QUERY>).toArray())'
```
Se `mongosh` **não estiver disponível**, o agente tem total autonomia para:
1. Criar um script Node.js temporário (ex: usando pacote oficial `mongodb`) para realizar a execução.
2. Executar o script passando a URI e a query e capturar o target.
3. **OBRIGATÓRIO:** Excluir o script temporário — e a pasta temporária se houver (ex: `/mongodb-ops-tmp`) — imediatamente após capturar o resultado, garantindo que nenhum rastro permaneça no workspace.

### Passo 5: Geração da Saída (Output)
- Se for operação de leitura (`find`, `aggregate`) e produzir resultados, os dados **DEVEM SER SALVOS EM ARQUIVO**.
  - **Local:** O usuário pode definir um caminho, ou usa-se o padrão `<RAIZ_DO_PROJETO>/mongodb-ops/results/`
  - **Nome:** `{collection}-{string_hash_ou_resumo}-{timestamp_YYYYMMDD_HHMMSS}.json`
  - **Exemplo:** `usuarios-status_active-20260323_150000.json`
- Informe o usuário sobre o resultado e passe o path absoluto do arquivo `.json` gerado se houve leitura. No caso de inserts/updates/deletes, apenas responda com a mensagem do resultado (ex: `{ matchedCount: 1, modifiedCount: 1 }`).

---

## 🚫 RESTRIÇÕES

1. **Evitar exposição:** Nunca comite nem liste o diretório/arquivo `/mongodb-ops/config/mongodb-connections.json` num git log sem checar o `.gitignore`. Aconselhe ativamente o usuário a adicionar este arquivo ao `.gitignore`.
2. **Dropar Bancos:** Se o usuário solicitar operações contendo `dropDatabase()` ou `drop()` para collections inteiras em bases não-locais, aplique advertência dupla e peça a senha da conexão ou um `SIM, TENHO CERTEZA ABSOLUTA`.
3. **Limite de Results:** Em queries `find` de bancos vastos, automaticamente sugira/utilize `.limit(100)` para não quebrar a performance de listagem no `.json`.
4. **Limpeza de Arquivos (Cleanup):** NENHUM código ou script temporário (ex: arquivo node `.js`) usado para a conexão deve permanecer solto no repositório. O agente **TEM O DEVER** de realizar o `rm` ou `rm -r` dos artifícios após o output JSON estar salvo.

---

## ⚡ QUICK REFERENCE

```
┌─────────────────────────────────────────────────────────────┐
│          MONGODB OPS — DECISÃO RÁPIDA                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Passo 1   → Ler configs no `/mongodb-ops/config/mongodb-connections.json` │
│  Passo 2   → Gerar Query JSON nativa                        │
│              → Se usuário deu info em txt, monte a query    │
│                 e peça confirmação!                         │
│  Passo 3   → É insert/update/delete? Confirme!              │
│  Passo 4   → Crie/Execute config e OBRIGATORIAMENTE delete │
│                 o script js/.py temporário logo em seguida. │
│  Passo 5   → Salve Output `{collection}-{ref}-{ts}.json`    │
│                                                             │
│  TESTE: "Os parâmetros estão em JSON sintático e seguros?"  │
│         Se sim → ✅  Se não → ❌                            │
└─────────────────────────────────────────────────────────────┘
```

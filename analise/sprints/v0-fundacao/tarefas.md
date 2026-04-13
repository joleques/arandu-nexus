# Tarefas - V0 Fundacao

## Sequencia Recomendada

1. Inicializar o projeto Next.js com TypeScript.
2. Organizar a estrutura do monólito modular.
3. Configurar scripts principais.
4. Configurar lint e formatação.
5. Configurar base de testes.
6. Configurar acesso ao MongoDB.
7. Ajustar Dev Container e ambiente.
8. Documentar como subir, testar e validar a base.

## Tarefas Detalhadas

### 1. Bootstrap da Aplicacao

- O que fazer: criar a base do projeto Next.js adequada ao MVP.
- Onde mexer: raiz do projeto, configuração do framework, arquivos iniciais de aplicação.
- Resultado esperado: aplicação inicial executando localmente e no Dev Container.

### 2. Estrutura Modular Inicial

- O que fazer: definir pastas e convenções para os módulos `boards`, `comments`, `snapshots` e `templates`.
- Onde mexer: `src/` e arquivos estruturais do projeto.
- Resultado esperado: arquitetura preparada para evolução incremental sem misturar tudo em rotas aleatórias.

### 3. Configuração Operacional

- O que fazer: garantir scripts de `dev`, `build`, `test` e `lint`.
- Onde mexer: `package.json` e configurações associadas.
- Resultado esperado: comando único e previsível para cada fluxo operacional.

### 4. Base de Qualidade

- O que fazer: configurar lint, formatação e base inicial de testes.
- Onde mexer: arquivos de configuração e pastas de teste.
- Resultado esperado: o projeto passa a ter gate mínimo de qualidade.

### 5. Infra de Desenvolvimento

- O que fazer: garantir integração básica com Mongo e compatibilidade do Dev Container com a stack real.
- Onde mexer: `.devcontainer/`, configuração de ambiente e camada de infraestrutura.
- Resultado esperado: ambiente reproduzível e pronto para persistência futura.

### 6. Documentacao da Base

- O que fazer: registrar como rodar o projeto, testes e validações básicas.
- Onde mexer: `README.md` e documentos complementares, se necessário.
- Resultado esperado: nova pessoa ou agente consegue iniciar sem arqueologia digital.

## Dependencias Entre Tarefas

1. O bootstrap vem antes da organização modular.
2. A base de testes depende da stack já escolhida.
3. O ajuste do Dev Container depende do projeto e scripts já definidos.
4. A documentação final depende de todas as decisões anteriores.

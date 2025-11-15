# 📦 Guia de Instalação

## Pré-requisitos

- Node.js (versão 18 ou superior)
- npm

## Instalação no Windows

### 1. Clone o repositório

```bash
git clone https://github.com/ClaudioRobertoJr/csskinanalyze.git
cd csskinanalyze
```

### 2. Instale as dependências

```bash
# Instalar dependências do backend
npm install

# Instalar dependências do frontend
cd frontend
npm install
cd ..

# Criar diretório de dados (se não existir)
mkdir data
```

### 3. Execute o projeto

```bash
npm run dev
```

O servidor iniciará em `http://localhost:5000` e o frontend em `http://localhost:3000`.

## Comandos Disponíveis

- `npm run dev` - Inicia backend e frontend em modo de desenvolvimento
- `npm run server:dev` - Inicia apenas o servidor backend
- `npm run client:dev` - Inicia apenas o frontend
- `npm run collect-data` - Coleta dados do mercado Steam
- `npm run analyze` - Executa análise técnica dos itens

## Problemas Comuns

### Servidor não inicia (ECONNREFUSED)

Se você ver erros de "ECONNREFUSED", consulte o arquivo `TROUBLESHOOTING_WINDOWS.md` para soluções.

### Erro de compilação do better-sqlite3

O projeto usa `better-sqlite3` que geralmente funciona sem problemas no Windows. Em casos raros, pode ser necessário instalar ferramentas de build:

```bash
npm install --global windows-build-tools
```

Ou instale o Visual Studio Build Tools e selecione "Desktop development with C++".

## Estrutura do Projeto

```
csskinanalyze/
├── src/              # Código do backend
│   ├── api/          # Rotas da API
│   ├── analyzers/    # Análise técnica
│   ├── collectors/   # Coleta de dados
│   ├── database/     # Configuração do banco
│   └── signals/      # Geração de sinais
├── frontend/         # Aplicação React
├── data/             # Banco de dados SQLite
└── README.md         # Documentação
```

## Primeira Execução

Na primeira execução, o banco de dados será criado automaticamente. Para popular com dados:

1. Execute `npm run collect-data` para coletar skins do Steam
2. Execute `npm run analyze` para analisar os dados coletados
3. Acesse `http://localhost:3000` para ver o dashboard

## Suporte

Se encontrar problemas, abra uma issue no GitHub ou consulte a documentação em `TROUBLESHOOTING_WINDOWS.md`.

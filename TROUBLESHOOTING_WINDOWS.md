# Guia de Troubleshooting para Windows

## Problema: Servidor não inicia (ECONNREFUSED)

Se você está vendo o erro "ECONNREFUSED" no frontend, significa que o servidor backend não está rodando.

### ✅ Solução: O projeto usa Better-SQLite3

Este projeto foi atualizado para usar `better-sqlite3` que funciona melhor no Windows e não requer ferramentas de build do Visual Studio.

**Simplesmente execute:**

```bash
npm install
npm run dev
```

### ⚠️ Se você ainda tiver problemas com better-sqlite3

Em casos raros, o better-sqlite3 pode precisar de ferramentas de build. Se você ver erros de compilação:

#### Opção 1: Instalar Visual Studio Build Tools

1. Baixe e instale: https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022
2. Durante a instalação, selecione "Desktop development with C++"
3. Execute: `npm install`

#### Opção 2: Instalar Windows Build Tools

```bash
npm install --global windows-build-tools
npm install
```

## Testar se o problema foi resolvido

Depois de aplicar qualquer solução acima, rode:

```bash
npm run dev
```

Você deve ver as seguintes mensagens:

```
╔════════════════════════════════════════╗
║   STEAM MARKET SKIN ANALYZER v1.0      ║
║   Análise & Trading de Skins CS2/Dota2 ║
╚════════════════════════════════════════╝

📦 Inicializando banco de dados...
✓ Banco de dados conectado: [caminho]/data/steam_skins.db
✓ Tabelas do banco de dados criadas
✓ Banco de dados inicializado

🚀 Iniciando servidor...

🚀 Servidor iniciado em http://localhost:5000

📊 Acesse o dashboard em http://localhost:3000

📡 API disponível em http://localhost:5000/api
```

## Outros Problemas Comuns

### Porta 5000 já em uso

Se a porta 5000 já estiver em uso, você pode mudá-la:

1. Crie um arquivo `.env` na raiz do projeto:
   ```
   PORT=5001
   ```

2. Atualize o proxy no `frontend/package.json`:
   ```json
   "proxy": "http://localhost:5001"
   ```

### Erro de permissão ao criar diretório data/

Execute o terminal como Administrador.

## Logs Detalhados

Para ver logs mais detalhados do que está acontecendo, rode apenas o servidor:

```bash
npm run server:dev
```

Isso mostrará exatamente onde o servidor está falhando.

## Ainda com problemas?

Se nenhuma solução funcionou, por favor execute os seguintes comandos e me envie a saída:

```bash
node --version
npm --version
npm list sqlite3
npm run server:dev
```

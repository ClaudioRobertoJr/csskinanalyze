# Guia de Troubleshooting para Windows

## Problema: Servidor não inicia (ECONNREFUSED)

Se você está vendo o erro "ECONNREFUSED" no frontend, significa que o servidor backend não está rodando. Veja as soluções abaixo:

### Solução 1: Recompilar o SQLite3 (Mais comum)

O pacote `sqlite3` precisa ser recompilado para funcionar corretamente no Windows:

```bash
npm rebuild sqlite3
```

Se isso não funcionar, tente:

```bash
npm uninstall sqlite3
npm install sqlite3 --build-from-source
```

### Solução 2: Instalar Ferramentas de Build do Windows

O SQLite3 precisa de ferramentas nativas para compilar no Windows:

```bash
npm install --global windows-build-tools
```

Ou instale o Visual Studio Build Tools manualmente:
https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022

### Solução 3: Usar Better-SQLite3 (Alternativa)

Se o sqlite3 continuar dando problemas, podemos substituir por `better-sqlite3` que funciona melhor no Windows:

```bash
npm uninstall sqlite3
npm install better-sqlite3
```

(Neste caso, precisaremos ajustar o código)

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

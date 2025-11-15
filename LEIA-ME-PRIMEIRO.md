# 🚨 LEIA-ME PRIMEIRO - Problemas no Windows

## Problema: Servidor não inicia (ERR_MODULE_NOT_FOUND)

Se você está vendo este erro:
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module 'C:\Users\...\src\api\server.js'
```

### ✅ Solução Automática (RECOMENDADA)

Execute este comando no terminal do Windows dentro da pasta do projeto:

```bash
node fix-imports.js
```

Este script vai corrigir automaticamente todos os imports. Depois execute:

```bash
npm install
npm run dev
```

---

### 🔧 Solução Manual (se a automática não funcionar)

Abra o arquivo `src/index.ts` e **adicione `.js`** no final dos imports:

**ANTES (❌ errado):**
```typescript
import { startServer } from './api/server';
import { db } from './database/db';
```

**DEPOIS (✅ correto):**
```typescript
import { startServer } from './api/server.js';
import { db } from './database/db.js';
```

Faça o mesmo para **TODOS** os outros arquivos TypeScript que importam módulos locais.

---

### 📥 Solução Git (forçar atualização)

Se você quer garantir que tem a versão mais recente do GitHub:

```bash
# Salvar suas mudanças locais
git stash

# Pegar a versão mais recente
git fetch origin
git checkout claude/fix-server-startup-01AspU2JLh4GTqZapRZ94weC
git pull origin claude/fix-server-startup-01AspU2JLh4GTqZapRZ94weC

# Instalar
npm install
npm run dev
```

---

## Por que isso acontece?

Quando usamos **ESM (módulos ECMAScript)** com TypeScript, o Node.js exige que os imports de arquivos locais incluam a extensão `.js`, mesmo que os arquivos sejam `.ts`.

Isso é um requisito do Node.js quando `"type": "module"` está no `package.json`.

---

## ❓ Ainda com problemas?

1. Consulte `TROUBLESHOOTING_WINDOWS.md` para outros problemas
2. Consulte `INSTALL.md` para instruções de instalação completas
3. Consulte `FIX_MANUAL.md` para ver todos os imports que precisam de `.js`

---

## ✅ O que você deve ver quando funcionar:

```
╔════════════════════════════════════════╗
║   STEAM MARKET SKIN ANALYZER v1.0      ║
║   Análise & Trading de Skins CS2/Dota2 ║
╚════════════════════════════════════════╝

📦 Inicializando banco de dados...
✓ Banco de dados conectado
✓ Banco de dados inicializado

🚀 Iniciando servidor...
🚀 Servidor iniciado em http://localhost:5000
📊 Acesse o dashboard em http://localhost:3000
```

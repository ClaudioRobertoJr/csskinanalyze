# 🔧 Correção Manual - src/index.ts

Se você ainda está vendo o erro `ERR_MODULE_NOT_FOUND`, copie este conteúdo para o arquivo `src/index.ts`:

```typescript
import { startServer } from './api/server.js';
import { db } from './database/db.js';

async function main() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   STEAM MARKET SKIN ANALYZER v1.0      ║');
  console.log('║   Análise & Trading de Skins CS2/Dota2 ║');
  console.log('╚════════════════════════════════════════╝\n');

  try {
    console.log('📦 Inicializando banco de dados...');
    await db.initialize();
    console.log('✓ Banco de dados inicializado\n');

    console.log('🚀 Iniciando servidor...\n');
    await startServer();

    console.log('⏰ Servidor pronto para sincronizar dados\n');
  } catch (error) {
    console.error('❌ Erro fatal:', error);
    if (error instanceof Error) {
      console.error('Stack:', error.stack);
    }
    process.exit(1);
  }
}

// Tratamento global de erros
process.on('unhandledRejection', (reason) => {
  console.error('❌ Promise rejeitada não tratada:');
  if (reason instanceof Error) {
    console.error(reason.message);
    console.error(reason.stack);
  } else {
    console.error(reason);
  }
});

process.on('SIGINT', async () => {
  console.log('\n\n👋 Encerrando aplicação...');
  try {
    await db.close();
  } catch (error) {
    console.error('Erro ao fechar banco:', error);
  }
  process.exit(0);
});

main().catch((error) => {
  console.error('Erro não capturado em main():', error);
  if (error instanceof Error) {
    console.error('Stack:', error.stack);
  }
  process.exit(1);
});
```

## ✅ Checklist de Arquivos que Precisam ter `.js` nos Imports:

Verifique se TODOS estes arquivos têm `.js` nos imports de arquivos locais:

### ✅ src/index.ts
```typescript
import { startServer } from './api/server.js';
import { db } from './database/db.js';
```

### ✅ src/api/server.ts
```typescript
import { db } from '../database/db.js';
import { portfolioManager } from './portfolio.js';
import { SteamCollector } from '../collectors/steamCollector.js';
import { TechnicalAnalyzer } from '../analyzers/technicalAnalyzer.js';
import { SignalGenerator } from '../signals/signalGenerator.js';
```

### ✅ src/api/portfolio.ts
```typescript
import { db } from '../database/db.js';
```

### ✅ src/analyzers/technicalAnalyzer.ts
```typescript
import { db } from '../database/db.js';
```

### ✅ src/collectors/steamCollector.ts
```typescript
import { db } from '../database/db.js';
```

### ✅ src/signals/signalGenerator.ts
```typescript
import { db } from '../database/db.js';
```

## 🚀 Depois de Corrigir:

```bash
npm install
npm run dev
```

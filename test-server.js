// Script de teste para verificar problemas de inicialização
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 Testando inicialização do servidor...\n');

// Teste 1: Verificar diretório data
console.log('1️⃣ Verificando diretório data/...');
const dataDir = join(__dirname, 'data');
if (!existsSync(dataDir)) {
  console.log('   ⚠️  Diretório data/ não existe. Criando...');
  mkdirSync(dataDir, { recursive: true });
  console.log('   ✓ Diretório data/ criado');
} else {
  console.log('   ✓ Diretório data/ existe');
}

// Teste 2: Testar SQLite3
console.log('\n2️⃣ Testando SQLite3...');
try {
  const sqlite3 = await import('sqlite3');
  console.log('   ✓ SQLite3 importado com sucesso');

  // Tentar criar um banco de teste
  const dbPath = join(dataDir, 'test.db');
  const db = new sqlite3.default.Database(dbPath, (err) => {
    if (err) {
      console.log('   ❌ Erro ao criar banco:', err.message);
    } else {
      console.log('   ✓ Banco de teste criado com sucesso');
      db.close();
    }
  });
} catch (error) {
  console.log('   ❌ Erro ao importar SQLite3:', error.message);
  console.log('   💡 Solução: Execute "npm rebuild sqlite3"');
}

// Teste 3: Testar imports do projeto
console.log('\n3️⃣ Testando imports do projeto...');
try {
  const { db } = await import('./src/database/db.js');
  console.log('   ✓ Database module importado');

  await db.initialize();
  console.log('   ✓ Database inicializado');

  await db.close();
  console.log('   ✓ Database fechado');
} catch (error) {
  console.log('   ❌ Erro:', error.message);
  console.log('   Stack:', error.stack);
}

// Teste 4: Testar servidor Express
console.log('\n4️⃣ Testando servidor Express...');
try {
  const express = await import('express');
  console.log('   ✓ Express importado');

  const app = express.default();
  app.get('/test', (req, res) => res.json({ ok: true }));

  const server = app.listen(5001, () => {
    console.log('   ✓ Servidor de teste rodando na porta 5001');
    server.close();
    console.log('   ✓ Servidor de teste fechado');
  });
} catch (error) {
  console.log('   ❌ Erro:', error.message);
}

console.log('\n✅ Testes concluídos!');

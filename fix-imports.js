/**
 * Script para corrigir automaticamente os imports ESM
 * Execute: node fix-imports.js
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fixes = [
  {
    file: 'src/index.ts',
    replacements: [
      { from: "from './api/server'", to: "from './api/server.js'" },
      { from: "from './database/db'", to: "from './database/db.js'" }
    ]
  },
  {
    file: 'src/api/server.ts',
    replacements: [
      { from: "from '../database/db'", to: "from '../database/db.js'" },
      { from: "from './portfolio'", to: "from './portfolio.js'" },
      { from: "from '../collectors/steamCollector'", to: "from '../collectors/steamCollector.js'" },
      { from: "from '../analyzers/technicalAnalyzer'", to: "from '../analyzers/technicalAnalyzer.js'" },
      { from: "from '../signals/signalGenerator'", to: "from '../signals/signalGenerator.js'" }
    ]
  },
  {
    file: 'src/api/portfolio.ts',
    replacements: [
      { from: "from '../database/db'", to: "from '../database/db.js'" }
    ]
  },
  {
    file: 'src/analyzers/technicalAnalyzer.ts',
    replacements: [
      { from: "from '../database/db'", to: "from '../database/db.js'" }
    ]
  },
  {
    file: 'src/collectors/steamCollector.ts',
    replacements: [
      { from: "from '../database/db'", to: "from '../database/db.js'" }
    ]
  },
  {
    file: 'src/signals/signalGenerator.ts',
    replacements: [
      { from: "from '../database/db'", to: "from '../database/db.js'" }
    ]
  }
];

console.log('🔧 Corrigindo imports ESM...\n');

let totalFixes = 0;

for (const { file, replacements } of fixes) {
  const filePath = join(__dirname, file);

  try {
    let content = readFileSync(filePath, 'utf8');
    let fileChanged = false;

    for (const { from, to } of replacements) {
      if (content.includes(from) && !content.includes(to)) {
        content = content.replace(new RegExp(from, 'g'), to);
        fileChanged = true;
        totalFixes++;
      }
    }

    if (fileChanged) {
      writeFileSync(filePath, content, 'utf8');
      console.log(`✓ Corrigido: ${file}`);
    } else {
      console.log(`  OK: ${file} (já estava correto)`);
    }
  } catch (error) {
    console.error(`✗ Erro ao processar ${file}:`, error.message);
  }
}

console.log(`\n✅ Concluído! ${totalFixes} correções aplicadas.`);
console.log('\nAgora execute:');
console.log('  npm install');
console.log('  npm run dev');

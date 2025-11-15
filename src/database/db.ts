import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Garantir que o diretório data/ existe
const dataDir = path.join(__dirname, '../../data');
if (!existsSync(dataDir)) {
  console.log('📁 Criando diretório data/...');
  mkdirSync(dataDir, { recursive: true });
  console.log('✓ Diretório data/ criado');
}

const dbPath = path.join(dataDir, 'steam_skins.db');

export class Database {
  private db: sqlite3.Database | null = null;
  private initialized = false;
  private connectionError: Error | null = null;

  constructor() {
    try {
      this.db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error('❌ Erro ao conectar ao banco de dados:', err.message);
          this.connectionError = err;
        } else {
          console.log('✓ Banco de dados conectado:', dbPath);
        }
      });
    } catch (error) {
      console.error('❌ Erro fatal ao criar instância do banco:', error);
      this.connectionError = error instanceof Error ? error : new Error(String(error));
    }
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    if (this.connectionError) {
      throw new Error(`Não foi possível conectar ao banco de dados: ${this.connectionError.message}`);
    }

    if (!this.db) {
      throw new Error('Banco de dados não foi inicializado corretamente');
    }

    await this.createTables();
    this.initialized = true;
  }

  private async createTables(): Promise<void> {
    const run = promisify(this.db.run.bind(this.db));

    // Tabela de itens do mercado
    await run(`
      CREATE TABLE IF NOT EXISTS market_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_name TEXT UNIQUE NOT NULL,
        app_id INTEGER,
        market_hash_name TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de histórico de preços
    await run(`
      CREATE TABLE IF NOT EXISTS price_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_id INTEGER NOT NULL,
        price REAL NOT NULL,
        volume INTEGER,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(item_id) REFERENCES market_items(id)
      )
    `);

    // Tabela de análises técnicas
    await run(`
      CREATE TABLE IF NOT EXISTS technical_analysis (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_id INTEGER NOT NULL,
        rsi REAL,
        macd REAL,
        signal_line REAL,
        moving_avg_7 REAL,
        moving_avg_30 REAL,
        trend TEXT,
        score REAL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(item_id) REFERENCES market_items(id)
      )
    `);

    // Tabela de sinais de compra/venda
    await run(`
      CREATE TABLE IF NOT EXISTS trading_signals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_id INTEGER NOT NULL,
        signal_type TEXT NOT NULL,
        price REAL,
        predicted_price REAL,
        confidence REAL,
        target_days INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        expires_at DATETIME,
        status TEXT DEFAULT 'active',
        FOREIGN KEY(item_id) REFERENCES market_items(id)
      )
    `);

    // Tabela de portfólio (itens comprados)
    await run(`
      CREATE TABLE IF NOT EXISTS portfolio (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_id INTEGER NOT NULL,
        quantity INTEGER DEFAULT 1,
        purchase_price REAL,
        purchase_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        current_price REAL,
        signal_id INTEGER,
        status TEXT DEFAULT 'held',
        FOREIGN KEY(item_id) REFERENCES market_items(id),
        FOREIGN KEY(signal_id) REFERENCES trading_signals(id)
      )
    `);

    console.log('✓ Tabelas do banco de dados criadas');
  }

  run(sql: string, params: any[] = []): Promise<void> {
    if (!this.db) {
      return Promise.reject(new Error('Banco de dados não está conectado'));
    }
    return new Promise((resolve, reject) => {
      this.db!.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  get(sql: string, params: any[] = []): Promise<any> {
    if (!this.db) {
      return Promise.reject(new Error('Banco de dados não está conectado'));
    }
    return new Promise((resolve, reject) => {
      this.db!.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  all(sql: string, params: any[] = []): Promise<any[]> {
    if (!this.db) {
      return Promise.reject(new Error('Banco de dados não está conectado'));
    }
    return new Promise((resolve, reject) => {
      this.db!.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  close(): Promise<void> {
    if (!this.db) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      this.db!.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

export const db = new Database();

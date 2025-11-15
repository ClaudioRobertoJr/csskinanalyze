import Database from 'better-sqlite3';
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

export class DatabaseWrapper {
  private db: Database.Database | null = null;
  private initialized = false;

  constructor() {
    try {
      this.db = new Database(dbPath, { verbose: console.log });
      console.log('✓ Banco de dados conectado:', dbPath);
    } catch (error) {
      console.error('❌ Erro fatal ao criar instância do banco:', error);
      throw error;
    }
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    if (!this.db) {
      throw new Error('Banco de dados não foi inicializado corretamente');
    }

    this.createTables();
    this.initialized = true;
  }

  private createTables(): void {
    if (!this.db) throw new Error('Banco de dados não conectado');

    // Tabela de itens do mercado
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS market_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_name TEXT UNIQUE NOT NULL,
        app_id INTEGER,
        market_hash_name TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de histórico de preços
    this.db.exec(`
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
    this.db.exec(`
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
    this.db.exec(`
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
    this.db.exec(`
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

  async run(sql: string, params: any[] = []): Promise<void> {
    if (!this.db) {
      throw new Error('Banco de dados não está conectado');
    }

    try {
      const stmt = this.db.prepare(sql);
      stmt.run(...params);
    } catch (error) {
      console.error('Erro ao executar SQL:', sql, params);
      throw error;
    }
  }

  async get(sql: string, params: any[] = []): Promise<any> {
    if (!this.db) {
      throw new Error('Banco de dados não está conectado');
    }

    try {
      const stmt = this.db.prepare(sql);
      return stmt.get(...params);
    } catch (error) {
      console.error('Erro ao executar SQL:', sql, params);
      throw error;
    }
  }

  async all(sql: string, params: any[] = []): Promise<any[]> {
    if (!this.db) {
      throw new Error('Banco de dados não está conectado');
    }

    try {
      const stmt = this.db.prepare(sql);
      return stmt.all(...params);
    } catch (error) {
      console.error('Erro ao executar SQL:', sql, params);
      throw error;
    }
  }

  async close(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

export const db = new DatabaseWrapper();

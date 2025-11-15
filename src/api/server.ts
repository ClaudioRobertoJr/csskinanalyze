import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { db } from '../database/db.js';
import { portfolioManager } from './portfolio.js';
import { SteamCollector } from '../collectors/steamCollector.js';
import { TechnicalAnalyzer } from '../analyzers/technicalAnalyzer.js';
import { SignalGenerator } from '../signals/signalGenerator.js';

const app: Express = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ==================== ROTAS DE DADOS ====================

// Obter todos os itens com análises
app.get('/api/items', async (req: Request, res: Response) => {
  try {
    const items = await db.all(
      `SELECT mi.*, ta.rsi, ta.macd, ta.signal_line, ta.moving_avg_7,
              ta.moving_avg_30, ta.trend, ta.score
       FROM market_items mi
       LEFT JOIN technical_analysis ta ON mi.id = ta.item_id
       LEFT JOIN (
         SELECT item_id, MAX(timestamp) as latest
         FROM technical_analysis
         GROUP BY item_id
       ) latest ON ta.item_id = latest.item_id AND ta.timestamp = latest.latest
       ORDER BY ta.score DESC
       LIMIT 50`
    );

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Erro ao buscar itens' });
  }
});

// Obter detalhes de um item
app.get('/api/items/:itemId', async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;

    const item = await db.get(
      `SELECT * FROM market_items WHERE id = ?`,
      [itemId]
    );

    const priceHistory = await db.all(
      `SELECT price, volume, timestamp FROM price_history
       WHERE item_id = ?
       ORDER BY timestamp DESC
       LIMIT 90`,
      [itemId]
    );

    const analysis = await db.get(
      `SELECT * FROM technical_analysis
       WHERE item_id = ?
       ORDER BY timestamp DESC
       LIMIT 1`,
      [itemId]
    );

    res.json({ item, priceHistory: priceHistory.reverse(), analysis });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Erro ao buscar item' });
  }
});

// ==================== ROTAS DE SINAIS ====================

app.get('/api/signals', async (req: Request, res: Response) => {
  try {
    const signals = await db.all(
      `SELECT ts.*, mi.item_name
       FROM trading_signals ts
       JOIN market_items mi ON ts.item_id = mi.id
       WHERE ts.status = 'active' AND ts.expires_at > datetime('now')
       ORDER BY ts.confidence DESC
       LIMIT 50`
    );

    res.json(signals);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Erro ao buscar sinais' });
  }
});

// ==================== ROTAS DE PORTFÓLIO ====================

app.get('/api/portfolio', async (req: Request, res: Response) => {
  try {
    await portfolioManager.updateCurrentPrices();
    const items = await portfolioManager.getPortfolioItems();
    const stats = await portfolioManager.getPortfolioStats();

    res.json({ items, stats });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Erro ao buscar portfólio' });
  }
});

app.post('/api/portfolio/buy', async (req: Request, res: Response) => {
  try {
    const { itemId, quantity, purchasePrice, signalId } = req.body;

    await portfolioManager.addPurchase(itemId, quantity, purchasePrice, signalId);

    res.json({ success: true, message: 'Item adicionado ao portfólio' });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Erro ao adicionar item' });
  }
});

app.post('/api/portfolio/sell/:portfolioId', async (req: Request, res: Response) => {
  try {
    const { portfolioId } = req.params;
    const { salePrice } = req.body;

    await portfolioManager.sellItem(parseInt(portfolioId), salePrice);

    res.json({ success: true, message: 'Item vendido' });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Erro ao vender item' });
  }
});

// ==================== ROTAS DE OPERAÇÕES ====================

app.post('/api/operations/collect', async (req: Request, res: Response) => {
  try {
    const collector = new SteamCollector();
    await collector.collectPopularSkins();
    await collector.updatePrices();

    res.json({ success: true, message: 'Coleta de dados concluída' });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Erro na coleta de dados' });
  }
});

app.post('/api/operations/analyze', async (req: Request, res: Response) => {
  try {
    const analyzer = new TechnicalAnalyzer();
    const results = await analyzer.analyzeAllItems();

    res.json({ success: true, count: results.length, results });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Erro na análise' });
  }
});

app.post('/api/operations/signals', async (req: Request, res: Response) => {
  try {
    const generator = new SignalGenerator();
    const signals = await generator.generateSignals();

    res.json({ success: true, count: signals.length, signals });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Erro na geração de sinais' });
  }
});

// ==================== ROTAS DE SAÚDE ====================

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ==================== INICIALIZAÇÃO ====================

export async function startServer(): Promise<Express> {
  await db.initialize();

  app.listen(PORT, () => {
    console.log(`\n🚀 Servidor iniciado em http://localhost:${PORT}`);
    console.log(`\n📊 Acesse o dashboard em http://localhost:3000`);
    console.log(`\n📡 API disponível em http://localhost:${PORT}/api\n`);
  });

  return app;
}

// Iniciar servidor se executado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  startServer().catch(console.error);
}

export default app;

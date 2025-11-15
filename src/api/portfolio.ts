import { db } from '../database/db';

export interface PortfolioItem {
  id: number;
  itemName: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  totalCost: number;
  currentValue: number;
  profit: number;
  profitPercent: number;
  status: 'held' | 'sold';
  purchaseDate: string;
  holdDays: number;
}

export interface PortfolioStats {
  totalItems: number;
  totalInvested: number;
  totalCurrentValue: number;
  totalProfit: number;
  totalProfitPercent: number;
  winRate: number;
  averageHoldDays: number;
}

export class PortfolioManager {
  async addPurchase(
    itemId: number,
    quantity: number,
    purchasePrice: number,
    signalId: number
  ): Promise<void> {
    await db.run(
      `INSERT INTO portfolio (item_id, quantity, purchase_price, signal_id)
       VALUES (?, ?, ?, ?)`,
      [itemId, quantity, purchasePrice, signalId]
    );

    console.log(`✓ Adicionado ao portfólio: ${quantity}x item ${itemId} a $${purchasePrice}`);
  }

  async updateCurrentPrices(): Promise<void> {
    const holdings = await db.all(
      `SELECT p.id, p.item_id FROM portfolio p WHERE p.status = 'held'`
    );

    for (const holding of holdings) {
      const price = await db.get(
        `SELECT price FROM price_history
         WHERE item_id = ?
         ORDER BY timestamp DESC
         LIMIT 1`,
        [holding.item_id]
      );

      if (price) {
        await db.run(
          `UPDATE portfolio SET current_price = ? WHERE id = ?`,
          [price.price, holding.id]
        );
      }
    }
  }

  async getPortfolioItems(): Promise<PortfolioItem[]> {
    const items = await db.all(
      `SELECT p.*, mi.item_name
       FROM portfolio p
       JOIN market_items mi ON p.item_id = mi.id
       WHERE p.status = 'held'`
    );

    return items.map(item => ({
      id: item.id,
      itemName: item.item_name,
      quantity: item.quantity,
      purchasePrice: item.purchase_price,
      currentPrice: item.current_price || item.purchase_price,
      totalCost: item.quantity * item.purchase_price,
      currentValue: item.quantity * (item.current_price || item.purchase_price),
      profit: item.quantity * ((item.current_price || item.purchase_price) - item.purchase_price),
      profitPercent: ((item.current_price || item.purchase_price) - item.purchase_price) / item.purchase_price * 100,
      status: item.status,
      purchaseDate: item.purchase_date,
      holdDays: Math.floor((Date.now() - new Date(item.purchase_date).getTime()) / (1000 * 60 * 60 * 24))
    }));
  }

  async getPortfolioStats(): Promise<PortfolioStats> {
    const items = await this.getPortfolioItems();

    const totalInvested = items.reduce((sum, item) => sum + item.totalCost, 0);
    const totalCurrentValue = items.reduce((sum, item) => sum + item.currentValue, 0);
    const totalProfit = totalCurrentValue - totalInvested;
    const totalProfitPercent = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

    // Calcula taxa de ganho (itens com lucro / total de itens vendidos)
    const soldItems = await db.all(
      `SELECT p.*, mi.item_name
       FROM portfolio p
       JOIN market_items mi ON p.item_id = mi.id
       WHERE p.status = 'sold'`
    );

    const profitableItems = soldItems.filter(item =>
      item.current_price > item.purchase_price
    ).length;
    const winRate = soldItems.length > 0 ? (profitableItems / soldItems.length) * 100 : 0;

    const averageHoldDays = items.length > 0
      ? items.reduce((sum, item) => sum + item.holdDays, 0) / items.length
      : 0;

    return {
      totalItems: items.length,
      totalInvested: Math.round(totalInvested * 100) / 100,
      totalCurrentValue: Math.round(totalCurrentValue * 100) / 100,
      totalProfit: Math.round(totalProfit * 100) / 100,
      totalProfitPercent: Math.round(totalProfitPercent * 100) / 100,
      winRate: Math.round(winRate * 100) / 100,
      averageHoldDays: Math.round(averageHoldDays * 100) / 100
    };
  }

  async sellItem(portfolioId: number, salePrice: number): Promise<void> {
    await db.run(
      `UPDATE portfolio
       SET status = 'sold', current_price = ?
       WHERE id = ?`,
      [salePrice, portfolioId]
    );

    const item = await db.get(
      `SELECT mi.item_name FROM portfolio p
       JOIN market_items mi ON p.item_id = mi.id
       WHERE p.id = ?`,
      [portfolioId]
    );

    console.log(`✓ Vendido: ${item.item_name} a $${salePrice}`);
  }

  async checkTargets(): Promise<void> {
    const holdings = await db.all(
      `SELECT p.*, mi.item_name, ts.predicted_price, ts.target_days
       FROM portfolio p
       JOIN market_items mi ON p.item_id = mi.id
       JOIN trading_signals ts ON p.signal_id = ts.id
       WHERE p.status = 'held' AND ts.signal_type = 'BUY'`
    );

    for (const holding of holdings) {
      if (holding.current_price && holding.current_price >= holding.predicted_price) {
        console.log(
          `🎯 ALVO ATINGIDO: ${holding.item_name} - Preço: $${holding.current_price} >= $${holding.predicted_price}`
        );
      }
    }
  }
}

export const portfolioManager = new PortfolioManager();

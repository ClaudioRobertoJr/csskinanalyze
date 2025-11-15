import { db } from '../database/db';

export interface TradingSignal {
  itemId: number;
  itemName: string;
  signalType: 'BUY' | 'SELL';
  currentPrice: number;
  predictedPrice: number;
  confidence: number; // 0-100
  targetDays: number;
  potentialReturn: number;
}

export class SignalGenerator {
  private readonly MIN_CONFIDENCE = 60; // Mínimo 60% de confiança
  private readonly HOLD_DAYS = 15; // Dias para segurar o item
  private readonly MAX_DAYS = 30; // Máximo 30 dias

  async generateSignals(): Promise<TradingSignal[]> {
    console.log('🎯 Gerando sinais de negociação...');

    const signals: TradingSignal[] = [];

    // Obter análises técnicas recentes
    const analyses = await db.all(
      `SELECT ta.*, mi.item_name, mi.id as item_id
       FROM technical_analysis ta
       JOIN market_items mi ON ta.item_id = mi.id
       WHERE ta.timestamp > datetime('now', '-1 hour')
       ORDER BY ta.score DESC`
    );

    for (const analysis of analyses) {
      // Obter preço atual
      const currentPrice = await this.getCurrentPrice(analysis.item_id);
      if (!currentPrice) continue;

      // Gerar sinais baseado na análise
      if (analysis.trend === 'BULLISH' && analysis.score > 65) {
        const signal = await this.generateBuySignal(
          analysis.item_id,
          analysis.item_name,
          currentPrice,
          analysis
        );
        if (signal) signals.push(signal);
      }

      if (analysis.trend === 'BEARISH' && analysis.score < 35) {
        const signal = await this.generateSellSignal(
          analysis.item_id,
          analysis.item_name,
          currentPrice,
          analysis
        );
        if (signal) signals.push(signal);
      }
    }

    // Salvar sinais no banco
    for (const signal of signals) {
      await this.saveSignal(signal);
    }

    return signals.sort((a, b) => b.confidence - a.confidence);
  }

  private async generateBuySignal(
    itemId: number,
    itemName: string,
    currentPrice: number,
    analysis: any
  ): Promise<TradingSignal | null> {
    // Estratégia: Comprar quando RSI < 40 e tendência é bullish
    const rsi = analysis.rsi;
    const score = analysis.score;
    const macdTrend = analysis.macd > analysis.signal_line;

    if (!macdTrend || rsi > 45) {
      return null; // Não é um bom sinal de compra
    }

    // Prever preço alvo (usando análise técnica simples)
    const predictedPrice = this.predictPriceGrowth(
      currentPrice,
      analysis.moving_avg_7,
      analysis.moving_avg_30,
      20 // 20% de crescimento esperado
    );

    // Calcular confiança
    const confidence = this.calculateConfidence(
      rsi,
      score,
      macdTrend,
      'BUY'
    );

    if (confidence < this.MIN_CONFIDENCE) {
      return null;
    }

    const potentialReturn = ((predictedPrice - currentPrice) / currentPrice) * 100;

    return {
      itemId,
      itemName,
      signalType: 'BUY',
      currentPrice: Math.round(currentPrice * 100) / 100,
      predictedPrice: Math.round(predictedPrice * 100) / 100,
      confidence: Math.round(confidence),
      targetDays: this.HOLD_DAYS,
      potentialReturn: Math.round(potentialReturn * 100) / 100
    };
  }

  private async generateSellSignal(
    itemId: number,
    itemName: string,
    currentPrice: number,
    analysis: any
  ): Promise<TradingSignal | null> {
    // Estratégia: Vender quando RSI > 60 e tendência é bearish
    const rsi = analysis.rsi;
    const score = analysis.score;
    const macdTrend = analysis.macd > analysis.signal_line;

    if (macdTrend || rsi < 55) {
      return null; // Não é um bom sinal de venda
    }

    // Prever preço alvo (usando análise técnica simples)
    const predictedPrice = this.predictPriceFall(
      currentPrice,
      analysis.moving_avg_7,
      analysis.moving_avg_30,
      10 // 10% de queda esperada
    );

    // Calcular confiança
    const confidence = this.calculateConfidence(
      rsi,
      score,
      macdTrend,
      'SELL'
    );

    if (confidence < this.MIN_CONFIDENCE) {
      return null;
    }

    const potentialReturn = ((currentPrice - predictedPrice) / currentPrice) * 100;

    return {
      itemId,
      itemName,
      signalType: 'SELL',
      currentPrice: Math.round(currentPrice * 100) / 100,
      predictedPrice: Math.round(predictedPrice * 100) / 100,
      confidence: Math.round(confidence),
      targetDays: this.HOLD_DAYS,
      potentialReturn: Math.round(potentialReturn * 100) / 100
    };
  }

  private calculateConfidence(
    rsi: number,
    score: number,
    macdTrend: boolean,
    signalType: 'BUY' | 'SELL'
  ): number {
    let confidence = 50; // Base 50%

    if (signalType === 'BUY') {
      // RSI < 40 é bom para compra
      if (rsi < 40) confidence += Math.min((40 - rsi) / 40 * 30, 30);

      // Score > 60 aumenta confiança
      if (score > 60) confidence += (score - 60) / 40 * 20;

      // MACD positivo aumenta confiança
      if (macdTrend) confidence += 10;
    } else {
      // RSI > 60 é bom para venda
      if (rsi > 60) confidence += Math.min((rsi - 60) / 40 * 30, 30);

      // Score < 40 aumenta confiança
      if (score < 40) confidence += (40 - score) / 40 * 20;

      // MACD negativo aumenta confiança
      if (!macdTrend) confidence += 10;
    }

    return Math.min(100, confidence);
  }

  private predictPriceGrowth(
    currentPrice: number,
    sma7: number,
    sma30: number,
    growthPercent: number
  ): number {
    // Se preço está abaixo das médias, é mais provável crescer
    const priceBelowSMA = currentPrice < sma7 && sma7 > sma30;

    if (priceBelowSMA) {
      return currentPrice * (1 + growthPercent / 100);
    }

    // Crescimento mais conservador
    return currentPrice * (1 + growthPercent / 200);
  }

  private predictPriceFall(
    currentPrice: number,
    sma7: number,
    sma30: number,
    fallPercent: number
  ): number {
    // Se preço está acima das médias, é mais provável cair
    const priceAboveSMA = currentPrice > sma7 && sma7 < sma30;

    if (priceAboveSMA) {
      return currentPrice * (1 - fallPercent / 100);
    }

    // Queda mais conservadora
    return currentPrice * (1 - fallPercent / 200);
  }

  private async getCurrentPrice(itemId: number): Promise<number | null> {
    const result = await db.get(
      `SELECT price FROM price_history
       WHERE item_id = ?
       ORDER BY timestamp DESC
       LIMIT 1`,
      [itemId]
    );

    return result ? result.price : null;
  }

  private async saveSignal(signal: TradingSignal): Promise<void> {
    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + signal.targetDays);

      await db.run(
        `INSERT INTO trading_signals
        (item_id, signal_type, price, predicted_price, confidence, target_days, expires_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          signal.itemId,
          signal.signalType,
          signal.currentPrice,
          signal.predictedPrice,
          signal.confidence,
          signal.targetDays,
          expiresAt.toISOString()
        ]
      );
    } catch (error) {
      console.error('Erro ao salvar sinal:', error);
    }
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    await db.initialize();
    const generator = new SignalGenerator();
    const signals = await generator.generateSignals();

    console.log('\n🎯 Sinais Gerados:');
    console.log('================================');
    signals.forEach(signal => {
      const emoji = signal.signalType === 'BUY' ? '📈' : '📉';
      console.log(`${emoji} ${signal.itemName}`);
      console.log(`   Tipo: ${signal.signalType} | Preço Atual: $${signal.currentPrice}`);
      console.log(`   Preço Alvo: $${signal.predictedPrice} | Retorno: ${signal.potentialReturn}%`);
      console.log(`   Confiança: ${signal.confidence}% | Dias: ${signal.targetDays}`);
    });

    await db.close();
  })();
}

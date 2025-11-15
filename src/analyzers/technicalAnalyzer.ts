import { RSI, MACD, SMA } from 'technicalindicators';
import { db } from '../database/db';

export interface AnalysisResult {
  itemId: number;
  itemName: string;
  rsi: number;
  macd: number;
  signalLine: number;
  movingAvg7: number;
  movingAvg30: number;
  trend: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  score: number; // 0-100
  recommendation: 'BUY' | 'SELL' | 'HOLD';
}

export class TechnicalAnalyzer {
  private readonly RSI_PERIOD = 14;
  private readonly MACD_FAST = 12;
  private readonly MACD_SLOW = 26;
  private readonly MACD_SIGNAL = 9;
  private readonly SMA_SHORT = 7;
  private readonly SMA_LONG = 30;

  async analyzeAllItems(): Promise<AnalysisResult[]> {
    console.log('📊 Analisando tendências técnicas...');

    const items = await db.all('SELECT id, item_name FROM market_items');
    const results: AnalysisResult[] = [];

    for (const item of items) {
      const analysis = await this.analyzeItem(item.id, item.item_name);
      if (analysis) {
        results.push(analysis);

        // Salvar análise no banco
        await db.run(
          `INSERT INTO technical_analysis
          (item_id, rsi, macd, signal_line, moving_avg_7, moving_avg_30, trend, score)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            analysis.itemId,
            analysis.rsi,
            analysis.macd,
            analysis.signalLine,
            analysis.movingAvg7,
            analysis.movingAvg30,
            analysis.trend,
            analysis.score
          ]
        );
      }
    }

    return results;
  }

  async analyzeItem(itemId: number, itemName: string): Promise<AnalysisResult | null> {
    try {
      // Obter histórico de preços
      const priceHistory = await db.all(
        `SELECT price FROM price_history
         WHERE item_id = ?
         ORDER BY timestamp DESC
         LIMIT 100`,
        [itemId]
      );

      if (priceHistory.length < this.MACD_SLOW) {
        console.log(`  ⚠ ${itemName}: histórico insuficiente`);
        return null;
      }

      const prices = priceHistory.reverse().map((h: any) => h.price);

      // Calcular indicadores técnicos
      const rsi = this.calculateRSI(prices);
      const macd = this.calculateMACD(prices);
      const sma7 = this.calculateSMA(prices, this.SMA_SHORT);
      const sma30 = this.calculateSMA(prices, this.SMA_LONG);

      // Determinar tendência
      const trend = this.determineTrend(rsi, macd, sma7, sma30);
      const score = this.calculateScore(rsi, macd, sma7, sma30);
      const recommendation = this.getRecommendation(trend, score);

      console.log(`  ✓ ${itemName}: RSI=${rsi.toFixed(2)}, Trend=${trend}, Score=${score.toFixed(0)}`);

      return {
        itemId,
        itemName,
        rsi: Math.round(rsi * 100) / 100,
        macd: Math.round(macd.macd * 100) / 100,
        signalLine: Math.round(macd.signal * 100) / 100,
        movingAvg7: Math.round(sma7 * 100) / 100,
        movingAvg30: Math.round(sma30 * 100) / 100,
        trend,
        score,
        recommendation
      };
    } catch (error) {
      console.error(`Erro ao analisar ${itemName}:`, error);
      return null;
    }
  }

  private calculateRSI(prices: number[]): number {
    const values = prices.slice(-this.RSI_PERIOD - 1);
    const rsiValues = RSI.calculate({ values, period: this.RSI_PERIOD });
    return rsiValues[rsiValues.length - 1] ?? 50;
  }

  private calculateMACD(prices: number[]): { macd: number; signal: number } {
    const values = prices.slice(-this.MACD_SLOW - this.MACD_SIGNAL);
    const macdResult = MACD.calculate({
      values,
      fastPeriod: this.MACD_FAST,
      slowPeriod: this.MACD_SLOW,
      signalPeriod: this.MACD_SIGNAL,
      SimpleMAOscillator: false,
      SimpleMASignal: false
    });

    if (macdResult.length === 0) {
      return { macd: 0, signal: 0 };
    }

    const last = macdResult[macdResult.length - 1];
    return {
      macd: last.MACD ?? 0,
      signal: last.signal ?? 0
    };
  }

  private calculateSMA(prices: number[], period: number): number {
    const values = prices.slice(-period);
    const smaValues = SMA.calculate({ values, period });
    return smaValues[smaValues.length - 1] ?? prices[prices.length - 1];
  }

  private determineTrend(
    rsi: number,
    macd: { macd: number; signal: number },
    sma7: number,
    sma30: number
  ): 'BULLISH' | 'BEARISH' | 'NEUTRAL' {
    let bullishSignals = 0;
    let bearishSignals = 0;

    // RSI análise
    if (rsi < 30) bullishSignals++;
    if (rsi > 70) bearishSignals++;

    // MACD análise
    if (macd.macd > macd.signal) bullishSignals++;
    else bearishSignals++;

    // Moving Average análise
    if (sma7 > sma30) bullishSignals++;
    else bearishSignals++;

    if (bullishSignals > bearishSignals) return 'BULLISH';
    if (bearishSignals > bullishSignals) return 'BEARISH';
    return 'NEUTRAL';
  }

  private calculateScore(
    rsi: number,
    macd: { macd: number; signal: number },
    sma7: number,
    sma30: number
  ): number {
    let score = 50; // Neutro

    // RSI contribui até 25 pontos
    if (rsi < 30) score += 25; // Oversold - compra
    else if (rsi > 70) score -= 25; // Overbought - venda
    else score += (50 - rsi) * 0.25; // Escala linear

    // MACD contribui até 25 pontos
    const macdDiff = macd.macd - macd.signal;
    if (macdDiff > 0) score += Math.min(macdDiff * 10, 25);
    else score -= Math.min(Math.abs(macdDiff) * 10, 25);

    // Moving Averages contribuem até 25 pontos
    const priceVsSma = (sma7 - sma30) / sma30;
    score += priceVsSma * 25;

    return Math.max(0, Math.min(100, score));
  }

  private getRecommendation(trend: string, score: number): 'BUY' | 'SELL' | 'HOLD' {
    if (trend === 'BULLISH' && score > 60) return 'BUY';
    if (trend === 'BEARISH' && score < 40) return 'SELL';
    return 'HOLD';
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    await db.initialize();
    const analyzer = new TechnicalAnalyzer();
    const results = await analyzer.analyzeAllItems();

    console.log('\n📈 Resultados das Análises:');
    console.log('================================');
    results.forEach(result => {
      console.log(`${result.itemName}`);
      console.log(`  RSI: ${result.rsi} | MACD: ${result.macd} | Trend: ${result.trend}`);
      console.log(`  Score: ${result.score.toFixed(2)} | Recomendação: ${result.recommendation}`);
    });

    await db.close();
  })();
}

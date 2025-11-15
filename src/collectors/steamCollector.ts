import axios from 'axios';
import { db } from '../database/db.js';

interface SteamMarketItem {
  name: string;
  appId: number;
  marketHashName: string;
  price?: number;
  volume?: number;
}

interface PriceHistoryData {
  price: number;
  volume: number;
  timestamp: number;
}

export class SteamCollector {
  private readonly STEAM_API_BASE = 'https://steamcommunity.com/market/api/';
  private readonly PRICE_OVERVIEW_URL = 'https://steamcommunity.com/market/priceoverview/';
  private readonly SEARCH_URL = 'https://steamcommunity.com/market/search/render/';
  private readonly RETRY_DELAY = 2000; // 2 segundos
  private readonly MAX_RETRIES = 3;

  async collectPopularSkins(): Promise<void> {
    console.log('🔍 Iniciando coleta de skins populares...');

    try {
      // Coletar skins de jogos populares (CS:GO, Dota 2, etc)
      const apps = [
        { id: 730, name: 'Counter-Strike 2' },
        { id: 570, name: 'Dota 2' },
        { id: 440, name: 'Team Fortress 2' }
      ];

      for (const app of apps) {
        console.log(`\n📦 Coletando skins de ${app.name}...`);
        await this.collectSkinsForApp(app.id);
        await this.delay(this.RETRY_DELAY);
      }

      console.log('\n✓ Coleta de skins concluída');
    } catch (error) {
      console.error('Erro ao coletar skins:', error);
    }
  }

  private async collectSkinsForApp(appId: number): Promise<void> {
    try {
      const response = await this.retryRequest(async () => {
        return axios.get(this.SEARCH_URL, {
          params: {
            query: '',
            appid: appId,
            sort_column: 'popular',
            sort_dir: 'desc',
            count: 100,
            search_descriptions: 0,
            norender: 1
          },
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
      });

      const results = response.data.results || [];

      for (const item of results.slice(0, 20)) {
        await this.addItem({
          name: item.hash_name,
          appId: appId,
          marketHashName: item.hash_name
        });
      }

      console.log(`✓ ${results.length} skins coletadas de app ${appId}`);
    } catch (error) {
      console.error(`Erro ao coletar skins de app ${appId}:`, error);
    }
  }

  async updatePrices(): Promise<void> {
    console.log('💰 Atualizando preços...');

    const items = await db.all('SELECT * FROM market_items');

    for (const item of items) {
      await this.updateItemPrice(item.id, item.app_id, item.market_hash_name);
      await this.delay(this.RETRY_DELAY);
    }

    console.log(`✓ ${items.length} itens atualizados`);
  }

  private async updateItemPrice(itemId: number, appId: number, marketHashName: string): Promise<void> {
    try {
      const priceData = await this.retryRequest(async () => {
        return axios.get(this.PRICE_OVERVIEW_URL, {
          params: {
            market_hash_name: marketHashName,
            appid: appId,
            country: 'US',
            currency: 1 // USD
          },
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
      });

      const data = priceData.data;

      if (data.success) {
        // Parse price (remove $ e converter para número)
        const price = parseFloat(data.lowest_price?.replace('$', '') || '0');
        const volume = parseInt(data.volume?.replace(',', '') || '0');

        if (price > 0) {
          await db.run(
            'INSERT INTO price_history (item_id, price, volume) VALUES (?, ?, ?)',
            [itemId, price, volume]
          );

          console.log(`  ✓ ${marketHashName}: $${price} (Volume: ${volume})`);
        }
      }
    } catch (error) {
      console.error(`Erro ao atualizar preço de ${marketHashName}:`, error);
    }
  }

  private async addItem(item: SteamMarketItem): Promise<void> {
    try {
      const existing = await db.get(
        'SELECT id FROM market_items WHERE item_name = ?',
        [item.name]
      );

      if (!existing) {
        await db.run(
          'INSERT INTO market_items (item_name, app_id, market_hash_name) VALUES (?, ?, ?)',
          [item.name, item.appId, item.marketHashName]
        );
      }
    } catch (error) {
      // Item pode já existir
    }
  }

  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    retries: number = 0
  ): Promise<T> {
    try {
      return await requestFn();
    } catch (error) {
      if (retries < this.MAX_RETRIES) {
        const delay = Math.pow(2, retries) * this.RETRY_DELAY;
        console.log(`⏳ Tentando novamente em ${delay}ms...`);
        await this.delay(delay);
        return this.retryRequest(requestFn, retries + 1);
      }
      throw error;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    await db.initialize();
    const collector = new SteamCollector();
    await collector.collectPopularSkins();
    await collector.updatePrices();
    await db.close();
  })();
}

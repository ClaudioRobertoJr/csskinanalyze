import { startServer } from './api/server';
import { db } from './database/db';
import { SteamCollector } from './collectors/steamCollector';
import { TechnicalAnalyzer } from './analyzers/technicalAnalyzer';
import { SignalGenerator } from './signals/signalGenerator';
import { portfolioManager } from './api/portfolio';

async function main() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   STEAM MARKET SKIN ANALYZER v1.0      ║');
  console.log('║   Análise & Trading de Skins CS2/Dota2 ║');
  console.log('╚════════════════════════════════════════╝\n');

  try {
    // Inicializar banco de dados
    await db.initialize();
    console.log('✓ Banco de dados inicializado\n');

    // Iniciar servidor PRIMEIRO
    console.log('🚀 Iniciando servidor...\n');
    await startServer();

    // Agendar coleta de dados a cada 2 horas
    console.log('⏰ Agendando operações automáticas...\n');

    setInterval(async () => {
      console.log('\n📅 Executando ciclo automático...');
      try {
        const collector = new SteamCollector();
        console.log('Atualizando preços...');
        await collector.updatePrices();

        console.log('Analisando tendências...');
        const analyzer = new TechnicalAnalyzer();
        await analyzer.analyzeAllItems();

        console.log('Gerando sinais...');
        const generator = new SignalGenerator();
        await generator.generateSignals();

        console.log('Atualizando portfólio...');
        await portfolioManager.updateCurrentPrices();
        await portfolioManager.checkTargets();

        console.log('✓ Ciclo completado!\n');
      } catch (error) {
        console.error('❌ Erro no ciclo automático:', error);
      }
    }, 2 * 60 * 60 * 1000); // 2 horas

    // Executar primeira sincronização em background (não bloqueia servidor)
    console.log('🔄 Executando primeira sincronização (background)...\n');
    setImmediate(async () => {
      try {
        const collector = new SteamCollector();
        console.log('\n📦 Coletando skins populares...');
        await collector.collectPopularSkins();

        console.log('💰 Atualizando preços...');
        await collector.updatePrices();

        console.log('📊 Analisando tendências...');
        const analyzer = new TechnicalAnalyzer();
        await analyzer.analyzeAllItems();

        console.log('🎯 Gerando sinais...');
        const generator = new SignalGenerator();
        await generator.generateSignals();

        console.log('\n✓ Primeira sincronização concluída!\n');
      } catch (error) {
        console.error('⚠️ Erro na primeira sincronização:', error);
      }
    });

  } catch (error) {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  }
}

// Tratamento de sinais para encerramento gracioso
process.on('SIGINT', async () => {
  console.log('\n\n👋 Encerrando aplicação...');
  await db.close();
  process.exit(0);
});

main().catch(console.error);

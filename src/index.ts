import { startServer } from './api/server.js';
import { db } from './database/db.js';
import { SteamCollector } from './collectors/steamCollector.js';
import { TechnicalAnalyzer } from './analyzers/technicalAnalyzer.js';
import { SignalGenerator } from './signals/signalGenerator.js';
import { portfolioManager } from './api/portfolio.js';

async function main() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   STEAM MARKET SKIN ANALYZER v1.0      ║');
  console.log('║   Análise & Trading de Skins CS2/Dota2 ║');
  console.log('╚════════════════════════════════════════╝\n');

  try {
    // Inicializar banco de dados
    await db.initialize();
    console.log('✓ Banco de dados inicializado\n');

    // Iniciar servidor
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

    // Executar uma vez na inicialização
    console.log('🔄 Executando primeira sincronização...\n');
    const collector = new SteamCollector();
    await collector.collectPopularSkins();
    await collector.updatePrices();

    const analyzer = new TechnicalAnalyzer();
    await analyzer.analyzeAllItems();

    const generator = new SignalGenerator();
    await generator.generateSignals();

    console.log('\n✓ Sistema pronto e operacional!\n');
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

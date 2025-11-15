# 🎮 Steam Market Skin Analyzer

Um analisador avançado de skins do mercado da Steam que utiliza análise técnica em tempo real para identificar oportunidades de compra e venda com previsão de lucro em 15-30 dias.

## 🚀 Características

- **📊 Coleta Automática de Dados**: Busca preços e volumes do mercado Steam
- **📈 Análise Técnica**: RSI, MACD, Médias Móveis (7 e 30 dias)
- **🎯 Gerador de Sinais**: Identificação automática de oportunidades BUY/SELL
- **💼 Gerenciamento de Portfólio**: Rastreamento de compras/vendas com lucro/prejuízo
- **📱 Dashboard em Tempo Real**: Interface intuitiva para visualizar análises
- **🔄 Operações Automáticas**: Execução em segundo plano a cada 2 horas

## 🛠️ Arquitetura

```
├── src/
│   ├── collectors/       # Coleta de dados do Steam Market
│   ├── analyzers/        # Análise técnica (RSI, MACD, SMA)
│   ├── signals/          # Gerador de sinais de compra/venda
│   ├── database/         # SQLite para persistência
│   └── api/              # API Express + Gerenciador de Portfólio
├── frontend/             # Dashboard React
├── data/                 # Banco de dados SQLite
└── dist/                 # Código compilado
```

## 📋 Stack Tecnológico

**Backend:**
- Node.js + TypeScript
- Express.js (API REST)
- SQLite3 (Persistência)
- technicalindicators (Análise técnica)

**Frontend:**
- React 18
- Chart.js (Visualização de preços)
- Axios (Requisições HTTP)

## 🔧 Instalação

1. **Clone o repositório**
```bash
cd csskinanalyze
```

2. **Instale as dependências**
```bash
npm install
cd frontend && npm install && cd ..
```

3. **Crie a pasta de dados**
```bash
mkdir data
```

## 🚀 Como Usar

### Iniciar o Sistema

```bash
npm run dev
```

Isso iniciará:
- **Servidor**: http://localhost:5000
- **Dashboard**: http://localhost:3000

### Operações Manuais

- **Coletar Dados**: Busca skins populares e atualiza preços
- **Analisar**: Calcula indicadores técnicos (RSI, MACD, SMA)
- **Gerar Sinais**: Identifica oportunidades de compra/venda
- **Portfólio**: Acompanha itens comprados

### Rotas da API

```bash
# Dashboard
GET /api/items              # Lista todos os itens com análises
GET /api/items/:id         # Detalhes de um item
GET /api/signals           # Sinais ativos de compra/venda
GET /api/portfolio         # Portfólio e estatísticas

# Operações
POST /api/portfolio/buy    # Adicionar compra ao portfólio
POST /api/portfolio/sell/:id # Vender item
POST /api/operations/collect # Coletar dados
POST /api/operations/analyze # Analisar tendências
POST /api/operations/signals  # Gerar sinais
```

## 📊 Indicadores Técnicos

### RSI (Relative Strength Index)
- Período: 14
- **< 30**: Oversold (sinal de compra)
- **> 70**: Overbought (sinal de venda)

### MACD (Moving Average Convergence Divergence)
- Fast: 12, Slow: 26, Signal: 9
- Quando MACD > Signal Line: Tendência de alta
- Quando MACD < Signal Line: Tendência de baixa

### Médias Móveis
- SMA 7 dias: Curto prazo
- SMA 30 dias: Longo prazo
- Preço acima de ambas: Bullish
- Preço abaixo de ambas: Bearish

## 💡 Lógica de Sinais

### Sinal de Compra (BUY)
- RSI < 40 (Oversold)
- MACD > Signal Line (Bullish)
- Preço abaixo das médias
- Score > 65
- Confiança > 60%

### Sinal de Venda (SELL)
- RSI > 60 (Overbought)
- MACD < Signal Line (Bearish)
- Preço acima das médias
- Score < 35
- Confiança > 60%

## 💼 Gerenciamento de Portfólio

O sistema rastreia:
- **Total Investido**: Soma de todos os investimentos
- **Valor Atual**: Preço atual × quantidade
- **Lucro/Prejuízo**: Diferença total e percentual
- **Taxa de Ganho**: Percentual de operações lucrativas
- **Dias em Posse**: Tempo médio de retenção

## 📱 Dashboard

- **Dashboard**: Visão geral das estatísticas
- **Itens**: Lista de todos os itens com análises técnicas
- **Sinais**: Oportunidades de compra/venda
- **Portfólio**: Itens em posse e histórico de vendas

## 🔄 Ciclo Automático

O sistema executa automaticamente a cada 2 horas:
1. Atualiza preços do mercado
2. Recalcula indicadores técnicos
3. Gera novos sinais
4. Atualiza portfólio
5. Verifica metas atingidas

## 📈 Estratégia de Negociação

1. **Identificação**: Encontra itens com RSI baixo (< 40)
2. **Confirmação**: Valida com MACD e Médias Móveis
3. **Entrada**: Compra quando score > 65 e confiança > 60%
4. **Alvo**: Define preço alvo de 15-30% de lucro
5. **Saída**: Vende quando atinge o alvo ou depois de 30 dias
6. **Análise**: Rastreia ganhos para otimizar futuras operações

## ⚠️ Aviso Importante

Este projeto é para fins educacionais e de análise. Transações reais no mercado Steam estão sujeitas a:
- Custos de transação do Steam (5-10%)
- Limites de mercado (quantidade e preço)
- Restrições de conta (novos usuários)

**Use sempre com cautela e nunca invista mais do que pode perder.**

## 🤝 Contribuições

Melhorias são bem-vindas! Sinta-se livre para:
- Implementar novos indicadores técnicos
- Melhorar a interface do dashboard
- Otimizar algoritmos de sinais
- Adicionar mais estratégias

## 📄 Licença

MIT License - Veja LICENSE para detalhes

## 🙋 Suporte

Para dúvidas ou problemas:
1. Verifique os logs da aplicação
2. Consulte a documentação da API
3. Revise a lógica de sinais

---

**Desenvolvido com ❤️ para traders de skins Steam**

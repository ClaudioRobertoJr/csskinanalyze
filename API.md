# 📡 Documentação da API REST

## Base URL
```
http://localhost:5000/api
```

## Endpoints

### 🏥 Health Check

```
GET /api/health
```

Verifica se o servidor está ativo.

**Resposta:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### 📦 Itens

#### Listar Todos os Itens
```
GET /api/items
```

Retorna lista de skins com análises técnicas recentes.

**Parâmetros de Query:**
- `limit=50` (padrão): Máximo de itens

**Resposta:**
```json
[
  {
    "id": 1,
    "item_name": "Glock-18 | Dragon Tattoo (Factory New)",
    "app_id": 730,
    "rsi": 35.5,
    "macd": -0.025,
    "signal_line": -0.018,
    "moving_avg_7": 2.45,
    "moving_avg_30": 2.50,
    "trend": "BULLISH",
    "score": 72
  }
]
```

#### Obter Detalhes de Um Item
```
GET /api/items/:itemId
```

Retorna análise detalhada e histórico de preços.

**Parâmetros de Path:**
- `itemId`: ID do item (requerido)

**Resposta:**
```json
{
  "item": {
    "id": 1,
    "item_name": "Glock-18 | Dragon Tattoo (Factory New)",
    "app_id": 730,
    "market_hash_name": "Glock-18 | Dragon Tattoo (Factory New)"
  },
  "priceHistory": [
    {
      "price": 2.15,
      "volume": 1250,
      "timestamp": "2024-01-15T10:00:00.000Z"
    },
    {
      "price": 2.18,
      "volume": 1300,
      "timestamp": "2024-01-14T10:00:00.000Z"
    }
  ],
  "analysis": {
    "rsi": 35.5,
    "macd": -0.025,
    "signal_line": -0.018,
    "moving_avg_7": 2.45,
    "moving_avg_30": 2.50,
    "trend": "BULLISH",
    "score": 72,
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 🎯 Sinais

#### Listar Sinais Ativos
```
GET /api/signals
```

Retorna sinais de compra/venda válidos.

**Resposta:**
```json
[
  {
    "id": 5,
    "item_id": 1,
    "item_name": "Glock-18 | Dragon Tattoo (Factory New)",
    "signal_type": "BUY",
    "price": 2.15,
    "predicted_price": 2.65,
    "confidence": 75,
    "target_days": 15,
    "expires_at": "2024-01-30T10:30:00.000Z",
    "status": "active"
  },
  {
    "id": 6,
    "item_id": 2,
    "item_name": "AWP Dragon Lore (Factory New)",
    "signal_type": "SELL",
    "price": 45.50,
    "predicted_price": 40.20,
    "confidence": 68,
    "target_days": 10,
    "expires_at": "2024-01-25T10:30:00.000Z",
    "status": "active"
  }
]
```

---

### 💼 Portfólio

#### Obter Portfólio e Estatísticas
```
GET /api/portfolio
```

Retorna itens em posse e resumo de performance.

**Resposta:**
```json
{
  "items": [
    {
      "id": 1,
      "itemName": "Glock-18 | Dragon Tattoo (Factory New)",
      "quantity": 2,
      "purchasePrice": 2.15,
      "currentPrice": 2.45,
      "totalCost": 4.30,
      "currentValue": 4.90,
      "profit": 0.60,
      "profitPercent": 13.95,
      "status": "held",
      "purchaseDate": "2024-01-10T10:00:00.000Z",
      "holdDays": 5
    }
  ],
  "stats": {
    "totalItems": 1,
    "totalInvested": 4.30,
    "totalCurrentValue": 4.90,
    "totalProfit": 0.60,
    "totalProfitPercent": 13.95,
    "winRate": 100,
    "averageHoldDays": 5
  }
}
```

#### Adicionar Compra
```
POST /api/portfolio/buy
Content-Type: application/json
```

Adiciona um novo item ao portfólio.

**Body:**
```json
{
  "itemId": 1,
  "quantity": 2,
  "purchasePrice": 2.15,
  "signalId": 5
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Item adicionado ao portfólio"
}
```

#### Vender Item
```
POST /api/portfolio/sell/:portfolioId
Content-Type: application/json
```

Marca um item como vendido.

**Parâmetros de Path:**
- `portfolioId`: ID do item no portfólio (requerido)

**Body:**
```json
{
  "salePrice": 2.45
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Item vendido"
}
```

---

### ⚙️ Operações

#### Coletar Dados
```
POST /api/operations/collect
```

Busca skins populares e atualiza preços do mercado Steam.

**Resposta:**
```json
{
  "success": true,
  "message": "Coleta de dados concluída"
}
```

#### Analisar Tendências
```
POST /api/operations/analyze
```

Calcula indicadores técnicos para todos os itens.

**Resposta:**
```json
{
  "success": true,
  "count": 45,
  "results": [
    {
      "itemId": 1,
      "itemName": "Glock-18 | Dragon Tattoo (Factory New)",
      "rsi": 35.5,
      "macd": -0.025,
      "signalLine": -0.018,
      "movingAvg7": 2.45,
      "movingAvg30": 2.50,
      "trend": "BULLISH",
      "score": 72,
      "recommendation": "BUY"
    }
  ]
}
```

#### Gerar Sinais
```
POST /api/operations/signals
```

Identifica oportunidades de compra/venda.

**Resposta:**
```json
{
  "success": true,
  "count": 5,
  "signals": [
    {
      "itemId": 1,
      "itemName": "Glock-18 | Dragon Tattoo (Factory New)",
      "signalType": "BUY",
      "currentPrice": 2.15,
      "predictedPrice": 2.65,
      "confidence": 75,
      "targetDays": 15,
      "potentialReturn": 23.26
    }
  ]
}
```

---

## Códigos de Erro

| Status | Descrição |
|--------|-----------|
| 200 | Sucesso |
| 400 | Requisição inválida |
| 404 | Não encontrado |
| 500 | Erro do servidor |

**Exemplo de erro:**
```json
{
  "error": "Item não encontrado"
}
```

---

## Exemplos com cURL

### 1. Verificar saúde
```bash
curl http://localhost:5000/api/health
```

### 2. Listar itens
```bash
curl http://localhost:5000/api/items
```

### 3. Buscar item específico
```bash
curl http://localhost:5000/api/items/1
```

### 4. Listar sinais
```bash
curl http://localhost:5000/api/signals
```

### 5. Obter portfólio
```bash
curl http://localhost:5000/api/portfolio
```

### 6. Coletar dados
```bash
curl -X POST http://localhost:5000/api/operations/collect
```

### 7. Analisar
```bash
curl -X POST http://localhost:5000/api/operations/analyze
```

### 8. Gerar sinais
```bash
curl -X POST http://localhost:5000/api/operations/signals
```

### 9. Comprar item
```bash
curl -X POST http://localhost:5000/api/portfolio/buy \
  -H "Content-Type: application/json" \
  -d '{
    "itemId": 1,
    "quantity": 2,
    "purchasePrice": 2.15,
    "signalId": 5
  }'
```

### 10. Vender item
```bash
curl -X POST http://localhost:5000/api/portfolio/sell/1 \
  -H "Content-Type: application/json" \
  -d '{
    "salePrice": 2.45
  }'
```

---

## Rate Limiting

Não há rate limiting implementado. Para uso em produção, considere adicionar:
```bash
npm install express-rate-limit
```

---

## Autenticação

Atualmente não há autenticação. Para produção, implemente JWT:
```bash
npm install jsonwebtoken
```

---

## CORS

CORS está habilitado para todas as origens em desenvolvimento. Ajuste em produção em `src/api/server.ts`:

```typescript
app.use(cors({
  origin: 'https://seu-dominio.com',
  credentials: true
}));
```

---

## WebSockets (Futuro)

Considere adicionar WebSockets para atualizações em tempo real:
```bash
npm install socket.io
```

---

## Migração de Banco de Dados

Para resetar o banco:
```bash
rm data/steam_skins.db
npm run server:dev
```

---

## Monitoramento

Monitore com ferramentas como:
- PM2
- Forever
- Supervisor
- Docker

---

**Última atualização:** 2024-01-15

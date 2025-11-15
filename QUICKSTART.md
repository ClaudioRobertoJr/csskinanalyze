# ⚡ Quick Start - Steam Skin Analyzer

Comece em 5 minutos! 🚀

## 1️⃣ Instale as Dependências

```bash
npm install
cd frontend && npm install && cd ..
```

## 2️⃣ Crie a Pasta de Dados

```bash
mkdir -p data
```

## 3️⃣ Inicie o Sistema

```bash
npm run dev
```

Aguarde até ver:
```
🚀 Servidor iniciado em http://localhost:5000
📊 Acesse o dashboard em http://localhost:3000
```

## 4️⃣ Abra o Dashboard

Acesse: **http://localhost:3000** 🌐

## 5️⃣ Clique em "Coletar Dados"

O sistema vai:
1. Buscar skins populares de CS2, Dota 2 e TF2
2. Atualizar preços
3. Calcular indicadores técnicos
4. Gerar sinais de compra/venda

## 📊 O que Você Vai Ver

### Dashboard
- 📈 Gráfico de investimentos
- 💰 Lucro/Prejuízo total
- ⭐ Top itens para investir

### Itens
- 📦 Lista de todas as skins
- 📊 Indicadores técnicos (RSI, MACD)
- 📉 Histórico de preços

### Sinais
- 🎯 Oportunidades de compra/venda
- 💹 Retorno esperado
- ⚡ Confiança do sinal

### Portfólio
- 💼 Itens que você "comprou"
- 💸 Lucro/Prejuízo por item
- 📊 Estatísticas gerais

## 🎯 Como Ganhar Dinheiro

1. **Encontre um Sinal BUY** com alta confiança
2. **Clique "Comprar"** na página de Sinais
3. **Aguarde 15-30 dias** ou até atingir o lucro
4. **Venda** quando o preço subir
5. **Repita!** 🔄

## 📊 Indicadores Explicados

| Indicador | O que significa |
|-----------|-----------------|
| **RSI < 30** | Preço muito baixo = boa hora para COMPRAR 📈 |
| **RSI > 70** | Preço muito alto = boa hora para VENDER 📉 |
| **MACD ↑** | Tendência subindo (bullish) |
| **MACD ↓** | Tendência descendo (bearish) |
| **Score > 65** | Sinal forte para compra |
| **Score < 35** | Sinal forte para venda |

## 💡 Dicas de Ouro

✅ **Faça isso:**
- Espere por sinais com confiança > 70%
- Compre quando RSI < 30 e score > 65
- Venda após 15-30% de lucro
- Deixe o sistema rodando 24/7

❌ **Não faça:**
- Não compre skins com volume baixo
- Não ignore sinais com baixa confiança
- Não venda no primeiro sinal de queda
- Não invista tudo em um item

## 🐛 Problemas Comuns

### Nenhum item aparecendo?
```bash
# Clique em "Coletar Dados" no dashboard
```

### Nenhum sinal aparecendo?
```bash
# Clique em "Gerar Sinais" no dashboard
```

### API não responde?
```bash
# Verifique se o servidor está rodando
curl http://localhost:5000/api/health
```

### React não abre?
```bash
# Tente:
cd frontend
npm install
npm start
```

## 🔧 Operações Manuais

Se preferir linha de comando:

```bash
# Coletar dados
npm run collect-data

# Analisar
npm run analyze
```

## 📱 Acompanhamento em Tempo Real

O sistema atualiza automaticamente a cada 2 horas:
- ✅ Coleta novos preços
- ✅ Recalcula indicadores
- ✅ Gera novos sinais
- ✅ Atualiza portfólio

## 🎬 Exemplo de Uma Operação

```
1. Sistema detecta: Glock-18 Dragon Tattoo
   RSI = 25 (muito baixa) 📉
   Score = 78 (excelente) ⭐

2. Gera sinal: COMPRAR
   Preço atual: $2.15
   Preço alvo: $2.65
   Confiança: 82%
   Retorno esperado: 23%

3. Você clica "Comprar" 🛒

4. Sistema registra:
   - Item comprado: 1x Glock-18
   - Preço: $2.15
   - Data: 15/01/2024

5. Após 10 dias:
   - Preço sobe para $2.65
   - Lucro: +$0.50 💰

6. Você clica "Vender" 💸

7. Resultado:
   - Ganhou: +23%
   - Sistema aprende padrão ✨
```

## 📈 Próximos Passos

1. **Explore o Dashboard** - Familiarize-se com a interface
2. **Monitore os Sinais** - Veja como o sistema identifica oportunidades
3. **Faça uma "Compra"** - Teste a função de portfólio
4. **Deixe Rodando** - Quanto mais dados, melhor a análise
5. **Acompanhe os Lucros** - Veja a magia acontecer! ✨

## 🎓 Aprenda Mais

- **Análise Técnica**: Leia `README.md`
- **API**: Consulte `API.md`
- **Setup Avançado**: Veja `SETUP.md`

## 📞 Precisa de Ajuda?

1. Verifique o console (F12 no navegador)
2. Olhe os logs do terminal
3. Leia a documentação no `README.md`
4. Tente recarregar (Ctrl+R no navegador)

## 🚀 Let's Go!

```bash
npm run dev
```

Pronto! Seu analisador de skins está online!

Boa sorte nos seus trades! 🎯

---

**Happy trading! 💰**

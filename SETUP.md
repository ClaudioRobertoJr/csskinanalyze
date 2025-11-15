# 🚀 Guia de Setup - Steam Skin Market Analyzer

## Pré-requisitos

- **Node.js 16+** (Recomendado: 18+)
- **npm** ou **yarn**
- **Git**

## Passo 1: Instalação de Dependências

```bash
# Instalar dependências do backend
npm install

# Instalar dependências do frontend
cd frontend
npm install
cd ..
```

## Passo 2: Criar Pastas Necessárias

```bash
mkdir -p data
```

## Passo 3: Configuração (Opcional)

Copie o arquivo `.env.example` para `.env` e ajuste conforme necessário:

```bash
cp .env.example .env
```

## Passo 4: Executar o Sistema

### Modo de Desenvolvimento (Recomendado)

```bash
npm run dev
```

Isso iniciará automaticamente:
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000

### Modo de Produção

```bash
# Build do backend
npm run server:build

# Build do frontend
npm run client:build

# Iniciar servidor
npm run server:start
```

## 📊 Usando o Dashboard

Acesse **http://localhost:3000** e você verá:

### 1. **Dashboard** 📈
- Resumo de investimentos
- Total atual e lucro/prejuízo
- Top 5 itens com melhor análise

### 2. **Itens** 📦
- Lista completa de skins analisadas
- Indicadores técnicos (RSI, MACD)
- Histórico de preços

### 3. **Sinais** 🎯
- Oportunidades de compra/venda
- Preço alvo e retorno esperado
- Nível de confiança de cada sinal

### 4. **Portfólio** 💼
- Itens em posse
- Lucro/prejuízo por item
- Estatísticas gerais

## 🔄 Operações Automáticas

Clique nos botões no topo para executar operações manualmente:

```
🔄 Coletar Dados   → Busca preços do mercado Steam
📊 Analisar        → Calcula indicadores técnicos
🎯 Gerar Sinais    → Identifica oportunidades
```

## 🔧 Operações via Linha de Comando

### Coletar dados apenas
```bash
npm run collect-data
```

### Analisar dados
```bash
npm run analyze
```

## 📁 Estrutura de Arquivos

```
├── src/
│   ├── collectors/
│   │   └── steamCollector.ts          # Coleta dados do Steam
│   ├── analyzers/
│   │   └── technicalAnalyzer.ts       # Análise técnica (RSI, MACD, SMA)
│   ├── signals/
│   │   └── signalGenerator.ts         # Gerador de sinais
│   ├── database/
│   │   └── db.ts                      # Inicialização do banco
│   ├── api/
│   │   ├── server.ts                  # API Express
│   │   └── portfolio.ts               # Gerenciador de portfólio
│   └── index.ts                       # Entrada principal
├── frontend/
│   └── src/
│       ├── pages/                     # Dashboard, Itens, Sinais, Portfólio
│       └── components/                # Componentes React reutilizáveis
├── data/
│   └── steam_skins.db                 # Banco de dados SQLite
└── README.md                          # Documentação completa
```

## 🧪 Testes de Funcionalidade

### 1. Verificar Banco de Dados
```bash
ls -la data/steam_skins.db
```

### 2. Testar API
```bash
# Verificar saúde da API
curl http://localhost:5000/api/health

# Listar itens
curl http://localhost:5000/api/items

# Listar sinais
curl http://localhost:5000/api/signals
```

## 🐛 Troubleshooting

### Problema: "Cannot find module 'technicalindicators'"
```bash
npm install technicalindicators
```

### Problema: Porta 5000 já em uso
```bash
# Mudar porta na variável de ambiente
export PORT=5001
npm run dev
```

### Problema: Erro ao conectar ao banco de dados
```bash
# Verificar permissões
chmod 755 data/
ls -la data/
```

### Problema: React não inicia
```bash
cd frontend
npm install
npm start
```

## 📝 Arquivos Importantes

- **`src/index.ts`**: Ponto de entrada do servidor
- **`src/database/db.ts`**: Gerenciador de banco de dados
- **`src/collectors/steamCollector.ts`**: Coleta de dados do Steam
- **`src/analyzers/technicalAnalyzer.ts`**: Cálculo de indicadores
- **`src/signals/signalGenerator.ts`**: Geração de sinais
- **`frontend/src/App.js`**: Aplicação React principal

## 🔐 Segurança

- Não commite arquivos `.env` com dados sensíveis
- Use `.env.example` como template
- Altere `SECRET_KEY` em produção

## 📊 Monitoramento

O sistema cria logs em:
- Console (desenvolvimento)
- `data/steam_skins.db` (database)

## 🚀 Deploy

Para deploy em produção:

1. Instale dependências com `npm ci` (ao invés de `npm install`)
2. Compile o TypeScript: `npm run server:build`
3. Build do frontend: `npm run client:build`
4. Use um process manager como PM2
5. Configure variáveis de ambiente em `.env`

Exemplo com PM2:
```bash
npm install -g pm2
pm2 start npm --name "steam-analyzer" -- run server:start
pm2 save
```

## 💡 Dicas

1. **Deixe rodando**: O sistema funciona melhor se deixado em execução contínua
2. **Coleta regular**: Dados são coletados automaticamente a cada 2 horas
3. **Análise em tempo real**: Indicadores são recalculados após cada coleta
4. **Sinais seguem RSI**: Procure por itens com RSI < 30 (oportunidades)
5. **Gerenciar lucros**: Venda quando atingir o alvo (15-30% de lucro)

## 📞 Suporte

Para erros ou dúvidas:
1. Verifique os logs do console
2. Consulte o `README.md` para mais detalhes
3. Revise a documentação das APIs

---

**Bom trading! 🚀**

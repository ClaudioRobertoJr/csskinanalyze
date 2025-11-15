import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StatCard from '../components/StatCard';

function Portfolio() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/portfolio');
      setItems(res.data.items);
      setStats(res.data.stats);
    } catch (error) {
      console.error('Erro ao carregar portfólio:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSell = async (portfolioId, itemName) => {
    const price = prompt(`Preço de venda para ${itemName}:`);
    if (!price || isNaN(price)) return;

    try {
      await axios.post(`/api/portfolio/sell/${portfolioId}`, {
        salePrice: parseFloat(price)
      });
      alert('✓ Item vendido com sucesso');
      fetchPortfolio();
    } catch (error) {
      alert(`Erro: ${error.response?.data?.error || error.message}`);
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div>
      <h2>Portfólio</h2>

      {stats && (
        <div className="grid">
          <StatCard label="Total Investido" value={`$${stats.totalInvested}`} />
          <StatCard label="Valor Atual" value={`$${stats.totalCurrentValue}`} />
          <StatCard
            label="Lucro"
            value={`$${stats.totalProfit}`}
            isPositive={stats.totalProfit >= 0}
          />
          <StatCard
            label="Retorno"
            value={`${stats.totalProfitPercent}%`}
            isPositive={stats.totalProfitPercent >= 0}
          />
        </div>
      )}

      {items.length > 0 ? (
        <div className="card">
          <h3>Itens em Posse ({items.length})</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantidade</th>
                <th>Preço de Compra</th>
                <th>Preço Atual</th>
                <th>Total Investido</th>
                <th>Valor Atual</th>
                <th>Lucro</th>
                <th>% Ganho</th>
                <th>Dias em Posse</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td>{item.itemName?.substring(0, 30)}</td>
                  <td>{item.quantity}</td>
                  <td>${item.purchasePrice?.toFixed(2)}</td>
                  <td>${item.currentPrice?.toFixed(2)}</td>
                  <td>${item.totalCost?.toFixed(2)}</td>
                  <td>${item.currentValue?.toFixed(2)}</td>
                  <td style={{
                    color: item.profit >= 0 ? '#10b981' : '#ef4444'
                  }}>
                    ${item.profit?.toFixed(2)}
                  </td>
                  <td style={{
                    color: item.profitPercent >= 0 ? '#10b981' : '#ef4444',
                    fontWeight: 'bold'
                  }}>
                    {item.profitPercent?.toFixed(2)}%
                  </td>
                  <td>{item.holdDays}</td>
                  <td>
                    <button
                      onClick={() => handleSell(item.id, item.itemName)}
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                    >
                      Vender
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card">
          <p>Nenhum item no portfólio. Clique em "Sinais" para encontrar oportunidades.</p>
        </div>
      )}
    </div>
  );
}

export default Portfolio;

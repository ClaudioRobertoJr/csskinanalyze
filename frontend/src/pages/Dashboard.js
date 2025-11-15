import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StatCard from '../components/StatCard';
import PriceChart from '../components/PriceChart';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [topItems, setTopItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Buscar estatísticas do portfólio
      const portfolioRes = await axios.get('/api/portfolio');
      setStats(portfolioRes.data.stats);

      // Buscar itens com melhor score
      const itemsRes = await axios.get('/api/items');
      const topItems = itemsRes.data
        .filter(item => item.score)
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, 5);
      setTopItems(topItems);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  if (!stats) {
    return <div className="error">Erro ao carregar dados do dashboard</div>;
  }

  return (
    <div>
      <h2>Dashboard Principal</h2>

      <div className="grid">
        <StatCard label="Investimento Total" value={`$${stats.totalInvested}`} />
        <StatCard label="Valor Atual" value={`$${stats.totalCurrentValue}`} />
        <StatCard
          label="Lucro Total"
          value={`$${stats.totalProfit}`}
          isPositive={stats.totalProfit >= 0}
        />
        <StatCard
          label="Retorno (%)"
          value={`${stats.totalProfitPercent}%`}
          isPositive={stats.totalProfitPercent >= 0}
        />
        <StatCard label="Taxa de Ganho" value={`${stats.winRate}%`} />
        <StatCard label="Itens no Portfólio" value={stats.totalItems} />
      </div>

      <div className="card">
        <h3>Top 5 Itens por Score</h3>
        {topItems.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>RSI</th>
                <th>MACD</th>
                <th>Tendência</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {topItems.map(item => (
                <tr key={item.id}>
                  <td>{item.item_name}</td>
                  <td>{item.rsi?.toFixed(2) || 'N/A'}</td>
                  <td>{item.macd?.toFixed(2) || 'N/A'}</td>
                  <td>
                    <span className={`badge ${item.trend?.toLowerCase()}`}>
                      {item.trend || 'N/A'}
                    </span>
                  </td>
                  <td><strong>{item.score?.toFixed(0) || 'N/A'}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Nenhum item disponível. Inicie uma coleta de dados.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

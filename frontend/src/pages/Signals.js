import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Signals() {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSignals();
  }, []);

  const fetchSignals = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/signals');
      setSignals(res.data);
    } catch (error) {
      console.error('Erro ao carregar sinais:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (signal) => {
    if (!window.confirm(`Comprar 1x ${signal.item_name} a $${signal.price}?`)) {
      return;
    }

    try {
      await axios.post('/api/portfolio/buy', {
        itemId: signal.item_id,
        quantity: 1,
        purchasePrice: signal.price,
        signalId: signal.id
      });
      alert('✓ Item adicionado ao portfólio');
      window.location.reload();
    } catch (error) {
      alert(`Erro: ${error.response?.data?.error || error.message}`);
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div>
      <h2>Sinais de Negociação</h2>

      {signals.length > 0 ? (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Tipo</th>
                <th>Preço Atual</th>
                <th>Preço Alvo</th>
                <th>Retorno</th>
                <th>Confiança</th>
                <th>Dias</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {signals.map(signal => (
                <tr key={signal.id}>
                  <td style={{ fontSize: '13px' }}>
                    {signal.item_name?.substring(0, 40)}
                  </td>
                  <td>
                    <span className={`badge ${signal.signal_type === 'BUY' ? 'buy' : 'sell'}`}>
                      {signal.signal_type}
                    </span>
                  </td>
                  <td>${signal.price?.toFixed(2)}</td>
                  <td>${signal.predicted_price?.toFixed(2)}</td>
                  <td>
                    <span style={{
                      color: signal.predicted_price > signal.price ? '#10b981' : '#ef4444'
                    }}>
                      {((signal.predicted_price - signal.price) / signal.price * 100).toFixed(2)}%
                    </span>
                  </td>
                  <td><strong>{signal.confidence}%</strong></td>
                  <td>{signal.target_days} dias</td>
                  <td>
                    {signal.signal_type === 'BUY' && (
                      <button
                        onClick={() => handleBuy(signal)}
                        style={{ fontSize: '12px', padding: '6px 12px' }}
                      >
                        Comprar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card">
          <p>Nenhum sinal disponível. Gere sinais clicando no botão acima.</p>
        </div>
      )}
    </div>
  );
}

export default Signals;

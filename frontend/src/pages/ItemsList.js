import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ItemsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/items');
      setItems(res.data);
    } catch (error) {
      console.error('Erro ao carregar itens:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchItemDetails = async (itemId) => {
    try {
      const res = await axios.get(`/api/items/${itemId}`);
      setSelectedItem(res.data.item);
      setPriceHistory(res.data.priceHistory);
    } catch (error) {
      console.error('Erro ao carregar detalhes:', error);
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div>
      <h2>Lista de Itens</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <div className="card">
            <h3>Itens Disponíveis ({items.length})</h3>
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {items.length > 0 ? (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Score</th>
                      <th>Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(item => (
                      <tr
                        key={item.id}
                        onClick={() => fetchItemDetails(item.id)}
                        style={{
                          cursor: 'pointer',
                          background: selectedItem?.id === item.id ? '#f0f0f0' : 'white'
                        }}
                      >
                        <td style={{ fontSize: '12px' }}>
                          {item.item_name?.substring(0, 30)}...
                        </td>
                        <td><strong>{item.score?.toFixed(0) || 'N/A'}</strong></td>
                        <td>
                          <span className={`badge ${item.trend?.toLowerCase()}`}>
                            {item.trend || 'N/A'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>Nenhum item disponível</p>
              )}
            </div>
          </div>
        </div>

        <div>
          {selectedItem ? (
            <div className="card">
              <h3>{selectedItem.item_name}</h3>
              <div style={{ marginTop: '20px' }}>
                <p><strong>Análise Técnica:</strong></p>
                <p>RSI: {selectedItem.rsi?.toFixed(2) || 'N/A'}</p>
                <p>MACD: {selectedItem.macd?.toFixed(2) || 'N/A'}</p>
                <p>Trend: <span className={`badge ${selectedItem.trend?.toLowerCase()}`}>{selectedItem.trend || 'N/A'}</span></p>
                <p>Score: <strong>{selectedItem.score?.toFixed(0) || 'N/A'}</strong></p>

                <p style={{ marginTop: '20px' }}><strong>Histórico de Preços:</strong></p>
                {priceHistory.length > 0 ? (
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Data</th>
                          <th>Preço</th>
                          <th>Volume</th>
                        </tr>
                      </thead>
                      <tbody>
                        {priceHistory.map((ph, idx) => (
                          <tr key={idx}>
                            <td>{new Date(ph.timestamp).toLocaleDateString()}</td>
                            <td>${ph.price?.toFixed(2)}</td>
                            <td>{ph.volume}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>Nenhum histórico disponível</p>
                )}
              </div>
            </div>
          ) : (
            <div className="card">
              <p>Selecione um item para ver detalhes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ItemsList;

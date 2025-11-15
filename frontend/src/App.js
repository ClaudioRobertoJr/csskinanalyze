import React, { useState } from 'react';
import axios from 'axios';
import Dashboard from './pages/Dashboard';
import ItemsList from './pages/ItemsList';
import Signals from './pages/Signals';
import Portfolio from './pages/Portfolio';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleOperation = async (operation) => {
    setLoading(true);
    setMessage('');
    try {
      await axios.post(`/api/operations/${operation}`);
      setMessage(`✓ ${operation.charAt(0).toUpperCase() + operation.slice(1)} concluído com sucesso!`);
      // Recarregar dados em todos os componentes
      window.location.reload();
    } catch (error) {
      setMessage(`❌ Erro: ${error.response?.data?.error || error.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <header>
        <h1>📊 Steam Skin Market Analyzer</h1>
        <p>Análise técnica em tempo real e previsão de preços para skins do mercado Steam</p>
      </header>

      <div className="nav-tabs">
        <button
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          📈 Dashboard
        </button>
        <button
          className={activeTab === 'items' ? 'active' : ''}
          onClick={() => setActiveTab('items')}
        >
          📦 Itens
        </button>
        <button
          className={activeTab === 'signals' ? 'active' : ''}
          onClick={() => setActiveTab('signals')}
        >
          🎯 Sinais
        </button>
        <button
          className={activeTab === 'portfolio' ? 'active' : ''}
          onClick={() => setActiveTab('portfolio')}
        >
          💼 Portfólio
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => handleOperation('collect')}
          disabled={loading}
          style={{ marginRight: '10px' }}
        >
          🔄 Coletar Dados
        </button>
        <button
          onClick={() => handleOperation('analyze')}
          disabled={loading}
          style={{ marginRight: '10px' }}
        >
          📊 Analisar
        </button>
        <button
          onClick={() => handleOperation('signals')}
          disabled={loading}
        >
          🎯 Gerar Sinais
        </button>
      </div>

      {message && (
        <div className={message.startsWith('✓') ? 'success' : 'error'}>
          {message}
        </div>
      )}

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Processando...</p>
        </div>
      )}

      {!loading && activeTab === 'dashboard' && <Dashboard />}
      {!loading && activeTab === 'items' && <ItemsList />}
      {!loading && activeTab === 'signals' && <Signals />}
      {!loading && activeTab === 'portfolio' && <Portfolio />}
    </div>
  );
}

export default App;

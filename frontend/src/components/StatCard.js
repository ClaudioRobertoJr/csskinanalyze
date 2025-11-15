import React from 'react';

function StatCard({ label, value, isPositive = null }) {
  const valueClass = isPositive === true ? 'positive' : isPositive === false ? 'negative' : '';

  return (
    <div className="card stat-card">
      <div className="stat-label">{label}</div>
      <div className={`stat-value ${valueClass}`}>{value}</div>
    </div>
  );
}

export default StatCard;

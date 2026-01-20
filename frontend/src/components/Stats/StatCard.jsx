import React from 'react';
import './StatCard.css';

const StatCard = ({ icon, value, label, trend = null, className = '' }) => {
  return (
    <div className={`stat-card ${className}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <span className="stat-value">{value}</span>
        <span className="stat-label">{label}</span>
        {trend && (
          <span className={`stat-trend ${trend.positive ? 'positive' : 'negative'}`}>
            {trend.positive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;

import React from 'react';
import './EmptyState.css';

const EmptyState = ({
  icon = '📭',
  title,
  description,
  action = null,
  className = '',
}) => {
  return (
    <div className={`empty-state ${className}`}>
      <span className="empty-state-icon">{icon}</span>
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-description">{description}</p>}
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
};

export default EmptyState;

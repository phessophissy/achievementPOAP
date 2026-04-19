import React from 'react';
import './Badge.css';

const Badge = ({
  children,
  variant = 'gold',
  size = 'medium',
  icon = null,
  className = '',
}) => {
  return (
    <span className={`badge badge-${variant} badge-${size} ${className}`}>
      {icon && <span className="badge-icon">{icon}</span>}
      <span className="badge-text">{children}</span>
    </span>
  );
};

export default Badge;

// add event handlers and state management for notification-center — ref:feat/notification-center#3 (1776634999309)

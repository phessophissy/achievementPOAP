/** @file frontend/src/components/UI/Badge.jsx - UI component module documenting rendering and interaction intent. */
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

// add responsive design adjustments for component-api-guide — ref:docs/component-api-guide#7 (1776635166336)

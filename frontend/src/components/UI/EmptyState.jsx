/** @file frontend/src/components/UI/EmptyState.jsx - UI component module documenting rendering and interaction intent. */
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

// optimize performance for drag-sort-gallery — ref:feat/drag-sort-gallery#8 (1776635022473)

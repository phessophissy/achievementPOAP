/** @file frontend/src/components/UI/Tooltip.jsx - UI component module documenting rendering and interaction intent. */
import React from 'react';
import './Tooltip.css';

const Tooltip = ({
  children,
  text,
  position = 'top',
  className = '',
}) => {
  return (
    <div className={`tooltip-wrapper ${className}`}>
      {children}
      <span className={`tooltip tooltip-${position}`}>{text}</span>
    </div>
  );
};

export default Tooltip;

// improve accessibility for component-api-guide — ref:docs/component-api-guide#6 (1776635166323)

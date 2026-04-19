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

// add responsive design adjustments for event-card-overflow — ref:fix/event-card-overflow#7 (1776635110004)

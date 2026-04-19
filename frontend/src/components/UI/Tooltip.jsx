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

// polish and finalize event-sharing — ref:feat/event-sharing#9 (1776634631744)

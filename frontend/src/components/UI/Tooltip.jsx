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

// polish and finalize header-z-index — ref:fix/header-z-index#9 (1776635071296)

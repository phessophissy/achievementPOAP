import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({
  value,
  max = 100,
  showLabel = true,
  showValues = false,
  size = 'medium',
  variant = 'gold',
  animated = true,
  className = '',
}) => {
  const percentage = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;

  return (
    <div className={`progress-bar-container ${className}`}>
      {(showLabel || showValues) && (
        <div className="progress-bar-header">
          {showValues && (
            <span className="progress-values">
              {value.toLocaleString()} / {max.toLocaleString()}
            </span>
          )}
          {showLabel && (
            <span className="progress-percentage">{percentage}%</span>
          )}
        </div>
      )}
      <div className={`progress-bar progress-bar-${size}`}>
        <div
          className={`progress-bar-fill progress-bar-${variant} ${animated ? 'animated' : ''}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;

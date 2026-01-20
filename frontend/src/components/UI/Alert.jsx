import React from 'react';
import './Alert.css';

const Alert = ({
  children,
  variant = 'info',
  title = null,
  icon = null,
  onClose = null,
  className = '',
}) => {
  const getDefaultIcon = () => {
    switch (variant) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  return (
    <div className={`alert alert-${variant} ${className}`} role="alert">
      <div className="alert-icon">{icon || getDefaultIcon()}</div>
      <div className="alert-content">
        {title && <h4 className="alert-title">{title}</h4>}
        <div className="alert-message">{children}</div>
      </div>
      {onClose && (
        <button className="alert-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
      )}
    </div>
  );
};

export default Alert;

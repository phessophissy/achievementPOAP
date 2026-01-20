import React from 'react';
import './Switch.css';

const Switch = ({
  checked,
  onChange,
  disabled = false,
  size = 'medium',
  label,
  labelPosition = 'right',
  id,
  name,
  className = '',
}) => {
  const switchId = id || `switch-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`switch-container switch-container--${labelPosition} ${className}`}>
      {label && labelPosition === 'left' && (
        <label htmlFor={switchId} className="switch__label">
          {label}
        </label>
      )}
      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label || 'Toggle'}
        disabled={disabled}
        onClick={() => !disabled && onChange?.(!checked)}
        className={`switch switch--${size} ${checked ? 'switch--checked' : ''} ${disabled ? 'switch--disabled' : ''}`}
      >
        <span className="switch__track">
          <span className="switch__thumb" />
        </span>
      </button>
      {label && labelPosition === 'right' && (
        <label htmlFor={switchId} className="switch__label">
          {label}
        </label>
      )}
      {name && (
        <input type="hidden" name={name} value={checked ? 'on' : 'off'} />
      )}
    </div>
  );
};

export default Switch;

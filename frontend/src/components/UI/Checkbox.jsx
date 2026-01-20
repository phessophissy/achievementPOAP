import React from 'react';
import './Checkbox.css';

const Checkbox = ({
  checked,
  onChange,
  disabled = false,
  indeterminate = false,
  label,
  description,
  error,
  id,
  name,
  value,
  size = 'medium',
  className = '',
}) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`checkbox-wrapper ${className}`}>
      <div className="checkbox-container">
        <input
          type="checkbox"
          id={checkboxId}
          name={name}
          value={value}
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
          ref={(el) => el && (el.indeterminate = indeterminate)}
          className={`checkbox__input checkbox__input--${size}`}
          aria-describedby={description ? `${checkboxId}-desc` : undefined}
          aria-invalid={error ? 'true' : 'false'}
        />
        <span className={`checkbox__box checkbox__box--${size} ${error ? 'checkbox__box--error' : ''}`}>
          {checked && !indeterminate && (
            <svg viewBox="0 0 16 16" fill="currentColor" className="checkbox__check">
              <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 1 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z" />
            </svg>
          )}
          {indeterminate && (
            <svg viewBox="0 0 16 16" fill="currentColor" className="checkbox__indeterminate">
              <path d="M3 8a.75.75 0 0 1 .75-.75h8.5a.75.75 0 0 1 0 1.5h-8.5A.75.75 0 0 1 3 8z" />
            </svg>
          )}
        </span>
        {(label || description) && (
          <div className="checkbox__content">
            {label && (
              <label htmlFor={checkboxId} className="checkbox__label">
                {label}
              </label>
            )}
            {description && (
              <span id={`${checkboxId}-desc`} className="checkbox__description">
                {description}
              </span>
            )}
          </div>
        )}
      </div>
      {error && (
        <span className="checkbox__error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export default Checkbox;

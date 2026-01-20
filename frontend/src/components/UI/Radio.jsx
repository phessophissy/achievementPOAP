import React from 'react';
import './Radio.css';

const RadioGroup = ({
  value,
  onChange,
  options = [],
  name,
  disabled = false,
  orientation = 'vertical',
  error,
  label,
  required = false,
  className = '',
}) => {
  const groupId = `radio-group-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div
      className={`radio-group radio-group--${orientation} ${className}`}
      role="radiogroup"
      aria-labelledby={label ? `${groupId}-label` : undefined}
      aria-required={required}
    >
      {label && (
        <span id={`${groupId}-label`} className="radio-group__label">
          {label}
          {required && <span className="radio-group__required">*</span>}
        </span>
      )}
      <div className={`radio-group__options radio-group__options--${orientation}`}>
        {options.map((option) => (
          <Radio
            key={option.value}
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange?.(option.value)}
            disabled={disabled || option.disabled}
            label={option.label}
            description={option.description}
          />
        ))}
      </div>
      {error && (
        <span className="radio-group__error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

const Radio = ({
  checked,
  onChange,
  disabled = false,
  label,
  description,
  name,
  value,
  id,
  className = '',
}) => {
  const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`radio-wrapper ${className}`}>
      <div className="radio-container">
        <input
          type="radio"
          id={radioId}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="radio__input"
        />
        <span className="radio__circle">
          {checked && <span className="radio__dot" />}
        </span>
        {(label || description) && (
          <div className="radio__content">
            {label && (
              <label htmlFor={radioId} className="radio__label">
                {label}
              </label>
            )}
            {description && (
              <span className="radio__description">{description}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export { Radio };
export default RadioGroup;

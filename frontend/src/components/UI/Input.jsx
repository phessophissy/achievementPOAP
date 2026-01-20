import React from 'react';
import './Input.css';

const Input = ({
  type = 'text',
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  helperText,
  icon,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`input-group ${error ? 'input-error' : ''} ${disabled ? 'input-disabled' : ''} ${className}`}>
      {label && (
        <label htmlFor={name} className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <div className="input-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`input ${icon ? 'input-with-icon' : ''}`}
          {...props}
        />
      </div>
      {(error || helperText) && (
        <span className={`input-helper ${error ? 'error' : ''}`}>
          {error || helperText}
        </span>
      )}
    </div>
  );
};

export default Input;

import React from 'react';
import './Textarea.css';

const Textarea = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  helperText,
  disabled = false,
  required = false,
  rows = 4,
  maxLength,
  className = '',
  ...props
}) => {
  const charCount = value?.length || 0;
  const showCharCount = maxLength && maxLength > 0;

  return (
    <div className={`textarea-group ${error ? 'textarea-error' : ''} ${disabled ? 'textarea-disabled' : ''} ${className}`}>
      {label && (
        <label htmlFor={name} className="textarea-label">
          {label}
          {required && <span className="textarea-required">*</span>}
        </label>
      )}
      <div className="textarea-wrapper">
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          rows={rows}
          maxLength={maxLength}
          className="textarea"
          {...props}
        />
      </div>
      <div className="textarea-footer">
        {(error || helperText) && (
          <span className={`textarea-helper ${error ? 'error' : ''}`}>
            {error || helperText}
          </span>
        )}
        {showCharCount && (
          <span className={`textarea-char-count ${charCount >= maxLength ? 'limit' : ''}`}>
            {charCount} / {maxLength}
          </span>
        )}
      </div>
    </div>
  );
};

export default Textarea;

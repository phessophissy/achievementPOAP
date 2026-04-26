/** @file frontend/src/components/Form-validation/index.jsx - UI component module documenting rendering and interaction intent. */
import React, { useState, useEffect, useCallback } from 'react';
import { validateForm-validationParams, formatForm-validationResult } from '../../utils/helpers';
import { FORM_VALIDATION_MAX_ITEMS } from '../../config/constants';
import './Form-validation.css';

/**
 * feat: add comprehensive form validation for event creation
 * @param {{ items?: any[], onSuccess?: Function, onError?: Function }} props
 */
const Form-validationComponent = ({ items = [], onSuccess, onError }) => {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const limited = items.slice(0, FORM_VALIDATION_MAX_ITEMS);

  const handleSelect = useCallback((item) => {
    setSelected(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  }, []);

  const handleSubmit = useCallback(async () => {
    const { valid, errors } = validateForm-validationParams({ items: selected });
    if (!valid) {
      onError?.(new Error(errors.join(', ')));
      return;
    }
    setLoading(true);
    try {
      const res = { processed: selected.length };
      setResult(formatForm-validationResult(res));
      onSuccess?.(res);
    } catch (err) {
      onError?.(err);
    } finally {
      setLoading(false);
    }
  }, [selected, onSuccess, onError]);

  useEffect(() => {
    if (result) {
      const t = setTimeout(() => setResult(null), 5000);
      return () => clearTimeout(t);
    }
  }, [result]);

  return (
    <div className="form-validation-container" role="region" aria-label="feat: add comprehensive form validation for event creation">
      <div className="form-validation-header">feat: add comprehensive form validation for event creation</div>
      <div className="form-validation-body">
        {limited.map((item, i) => (
          <label key={i} className="form-validation-item">
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => handleSelect(item)}
            />
            {String(item)}
          </label>
        ))}
      </div>
      {result && <p className="form-validation-result" role="status">{result}</p>}
      <div className="form-validation-actions">
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={loading || selected.length === 0}
          aria-busy={loading}
        >
          {loading ? 'Processing…' : `Confirm (${selected.length})`}
        </button>
      </div>
    </div>
  );
};

export default Form-validationComponent;

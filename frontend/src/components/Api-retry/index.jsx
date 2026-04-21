import React, { useState, useEffect, useCallback } from 'react';
import { validateApi-retryParams, formatApi-retryResult } from '../../utils/helpers';
import { API_RETRY_MAX_ITEMS } from '../../config/constants';
import './Api-retry.css';

/**
 * feat: add exponential-backoff retry to API service
 * @param {{ items?: any[], onSuccess?: Function, onError?: Function }} props
 */
const Api-retryComponent = ({ items = [], onSuccess, onError }) => {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const limited = items.slice(0, API_RETRY_MAX_ITEMS);

  const handleSelect = useCallback((item) => {
    setSelected(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  }, []);

  const handleSubmit = useCallback(async () => {
    const { valid, errors } = validateApi-retryParams({ items: selected });
    if (!valid) {
      onError?.(new Error(errors.join(', ')));
      return;
    }
    setLoading(true);
    try {
      const res = { processed: selected.length };
      setResult(formatApi-retryResult(res));
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
    <div className="api-retry-container" role="region" aria-label="feat: add exponential-backoff retry to API service">
      <div className="api-retry-header">feat: add exponential-backoff retry to API service</div>
      <div className="api-retry-body">
        {limited.map((item, i) => (
          <label key={i} className="api-retry-item">
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => handleSelect(item)}
            />
            {String(item)}
          </label>
        ))}
      </div>
      {result && <p className="api-retry-result" role="status">{result}</p>}
      <div className="api-retry-actions">
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

export default Api-retryComponent;

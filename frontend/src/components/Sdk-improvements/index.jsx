import React, { useState, useEffect, useCallback } from 'react';
import { validateSdk-improvementsParams, formatSdk-improvementsResult } from '../../utils/helpers';
import { SDK_IMPROVEMENTS_MAX_ITEMS } from '../../config/constants';
import './Sdk-improvements.css';

/**
 * feat: add typed helpers and error classes to SDK
 * @param {{ items?: any[], onSuccess?: Function, onError?: Function }} props
 */
const Sdk-improvementsComponent = ({ items = [], onSuccess, onError }) => {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const limited = items.slice(0, SDK_IMPROVEMENTS_MAX_ITEMS);

  const handleSelect = useCallback((item) => {
    setSelected(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  }, []);

  const handleSubmit = useCallback(async () => {
    const { valid, errors } = validateSdk-improvementsParams({ items: selected });
    if (!valid) {
      onError?.(new Error(errors.join(', ')));
      return;
    }
    setLoading(true);
    try {
      const res = { processed: selected.length };
      setResult(formatSdk-improvementsResult(res));
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
    <div className="sdk-improvements-container" role="region" aria-label="feat: add typed helpers and error classes to SDK">
      <div className="sdk-improvements-header">feat: add typed helpers and error classes to SDK</div>
      <div className="sdk-improvements-body">
        {limited.map((item, i) => (
          <label key={i} className="sdk-improvements-item">
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => handleSelect(item)}
            />
            {String(item)}
          </label>
        ))}
      </div>
      {result && <p className="sdk-improvements-result" role="status">{result}</p>}
      <div className="sdk-improvements-actions">
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

export default Sdk-improvementsComponent;

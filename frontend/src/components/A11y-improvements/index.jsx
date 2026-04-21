import React, { useState, useEffect, useCallback } from 'react';
import { validateA11y-improvementsParams, formatA11y-improvementsResult } from '../../utils/helpers';
import { A11Y_IMPROVEMENTS_MAX_ITEMS } from '../../config/constants';
import './A11y-improvements.css';

/**
 * feat: improve accessibility across all pages
 * @param {{ items?: any[], onSuccess?: Function, onError?: Function }} props
 */
const A11y-improvementsComponent = ({ items = [], onSuccess, onError }) => {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const limited = items.slice(0, A11Y_IMPROVEMENTS_MAX_ITEMS);

  const handleSelect = useCallback((item) => {
    setSelected(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  }, []);

  const handleSubmit = useCallback(async () => {
    const { valid, errors } = validateA11y-improvementsParams({ items: selected });
    if (!valid) {
      onError?.(new Error(errors.join(', ')));
      return;
    }
    setLoading(true);
    try {
      const res = { processed: selected.length };
      setResult(formatA11y-improvementsResult(res));
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
    <div className="a11y-improvements-container" role="region" aria-label="feat: improve accessibility across all pages">
      <div className="a11y-improvements-header">feat: improve accessibility across all pages</div>
      <div className="a11y-improvements-body">
        {limited.map((item, i) => (
          <label key={i} className="a11y-improvements-item">
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => handleSelect(item)}
            />
            {String(item)}
          </label>
        ))}
      </div>
      {result && <p className="a11y-improvements-result" role="status">{result}</p>}
      <div className="a11y-improvements-actions">
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

export default A11y-improvementsComponent;

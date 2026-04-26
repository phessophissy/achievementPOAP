/** @file frontend/src/components/Loading-skeletons/index.jsx - UI component module documenting rendering and interaction intent. */
import React, { useState, useEffect, useCallback } from 'react';
import { validateLoading-skeletonsParams, formatLoading-skeletonsResult } from '../../utils/helpers';
import { LOADING_SKELETONS_MAX_ITEMS } from '../../config/constants';
import './Loading-skeletons.css';

/**
 * feat: replace spinners with skeleton loading components
 * @param {{ items?: any[], onSuccess?: Function, onError?: Function }} props
 */
const Loading-skeletonsComponent = ({ items = [], onSuccess, onError }) => {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const limited = items.slice(0, LOADING_SKELETONS_MAX_ITEMS);

  const handleSelect = useCallback((item) => {
    setSelected(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  }, []);

  const handleSubmit = useCallback(async () => {
    const { valid, errors } = validateLoading-skeletonsParams({ items: selected });
    if (!valid) {
      onError?.(new Error(errors.join(', ')));
      return;
    }
    setLoading(true);
    try {
      const res = { processed: selected.length };
      setResult(formatLoading-skeletonsResult(res));
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
    <div className="loading-skeletons-container" role="region" aria-label="feat: replace spinners with skeleton loading components">
      <div className="loading-skeletons-header">feat: replace spinners with skeleton loading components</div>
      <div className="loading-skeletons-body">
        {limited.map((item, i) => (
          <label key={i} className="loading-skeletons-item">
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => handleSelect(item)}
            />
            {String(item)}
          </label>
        ))}
      </div>
      {result && <p className="loading-skeletons-result" role="status">{result}</p>}
      <div className="loading-skeletons-actions">
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

export default Loading-skeletonsComponent;

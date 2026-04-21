import React, { useState, useEffect, useCallback } from 'react';
import { validateContract-helpersParams, formatContract-helpersResult } from '../../utils/helpers';
import { CONTRACT_HELPERS_MAX_ITEMS } from '../../config/constants';
import './Contract-helpers.css';

/**
 * refactor: extract contract read helpers into service layer
 * @param {{ items?: any[], onSuccess?: Function, onError?: Function }} props
 */
const Contract-helpersComponent = ({ items = [], onSuccess, onError }) => {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const limited = items.slice(0, CONTRACT_HELPERS_MAX_ITEMS);

  const handleSelect = useCallback((item) => {
    setSelected(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  }, []);

  const handleSubmit = useCallback(async () => {
    const { valid, errors } = validateContract-helpersParams({ items: selected });
    if (!valid) {
      onError?.(new Error(errors.join(', ')));
      return;
    }
    setLoading(true);
    try {
      const res = { processed: selected.length };
      setResult(formatContract-helpersResult(res));
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
    <div className="contract-helpers-container" role="region" aria-label="refactor: extract contract read helpers into service layer">
      <div className="contract-helpers-header">refactor: extract contract read helpers into service layer</div>
      <div className="contract-helpers-body">
        {limited.map((item, i) => (
          <label key={i} className="contract-helpers-item">
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => handleSelect(item)}
            />
            {String(item)}
          </label>
        ))}
      </div>
      {result && <p className="contract-helpers-result" role="status">{result}</p>}
      <div className="contract-helpers-actions">
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

export default Contract-helpersComponent;

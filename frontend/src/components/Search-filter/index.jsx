/** @file frontend/src/components/Search-filter/index.jsx - UI component module documenting rendering and interaction intent. */
import React, { useState, useEffect, useCallback } from 'react';
import { validateSearch-filterParams, formatSearch-filterResult } from '../../utils/helpers';
import { SEARCH_FILTER_MAX_ITEMS } from '../../config/constants';
import './Search-filter.css';

/**
 * feat: add real-time search across events and POAPs
 * @param {{ items?: any[], onSuccess?: Function, onError?: Function }} props
 */
const Search-filterComponent = ({ items = [], onSuccess, onError }) => {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const limited = items.slice(0, SEARCH_FILTER_MAX_ITEMS);

  const handleSelect = useCallback((item) => {
    setSelected(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  }, []);

  const handleSubmit = useCallback(async () => {
    const { valid, errors } = validateSearch-filterParams({ items: selected });
    if (!valid) {
      onError?.(new Error(errors.join(', ')));
      return;
    }
    setLoading(true);
    try {
      const res = { processed: selected.length };
      setResult(formatSearch-filterResult(res));
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
    <div className="search-filter-container" role="region" aria-label="feat: add real-time search across events and POAPs">
      <div className="search-filter-header">feat: add real-time search across events and POAPs</div>
      <div className="search-filter-body">
        {limited.map((item, i) => (
          <label key={i} className="search-filter-item">
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => handleSelect(item)}
            />
            {String(item)}
          </label>
        ))}
      </div>
      {result && <p className="search-filter-result" role="status">{result}</p>}
      <div className="search-filter-actions">
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

export default Search-filterComponent;

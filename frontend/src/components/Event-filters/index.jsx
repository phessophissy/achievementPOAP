import React, { useState, useEffect, useCallback } from 'react';
import { validateEvent-filtersParams, formatEvent-filtersResult } from '../../utils/helpers';
import { EVENT_FILTERS_MAX_ITEMS } from '../../config/constants';
import './Event-filters.css';

/**
 * feat: add advanced event filtering and sorting
 * @param {{ items?: any[], onSuccess?: Function, onError?: Function }} props
 */
const Event-filtersComponent = ({ items = [], onSuccess, onError }) => {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const limited = items.slice(0, EVENT_FILTERS_MAX_ITEMS);

  const handleSelect = useCallback((item) => {
    setSelected(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  }, []);

  const handleSubmit = useCallback(async () => {
    const { valid, errors } = validateEvent-filtersParams({ items: selected });
    if (!valid) {
      onError?.(new Error(errors.join(', ')));
      return;
    }
    setLoading(true);
    try {
      const res = { processed: selected.length };
      setResult(formatEvent-filtersResult(res));
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
    <div className="event-filters-container" role="region" aria-label="feat: add advanced event filtering and sorting">
      <div className="event-filters-header">feat: add advanced event filtering and sorting</div>
      <div className="event-filters-body">
        {limited.map((item, i) => (
          <label key={i} className="event-filters-item">
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => handleSelect(item)}
            />
            {String(item)}
          </label>
        ))}
      </div>
      {result && <p className="event-filters-result" role="status">{result}</p>}
      <div className="event-filters-actions">
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

export default Event-filtersComponent;

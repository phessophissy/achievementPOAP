/** @file frontend/src/components/Event-countdown/index.jsx - UI component module documenting rendering and interaction intent. */
import React, { useState, useEffect, useCallback } from 'react';
import { validateEvent-countdownParams, formatEvent-countdownResult } from '../../utils/helpers';
import { EVENT_COUNTDOWN_MAX_ITEMS } from '../../config/constants';
import './Event-countdown.css';

/**
 * feat: enhance event countdown with live updates
 * @param {{ items?: any[], onSuccess?: Function, onError?: Function }} props
 */
const Event-countdownComponent = ({ items = [], onSuccess, onError }) => {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const limited = items.slice(0, EVENT_COUNTDOWN_MAX_ITEMS);

  const handleSelect = useCallback((item) => {
    setSelected(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  }, []);

  const handleSubmit = useCallback(async () => {
    const { valid, errors } = validateEvent-countdownParams({ items: selected });
    if (!valid) {
      onError?.(new Error(errors.join(', ')));
      return;
    }
    setLoading(true);
    try {
      const res = { processed: selected.length };
      setResult(formatEvent-countdownResult(res));
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
    <div className="event-countdown-container" role="region" aria-label="feat: enhance event countdown with live updates">
      <div className="event-countdown-header">feat: enhance event countdown with live updates</div>
      <div className="event-countdown-body">
        {limited.map((item, i) => (
          <label key={i} className="event-countdown-item">
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => handleSelect(item)}
            />
            {String(item)}
          </label>
        ))}
      </div>
      {result && <p className="event-countdown-result" role="status">{result}</p>}
      <div className="event-countdown-actions">
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

export default Event-countdownComponent;

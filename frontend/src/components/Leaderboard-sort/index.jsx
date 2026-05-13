/** @file frontend/src/components/Leaderboard-sort/index.jsx - UI component module documenting rendering and interaction intent. */
import React, { useState, useEffect, useCallback } from 'react';
import { validateLeaderboard-sortParams, formatLeaderboard-sortResult } from '../../utils/helpers';
import { LEADERBOARD_SORT_MAX_ITEMS } from '../../config/constants';
import './Leaderboard-sort.css';

/**
 * feat: add sorting and pagination to leaderboard
 * @param {{ items?: any[], onSuccess?: Function, onError?: Function }} props
 */
const Leaderboard-sortComponent = ({ items = [], onSuccess, onError }) => {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const limited = items.slice(0, LEADERBOARD_SORT_MAX_ITEMS);

  const handleSelect = useCallback((item) => {
    setSelected(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  }, []);

  const handleSubmit = useCallback(async () => {
    const { valid, errors } = validateLeaderboard-sortParams({ items: selected });
    if (!valid) {
      onError?.(new Error(errors.join(', ')));
      return;
    }
    setLoading(true);
    try {
      const res = { processed: selected.length };
      setResult(formatLeaderboard-sortResult(res));
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
    <div className="leaderboard-sort-container" role="region" aria-label="feat: add sorting and pagination to leaderboard">
      <div className="leaderboard-sort-header">feat: add sorting and pagination to leaderboard</div>
      <div className="leaderboard-sort-body">
        {limited.map((item, i) => (
          <label key={i} className="leaderboard-sort-item">
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => handleSelect(item)}
            />
            {String(item)}
          </label>
        ))}
      </div>
      {result && <p className="leaderboard-sort-result" role="status">{result}</p>}
      <div className="leaderboard-sort-actions">
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

export default Leaderboard-sortComponent;

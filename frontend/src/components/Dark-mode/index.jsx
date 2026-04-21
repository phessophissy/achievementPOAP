import React, { useState, useEffect, useCallback } from 'react';
import { validateDark-modeParams, formatDark-modeResult } from '../../utils/helpers';
import { DARK_MODE_MAX_ITEMS } from '../../config/constants';
import './Dark-mode.css';

/**
 * feat: implement dark/light mode theme toggle
 * @param {{ items?: any[], onSuccess?: Function, onError?: Function }} props
 */
const Dark-modeComponent = ({ items = [], onSuccess, onError }) => {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const limited = items.slice(0, DARK_MODE_MAX_ITEMS);

  const handleSelect = useCallback((item) => {
    setSelected(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  }, []);

  const handleSubmit = useCallback(async () => {
    const { valid, errors } = validateDark-modeParams({ items: selected });
    if (!valid) {
      onError?.(new Error(errors.join(', ')));
      return;
    }
    setLoading(true);
    try {
      const res = { processed: selected.length };
      setResult(formatDark-modeResult(res));
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
    <div className="dark-mode-container" role="region" aria-label="feat: implement dark/light mode theme toggle">
      <div className="dark-mode-header">feat: implement dark/light mode theme toggle</div>
      <div className="dark-mode-body">
        {limited.map((item, i) => (
          <label key={i} className="dark-mode-item">
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => handleSelect(item)}
            />
            {String(item)}
          </label>
        ))}
      </div>
      {result && <p className="dark-mode-result" role="status">{result}</p>}
      <div className="dark-mode-actions">
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

export default Dark-modeComponent;

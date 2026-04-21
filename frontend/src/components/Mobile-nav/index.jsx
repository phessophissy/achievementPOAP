import React, { useState, useEffect, useCallback } from 'react';
import { validateMobile-navParams, formatMobile-navResult } from '../../utils/helpers';
import { MOBILE_NAV_MAX_ITEMS } from '../../config/constants';
import './Mobile-nav.css';

/**
 * feat: improve mobile navigation and responsive layout
 * @param {{ items?: any[], onSuccess?: Function, onError?: Function }} props
 */
const Mobile-navComponent = ({ items = [], onSuccess, onError }) => {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const limited = items.slice(0, MOBILE_NAV_MAX_ITEMS);

  const handleSelect = useCallback((item) => {
    setSelected(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  }, []);

  const handleSubmit = useCallback(async () => {
    const { valid, errors } = validateMobile-navParams({ items: selected });
    if (!valid) {
      onError?.(new Error(errors.join(', ')));
      return;
    }
    setLoading(true);
    try {
      const res = { processed: selected.length };
      setResult(formatMobile-navResult(res));
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
    <div className="mobile-nav-container" role="region" aria-label="feat: improve mobile navigation and responsive layout">
      <div className="mobile-nav-header">feat: improve mobile navigation and responsive layout</div>
      <div className="mobile-nav-body">
        {limited.map((item, i) => (
          <label key={i} className="mobile-nav-item">
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => handleSelect(item)}
            />
            {String(item)}
          </label>
        ))}
      </div>
      {result && <p className="mobile-nav-result" role="status">{result}</p>}
      <div className="mobile-nav-actions">
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

export default Mobile-navComponent;

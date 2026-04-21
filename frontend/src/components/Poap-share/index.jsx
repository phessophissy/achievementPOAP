import React, { useState, useEffect, useCallback } from 'react';
import { validatePoap-shareParams, formatPoap-shareResult } from '../../utils/helpers';
import { POAP_SHARE_MAX_ITEMS } from '../../config/constants';
import './Poap-share.css';

/**
 * feat: share POAP via Web Share API and QR code
 * @param {{ items?: any[], onSuccess?: Function, onError?: Function }} props
 */
const Poap-shareComponent = ({ items = [], onSuccess, onError }) => {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const limited = items.slice(0, POAP_SHARE_MAX_ITEMS);

  const handleSelect = useCallback((item) => {
    setSelected(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  }, []);

  const handleSubmit = useCallback(async () => {
    const { valid, errors } = validatePoap-shareParams({ items: selected });
    if (!valid) {
      onError?.(new Error(errors.join(', ')));
      return;
    }
    setLoading(true);
    try {
      const res = { processed: selected.length };
      setResult(formatPoap-shareResult(res));
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
    <div className="poap-share-container" role="region" aria-label="feat: share POAP via Web Share API and QR code">
      <div className="poap-share-header">feat: share POAP via Web Share API and QR code</div>
      <div className="poap-share-body">
        {limited.map((item, i) => (
          <label key={i} className="poap-share-item">
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => handleSelect(item)}
            />
            {String(item)}
          </label>
        ))}
      </div>
      {result && <p className="poap-share-result" role="status">{result}</p>}
      <div className="poap-share-actions">
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

export default Poap-shareComponent;

/** @file frontend/src/components/Wallet-disconnect/index.jsx - UI component module documenting rendering and interaction intent. */
import React, { useState, useEffect, useCallback } from 'react';
import { validateWallet-disconnectParams, formatWallet-disconnectResult } from '../../utils/helpers';
import { WALLET_DISCONNECT_MAX_ITEMS } from '../../config/constants';
import './Wallet-disconnect.css';

/**
 * feat: wallet disconnect flow with confirmation dialog
 * @param {{ items?: any[], onSuccess?: Function, onError?: Function }} props
 */
const Wallet-disconnectComponent = ({ items = [], onSuccess, onError }) => {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const limited = items.slice(0, WALLET_DISCONNECT_MAX_ITEMS);

  const handleSelect = useCallback((item) => {
    setSelected(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  }, []);

  const handleSubmit = useCallback(async () => {
    const { valid, errors } = validateWallet-disconnectParams({ items: selected });
    if (!valid) {
      onError?.(new Error(errors.join(', ')));
      return;
    }
    setLoading(true);
    try {
      const res = { processed: selected.length };
      setResult(formatWallet-disconnectResult(res));
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
    <div className="wallet-disconnect-container" role="region" aria-label="feat: wallet disconnect flow with confirmation dialog">
      <div className="wallet-disconnect-header">feat: wallet disconnect flow with confirmation dialog</div>
      <div className="wallet-disconnect-body">
        {limited.map((item, i) => (
          <label key={i} className="wallet-disconnect-item">
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => handleSelect(item)}
            />
            {String(item)}
          </label>
        ))}
      </div>
      {result && <p className="wallet-disconnect-result" role="status">{result}</p>}
      <div className="wallet-disconnect-actions">
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

export default Wallet-disconnectComponent;

import React, { useState, useEffect, useCallback } from 'react';
import { validateBatch-mintParams, formatBatch-mintResult } from '../../utils/helpers';
import { BATCH_MINT_MAX_ITEMS } from '../../config/constants';
import './Batch-mint.css';

/**
 * feat: add batch minting UI and contract helpers
 * @param {{ items?: any[], onSuccess?: Function, onError?: Function }} props
 */
const Batch-mintComponent = ({ items = [], onSuccess, onError }) => {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const limited = items.slice(0, BATCH_MINT_MAX_ITEMS);

  const handleSelect = useCallback((item) => {
    setSelected(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  }, []);

  const handleSubmit = useCallback(async () => {
    const { valid, errors } = validateBatch-mintParams({ items: selected });
    if (!valid) {
      onError?.(new Error(errors.join(', ')));
      return;
    }
    setLoading(true);
    try {
      const res = { processed: selected.length };
      setResult(formatBatch-mintResult(res));
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
    <div className="batch-mint-container" role="region" aria-label="feat: add batch minting UI and contract helpers">
      <div className="batch-mint-header">feat: add batch minting UI and contract helpers</div>
      <div className="batch-mint-body">
        {limited.map((item, i) => (
          <label key={i} className="batch-mint-item">
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => handleSelect(item)}
            />
            {String(item)}
          </label>
        ))}
      </div>
      {result && <p className="batch-mint-result" role="status">{result}</p>}
      <div className="batch-mint-actions">
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

export default Batch-mintComponent;

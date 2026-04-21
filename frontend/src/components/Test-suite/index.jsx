import React, { useState, useEffect, useCallback } from 'react';
import { validateTest-suiteParams, formatTest-suiteResult } from '../../utils/helpers';
import { TEST_SUITE_MAX_ITEMS } from '../../config/constants';
import './Test-suite.css';

/**
 * test: expand unit test coverage for hooks and utils
 * @param {{ items?: any[], onSuccess?: Function, onError?: Function }} props
 */
const Test-suiteComponent = ({ items = [], onSuccess, onError }) => {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const limited = items.slice(0, TEST_SUITE_MAX_ITEMS);

  const handleSelect = useCallback((item) => {
    setSelected(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  }, []);

  const handleSubmit = useCallback(async () => {
    const { valid, errors } = validateTest-suiteParams({ items: selected });
    if (!valid) {
      onError?.(new Error(errors.join(', ')));
      return;
    }
    setLoading(true);
    try {
      const res = { processed: selected.length };
      setResult(formatTest-suiteResult(res));
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
    <div className="test-suite-container" role="region" aria-label="test: expand unit test coverage for hooks and utils">
      <div className="test-suite-header">test: expand unit test coverage for hooks and utils</div>
      <div className="test-suite-body">
        {limited.map((item, i) => (
          <label key={i} className="test-suite-item">
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => handleSelect(item)}
            />
            {String(item)}
          </label>
        ))}
      </div>
      {result && <p className="test-suite-result" role="status">{result}</p>}
      <div className="test-suite-actions">
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

export default Test-suiteComponent;

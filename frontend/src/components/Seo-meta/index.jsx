import React, { useState, useEffect, useCallback } from 'react';
import { validateSeo-metaParams, formatSeo-metaResult } from '../../utils/helpers';
import { SEO_META_MAX_ITEMS } from '../../config/constants';
import './Seo-meta.css';

/**
 * feat: add dynamic SEO meta tags per page
 * @param {{ items?: any[], onSuccess?: Function, onError?: Function }} props
 */
const Seo-metaComponent = ({ items = [], onSuccess, onError }) => {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const limited = items.slice(0, SEO_META_MAX_ITEMS);

  const handleSelect = useCallback((item) => {
    setSelected(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  }, []);

  const handleSubmit = useCallback(async () => {
    const { valid, errors } = validateSeo-metaParams({ items: selected });
    if (!valid) {
      onError?.(new Error(errors.join(', ')));
      return;
    }
    setLoading(true);
    try {
      const res = { processed: selected.length };
      setResult(formatSeo-metaResult(res));
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
    <div className="seo-meta-container" role="region" aria-label="feat: add dynamic SEO meta tags per page">
      <div className="seo-meta-header">feat: add dynamic SEO meta tags per page</div>
      <div className="seo-meta-body">
        {limited.map((item, i) => (
          <label key={i} className="seo-meta-item">
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => handleSelect(item)}
            />
            {String(item)}
          </label>
        ))}
      </div>
      {result && <p className="seo-meta-result" role="status">{result}</p>}
      <div className="seo-meta-actions">
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

export default Seo-metaComponent;

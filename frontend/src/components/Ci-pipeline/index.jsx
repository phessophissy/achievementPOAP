import React, { useState, useEffect, useCallback } from 'react';
import { validateCi-pipelineParams, formatCi-pipelineResult } from '../../utils/helpers';
import { CI_PIPELINE_MAX_ITEMS } from '../../config/constants';
import './Ci-pipeline.css';

/**
 * ci: add GitHub Actions CI pipeline with lint and test
 * @param {{ items?: any[], onSuccess?: Function, onError?: Function }} props
 */
const Ci-pipelineComponent = ({ items = [], onSuccess, onError }) => {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const limited = items.slice(0, CI_PIPELINE_MAX_ITEMS);

  const handleSelect = useCallback((item) => {
    setSelected(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  }, []);

  const handleSubmit = useCallback(async () => {
    const { valid, errors } = validateCi-pipelineParams({ items: selected });
    if (!valid) {
      onError?.(new Error(errors.join(', ')));
      return;
    }
    setLoading(true);
    try {
      const res = { processed: selected.length };
      setResult(formatCi-pipelineResult(res));
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
    <div className="ci-pipeline-container" role="region" aria-label="ci: add GitHub Actions CI pipeline with lint and test">
      <div className="ci-pipeline-header">ci: add GitHub Actions CI pipeline with lint and test</div>
      <div className="ci-pipeline-body">
        {limited.map((item, i) => (
          <label key={i} className="ci-pipeline-item">
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => handleSelect(item)}
            />
            {String(item)}
          </label>
        ))}
      </div>
      {result && <p className="ci-pipeline-result" role="status">{result}</p>}
      <div className="ci-pipeline-actions">
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

export default Ci-pipelineComponent;

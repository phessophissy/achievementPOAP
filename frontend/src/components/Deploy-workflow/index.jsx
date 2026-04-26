/** @file frontend/src/components/Deploy-workflow/index.jsx - UI component module documenting rendering and interaction intent. */
import React, { useState, useEffect, useCallback } from 'react';
import { validateDeploy-workflowParams, formatDeploy-workflowResult } from '../../utils/helpers';
import { DEPLOY_WORKFLOW_MAX_ITEMS } from '../../config/constants';
import './Deploy-workflow.css';

/**
 * chore: improve deploy scripts with env validation
 * @param {{ items?: any[], onSuccess?: Function, onError?: Function }} props
 */
const Deploy-workflowComponent = ({ items = [], onSuccess, onError }) => {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const limited = items.slice(0, DEPLOY_WORKFLOW_MAX_ITEMS);

  const handleSelect = useCallback((item) => {
    setSelected(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  }, []);

  const handleSubmit = useCallback(async () => {
    const { valid, errors } = validateDeploy-workflowParams({ items: selected });
    if (!valid) {
      onError?.(new Error(errors.join(', ')));
      return;
    }
    setLoading(true);
    try {
      const res = { processed: selected.length };
      setResult(formatDeploy-workflowResult(res));
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
    <div className="deploy-workflow-container" role="region" aria-label="chore: improve deploy scripts with env validation">
      <div className="deploy-workflow-header">chore: improve deploy scripts with env validation</div>
      <div className="deploy-workflow-body">
        {limited.map((item, i) => (
          <label key={i} className="deploy-workflow-item">
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => handleSelect(item)}
            />
            {String(item)}
          </label>
        ))}
      </div>
      {result && <p className="deploy-workflow-result" role="status">{result}</p>}
      <div className="deploy-workflow-actions">
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

export default Deploy-workflowComponent;

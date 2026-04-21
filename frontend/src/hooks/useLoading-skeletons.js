import { useState, useCallback, useRef } from 'react';

/**
 * useLoading-skeletons — manages state for feat: replace spinners with skeleton loading components
 * @param {Object} options
 * @returns {Object}
 */
export const useLoading-skeletons = (options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const execute = useCallback(async (params) => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);
    try {
      // Feature: feat: replace spinners with skeleton loading components
      const result = await Promise.resolve(params);
      setData(result);
      options.onSuccess?.(result);
      return result;
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'An error occurred');
        options.onError?.(err);
      }
    } finally {
      setLoading(false);
    }
  }, [options]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
};

export default useLoading-skeletons;

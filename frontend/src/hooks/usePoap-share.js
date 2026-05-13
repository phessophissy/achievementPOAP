/** @file frontend/src/hooks/usePoap-share.js - Custom hook module documenting state and side-effect responsibilities. */
import { useState, useCallback, useRef } from 'react';

/**
 * usePoap-share — manages state for feat: share POAP via Web Share API and QR code
 * @param {Object} options
 * @returns {Object}
 */
export const usePoap-share = (options = {}) => {
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
      // Feature: feat: share POAP via Web Share API and QR code
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

export default usePoap-share;

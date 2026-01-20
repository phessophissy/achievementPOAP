import { useState, useCallback } from 'react';

export const useClipboard = (timeout = 2000) => {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  const copy = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setError(null);
      setTimeout(() => setCopied(false), timeout);
      return true;
    } catch (err) {
      setError(err);
      setCopied(false);
      return false;
    }
  }, [timeout]);

  const reset = useCallback(() => {
    setCopied(false);
    setError(null);
  }, []);

  return { copy, copied, error, reset };
};

export const useShare = () => {
  const [shared, setShared] = useState(false);
  const [error, setError] = useState(null);

  const canShare = typeof navigator !== 'undefined' && navigator.share;

  const share = useCallback(async (data) => {
    if (!canShare) {
      setError(new Error('Web Share API not supported'));
      return false;
    }

    try {
      await navigator.share(data);
      setShared(true);
      return true;
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err);
      }
      return false;
    }
  }, [canShare]);

  return { share, shared, error, canShare };
};

export default useClipboard;

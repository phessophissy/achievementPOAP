import { useState, useCallback, useEffect, useRef } from 'react';

const cache = new Map();

export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const { 
    enabled = true, 
    cacheKey = url, 
    cacheTime = 5 * 60 * 1000,
    refetchOnMount = true,
    ...fetchOptions 
  } = options;

  const fetchData = useCallback(async () => {
    if (!url || !enabled) return;

    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cacheTime) {
      setData(cached.data);
      setLoading(false);
      return;
    }

    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      cache.set(cacheKey, { data: result, timestamp: Date.now() });
      setData(result);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  }, [url, enabled, cacheKey, cacheTime, fetchOptions]);

  useEffect(() => {
    if (refetchOnMount) fetchData();
    return () => abortControllerRef.current?.abort();
  }, [fetchData, refetchOnMount]);

  const refetch = useCallback(() => {
    cache.delete(cacheKey);
    return fetchData();
  }, [fetchData, cacheKey]);

  return { data, loading, error, refetch };
};

export const useMutation = (mutationFn, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { onSuccess, onError, onSettled } = options;

  const mutate = useCallback(async (variables) => {
    setLoading(true);
    setError(null);

    try {
      const result = await mutationFn(variables);
      setData(result);
      onSuccess?.(result, variables);
      return result;
    } catch (err) {
      setError(err);
      onError?.(err, variables);
      throw err;
    } finally {
      setLoading(false);
      onSettled?.();
    }
  }, [mutationFn, onSuccess, onError, onSettled]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { mutate, data, loading, error, reset };
};

export default useFetch;

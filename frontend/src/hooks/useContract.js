import { useState, useEffect, useCallback } from 'react';
import { fetchEvents, fetchEvent, fetchUserPOAPs, checkHasMinted, getTotalSupply } from '../services/contractService';

/**
 * Hook to fetch and manage events
 * @param {boolean} autoFetch - Whether to fetch automatically on mount
 * @returns {Object} Events state and actions
 */
export const useEvents = (autoFetch = true) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchEvents();
      setEvents(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch events');
      console.error('useEvents error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      loadEvents();
    }
  }, [autoFetch, loadEvents]);

  return {
    events,
    loading,
    error,
    refresh: loadEvents,
  };
};

/**
 * Hook to fetch a single event
 * @param {number} eventId - The event ID
 * @returns {Object} Event state and actions
 */
export const useEvent = (eventId) => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadEvent = useCallback(async () => {
    if (!eventId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchEvent(eventId);
      setEvent(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch event');
      console.error('useEvent error:', err);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    loadEvent();
  }, [loadEvent]);

  return {
    event,
    loading,
    error,
    refresh: loadEvent,
  };
};

/**
 * Hook to fetch user's POAPs
 * @param {string} userAddress - The user's wallet address
 * @returns {Object} POAPs state and actions
 */
export const useUserPOAPs = (userAddress) => {
  const [poaps, setPoaps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadPoaps = useCallback(async () => {
    if (!userAddress) {
      setPoaps([]);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchUserPOAPs(userAddress);
      setPoaps(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch POAPs');
      console.error('useUserPOAPs error:', err);
    } finally {
      setLoading(false);
    }
  }, [userAddress]);

  useEffect(() => {
    loadPoaps();
  }, [loadPoaps]);

  return {
    poaps,
    loading,
    error,
    refresh: loadPoaps,
  };
};

/**
 * Hook to check if user has minted a specific event
 * @param {number} eventId - The event ID
 * @param {string} userAddress - The user's wallet address
 * @returns {Object} Minted state
 */
export const useHasMinted = (eventId, userAddress) => {
  const [hasMinted, setHasMinted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const check = async () => {
      if (!eventId || !userAddress) {
        setHasMinted(false);
        return;
      }
      
      setLoading(true);
      
      try {
        const result = await checkHasMinted(eventId, userAddress);
        setHasMinted(result);
      } catch (err) {
        console.error('useHasMinted error:', err);
        setHasMinted(false);
      } finally {
        setLoading(false);
      }
    };

    check();
  }, [eventId, userAddress]);

  return { hasMinted, loading };
};

/**
 * Hook to get total POAP supply
 * @returns {Object} Supply state
 */
export const useTotalSupply = () => {
  const [totalSupply, setTotalSupply] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadSupply = useCallback(async () => {
    setLoading(true);
    
    try {
      const supply = await getTotalSupply();
      setTotalSupply(supply);
    } catch (err) {
      console.error('useTotalSupply error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSupply();
  }, [loadSupply]);

  return { totalSupply, loading, refresh: loadSupply };
};

/**
 * Hook for countdown timer
 * @param {number} endTime - End timestamp in seconds
 * @returns {Object} Time remaining
 */
export const useCountdown = (endTime) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });

  useEffect(() => {
    if (!endTime) return;

    const calculateTime = () => {
      const now = Math.floor(Date.now() / 1000);
      const diff = endTime - now;
      
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
        return;
      }
      
      setTimeLeft({
        days: Math.floor(diff / 86400),
        hours: Math.floor((diff % 86400) / 3600),
        minutes: Math.floor((diff % 3600) / 60),
        seconds: diff % 60,
        expired: false,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return timeLeft;
};

/**
 * Hook for local storage
 * @param {string} key - Storage key
 * @param {any} initialValue - Initial value
 * @returns {Array} [value, setValue]
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('useLocalStorage error:', error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('useLocalStorage error:', error);
    }
  };

  return [storedValue, setValue];
};

/**
 * Hook for debounced value
 * @param {any} value - Value to debounce
 * @param {number} delay - Delay in ms
 * @returns {any} Debounced value
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook for window scroll position
 * @returns {Object} Scroll position
 */
export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition({
        x: window.scrollX,
        y: window.scrollY,
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollPosition;
};

export default {
  useEvents,
  useEvent,
  useUserPOAPs,
  useHasMinted,
  useTotalSupply,
  useCountdown,
  useLocalStorage,
  useDebounce,
  useScrollPosition,
};

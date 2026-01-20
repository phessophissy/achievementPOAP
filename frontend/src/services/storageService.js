/**
 * Storage service for persisting data locally
 */

const STORAGE_PREFIX = 'achievementPOAP_';

/**
 * Get item from localStorage
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if not found
 * @returns {any}
 */
export const getItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error getting from storage:', error);
    return defaultValue;
  }
};

/**
 * Set item in localStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 */
export const setItem = (key, value) => {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (error) {
    console.error('Error setting storage:', error);
  }
};

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 */
export const removeItem = (key) => {
  try {
    localStorage.removeItem(STORAGE_PREFIX + key);
  } catch (error) {
    console.error('Error removing from storage:', error);
  }
};

/**
 * Clear all app data from localStorage
 */
export const clearAll = () => {
  try {
    Object.keys(localStorage)
      .filter(key => key.startsWith(STORAGE_PREFIX))
      .forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};

// Specific storage helpers

/**
 * Get recently viewed events
 * @returns {Array}
 */
export const getRecentEvents = () => {
  return getItem('recentEvents', []);
};

/**
 * Add event to recently viewed
 * @param {number} eventId - Event ID
 */
export const addRecentEvent = (eventId) => {
  const recent = getRecentEvents();
  const filtered = recent.filter(id => id !== eventId);
  const updated = [eventId, ...filtered].slice(0, 10); // Keep last 10
  setItem('recentEvents', updated);
};

/**
 * Get favorite events
 * @returns {Array}
 */
export const getFavoriteEvents = () => {
  return getItem('favoriteEvents', []);
};

/**
 * Toggle favorite event
 * @param {number} eventId - Event ID
 * @returns {boolean} Whether event is now favorited
 */
export const toggleFavoriteEvent = (eventId) => {
  const favorites = getFavoriteEvents();
  const isFavorite = favorites.includes(eventId);
  
  if (isFavorite) {
    setItem('favoriteEvents', favorites.filter(id => id !== eventId));
  } else {
    setItem('favoriteEvents', [...favorites, eventId]);
  }
  
  return !isFavorite;
};

/**
 * Check if event is favorited
 * @param {number} eventId - Event ID
 * @returns {boolean}
 */
export const isEventFavorited = (eventId) => {
  return getFavoriteEvents().includes(eventId);
};

/**
 * Get user preferences
 * @returns {Object}
 */
export const getPreferences = () => {
  return getItem('preferences', {
    theme: 'dark',
    notifications: true,
    compactView: false,
  });
};

/**
 * Update user preferences
 * @param {Object} updates - Preference updates
 */
export const updatePreferences = (updates) => {
  const current = getPreferences();
  setItem('preferences', { ...current, ...updates });
};

/**
 * Get cached events
 * @returns {Object} Cached events with timestamp
 */
export const getCachedEvents = () => {
  return getItem('eventsCache', { events: [], timestamp: 0 });
};

/**
 * Set cached events
 * @param {Array} events - Events to cache
 */
export const setCachedEvents = (events) => {
  setItem('eventsCache', { events, timestamp: Date.now() });
};

/**
 * Check if events cache is valid (5 minutes)
 * @returns {boolean}
 */
export const isEventsCacheValid = () => {
  const cache = getCachedEvents();
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  return cache.timestamp && Date.now() - cache.timestamp < CACHE_DURATION;
};

export default {
  getItem,
  setItem,
  removeItem,
  clearAll,
  getRecentEvents,
  addRecentEvent,
  getFavoriteEvents,
  toggleFavoriteEvent,
  isEventFavorited,
  getPreferences,
  updatePreferences,
  getCachedEvents,
  setCachedEvents,
  isEventsCacheValid,
};

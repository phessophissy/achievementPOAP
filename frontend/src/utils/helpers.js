/**
 * Format a Stacks address for display
 * @param {string} address - Full Stacks address
 * @param {number} startChars - Characters to show at start
 * @param {number} endChars - Characters to show at end
 * @returns {string} Formatted address
 */
export const formatAddress = (address, startChars = 6, endChars = 4) => {
  if (!address) return '';
  if (address.length <= startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

/**
 * Format STX amount from micro STX
 * @param {number} microStx - Amount in micro STX
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted STX amount
 */
export const formatSTX = (microStx, decimals = 6) => {
  const stx = microStx / 1_000_000;
  return stx.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

/**
 * Format a date from timestamp
 * @param {number} timestamp - Unix timestamp (seconds or ms)
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date
 */
export const formatDate = (timestamp, options = {}) => {
  if (!timestamp) return '';
  
  // Convert to milliseconds if in seconds
  const ms = timestamp > 1e12 ? timestamp : timestamp * 1000;
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  
  return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(new Date(ms));
};

/**
 * Format relative time (e.g., "2 hours ago")
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return '';
  
  const ms = timestamp > 1e12 ? timestamp : timestamp * 1000;
  const now = Date.now();
  const diff = now - ms;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 30) return formatDate(timestamp);
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
};

/**
 * Format a number with thousand separators
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return num.toLocaleString('en-US');
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

/**
 * Check if an event is currently active
 * @param {Object} event - Event object
 * @returns {boolean} Whether event is active
 */
export const isEventActive = (event) => {
  if (!event) return false;
  
  const now = Math.floor(Date.now() / 1000);
  const { startTime, endTime, active } = event;
  
  return active && now >= startTime && now <= endTime;
};

/**
 * Get event status label and class
 * @param {Object} event - Event object
 * @returns {Object} Status object with label and className
 */
export const getEventStatus = (event) => {
  if (!event) return { label: 'Unknown', className: 'badge-warning' };
  
  const now = Math.floor(Date.now() / 1000);
  const { startTime, endTime, active, currentMints, maxMints } = event;
  
  if (!active) {
    return { label: 'Paused', className: 'badge-warning' };
  }
  
  if (currentMints >= maxMints) {
    return { label: 'Sold Out', className: 'badge-error' };
  }
  
  if (now < startTime) {
    return { label: 'Upcoming', className: 'badge-gold' };
  }
  
  if (now > endTime) {
    return { label: 'Ended', className: 'badge-error' };
  }
  
  return { label: 'Active', className: 'badge-success' };
};

/**
 * Calculate time remaining until an event ends
 * @param {number} endTime - End timestamp in seconds
 * @returns {Object} Time remaining object
 */
export const getTimeRemaining = (endTime) => {
  const now = Math.floor(Date.now() / 1000);
  const diff = endTime - now;
  
  if (diff <= 0) {
    return { expired: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  
  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = diff % 60;
  
  return { expired: false, days, hours, minutes, seconds };
};

/**
 * Get progress percentage
 * @param {number} current - Current value
 * @param {number} max - Maximum value
 * @returns {number} Percentage (0-100)
 */
export const getProgress = (current, max) => {
  if (!max || max === 0) return 0;
  return Math.min(100, Math.round((current / max) * 100));
};

/**
 * Sleep for a specified duration
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after timeout
 */
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
};

/**
 * Validate a Stacks address
 * @param {string} address - Address to validate
 * @returns {boolean} Whether address is valid
 */
export const isValidStacksAddress = (address) => {
  if (!address) return false;
  // Simple validation - starts with SP or ST and has correct length
  return /^(SP|ST)[A-Z0-9]{38,40}$/i.test(address);
};

/**
 * Generate a unique ID
 * @returns {string} Unique ID
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export default {
  formatAddress,
  formatSTX,
  formatDate,
  formatRelativeTime,
  formatNumber,
  truncateText,
  isEventActive,
  getEventStatus,
  getTimeRemaining,
  getProgress,
  sleep,
  copyToClipboard,
  isValidStacksAddress,
  generateId,
};

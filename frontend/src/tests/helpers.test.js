import { describe, it, expect } from 'vitest';
import {
  truncateAddress,
  formatDate,
  formatNumber,
  classNames,
  debounce,
  throttle,
  generateId,
  copyToClipboard,
  validateEmail,
  isValidStacksAddress,
} from '../utils/helpers';

describe('Helper Functions', () => {
  describe('truncateAddress', () => {
    it('truncates long addresses', () => {
      const address = 'SP2KYZRNME33Y39GP3RKC90DQJ45EF1N0NZNVRE09';
      const result = truncateAddress(address);
      expect(result).toMatch(/^SP2K.*RE09$/);
    });

    it('returns empty string for null/undefined', () => {
      expect(truncateAddress(null)).toBe('');
      expect(truncateAddress(undefined)).toBe('');
    });

    it('returns short addresses unchanged', () => {
      expect(truncateAddress('SP123')).toBe('SP123');
    });
  });

  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2024-01-15');
      const result = formatDate(date);
      expect(result).toContain('2024');
    });

    it('handles string dates', () => {
      const result = formatDate('2024-01-15');
      expect(result).toContain('2024');
    });

    it('returns fallback for invalid dates', () => {
      expect(formatDate('invalid')).toBe('Invalid Date');
    });
  });

  describe('formatNumber', () => {
    it('formats large numbers with commas', () => {
      expect(formatNumber(1000000)).toBe('1,000,000');
    });

    it('handles decimals', () => {
      expect(formatNumber(1234.56)).toBe('1,234.56');
    });

    it('handles zero', () => {
      expect(formatNumber(0)).toBe('0');
    });
  });

  describe('classNames', () => {
    it('joins class names', () => {
      expect(classNames('a', 'b', 'c')).toBe('a b c');
    });

    it('filters falsy values', () => {
      expect(classNames('a', null, 'b', undefined, 'c', false)).toBe('a b c');
    });

    it('handles empty input', () => {
      expect(classNames()).toBe('');
    });
  });

  describe('debounce', () => {
    it('delays function execution', async () => {
      let count = 0;
      const increment = debounce(() => count++, 100);
      
      increment();
      increment();
      increment();
      
      expect(count).toBe(0);
      
      await new Promise(resolve => setTimeout(resolve, 150));
      expect(count).toBe(1);
    });
  });

  describe('throttle', () => {
    it('limits function execution rate', async () => {
      let count = 0;
      const increment = throttle(() => count++, 100);
      
      increment();
      increment();
      increment();
      
      expect(count).toBe(1);
    });
  });

  describe('generateId', () => {
    it('generates unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });

    it('generates IDs of expected length', () => {
      const id = generateId();
      expect(id.length).toBeGreaterThan(0);
    });
  });

  describe('validateEmail', () => {
    it('validates correct emails', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.org')).toBe(true);
    });

    it('rejects invalid emails', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
    });
  });

  describe('isValidStacksAddress', () => {
    it('validates Stacks mainnet addresses', () => {
      expect(isValidStacksAddress('SP2KYZRNME33Y39GP3RKC90DQJ45EF1N0NZNVRE09')).toBe(true);
    });

    it('validates Stacks testnet addresses', () => {
      expect(isValidStacksAddress('ST2KYZRNME33Y39GP3RKC90DQJ45EF1N0NZNVRE09')).toBe(true);
    });

    it('rejects invalid addresses', () => {
      expect(isValidStacksAddress('invalid')).toBe(false);
      expect(isValidStacksAddress('0x123')).toBe(false);
    });
  });
});

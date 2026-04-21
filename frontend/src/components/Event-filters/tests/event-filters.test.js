import { describe, it, expect, vi } from 'vitest';
import { validateEvent-filtersParams, formatEvent-filtersResult } from '../../../utils/helpers';

describe('event-filters helpers', () => {
  describe('validateEvent-filtersParams', () => {
    it('returns valid=true for non-null params', () => {
      const result = validateEvent-filtersParams({ key: 'value' });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('returns valid=false for null params', () => {
      const result = validateEvent-filtersParams(null);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('formatEvent-filtersResult', () => {
    it('returns dash for null', () => {
      expect(formatEvent-filtersResult(null)).toBe('—');
    });

    it('returns stringified object', () => {
      const obj = { foo: 1 };
      const out = formatEvent-filtersResult(obj);
      expect(out).toContain('foo');
    });

    it('returns string for primitive', () => {
      expect(formatEvent-filtersResult(42)).toBe('42');
    });
  });
});

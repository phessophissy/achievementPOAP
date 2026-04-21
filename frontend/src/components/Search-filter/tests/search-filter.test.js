import { describe, it, expect, vi } from 'vitest';
import { validateSearch-filterParams, formatSearch-filterResult } from '../../../utils/helpers';

describe('search-filter helpers', () => {
  describe('validateSearch-filterParams', () => {
    it('returns valid=true for non-null params', () => {
      const result = validateSearch-filterParams({ key: 'value' });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('returns valid=false for null params', () => {
      const result = validateSearch-filterParams(null);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('formatSearch-filterResult', () => {
    it('returns dash for null', () => {
      expect(formatSearch-filterResult(null)).toBe('—');
    });

    it('returns stringified object', () => {
      const obj = { foo: 1 };
      const out = formatSearch-filterResult(obj);
      expect(out).toContain('foo');
    });

    it('returns string for primitive', () => {
      expect(formatSearch-filterResult(42)).toBe('42');
    });
  });
});

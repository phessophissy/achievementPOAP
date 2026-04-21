import { describe, it, expect, vi } from 'vitest';
import { validateContract-helpersParams, formatContract-helpersResult } from '../../../utils/helpers';

describe('contract-helpers helpers', () => {
  describe('validateContract-helpersParams', () => {
    it('returns valid=true for non-null params', () => {
      const result = validateContract-helpersParams({ key: 'value' });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('returns valid=false for null params', () => {
      const result = validateContract-helpersParams(null);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('formatContract-helpersResult', () => {
    it('returns dash for null', () => {
      expect(formatContract-helpersResult(null)).toBe('—');
    });

    it('returns stringified object', () => {
      const obj = { foo: 1 };
      const out = formatContract-helpersResult(obj);
      expect(out).toContain('foo');
    });

    it('returns string for primitive', () => {
      expect(formatContract-helpersResult(42)).toBe('42');
    });
  });
});

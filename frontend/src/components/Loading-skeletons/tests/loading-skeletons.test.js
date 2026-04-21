import { describe, it, expect, vi } from 'vitest';
import { validateLoading-skeletonsParams, formatLoading-skeletonsResult } from '../../../utils/helpers';

describe('loading-skeletons helpers', () => {
  describe('validateLoading-skeletonsParams', () => {
    it('returns valid=true for non-null params', () => {
      const result = validateLoading-skeletonsParams({ key: 'value' });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('returns valid=false for null params', () => {
      const result = validateLoading-skeletonsParams(null);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('formatLoading-skeletonsResult', () => {
    it('returns dash for null', () => {
      expect(formatLoading-skeletonsResult(null)).toBe('—');
    });

    it('returns stringified object', () => {
      const obj = { foo: 1 };
      const out = formatLoading-skeletonsResult(obj);
      expect(out).toContain('foo');
    });

    it('returns string for primitive', () => {
      expect(formatLoading-skeletonsResult(42)).toBe('42');
    });
  });
});

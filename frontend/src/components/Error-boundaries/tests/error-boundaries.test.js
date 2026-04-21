import { describe, it, expect, vi } from 'vitest';
import { validateError-boundariesParams, formatError-boundariesResult } from '../../../utils/helpers';

describe('error-boundaries helpers', () => {
  describe('validateError-boundariesParams', () => {
    it('returns valid=true for non-null params', () => {
      const result = validateError-boundariesParams({ key: 'value' });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('returns valid=false for null params', () => {
      const result = validateError-boundariesParams(null);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('formatError-boundariesResult', () => {
    it('returns dash for null', () => {
      expect(formatError-boundariesResult(null)).toBe('—');
    });

    it('returns stringified object', () => {
      const obj = { foo: 1 };
      const out = formatError-boundariesResult(obj);
      expect(out).toContain('foo');
    });

    it('returns string for primitive', () => {
      expect(formatError-boundariesResult(42)).toBe('42');
    });
  });
});

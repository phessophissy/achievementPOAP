import { describe, it, expect, vi } from 'vitest';
import { validateForm-validationParams, formatForm-validationResult } from '../../../utils/helpers';

describe('form-validation helpers', () => {
  describe('validateForm-validationParams', () => {
    it('returns valid=true for non-null params', () => {
      const result = validateForm-validationParams({ key: 'value' });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('returns valid=false for null params', () => {
      const result = validateForm-validationParams(null);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('formatForm-validationResult', () => {
    it('returns dash for null', () => {
      expect(formatForm-validationResult(null)).toBe('—');
    });

    it('returns stringified object', () => {
      const obj = { foo: 1 };
      const out = formatForm-validationResult(obj);
      expect(out).toContain('foo');
    });

    it('returns string for primitive', () => {
      expect(formatForm-validationResult(42)).toBe('42');
    });
  });
});

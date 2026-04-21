import { describe, it, expect, vi } from 'vitest';
import { validateTest-suiteParams, formatTest-suiteResult } from '../../../utils/helpers';

describe('test-suite helpers', () => {
  describe('validateTest-suiteParams', () => {
    it('returns valid=true for non-null params', () => {
      const result = validateTest-suiteParams({ key: 'value' });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('returns valid=false for null params', () => {
      const result = validateTest-suiteParams(null);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('formatTest-suiteResult', () => {
    it('returns dash for null', () => {
      expect(formatTest-suiteResult(null)).toBe('—');
    });

    it('returns stringified object', () => {
      const obj = { foo: 1 };
      const out = formatTest-suiteResult(obj);
      expect(out).toContain('foo');
    });

    it('returns string for primitive', () => {
      expect(formatTest-suiteResult(42)).toBe('42');
    });
  });
});

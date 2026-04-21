import { describe, it, expect, vi } from 'vitest';
import { validateSdk-improvementsParams, formatSdk-improvementsResult } from '../../../utils/helpers';

describe('sdk-improvements helpers', () => {
  describe('validateSdk-improvementsParams', () => {
    it('returns valid=true for non-null params', () => {
      const result = validateSdk-improvementsParams({ key: 'value' });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('returns valid=false for null params', () => {
      const result = validateSdk-improvementsParams(null);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('formatSdk-improvementsResult', () => {
    it('returns dash for null', () => {
      expect(formatSdk-improvementsResult(null)).toBe('—');
    });

    it('returns stringified object', () => {
      const obj = { foo: 1 };
      const out = formatSdk-improvementsResult(obj);
      expect(out).toContain('foo');
    });

    it('returns string for primitive', () => {
      expect(formatSdk-improvementsResult(42)).toBe('42');
    });
  });
});

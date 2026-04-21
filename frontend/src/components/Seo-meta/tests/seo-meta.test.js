import { describe, it, expect, vi } from 'vitest';
import { validateSeo-metaParams, formatSeo-metaResult } from '../../../utils/helpers';

describe('seo-meta helpers', () => {
  describe('validateSeo-metaParams', () => {
    it('returns valid=true for non-null params', () => {
      const result = validateSeo-metaParams({ key: 'value' });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('returns valid=false for null params', () => {
      const result = validateSeo-metaParams(null);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('formatSeo-metaResult', () => {
    it('returns dash for null', () => {
      expect(formatSeo-metaResult(null)).toBe('—');
    });

    it('returns stringified object', () => {
      const obj = { foo: 1 };
      const out = formatSeo-metaResult(obj);
      expect(out).toContain('foo');
    });

    it('returns string for primitive', () => {
      expect(formatSeo-metaResult(42)).toBe('42');
    });
  });
});

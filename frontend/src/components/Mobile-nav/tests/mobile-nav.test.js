import { describe, it, expect, vi } from 'vitest';
import { validateMobile-navParams, formatMobile-navResult } from '../../../utils/helpers';

describe('mobile-nav helpers', () => {
  describe('validateMobile-navParams', () => {
    it('returns valid=true for non-null params', () => {
      const result = validateMobile-navParams({ key: 'value' });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('returns valid=false for null params', () => {
      const result = validateMobile-navParams(null);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('formatMobile-navResult', () => {
    it('returns dash for null', () => {
      expect(formatMobile-navResult(null)).toBe('—');
    });

    it('returns stringified object', () => {
      const obj = { foo: 1 };
      const out = formatMobile-navResult(obj);
      expect(out).toContain('foo');
    });

    it('returns string for primitive', () => {
      expect(formatMobile-navResult(42)).toBe('42');
    });
  });
});

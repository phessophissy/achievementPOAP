/** @file frontend/src/components/Poap-share/tests/poap-share.test.js - Test coverage file that validates behavior and regression safety. */
import { describe, it, expect, vi } from 'vitest';
import { validatePoap-shareParams, formatPoap-shareResult } from '../../../utils/helpers';

describe('poap-share helpers', () => {
  describe('validatePoap-shareParams', () => {
    it('returns valid=true for non-null params', () => {
      const result = validatePoap-shareParams({ key: 'value' });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('returns valid=false for null params', () => {
      const result = validatePoap-shareParams(null);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('formatPoap-shareResult', () => {
    it('returns dash for null', () => {
      expect(formatPoap-shareResult(null)).toBe('—');
    });

    it('returns stringified object', () => {
      const obj = { foo: 1 };
      const out = formatPoap-shareResult(obj);
      expect(out).toContain('foo');
    });

    it('returns string for primitive', () => {
      expect(formatPoap-shareResult(42)).toBe('42');
    });
  });
});

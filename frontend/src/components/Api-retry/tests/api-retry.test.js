/** @file frontend/src/components/Api-retry/tests/api-retry.test.js - Test coverage file that validates behavior and regression safety. */
import { describe, it, expect, vi } from 'vitest';
import { validateApi-retryParams, formatApi-retryResult } from '../../../utils/helpers';

describe('api-retry helpers', () => {
  describe('validateApi-retryParams', () => {
    it('returns valid=true for non-null params', () => {
      const result = validateApi-retryParams({ key: 'value' });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('returns valid=false for null params', () => {
      const result = validateApi-retryParams(null);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('formatApi-retryResult', () => {
    it('returns dash for null', () => {
      expect(formatApi-retryResult(null)).toBe('—');
    });

    it('returns stringified object', () => {
      const obj = { foo: 1 };
      const out = formatApi-retryResult(obj);
      expect(out).toContain('foo');
    });

    it('returns string for primitive', () => {
      expect(formatApi-retryResult(42)).toBe('42');
    });
  });
});

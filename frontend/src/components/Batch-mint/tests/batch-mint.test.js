/** @file frontend/src/components/Batch-mint/tests/batch-mint.test.js - Test coverage file that validates behavior and regression safety. */
import { describe, it, expect, vi } from 'vitest';
import { validateBatch-mintParams, formatBatch-mintResult } from '../../../utils/helpers';

describe('batch-mint helpers', () => {
  describe('validateBatch-mintParams', () => {
    it('returns valid=true for non-null params', () => {
      const result = validateBatch-mintParams({ key: 'value' });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('returns valid=false for null params', () => {
      const result = validateBatch-mintParams(null);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('formatBatch-mintResult', () => {
    it('returns dash for null', () => {
      expect(formatBatch-mintResult(null)).toBe('—');
    });

    it('returns stringified object', () => {
      const obj = { foo: 1 };
      const out = formatBatch-mintResult(obj);
      expect(out).toContain('foo');
    });

    it('returns string for primitive', () => {
      expect(formatBatch-mintResult(42)).toBe('42');
    });
  });
});

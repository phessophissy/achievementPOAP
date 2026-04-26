/** @file frontend/src/components/Leaderboard-sort/tests/leaderboard-sort.test.js - Test coverage file that validates behavior and regression safety. */
import { describe, it, expect, vi } from 'vitest';
import { validateLeaderboard-sortParams, formatLeaderboard-sortResult } from '../../../utils/helpers';

describe('leaderboard-sort helpers', () => {
  describe('validateLeaderboard-sortParams', () => {
    it('returns valid=true for non-null params', () => {
      const result = validateLeaderboard-sortParams({ key: 'value' });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('returns valid=false for null params', () => {
      const result = validateLeaderboard-sortParams(null);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('formatLeaderboard-sortResult', () => {
    it('returns dash for null', () => {
      expect(formatLeaderboard-sortResult(null)).toBe('—');
    });

    it('returns stringified object', () => {
      const obj = { foo: 1 };
      const out = formatLeaderboard-sortResult(obj);
      expect(out).toContain('foo');
    });

    it('returns string for primitive', () => {
      expect(formatLeaderboard-sortResult(42)).toBe('42');
    });
  });
});

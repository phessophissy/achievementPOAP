/** @file frontend/src/components/Event-countdown/tests/event-countdown.test.js - Test coverage file that validates behavior and regression safety. */
import { describe, it, expect, vi } from 'vitest';
import { validateEvent-countdownParams, formatEvent-countdownResult } from '../../../utils/helpers';

describe('event-countdown helpers', () => {
  describe('validateEvent-countdownParams', () => {
    it('returns valid=true for non-null params', () => {
      const result = validateEvent-countdownParams({ key: 'value' });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('returns valid=false for null params', () => {
      const result = validateEvent-countdownParams(null);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('formatEvent-countdownResult', () => {
    it('returns dash for null', () => {
      expect(formatEvent-countdownResult(null)).toBe('—');
    });

    it('returns stringified object', () => {
      const obj = { foo: 1 };
      const out = formatEvent-countdownResult(obj);
      expect(out).toContain('foo');
    });

    it('returns string for primitive', () => {
      expect(formatEvent-countdownResult(42)).toBe('42');
    });
  });
});

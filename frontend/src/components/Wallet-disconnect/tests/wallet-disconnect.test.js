import { describe, it, expect, vi } from 'vitest';
import { validateWallet-disconnectParams, formatWallet-disconnectResult } from '../../../utils/helpers';

describe('wallet-disconnect helpers', () => {
  describe('validateWallet-disconnectParams', () => {
    it('returns valid=true for non-null params', () => {
      const result = validateWallet-disconnectParams({ key: 'value' });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('returns valid=false for null params', () => {
      const result = validateWallet-disconnectParams(null);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('formatWallet-disconnectResult', () => {
    it('returns dash for null', () => {
      expect(formatWallet-disconnectResult(null)).toBe('—');
    });

    it('returns stringified object', () => {
      const obj = { foo: 1 };
      const out = formatWallet-disconnectResult(obj);
      expect(out).toContain('foo');
    });

    it('returns string for primitive', () => {
      expect(formatWallet-disconnectResult(42)).toBe('42');
    });
  });
});

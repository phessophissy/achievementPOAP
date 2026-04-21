import { describe, it, expect, vi } from 'vitest';
import { validateCi-pipelineParams, formatCi-pipelineResult } from '../../../utils/helpers';

describe('ci-pipeline helpers', () => {
  describe('validateCi-pipelineParams', () => {
    it('returns valid=true for non-null params', () => {
      const result = validateCi-pipelineParams({ key: 'value' });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('returns valid=false for null params', () => {
      const result = validateCi-pipelineParams(null);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('formatCi-pipelineResult', () => {
    it('returns dash for null', () => {
      expect(formatCi-pipelineResult(null)).toBe('—');
    });

    it('returns stringified object', () => {
      const obj = { foo: 1 };
      const out = formatCi-pipelineResult(obj);
      expect(out).toContain('foo');
    });

    it('returns string for primitive', () => {
      expect(formatCi-pipelineResult(42)).toBe('42');
    });
  });
});

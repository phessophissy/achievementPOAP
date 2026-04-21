import { describe, it, expect, vi } from 'vitest';
import { validateDeploy-workflowParams, formatDeploy-workflowResult } from '../../../utils/helpers';

describe('deploy-workflow helpers', () => {
  describe('validateDeploy-workflowParams', () => {
    it('returns valid=true for non-null params', () => {
      const result = validateDeploy-workflowParams({ key: 'value' });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('returns valid=false for null params', () => {
      const result = validateDeploy-workflowParams(null);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('formatDeploy-workflowResult', () => {
    it('returns dash for null', () => {
      expect(formatDeploy-workflowResult(null)).toBe('—');
    });

    it('returns stringified object', () => {
      const obj = { foo: 1 };
      const out = formatDeploy-workflowResult(obj);
      expect(out).toContain('foo');
    });

    it('returns string for primitive', () => {
      expect(formatDeploy-workflowResult(42)).toBe('42');
    });
  });
});

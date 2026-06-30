import { describe, it, expect } from 'vitest';
import { microStxToStx } from '../utils/helpers';

describe('microStxToStx', () => {
  it('converts the contract mint fee (25000 microSTX) to 0.025000 STX', () => {
    expect(microStxToStx(25000)).toBe('0.025000');
  });

  it('converts whole STX values', () => {
    expect(microStxToStx(1_000_000)).toBe('1.000000');
    expect(microStxToStx(10_000_000)).toBe('10.000000');
  });

  it('handles bigint inputs from Clarity uint responses', () => {
    expect(microStxToStx(25000n)).toBe('0.025000');
  });

  it('returns 0 for null/undefined/empty input', () => {
    expect(microStxToStx(null)).toBe('0');
    expect(microStxToStx(undefined)).toBe('0');
    expect(microStxToStx('')).toBe('0');
  });

  it('respects a custom decimals argument', () => {
    expect(microStxToStx(25000, 2)).toBe('0.03');
  });
});

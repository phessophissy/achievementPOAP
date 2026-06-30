import { describe, it, expect } from 'vitest';
import {
  microStxToStx,
  stxToMicroStx,
  formatBlockHeight,
  calculateMintCost,
} from '../utils/helpers';

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

describe('stxToMicroStx', () => {
  it('converts the mint fee back to microSTX', () => {
    expect(stxToMicroStx(0.025)).toBe(25000n);
  });

  it('converts whole STX values', () => {
    expect(stxToMicroStx(1)).toBe(1_000_000n);
    expect(stxToMicroStx(10)).toBe(10_000_000n);
  });

  it('rounds fractional microSTX correctly', () => {
    expect(stxToMicroStx(0.0000004)).toBe(0n);
    expect(stxToMicroStx(0.0000006)).toBe(1n);
  });

  it('returns 0n for null/undefined/empty input', () => {
    expect(stxToMicroStx(null)).toBe(0n);
    expect(stxToMicroStx(undefined)).toBe(0n);
    expect(stxToMicroStx('')).toBe(0n);
  });

    it('accepts string inputs from form fields', () => {
    expect(stxToMicroStx('0.025')).toBe(25000n);
  });
});

describe('formatBlockHeight', () => {
  it('adds thousands separators to large block heights', () => {
    expect(formatBlockHeight(180432)).toBe('180,432');
    expect(formatBlockHeight(1000000)).toBe('1,000,000');
  });

  it('handles small values without separators', () => {
    expect(formatBlockHeight(1)).toBe('1');
    expect(formatBlockHeight(0)).toBe('0');
  });

  it('accepts bigint inputs from Clarity uint responses', () => {
    expect(formatBlockHeight(180432n)).toBe('180,432');
  });

    it('returns 0 for null/undefined/empty input', () => {
    expect(formatBlockHeight(null)).toBe('0');
    expect(formatBlockHeight(undefined)).toBe('0');
    expect(formatBlockHeight('')).toBe('0');
  });
});

describe('calculateMintCost', () => {
  it('calculates the cost for a single mint at the default fee', () => {
    expect(calculateMintCost(1)).toBe('0.025000');
  });

  it('scales linearly with quantity', () => {
    expect(calculateMintCost(10)).toBe('0.250000');
    expect(calculateMintCost(100)).toBe('2.500000');
  });

  it('accepts a custom per-mint fee in microSTX', () => {
    expect(calculateMintCost(5, 50000)).toBe('0.250000');
  });

  it('returns 0.000000 for zero or invalid quantity', () => {
    expect(calculateMintCost(0)).toBe('0.000000');
    expect(calculateMintCost(-5)).toBe('0.000000');
    expect(calculateMintCost(NaN)).toBe('0.000000');
  });
});




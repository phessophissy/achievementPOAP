import { describe, expect, it } from 'vitest';

describe('Simnet bootstrap', () => {
  it('initializes simnet for contract testing', () => {
    expect(simnet.blockHeight).toBeGreaterThan(0);
    expect(simnet.getAccounts().has('deployer')).toBe(true);
  });
});

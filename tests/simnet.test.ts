import { describe, expect, it } from 'vitest';

describe('Simnet bootstrap', () => {
  it('initializes simnet for contract testing', () => {
    expect(simnet.blockHeight).toBe(0);
  });
});

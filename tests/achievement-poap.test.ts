import { describe, it, expect, beforeEach } from 'vitest';
import { Cl } from '@stacks/transactions';

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const wallet1 = accounts.get('wallet_1')!;
const wallet2 = accounts.get('wallet_2')!;

describe('Achievement POAP Contract', () => {
  describe('Event Creation', () => {
    it('should create a new event successfully', () => {
      const createEventResponse = simnet.callPublicFn(
        'achievement-poap',
        'create-event',
        [
          Cl.stringAscii('Test Event'),
          Cl.stringAscii('A test POAP event'),
          Cl.uint(100),
          Cl.uint(1),
          Cl.uint(100000),
          Cl.stringAscii('ipfs://test-metadata')
        ],
        deployer
      );
      
      expect(createEventResponse.result).toBeOk(Cl.uint(1));
    });

    it('should fail with invalid URI', () => {
      const createEventResponse = simnet.callPublicFn(
        'achievement-poap',
        'create-event',
        [
          Cl.stringAscii('Test Event'),
          Cl.stringAscii('A test POAP event'),
          Cl.uint(100),
          Cl.uint(1),
          Cl.uint(100000),
          Cl.stringAscii('')
        ],
        deployer
      );
      
      expect(createEventResponse.result).toBeErr(Cl.uint(107));
    });

    it('should fail with invalid block range', () => {
      const createEventResponse = simnet.callPublicFn(
        'achievement-poap',
        'create-event',
        [
          Cl.stringAscii('Test Event'),
          Cl.stringAscii('A test POAP event'),
          Cl.uint(100),
          Cl.uint(100000),
          Cl.uint(1),
          Cl.stringAscii('ipfs://test')
        ],
        deployer
      );
      
      expect(createEventResponse.result).toBeErr(Cl.uint(103));
    });
  });

  describe('POAP Minting', () => {
    beforeEach(() => {
      // Create an event before each minting test
      simnet.callPublicFn(
        'achievement-poap',
        'create-event',
        [
          Cl.stringAscii('Mint Test Event'),
          Cl.stringAscii('Event for minting tests'),
          Cl.uint(1000),
          Cl.uint(1),
          Cl.uint(999999),
          Cl.stringAscii('ipfs://mint-test')
        ],
        deployer
      );
    });

    it('should mint a POAP successfully', () => {
      const mintResponse = simnet.callPublicFn(
        'achievement-poap',
        'mint-poap',
        [Cl.uint(1)],
        wallet1
      );
      
      expect(mintResponse.result).toBeOk(Cl.uint(1));
    });

    it('should prevent double minting', () => {
      // First mint
      simnet.callPublicFn(
        'achievement-poap',
        'mint-poap',
        [Cl.uint(1)],
        wallet1
      );
      
      // Second mint attempt
      const secondMint = simnet.callPublicFn(
        'achievement-poap',
        'mint-poap',
        [Cl.uint(1)],
        wallet1
      );
      
      expect(secondMint.result).toBeErr(Cl.uint(101));
    });

    it('should fail for non-existent event', () => {
      const mintResponse = simnet.callPublicFn(
        'achievement-poap',
        'mint-poap',
        [Cl.uint(999)],
        wallet1
      );
      
      expect(mintResponse.result).toBeErr(Cl.uint(102));
    });
  });

  describe('Read Functions', () => {
    beforeEach(() => {
      simnet.callPublicFn(
        'achievement-poap',
        'create-event',
        [
          Cl.stringAscii('Read Test Event'),
          Cl.stringAscii('Event for read tests'),
          Cl.uint(500),
          Cl.uint(1),
          Cl.uint(999999),
          Cl.stringAscii('ipfs://read-test')
        ],
        deployer
      );
    });

    it('should return correct mint fee', () => {
      const feeResponse = simnet.callReadOnlyFn(
        'achievement-poap',
        'get-mint-fee',
        [],
        deployer
      );
      
      expect(feeResponse.result).toBeOk(Cl.uint(25000));
    });

    it('should return event details', () => {
      const eventResponse = simnet.callReadOnlyFn(
        'achievement-poap',
        'get-event',
        [Cl.uint(1)],
        deployer
      );
      
      expect(eventResponse.result).toBeDefined();
    });

    it('should check minting status', () => {
      const hasMinted = simnet.callReadOnlyFn(
        'achievement-poap',
        'has-minted-event',
        [Cl.uint(1), Cl.principal(wallet1)],
        deployer
      );
      
      expect(hasMinted.result).toBeBool(false);
    });
  });

  describe('Admin Functions', () => {
    it('should allow owner to pause contract', () => {
      const pauseResponse = simnet.callPublicFn(
        'achievement-poap',
        'pause-contract',
        [],
        deployer
      );
      
      expect(pauseResponse.result).toBeOk(Cl.bool(true));
    });

    it('should prevent non-owner from pausing', () => {
      const pauseResponse = simnet.callPublicFn(
        'achievement-poap',
        'pause-contract',
        [],
        wallet1
      );
      
      expect(pauseResponse.result).toBeErr(Cl.uint(100));
    });

    it('should allow owner to set treasury', () => {
      const setTreasuryResponse = simnet.callPublicFn(
        'achievement-poap',
        'set-treasury',
        [Cl.principal(wallet2)],
        deployer
      );
      
      expect(setTreasuryResponse.result).toBeOk(Cl.bool(true));
    });
  });

  describe('Transfer', () => {
    beforeEach(() => {
      simnet.callPublicFn(
        'achievement-poap',
        'create-event',
        [
          Cl.stringAscii('Transfer Test'),
          Cl.stringAscii('Event for transfer tests'),
          Cl.uint(100),
          Cl.uint(1),
          Cl.uint(999999),
          Cl.stringAscii('ipfs://transfer-test')
        ],
        deployer
      );
      
      simnet.callPublicFn(
        'achievement-poap',
        'mint-poap',
        [Cl.uint(1)],
        wallet1
      );
    });

    it('should transfer POAP successfully', () => {
      const transferResponse = simnet.callPublicFn(
        'achievement-poap',
        'transfer',
        [Cl.uint(1), Cl.principal(wallet1), Cl.principal(wallet2)],
        wallet1
      );
      
      expect(transferResponse.result).toBeOk(Cl.bool(true));
    });

    it('should fail transfer from non-owner', () => {
      const transferResponse = simnet.callPublicFn(
        'achievement-poap',
        'transfer',
        [Cl.uint(1), Cl.principal(wallet1), Cl.principal(wallet2)],
        wallet2
      );
      
      expect(transferResponse.result).toBeErr(Cl.uint(100));
    });
  });
});

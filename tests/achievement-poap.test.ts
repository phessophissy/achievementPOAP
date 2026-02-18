import { describe, it, expect, beforeEach } from 'vitest';
import { Cl } from '@stacks/transactions';

const CONTRACT_NAME = 'achievement-poap';
const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const wallet1 = accounts.get('wallet_1')!;
const wallet2 = accounts.get('wallet_2')!;

const createEvent = (
  sender = deployer,
  overrides: Partial<{
    name: string;
    description: string;
    maxSupply: number;
    startBlock: number;
    endBlock: number;
    metadataUri: string;
  }> = {}
) => {
  const {
    name = 'Test Event',
    description = 'A test POAP event',
    maxSupply = 100,
    startBlock = 1,
    endBlock = 100000,
    metadataUri = 'ipfs://test-metadata',
  } = overrides;

  return simnet.callPublicFn(
    CONTRACT_NAME,
    'create-event',
    [
      Cl.stringAscii(name),
      Cl.stringAscii(description),
      Cl.uint(maxSupply),
      Cl.uint(startBlock),
      Cl.uint(endBlock),
      Cl.stringAscii(metadataUri),
    ],
    sender
  );
};

describe('Achievement POAP Contract', () => {
  describe('Event Creation', () => {
    it('should create a new event successfully', () => {
      const createEventResponse = createEvent();
      expect(createEventResponse.result).toBeOk(Cl.uint(1));
    });

    it('should increment event IDs for subsequent events', () => {
      expect(createEvent().result).toBeOk(Cl.uint(1));
      expect(
        createEvent(deployer, {
          name: 'Second Event',
          metadataUri: 'ipfs://second-event',
        }).result
      ).toBeOk(Cl.uint(2));
    });

    it('should fail with invalid URI', () => {
      const createEventResponse = createEvent(deployer, { metadataUri: '' });
      expect(createEventResponse.result).toBeErr(Cl.uint(107));
    });

    it('should fail with invalid block range', () => {
      const createEventResponse = createEvent(deployer, {
        startBlock: 100000,
        endBlock: 1,
      });

      expect(createEventResponse.result).toBeErr(Cl.uint(103));
    });
  });

  describe('POAP Minting', () => {
    beforeEach(() => {
      createEvent(deployer, {
        name: 'Mint Test Event',
        description: 'Event for minting tests',
        maxSupply: 1000,
        endBlock: 999999,
        metadataUri: 'ipfs://mint-test',
      });
    });

    it('should mint a POAP successfully', () => {
      const mintResponse = simnet.callPublicFn(
        CONTRACT_NAME,
        'mint-poap',
        [Cl.uint(1)],
        wallet1
      );

      expect(mintResponse.result).toBeOk(Cl.uint(1));

      const ownerResponse = simnet.callReadOnlyFn(CONTRACT_NAME, 'get-owner', [Cl.uint(1)], deployer);
      expect(ownerResponse.result).toBeOk(Cl.some(Cl.principal(wallet1)));
    });

    it('should prevent double minting', () => {
      // First mint
      simnet.callPublicFn(
        CONTRACT_NAME,
        'mint-poap',
        [Cl.uint(1)],
        wallet1
      );
      
      // Second mint attempt
      const secondMint = simnet.callPublicFn(
        CONTRACT_NAME,
        'mint-poap',
        [Cl.uint(1)],
        wallet1
      );
      
      expect(secondMint.result).toBeErr(Cl.uint(101));
    });

    it('should fail for non-existent event', () => {
      const mintResponse = simnet.callPublicFn(
        CONTRACT_NAME,
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

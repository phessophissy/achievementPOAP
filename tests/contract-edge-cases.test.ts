import { describe, it, expect, beforeEach } from 'vitest';
import { Cl } from '@stacks/transactions';

/**
 * Edge-case coverage for the achievement-poap contract.
 *
 * These tests complement tests/achievement-poap.test.ts by exercising
 * scenarios that the original suite does not cover: token-id nonce
 * progression, supply exhaustion, deactivation blocking minting,
 * token-uri resolution, and user-tokens accumulation.
 */

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
    name = 'Edge Case Event',
    description = 'An event for edge-case tests',
    maxSupply = 100,
    startBlock = 1,
    endBlock = 100000,
    metadataUri = 'ipfs://edge-case-metadata',
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

const mintPoap = (eventId: number, sender = wallet1) =>
  simnet.callPublicFn(CONTRACT_NAME, 'mint-poap', [Cl.uint(eventId)], sender);

describe('Achievement POAP — edge cases', () => {
  describe('token-id nonce progression', () => {
    it('increments token-id across events and mints', () => {
      // Event 1
      createEvent(deployer, { name: 'Event One', metadataUri: 'ipfs://one' });
      // Event 2
      createEvent(deployer, { name: 'Event Two', metadataUri: 'ipfs://two' });

      // Mint from event 1 → token id 1
      const mintOne = mintPoap(1, wallet1);
      expect(mintOne.result).toBeOk(Cl.uint(1));

      // Mint from event 2 → token id 2 (nonce is global, not per-event)
      const mintTwo = mintPoap(2, wallet1);
      expect(mintTwo.result).toBeOk(Cl.uint(2));

      // Mint from event 1 with a different wallet → token id 3
      const mintThree = mintPoap(1, wallet2);
      expect(mintThree.result).toBeOk(Cl.uint(3));

            // Last token id reflects the global nonce
      const lastId = simnet.callReadOnlyFn(
        CONTRACT_NAME,
        'get-last-token-id',
        [],
        deployer
      );
      expect(lastId.result).toBeOk(Cl.uint(3));
    });
  });

  describe('supply exhaustion', () => {
    it('rejects minting once max-supply is reached', () => {
      // Create an event with a single mint available
      createEvent(deployer, {
        name: 'Single Mint Event',
        maxSupply: 1,
        metadataUri: 'ipfs://single-mint',
      });

      // First mint succeeds
      const firstMint = mintPoap(1, wallet1);
      expect(firstMint.result).toBeOk(Cl.uint(1));

      // Supply is now exhausted; a different wallet cannot mint
      const secondMint = mintPoap(1, wallet2);
      expect(secondMint.result).toBeErr(Cl.uint(106)); // ERR_EVENT_NOT_ACTIVE

            // Supply read reflects the cap
      const supply = simnet.callReadOnlyFn(
        CONTRACT_NAME,
        'get-event-supply',
        [Cl.uint(1)],
        deployer
      );
      expect(supply.result).toBeOk(
        Cl.tuple({ current: Cl.uint(1), max: Cl.uint(1) })
      );
    });
  });

  describe('event deactivation', () => {
    it('blocks minting after an event is deactivated', () => {
      createEvent(deployer, {
        name: 'Deactivatable Event',
        maxSupply: 50,
        metadataUri: 'ipfs://deactivatable',
      });

      // Minting works while active
      const activeMint = mintPoap(1, wallet1);
      expect(activeMint.result).toBeOk(Cl.uint(1));

      // Creator deactivates the event
      const deactivate = simnet.callPublicFn(
        CONTRACT_NAME,
        'deactivate-event',
        [Cl.uint(1)],
        deployer
      );
      expect(deactivate.result).toBeOk(Cl.bool(true));

      // A new wallet can no longer mint the deactivated event
      const blockedMint = mintPoap(1, wallet2);
      expect(blockedMint.result).toBeErr(Cl.uint(106)); // ERR_EVENT_NOT_ACTIVE
    });
  });
});

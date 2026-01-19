import { createEvent } from './interact.js';
import { config } from 'dotenv';

config();

const DEPLOYER_MNEMONIC = process.env.DEPLOYER_MNEMONIC;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

async function setupEvent() {
  if (!DEPLOYER_MNEMONIC || !CONTRACT_ADDRESS) {
    console.error('Set DEPLOYER_MNEMONIC and CONTRACT_ADDRESS in .env');
    process.exit(1);
  }

  console.log('Creating POAP event on Stacks Mainnet...\n');

  try {
    const response = await createEvent(
      DEPLOYER_MNEMONIC,
      CONTRACT_ADDRESS,
      'Achievement POAP Launch',
      'Commemorating the launch of Achievement POAP platform',
      1000,
      1,
      9999999,
      'ipfs://QmYourMetadataHashHere'
    );

    if ('error' in response) {
      console.error('Failed to create event:', response.error);
    } else {
      console.log('✅ Event creation transaction submitted!');
      console.log('TX ID:', response.txid);
      console.log(`View: https://explorer.stacks.co/txid/${response.txid}?chain=mainnet`);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

setupEvent();

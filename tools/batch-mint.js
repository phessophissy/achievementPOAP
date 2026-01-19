import { readFileSync } from 'fs';
import { mintPoap, getWalletFromMnemonic } from './interact.js';
import { config } from 'dotenv';

config();

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || 'SP_YOUR_CONTRACT_ADDRESS';
const EVENT_ID = parseInt(process.env.EVENT_ID || '1');
const DELAY_BETWEEN_MINTS = 3000;

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function executeMinting() {
  console.log('='.repeat(60));
  console.log('Achievement POAP Batch Minting - Stacks Mainnet');
  console.log('='.repeat(60));
  console.log(`Contract: ${CONTRACT_ADDRESS}.achievement-poap`);
  console.log(`Event ID: ${EVENT_ID}`);
  console.log('='.repeat(60) + '\n');

  let wallets;
  try {
    const walletsData = readFileSync('./tools/wallets.json', 'utf8');
    wallets = JSON.parse(walletsData);
  } catch (error) {
    console.error('❌ Could not read wallets.json. Run generate-wallets.js first.');
    process.exit(1);
  }

  console.log(`Found ${wallets.length} wallets to process\n`);

  const results = {
    successful: [],
    failed: [],
  };

  for (let i = 0; i < wallets.length; i++) {
    const wallet = wallets[i];
    console.log(`[${i + 1}/${wallets.length}] Processing wallet: ${wallet.address}`);

    try {
      const { response, address } = await mintPoap(
        wallet.mnemonic,
        CONTRACT_ADDRESS,
        EVENT_ID
      );

      if ('error' in response) {
        console.log(`   ❌ Failed: ${response.error}`);
        results.failed.push({ address: wallet.address, error: response.error });
      } else {
        console.log(`   ✅ Success! TX: ${response.txid}`);
        results.successful.push({ address: wallet.address, txid: response.txid });
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      results.failed.push({ address: wallet.address, error: error.message });
    }

    if (i < wallets.length - 1) {
      console.log(`   Waiting ${DELAY_BETWEEN_MINTS / 1000}s before next mint...`);
      await sleep(DELAY_BETWEEN_MINTS);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('MINTING COMPLETE');
  console.log('='.repeat(60));
  console.log(`✅ Successful: ${results.successful.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  console.log('='.repeat(60));

  if (results.successful.length > 0) {
    console.log('\nSuccessful transactions:');
    results.successful.forEach(r => {
      console.log(`  ${r.address}: https://explorer.stacks.co/txid/${r.txid}?chain=mainnet`);
    });
  }

  if (results.failed.length > 0) {
    console.log('\nFailed mints:');
    results.failed.forEach(r => {
      console.log(`  ${r.address}: ${r.error}`);
    });
  }

  return results;
}

executeMinting().catch(console.error);

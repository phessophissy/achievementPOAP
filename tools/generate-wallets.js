import * as bip39 from 'bip39';
import { writeFileSync } from 'fs';
import { TransactionVersion } from '@stacks/transactions';

async function generateWallets(count = 50) {
  const { generateWallet, getStxAddress } = await import('@stacks/wallet-sdk');
  
  const wallets = [];

  console.log(`Generating ${count} wallets for Stacks Mainnet...\n`);

  for (let i = 0; i < count; i++) {
    const mnemonic = bip39.generateMnemonic(256);
    
    const wallet = await generateWallet({
      secretKey: mnemonic,
      password: '',
    });

    const account = wallet.accounts[0];
    const address = getStxAddress({
      account,
      transactionVersion: TransactionVersion.Mainnet,
    });

    wallets.push({
      index: i + 1,
      address,
      mnemonic,
    });

    console.log(`Wallet ${i + 1}: ${address}`);
  }

  writeFileSync(
    './tools/wallets.json',
    JSON.stringify(wallets, null, 2)
  );

  console.log('\n✅ Wallets saved to tools/wallets.json');
  console.log('⚠️  Keep this file secure and never commit to version control!');

  return wallets;
}

generateWallets(50).catch(console.error);

/**
 * generate-wallets.js
 * Generates 100 Stacks wallets for testing/interaction purposes.
 * Each wallet includes: mnemonic, STX address (mainnet), private key, and index.
 * Outputs to wallets.json in the project root.
 */

import { generateWallet, getStxAddress } from '@stacks/wallet-sdk';
import { TransactionVersion } from '@stacks/transactions';
import { generateMnemonic } from 'bip39';
import { writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const WALLETS_FILE = join(PROJECT_ROOT, 'wallets.json');
const WALLET_COUNT = 100;

async function generateWallets() {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  🔐 Achievement POAP — Wallet Generator');
    console.log('═══════════════════════════════════════════════════════════');
    console.log();

    // Safety check: don't overwrite existing wallets
    if (existsSync(WALLETS_FILE)) {
        console.log('⚠️  wallets.json already exists!');
        console.log('   To regenerate, delete or rename the existing file first.');
        console.log('   This prevents accidental loss of funded wallets.');
        process.exit(1);
    }

    console.log(`Generating ${WALLET_COUNT} wallets...\n`);

    const wallets = [];

    for (let i = 0; i < WALLET_COUNT; i++) {
        const mnemonic = generateMnemonic(128); // 12-word mnemonic

        const wallet = await generateWallet({
            secretKey: mnemonic,
            password: '',
        });

        const account = wallet.accounts[0];
        const stxAddress = getStxAddress({
            account,
            transactionVersion: TransactionVersion.Mainnet,
        });

        wallets.push({
            index: i + 1,
            address: stxAddress,
            privateKey: account.stxPrivateKey,
            mnemonic: mnemonic,
            funded: false,
            minted: false,
        });

        // Progress indicator
        if ((i + 1) % 10 === 0) {
            console.log(`  ✅ Generated ${i + 1}/${WALLET_COUNT} wallets`);
        }
    }

    // Save to file
    const output = {
        generated_at: new Date().toISOString(),
        network: 'mainnet',
        count: wallets.length,
        wallets: wallets,
    };

    writeFileSync(WALLETS_FILE, JSON.stringify(output, null, 2));

    console.log();
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`  ✅ Successfully generated ${WALLET_COUNT} wallets`);
    console.log(`  📄 Saved to: wallets.json`);
    console.log('═══════════════════════════════════════════════════════════');
    console.log();
    console.log('  First 5 wallet addresses:');
    wallets.slice(0, 5).forEach((w) => {
        console.log(`    #${w.index}: ${w.address}`);
    });
    console.log('  ...');
    console.log();
    console.log('  ⚠️  IMPORTANT: Keep wallets.json secure — it contains private keys!');
    console.log();
}

generateWallets().catch((err) => {
    console.error('❌ Error generating wallets:', err.message);
    process.exit(1);
});

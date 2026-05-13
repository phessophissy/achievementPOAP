/**
 * generate-wallets-set-3.js
 * Generates 200 Stacks wallets for the Buildathon POAP event (event #17).
 * Each wallet includes: mnemonic, STX address (mainnet), private key, and index.
 * Outputs to wallets-set-3.json in the project root.
 *
 * Usage:
 *   node tools/generate-wallets-set-3.js
 */

import { generateWallet, getStxAddress } from '@stacks/wallet-sdk';
import { TransactionVersion } from '@stacks/transactions';
import { generateMnemonic } from 'bip39';
import { writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const WALLETS_FILE = join(PROJECT_ROOT, 'wallets-set-3.json');
const WALLET_COUNT = 200;

async function generateWallets() {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  🔐 Achievement POAP — Wallet Generator (Set 3 / Buildathon)');
    console.log('═══════════════════════════════════════════════════════════');
    console.log();

    if (existsSync(WALLETS_FILE)) {
        console.log('⚠️  wallets-set-3.json already exists!');
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
            minted_by_event: {},
        });

        if ((i + 1) % 20 === 0) {
            console.log(`  ✅ Generated ${i + 1}/${WALLET_COUNT} wallets`);
        }
    }

    const output = {
        generated_at: new Date().toISOString(),
        network: 'mainnet',
        label: 'Set 3 - Buildathon POAP event wallets',
        count: wallets.length,
        wallets,
    };

    writeFileSync(WALLETS_FILE, JSON.stringify(output, null, 2));

    console.log();
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`  ✅ Successfully generated ${WALLET_COUNT} wallets`);
    console.log(`  📄 Saved to: wallets-set-3.json`);
    console.log('═══════════════════════════════════════════════════════════');
    console.log();
    console.log('  First 5 wallet addresses:');
    wallets.slice(0, 5).forEach((w) => {
        console.log(`    #${w.index}: ${w.address}`);
    });
    console.log('  ...');
    console.log();
    console.log('  ⚠️  IMPORTANT: Keep wallets-set-3.json secure — it contains private keys!');
    console.log();
    console.log('  Next steps:');
    console.log('    1. Fund wallets:  node tools/fund-set-3.js --all');
    console.log('    2. Mint POAPs:    node tools/interact-set-3.js mint');
    console.log();
}

generateWallets().catch((err) => {
    console.error('❌ Error generating wallets:', err.message);
    process.exit(1);
});

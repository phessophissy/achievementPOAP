/**
 * fund-wallets.js
 * Funds all generated wallets from a specified funding wallet.
 * Funding Wallet: SP1QPNQB6R3EFMTQYGHG9J7N03S3K52ARSE1VEVX4
 * 
 * Usage:
 *   node tools/fund-wallets.js                    — Fund all unfunded wallets (0.05 STX each)
 *   node tools/fund-wallets.js --amount 50000     — Custom amount in microSTX
 *   node tools/fund-wallets.js --batch 10         — Custom batch size
 *   node tools/fund-wallets.js --start 20         — Start from wallet index 20
 *   node tools/fund-wallets.js --end 50           — End at wallet index 50
 *   node tools/fund-wallets.js --dry-run          — Preview without sending transactions
 *   node tools/fund-wallets.js --status            — Check funding status of all wallets
 */

import {
    makeSTXTokenTransfer,
    AnchorMode,
    TransactionVersion,
} from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';
import { generateWallet, getStxAddress } from '@stacks/wallet-sdk';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const WALLETS_FILE = join(PROJECT_ROOT, 'wallets.json');

const FUNDING_ADDRESS = 'SP1QPNQB6R3EFMTQYGHG9J7N03S3K52ARSE1VEVX4';
const DEFAULT_AMOUNT = 50000; // 0.05 STX in microSTX (covers mint fee 0.025 + tx fee)
const DEFAULT_BATCH_SIZE = 25;
const DELAY_BETWEEN_TX = 1500; // ms between transactions
const DELAY_BETWEEN_BATCHES = 30000; // 30s between batches

const network = new StacksMainnet();

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseArgs() {
    const args = process.argv.slice(2);
    const opts = {
        amount: DEFAULT_AMOUNT,
        batchSize: DEFAULT_BATCH_SIZE,
        start: 1,
        end: null,
        dryRun: false,
        status: false,
        onlyUnfunded: true,
    };

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--amount':
                opts.amount = parseInt(args[++i]);
                break;
            case '--batch':
                opts.batchSize = parseInt(args[++i]);
                break;
            case '--start':
                opts.start = parseInt(args[++i]);
                break;
            case '--end':
                opts.end = parseInt(args[++i]);
                break;
            case '--dry-run':
                opts.dryRun = true;
                break;
            case '--status':
                opts.status = true;
                break;
            case '--all':
                opts.onlyUnfunded = false;
                break;
        }
    }
    return opts;
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function broadcastTx(transaction) {
    const serializedTx = transaction.serialize();
    const response = await fetch('https://api.mainnet.hiro.so/v2/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        body: serializedTx,
    });

    const responseText = await response.text();

    if (!response.ok) {
        throw new Error(`Broadcast failed (${response.status}): ${responseText}`);
    }

    return responseText.replace(/"/g, '');
}

async function getBalance(address) {
    try {
        const res = await fetch(
            `https://api.mainnet.hiro.so/extended/v1/address/${address}/balances`
        );
        const data = await res.json();
        return parseInt(data.stx?.balance || '0');
    } catch {
        return 0;
    }
}

async function getNonce(address) {
    try {
        const res = await fetch(
            `https://api.mainnet.hiro.so/extended/v1/address/${address}/nonces`
        );
        const data = await res.json();
        return data.possible_next_nonce;
    } catch {
        return 0;
    }
}

async function getFunderAccount() {
    const mnemonic = process.env.FUNDER_MNEMONIC;
    if (!mnemonic) {
        throw new Error(
            'FUNDER_MNEMONIC not set in .env file.\n' +
            'Add: FUNDER_MNEMONIC=your twenty four word mnemonic phrase\n' +
            `This should be the mnemonic for ${FUNDING_ADDRESS}`
        );
    }

    const wallet = await generateWallet({ secretKey: mnemonic, password: '' });
    const account = wallet.accounts[0];
    const address = getStxAddress({
        account,
        transactionVersion: TransactionVersion.Mainnet,
    });

    if (address !== FUNDING_ADDRESS) {
        throw new Error(
            `Mnemonic resolves to ${address}, expected ${FUNDING_ADDRESS}.\n` +
            'Please check your FUNDER_MNEMONIC in .env'
        );
    }

    return { account, address };
}

// ─── Status Command ──────────────────────────────────────────────────────────

async function showStatus(walletsData) {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  📊 Wallet Funding Status');
    console.log('═══════════════════════════════════════════════════════════\n');

    const funded = walletsData.wallets.filter((w) => w.funded).length;
    const unfunded = walletsData.wallets.filter((w) => !w.funded).length;

    console.log(`  Total wallets:   ${walletsData.wallets.length}`);
    console.log(`  Funded:          ${funded}`);
    console.log(`  Unfunded:        ${unfunded}`);
    console.log();

    // Check funder balance
    const funderBalance = await getBalance(FUNDING_ADDRESS);
    console.log(`  Funder address:  ${FUNDING_ADDRESS}`);
    console.log(`  Funder balance:  ${(funderBalance / 1_000_000).toFixed(6)} STX`);
    console.log();

    // Sample check some wallet balances
    console.log('  Checking sample wallet balances (first 5)...');
    for (const w of walletsData.wallets.slice(0, 5)) {
        const bal = await getBalance(w.address);
        const status = bal > 0 ? '✅' : '⭕';
        console.log(
            `    ${status} #${String(w.index).padStart(3)} ${w.address} — ${(bal / 1_000_000).toFixed(6)} STX`
        );
    }

    console.log();
}

// ─── Funding Logic ───────────────────────────────────────────────────────────

async function fundWallets() {
    const opts = parseArgs();

    console.log('═══════════════════════════════════════════════════════════');
    console.log('  💰 Achievement POAP — Wallet Funder');
    console.log('═══════════════════════════════════════════════════════════');
    console.log();

    // Load wallets
    if (!existsSync(WALLETS_FILE)) {
        console.error('❌ wallets.json not found. Run generate-wallets.js first.');
        process.exit(1);
    }

    const walletsData = JSON.parse(readFileSync(WALLETS_FILE, 'utf-8'));
    console.log(`  Loaded ${walletsData.wallets.length} wallets from wallets.json`);

    // Status-only mode
    if (opts.status) {
        await showStatus(walletsData);
        return;
    }

    // Filter wallets
    let targetWallets = walletsData.wallets.filter((w) => {
        if (w.index < opts.start) return false;
        if (opts.end && w.index > opts.end) return false;
        if (opts.onlyUnfunded && w.funded) return false;
        return true;
    });

    if (targetWallets.length === 0) {
        console.log('  ✅ All wallets in range are already funded!');
        return;
    }

    // Get funder account
    const { account: funderAccount, address: funderAddress } =
        await getFunderAccount();

    // Check funder balance
    const funderBalance = await getBalance(funderAddress);
    const totalNeeded = targetWallets.length * (opts.amount + 500); // +500 for tx fees
    console.log(`  Funder balance:  ${(funderBalance / 1_000_000).toFixed(6)} STX`);
    console.log(
        `  Total needed:    ${(totalNeeded / 1_000_000).toFixed(6)} STX (${targetWallets.length} wallets × ${(opts.amount / 1_000_000).toFixed(6)} STX)`
    );

    if (funderBalance < totalNeeded) {
        console.error(
            `\n  ❌ Insufficient funder balance! Need ${(totalNeeded / 1_000_000).toFixed(6)} STX, have ${(funderBalance / 1_000_000).toFixed(6)} STX`
        );
        process.exit(1);
    }

    if (opts.dryRun) {
        console.log('\n  🏃 DRY RUN — No transactions will be sent\n');
        targetWallets.forEach((w) => {
            console.log(
                `    Would fund #${String(w.index).padStart(3)} ${w.address} with ${(opts.amount / 1_000_000).toFixed(6)} STX`
            );
        });
        console.log(`\n  Total: ${targetWallets.length} wallets`);
        return;
    }

    console.log(`\n  Funding ${targetWallets.length} wallets in batches of ${opts.batchSize}...\n`);

    // Get starting nonce
    let nonce = await getNonce(funderAddress);
    let successCount = 0;
    let failCount = 0;
    const results = [];

    // Process in batches
    const batches = [];
    for (let i = 0; i < targetWallets.length; i += opts.batchSize) {
        batches.push(targetWallets.slice(i, i + opts.batchSize));
    }

    for (let batchIdx = 0; batchIdx < batches.length; batchIdx++) {
        const batch = batches[batchIdx];
        console.log(
            `  ── Batch ${batchIdx + 1}/${batches.length} (${batch.length} wallets) ──`
        );

        for (const wallet of batch) {
            try {
                const txOptions = {
                    recipient: wallet.address,
                    amount: BigInt(opts.amount),
                    senderKey: funderAccount.stxPrivateKey,
                    network,
                    anchorMode: AnchorMode.Any,
                    fee: 500n,
                    nonce: BigInt(nonce),
                };

                const transaction = await makeSTXTokenTransfer(txOptions);
                const txid = await broadcastTx(transaction);

                console.log(
                    `    ✅ #${String(wallet.index).padStart(3)} ${wallet.address} — txid: ${txid.slice(0, 16)}...`
                );

                // Update wallet status
                const walletInFile = walletsData.wallets.find(
                    (w) => w.index === wallet.index
                );
                if (walletInFile) {
                    walletInFile.funded = true;
                    walletInFile.fund_txid = txid;
                    walletInFile.fund_amount = opts.amount;
                }

                results.push({ index: wallet.index, success: true, txid });
                successCount++;
                nonce++;

                await sleep(DELAY_BETWEEN_TX);
            } catch (err) {
                console.log(
                    `    ❌ #${String(wallet.index).padStart(3)} ${wallet.address} — Error: ${err.message.slice(0, 80)}`
                );
                results.push({
                    index: wallet.index,
                    success: false,
                    error: err.message,
                });
                failCount++;

                // If nonce error, try to refresh
                if (err.message.includes('nonce') || err.message.includes('ConflictingNonceInMempool')) {
                    nonce = await getNonce(funderAddress);
                    console.log(`    🔄 Refreshed nonce to ${nonce}`);
                }
            }
        }

        // Save progress after each batch
        writeFileSync(WALLETS_FILE, JSON.stringify(walletsData, null, 2));
        console.log(`  💾 Progress saved.\n`);

        // Wait between batches (except after the last one)
        if (batchIdx < batches.length - 1) {
            console.log(
                `  ⏳ Waiting ${DELAY_BETWEEN_BATCHES / 1000}s before next batch...\n`
            );
            await sleep(DELAY_BETWEEN_BATCHES);
        }
    }

    // Summary
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  📊 Funding Summary');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`  ✅ Successful:  ${successCount}`);
    console.log(`  ❌ Failed:      ${failCount}`);
    console.log(`  📄 Results saved to wallets.json`);
    console.log('═══════════════════════════════════════════════════════════\n');
}

fundWallets().catch((err) => {
    console.error('❌ Fatal error:', err.message);
    process.exit(1);
});

// improve accessibility for deployment-runbook — ref:docs/deployment-runbook#6 (1776635184292)

/**
 * fund-set-3.js
 * Funds the third set of 200 wallets (Buildathon) from the main funding wallet.
 *
 * Each wallet needs at least 27,500 microSTX (mint fee 25000 + tx fee 2500).
 * Default top-up is 30,000 microSTX (0.03 STX) to include a small buffer.
 *
 * Usage:
 *   node tools/fund-set-3.js                          # fund only unfunded wallets
 *   node tools/fund-set-3.js --all                    # fund all wallets regardless
 *   node tools/fund-set-3.js --amount 30000 --all
 *   node tools/fund-set-3.js --start 1 --end 100
 *   node tools/fund-set-3.js --dry-run --all          # preview only
 */

import {
    makeSTXTokenTransfer,
    AnchorMode,
    TransactionVersion,
    getAddressFromPrivateKey,
} from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const WALLETS_FILE = join(PROJECT_ROOT, 'wallets-set-3.json');

// The designated funding wallet for this project
const FUNDING_ADDRESS = 'SP3KQGS77RT7GRS6NYT29JSRPHSWT9WK0FCTPNK3N';

// 30,000 microSTX = 0.03 STX (covers mint fee 25000 + tx fee 2500 + buffer)
const DEFAULT_TOPUP_AMOUNT = 30000;
const DEFAULT_BATCH_SIZE = 5;
const DEFAULT_TX_FEE = 2500;
const DELAY_BETWEEN_TX = 3000;
const DELAY_BETWEEN_BATCHES = 45000;
const MAX_RETRIES_PER_WALLET = 5;

const network = new StacksMainnet();

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

function parseArgs() {
    const args = process.argv.slice(2);
    const opts = {
        amount: DEFAULT_TOPUP_AMOUNT,
        batchSize: DEFAULT_BATCH_SIZE,
        txFee: DEFAULT_TX_FEE,
        start: 1,
        end: null,
        includeAll: false,
        dryRun: false,
    };

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--amount':  opts.amount    = parseInt(args[++i], 10); break;
            case '--batch':   opts.batchSize = parseInt(args[++i], 10); break;
            case '--tx-fee':  opts.txFee     = parseInt(args[++i], 10); break;
            case '--start':   opts.start     = parseInt(args[++i], 10); break;
            case '--end':     opts.end       = parseInt(args[++i], 10); break;
            case '--all':     opts.includeAll = true;                   break;
            case '--dry-run': opts.dryRun    = true;                   break;
        }
    }
    return opts;
}

async function getBalance(address) {
    let lastError = null;
    for (let i = 0; i < 6; i++) {
        try {
            const res = await fetch(
                `https://api.mainnet.hiro.so/extended/v1/address/${address}/balances`
            );
            if (!res.ok) {
                lastError = new Error(`balance http ${res.status}`);
                await sleep(1000 + i * 1000);
                continue;
            }
            const data = await res.json();
            return parseInt(data.stx?.balance || '0', 10);
        } catch (err) {
            lastError = err;
            await sleep(1000 + i * 1000);
        }
    }
    throw new Error(`Unable to fetch balance for ${address}: ${lastError?.message || 'unknown'}`);
}

async function getNonce(address) {
    try {
        const res = await fetch(`https://api.mainnet.hiro.so/extended/v1/address/${address}/nonces`);
        const data = await res.json();
        return data.possible_next_nonce;
    } catch { return 0; }
}

async function getMempoolCount(address) {
    try {
        const res = await fetch(`https://api.mainnet.hiro.so/extended/v1/address/${address}/mempool?limit=1`);
        const data = await res.json();
        return data.total;
    } catch { return 0; }
}

async function broadcastTx(transaction) {
    const serializedTx = transaction.serialize();
    const response = await fetch('https://api.mainnet.hiro.so/v2/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        body: serializedTx,
    });
    if (!response.ok) throw new Error(`Failed: ${await response.text()}`);
    return (await response.text()).replace(/"/g, '');
}

async function getFunderAccount() {
    const pk = process.env.FUNDER_PK;
    if (!pk) throw new Error('FUNDER_PK not set in .env');
    const address = getAddressFromPrivateKey(pk, TransactionVersion.Mainnet);
    if (address !== FUNDING_ADDRESS) {
        throw new Error(`FUNDER_PK resolves to ${address}, expected ${FUNDING_ADDRESS}`);
    }
    return { stxPrivateKey: pk, address };
}

async function fund() {
    const opts = parseArgs();

    console.log('═══════════════════════════════════════════════════════════');
    console.log('  💰 Funding SET 3 Wallets (Buildathon)');
    console.log('═══════════════════════════════════════════════════════════\n');

    if (!existsSync(WALLETS_FILE)) {
        console.error('❌ wallets-set-3.json not found. Run generate-wallets-set-3.js first.');
        return;
    }

    const walletsData = JSON.parse(readFileSync(WALLETS_FILE, 'utf-8'));
    const { stxPrivateKey: funderPrivateKey, address: funderAddress } = await getFunderAccount();
    let nonce = await getNonce(funderAddress);

    let targetWallets = walletsData.wallets
        .filter((w) => {
            if (w.index < opts.start) return false;
            if (opts.end && w.index > opts.end) return false;
            if (!opts.includeAll && w.fund_txid) return false; // skip already-funded unless --all
            return true;
        })
        .sort((a, b) => a.index - b.index);

    if (targetWallets.length === 0) {
        console.log('✅ No wallets to fund for current filter. Use --all to re-fund.');
        return;
    }

    const funderBalance = await getBalance(funderAddress);
    const perWalletTotal = opts.amount + opts.txFee;
    const maxAffordable = Math.floor(funderBalance / perWalletTotal);

    console.log(`  Funder:            ${funderAddress}`);
    console.log(`  Funder balance:    ${(funderBalance / 1_000_000).toFixed(6)} STX`);
    console.log(`  Amount per wallet: ${(opts.amount / 1_000_000).toFixed(6)} STX  (${opts.amount} uSTX)`);
    console.log(`  TX fee per send:   ${(opts.txFee / 1_000_000).toFixed(6)} STX  (${opts.txFee} uSTX)`);
    console.log(`  Total per wallet:  ${(perWalletTotal / 1_000_000).toFixed(6)} STX`);
    console.log(`  Wallets targeted:  ${targetWallets.length}`);
    console.log(`  Max affordable:    ${maxAffordable}`);
    console.log(`  Est. total cost:   ${((targetWallets.length * perWalletTotal) / 1_000_000).toFixed(4)} STX\n`);

    if (maxAffordable <= 0) {
        console.log('❌ Funder balance is too low for even one transfer.');
        return;
    }

    if (targetWallets.length > maxAffordable) {
        console.log(
            `⚠️  Balance can only cover ${maxAffordable}/${targetWallets.length} wallets. Truncating.\n`
        );
        targetWallets = targetWallets.slice(0, maxAffordable);
    }

    if (opts.dryRun) {
        console.log('🏃 DRY RUN — no transactions sent.\n');
        targetWallets.forEach((w) => {
            console.log(
                `  would fund #${w.index} ${w.address} with ${(opts.amount / 1_000_000).toFixed(6)} STX`
            );
        });
        return;
    }

    let success = 0;
    let failed = 0;
    let stopEarly = false;

    for (let i = 0; i < targetWallets.length; i += opts.batchSize) {
        // Throttle if mempool is deep
        let pending = await getMempoolCount(funderAddress);
        while (pending > 20) {
            console.log(`  ⏳ Mempool too full (${pending} pending). Waiting 60s...`);
            await sleep(60000);
            pending = await getMempoolCount(funderAddress);
        }

        const batch = targetWallets.slice(i, i + opts.batchSize);
        const batchNum = Math.floor(i / opts.batchSize) + 1;
        const totalBatches = Math.ceil(targetWallets.length / opts.batchSize);
        console.log(`  ── Batch ${batchNum}/${totalBatches} (${batch.length} wallets) ──`);

        for (const wallet of batch) {
            let funded = false;
            let attempt = 0;

            while (!funded && attempt < MAX_RETRIES_PER_WALLET) {
                attempt++;
                try {
                    const txOptions = {
                        recipient: wallet.address,
                        amount: BigInt(opts.amount),
                        senderKey: funderPrivateKey,
                        network,
                        anchorMode: AnchorMode.Any,
                        fee: BigInt(opts.txFee),
                        nonce: BigInt(nonce),
                    };

                    const transaction = await makeSTXTokenTransfer(txOptions);
                    const txid = await broadcastTx(transaction);
                    console.log(
                        `    ✅ #${wallet.index} funded — txid: ${txid.slice(0, 16)}... (attempt ${attempt})`
                    );

                    wallet.funded = true;
                    wallet.fund_txid = wallet.fund_txid || txid;
                    wallet.last_topup_txid = txid;
                    wallet.last_topup_amount = opts.amount;
                    nonce++;
                    success++;
                    funded = true;
                    await sleep(DELAY_BETWEEN_TX);
                } catch (err) {
                    const msg = String(err?.message || err);
                    console.log(
                        `    ❌ #${wallet.index} attempt ${attempt}/${MAX_RETRIES_PER_WALLET} — ${msg.slice(0, 180)}`
                    );

                    if (msg.includes('Per-minute rate limit exceeded') || msg.includes('429')) {
                        const waitMs = Math.min(60000, 10000 * attempt);
                        console.log(`    ⏳ Rate limited. Waiting ${Math.round(waitMs / 1000)}s...`);
                        await sleep(waitMs);
                        continue;
                    }

                    if (
                        msg.includes('nonce')
                        || msg.includes('ConflictingNonceInMempool')
                        || msg.includes('BadNonce')
                    ) {
                        nonce = await getNonce(funderAddress);
                        console.log(`    🔄 Nonce refreshed → ${nonce}`);
                        await sleep(4000);
                        continue;
                    }

                    if (msg.includes('NotEnoughFunds')) {
                        stopEarly = true;
                        break;
                    }

                    await sleep(5000);
                }
            }

            if (!funded) {
                failed++;
                wallet.last_topup_error = `failed_after_${MAX_RETRIES_PER_WALLET}_attempts`;
            }

            if (stopEarly) break;
        }

        writeFileSync(WALLETS_FILE, JSON.stringify(walletsData, null, 2));

        if (stopEarly) {
            console.log('\n⚠️  Stopping early — funder wallet ran out of funds.');
            break;
        }

        if (i + opts.batchSize < targetWallets.length) {
            console.log(`  ⏳ Batch done. Waiting ${DELAY_BETWEEN_BATCHES / 1000}s before next batch...\n`);
            await sleep(DELAY_BETWEEN_BATCHES);
        }
    }

    console.log();
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  📊 Funding Summary — SET 3 (Buildathon)');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`  ✅ Successful:  ${success}`);
    console.log(`  ❌ Failed:      ${failed}`);
    console.log(`  💾 Saved:       ${WALLETS_FILE}`);
    console.log('═══════════════════════════════════════════════════════════');
    console.log();
    console.log('  Next step: node tools/interact-set-3.js mint');
}

fund().catch(console.error);

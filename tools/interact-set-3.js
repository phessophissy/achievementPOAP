/**
 * interact-set-3.js
 * Mint / status / reconcile script for the THIRD SET of 200 wallets.
 * Targets the Buildathon POAP event (event ID 17) by default.
 *
 * Usage:
 *   node tools/interact-set-3.js status
 *   node tools/interact-set-3.js mint
 *   node tools/interact-set-3.js mint --event 17 --batch 10 --dry-run
 *   node tools/interact-set-3.js mint --start 1 --end 50
 *   node tools/interact-set-3.js reconcile
 */

import {
    makeContractCall,
    AnchorMode,
    PostConditionMode,
    TransactionVersion,
    uintCV,
    stringAsciiCV,
    principalCV,
    callReadOnlyFunction,
    Cl,
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
const WALLETS_FILE = join(PROJECT_ROOT, 'wallets-set-3.json');

const DEPLOYER_ADDRESS = process.env.DEPLOYER_ADDRESS;
const CONTRACT_NAME = process.env.CONTRACT_NAME || 'achievement-poap';

const DEFAULT_EVENT_ID = 19; // Buildathon event (open-ended block range 1-9999999)
const DEFAULT_BATCH_SIZE = 10;
const DEFAULT_TX_FEE = 2500;
const DELAY_BETWEEN_TX = 1500;
const DELAY_BETWEEN_BATCHES = 20000;
const MINT_FEE = 25000; // 0.025 STX
const TX_STATUS_POLL_MS = 5000;
const TX_STATUS_TIMEOUT_MS = 180000;

const network = new StacksMainnet();

function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }

function parseArgs() {
    const args = process.argv.slice(2);
    const command = args[0];
    const opts = {
        command,
        eventId: DEFAULT_EVENT_ID,
        batchSize: DEFAULT_BATCH_SIZE,
        walletIndex: null,
        start: 1,
        end: null,
        dryRun: false,
        fee: DEFAULT_TX_FEE,
    };

    for (let i = 1; i < args.length; i++) {
        switch (args[i]) {
            case '--event':    opts.eventId     = parseInt(args[++i]); break;
            case '--batch':    opts.batchSize   = parseInt(args[++i]); break;
            case '--wallet':   opts.walletIndex = parseInt(args[++i]); break;
            case '--start':    opts.start       = parseInt(args[++i]); break;
            case '--end':      opts.end         = parseInt(args[++i]); break;
            case '--dry-run':  opts.dryRun      = true;               break;
            case '--fee':      opts.fee         = parseInt(args[++i]); break;
        }
    }
    return opts;
}

function loadWallets() {
    if (!existsSync(WALLETS_FILE)) {
        console.error('❌ wallets-set-3.json not found. Run generate-wallets-set-3.js first.');
        process.exit(1);
    }
    return JSON.parse(readFileSync(WALLETS_FILE, 'utf-8'));
}

function saveWallets(data) {
    writeFileSync(WALLETS_FILE, JSON.stringify(data, null, 2));
}

function hasMintedLocally(wallet, eventId) {
    const key = String(eventId);
    return !!(wallet.minted_by_event && wallet.minted_by_event[key] === true);
}

function setMintedLocally(wallet, eventId, minted) {
    if (!wallet.minted_by_event || typeof wallet.minted_by_event !== 'object') {
        wallet.minted_by_event = {};
    }
    wallet.minted_by_event[String(eventId)] = minted;
}

async function broadcastTx(transaction) {
    const serializedTx = transaction.serialize();
    const response = await fetch('https://api.mainnet.hiro.so/v2/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        body: serializedTx,
    });
    const responseText = await response.text();
    if (!response.ok) throw new Error(`Broadcast failed: ${responseText}`);
    return responseText.replace(/"/g, '');
}

async function getNonce(address) {
    try {
        const res = await fetch(`https://api.mainnet.hiro.so/extended/v1/address/${address}/nonces`);
        const data = await res.json();
        return data.possible_next_nonce;
    } catch { return 0; }
}

async function getBalance(address) {
    try {
        const res = await fetch(`https://api.mainnet.hiro.so/extended/v1/address/${address}/balances`);
        const data = await res.json();
        return parseInt(data.stx?.balance || '0', 10);
    } catch { return 0; }
}

async function getTxInfo(txid) {
    const res = await fetch(`https://api.mainnet.hiro.so/extended/v1/tx/${txid}`);
    if (!res.ok) return null;
    return res.json();
}

function isFinalTxStatus(status) {
    return status === 'success'
        || status.startsWith('abort')
        || status.startsWith('dropped');
}

async function waitForTxFinalStatus(txid, timeoutMs = TX_STATUS_TIMEOUT_MS) {
    const startedAt = Date.now();
    while (Date.now() - startedAt < timeoutMs) {
        const tx = await getTxInfo(txid);
        if (tx && isFinalTxStatus(tx.tx_status)) return tx;
        await sleep(TX_STATUS_POLL_MS);
    }
    return null;
}

async function hasMintedOnChain(eventId, userAddress) {
    let lastErr = null;
    for (let attempt = 0; attempt < 8; attempt++) {
        try {
            const cv = await callReadOnlyFunction({
                contractAddress: DEPLOYER_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: 'has-minted-event',
                functionArgs: [uintCV(eventId), principalCV(userAddress)],
                senderAddress: DEPLOYER_ADDRESS,
                network,
            });
            return Cl.prettyPrint(cv) === 'true';
        } catch (err) {
            lastErr = err;
            if (!String(err.message || '').includes('429')) throw err;
            await sleep(1000 + attempt * 500);
        }
    }
    throw lastErr || new Error('Unable to verify mint status');
}

// ─── Commands ────────────────────────────────────────────────────────────────

async function cmdStatus() {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  📊 Wallet Status — SET 3 (Buildathon)');
    console.log('═══════════════════════════════════════════════════════════\n');

    const walletsData = loadWallets();
    const total = walletsData.wallets.length;
    const funded = walletsData.wallets.filter((w) => w.funded).length;
    const minted = walletsData.wallets.filter((w) =>
        Object.values(w.minted_by_event || {}).includes(true)
    ).length;

    console.log(`  Set Label:      ${walletsData.label}`);
    console.log(`  Total wallets:  ${total}`);
    console.log(`  Funded:         ${funded}/${total}`);
    console.log(`  Minted (any):   ${minted}/${total}`);
    console.log();

    console.log('  Idx  | Address                                  | Funded | Minted');
    console.log('  ─────┼──────────────────────────────────────────┼────────┼───────');
    walletsData.wallets.slice(0, 50).forEach((w) => {
        const f = w.funded ? '  ✅  ' : '  ⭕  ';
        const m = Object.values(w.minted_by_event || {}).includes(true) ? '  ✅  ' : '  ⭕  ';
        console.log(`  ${String(w.index).padStart(3)}  | ${w.address} | ${f} | ${m}`);
    });
    if (total > 50) console.log(`  ... and ${total - 50} more.`);
    console.log();
}

async function cmdMint(opts) {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  ⛏️  Minting for SET 3 — Buildathon');
    console.log('═══════════════════════════════════════════════════════════\n');

    if (!DEPLOYER_ADDRESS) {
        console.error('❌ DEPLOYER_ADDRESS not set in .env');
        process.exit(1);
    }

    const walletsData = loadWallets();
    let targetWallets = walletsData.wallets.filter((w) => {
        if (opts.walletIndex !== null) return w.index === opts.walletIndex;
        if (w.index < opts.start) return false;
        if (opts.end && w.index > opts.end) return false;
        if (hasMintedLocally(w, opts.eventId)) return false;
        return true;
    });

    if (targetWallets.length === 0) {
        console.log('  ✅ All target wallets have already minted!');
        return;
    }

    console.log(`  Event ID:       ${opts.eventId} (Buildathon)`);
    console.log(`  Target wallets: ${targetWallets.length}`);
    console.log(`  Batch size:     ${opts.batchSize}`);
    console.log(`  Mint fee:       ${MINT_FEE} microSTX (0.025 STX)`);
    console.log(`  TX fee:         ${opts.fee} microSTX`);
    console.log(`  Total/wallet:   ${MINT_FEE + opts.fee} microSTX (${((MINT_FEE + opts.fee) / 1_000_000).toFixed(6)} STX)`);
    console.log();

    if (opts.dryRun) {
        console.log('  🏃 DRY RUN — No transactions will be sent\n');
        targetWallets.forEach((w) => {
            console.log(`    would mint #${w.index} ${w.address}`);
        });
        return;
    }

    for (let i = 0; i < targetWallets.length; i += opts.batchSize) {
        const batch = targetWallets.slice(i, i + opts.batchSize);
        console.log(`  ── Batch ${Math.floor(i / opts.batchSize) + 1}/${Math.ceil(targetWallets.length / opts.batchSize)} ──`);

        for (const wallet of batch) {
            try {
                const w = await generateWallet({ secretKey: wallet.mnemonic, password: '' });
                const account = w.accounts[0];
                const balance = await getBalance(wallet.address);
                const required = MINT_FEE + opts.fee;

                if (balance < required) {
                    console.log(`    ❌ #${wallet.index} ${wallet.address} — insufficient balance (${balance} < ${required})`);
                    const walletInFile = walletsData.wallets.find((v) => v.index === wallet.index);
                    if (walletInFile) {
                        setMintedLocally(walletInFile, opts.eventId, false);
                        walletInFile.mint_error = `insufficient_balance:${balance}`;
                    }
                    continue;
                }

                const nonce = await getNonce(wallet.address);

                const txOptions = {
                    contractAddress: DEPLOYER_ADDRESS,
                    contractName: CONTRACT_NAME,
                    functionName: 'mint-poap',
                    functionArgs: [uintCV(opts.eventId)],
                    senderKey: account.stxPrivateKey,
                    network,
                    anchorMode: AnchorMode.Any,
                    postConditionMode: PostConditionMode.Allow,
                    fee: BigInt(opts.fee),
                    nonce: BigInt(nonce),
                };

                const transaction = await makeContractCall(txOptions);
                const txid = await broadcastTx(transaction);
                console.log(`    📤 #${wallet.index} ${wallet.address} — txid: ${txid.slice(0, 16)}...`);

                const tx = await waitForTxFinalStatus(txid);
                const walletInFile = walletsData.wallets.find((v) => v.index === wallet.index);

                if (walletInFile) {
                    walletInFile.mint_txid = txid;
                    if (tx?.tx_status === 'success') {
                        setMintedLocally(walletInFile, opts.eventId, true);
                        walletInFile.mint_error = null;
                        console.log(`    ✅ #${wallet.index} confirmed`);
                    } else {
                        const txErr = `${tx?.tx_status || 'pending'} ${tx?.tx_result?.repr || ''}`.trim();
                        const alreadyMinted = txErr.includes('(err u101)');
                        setMintedLocally(walletInFile, opts.eventId, alreadyMinted);
                        walletInFile.mint_error = alreadyMinted ? null : txErr;
                        if (alreadyMinted) console.log(`    ✅ #${wallet.index} already minted on-chain`);
                        else console.log(`    ❌ #${wallet.index} failed: ${walletInFile.mint_error}`);
                    }
                }

                await sleep(DELAY_BETWEEN_TX);
            } catch (err) {
                console.log(`    ❌ #${wallet.index} — ${String(err.message).slice(0, 80)}`);
            }
        }

        saveWallets(walletsData);
        if (i + opts.batchSize < targetWallets.length) await sleep(DELAY_BETWEEN_BATCHES);
    }

    const total = walletsData.wallets.length;
    const mintedCount = walletsData.wallets.filter((w) => hasMintedLocally(w, opts.eventId)).length;
    const failedCount = walletsData.wallets.filter((w) => w.mint_error && w.mint_error.length > 0).length;

    console.log();
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  📊 Mint Summary — SET 3 (Buildathon)');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`  ✅ Minted:   ${mintedCount}/${total}`);
    console.log(`  ❌ Failed:   ${failedCount}`);
    console.log(`  💾 Saved:    ${WALLETS_FILE}`);
    console.log('═══════════════════════════════════════════════════════════');
}

async function cmdReconcile(opts) {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  🔍 Reconciling wallet mint status from chain (SET 3)');
    console.log('═══════════════════════════════════════════════════════════\n');

    const walletsData = loadWallets();
    let updated = 0;
    let minted = 0;
    let notMinted = 0;

    for (const wallet of walletsData.wallets) {
        try {
            const nextMinted = await hasMintedOnChain(opts.eventId, wallet.address);
            const currentMinted = hasMintedLocally(wallet, opts.eventId);
            if (currentMinted !== nextMinted) {
                setMintedLocally(wallet, opts.eventId, nextMinted);
                if (nextMinted) wallet.mint_error = null;
                updated++;
            }
            if (nextMinted) minted++;
            else notMinted++;
            await sleep(250);
        } catch (err) {
            console.log(`  ⚠️  #${wallet.index} check failed: ${err.message.slice(0, 60)}`);
        }
    }

    saveWallets(walletsData);
    console.log(`  Updated:             ${updated}`);
    console.log(`  Minted on-chain:     ${minted}`);
    console.log(`  Not minted on-chain: ${notMinted}`);
    console.log();
}

async function main() {
    const opts = parseArgs();
    switch (opts.command) {
        case 'status':     return cmdStatus();
        case 'mint':       return cmdMint(opts);
        case 'reconcile':  return cmdReconcile(opts);
        default:
            console.log('Usage: node tools/interact-set-3.js <command> [options]');
            console.log();
            console.log('Commands:');
            console.log('  status                         Show wallet funding/mint status');
            console.log('  mint                           Mint Buildathon POAP for all wallets');
            console.log('  reconcile                      Sync local state from chain');
            console.log();
            console.log('Options:');
            console.log('  --event <id>       Event ID to mint (default: 17)');
            console.log('  --batch <n>        Batch size (default: 10)');
            console.log('  --start <n>        Start from wallet index');
            console.log('  --end <n>          Stop at wallet index');
            console.log('  --wallet <n>       Only mint for a single wallet');
            console.log('  --fee <amount>     TX fee in microSTX (default: 2500)');
            console.log('  --dry-run          Preview without sending transactions');
    }
}

main().catch(console.error);

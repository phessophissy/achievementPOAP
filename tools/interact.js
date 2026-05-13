/**
 * interact.js
 * Interaction script for the Achievement POAP contract on Stacks mainnet.
 * 
 * Commands:
 *   node tools/interact.js create-event       — Create a new POAP event
 *   node tools/interact.js mint               — Mint POAPs for all wallets
 *   node tools/interact.js mint --wallet 5    — Mint for a specific wallet
 *   node tools/interact.js mint --start 1 --end 50  — Mint for wallet range
 *   node tools/interact.js transfer           — Transfer POAPs between wallets
 *   node tools/interact.js status             — Check minting status of all wallets
 *   node tools/interact.js info               — Show contract info & event details
 *   node tools/interact.js balance            — Check STX balances of all wallets
 *   node tools/interact.js pause              — Pause the contract (admin)
 *   node tools/interact.js unpause            — Unpause the contract (admin)
 *   node tools/interact.js deactivate-event   — Deactivate an event (admin)
 * 
 * Options:
 *   --event <id>       Event ID to interact with (default: 14)
 *   --batch <size>     Batch size for bulk operations (default: 25)
 *   --dry-run          Preview actions without sending transactions
 *   --fee <amount>     Custom tx fee in microSTX (default: 2500)
 */

import {
    makeContractCall,
    AnchorMode,
    PostConditionMode,
    TransactionVersion,
    getAddressFromPrivateKey,
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
const WALLETS_FILE = join(PROJECT_ROOT, 'wallets.json');

const DEPLOYER_ADDRESS =
    process.env.DEPLOYER_ADDRESS || 'SP1QPNQB6R3EFMTQYGHG9J7N03S3K52ARSE1VEVX4';
const CONTRACT_NAME = process.env.CONTRACT_NAME || 'achievement-poap';
const CONTRACT_ID = `${DEPLOYER_ADDRESS}.${CONTRACT_NAME}`;

const DEFAULT_BATCH_SIZE = 25;
const DEFAULT_TX_FEE = 2500;
const DELAY_BETWEEN_TX = 1500;
const DELAY_BETWEEN_BATCHES = 30000;
const MINT_FEE = 25000; // 0.025 STX in microSTX

const network = new StacksMainnet();

// ─── Helpers ─────────────────────────────────────────────────────────────────

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseArgs() {
    const args = process.argv.slice(2);
    const command = args[0];
    const opts = {
        command,
        eventId: 14,
        batchSize: DEFAULT_BATCH_SIZE,
        walletIndex: null,
        start: 1,
        end: null,
        dryRun: false,
        fee: DEFAULT_TX_FEE,
        // create-event params
        eventName: '',
        eventDescription: '',
        maxSupply: 100,
        startBlock: 0,
        endBlock: 0,
        metadataUri: '',
        // transfer params
        recipient: '',
        tokenId: null,
    };

    for (let i = 1; i < args.length; i++) {
        switch (args[i]) {
            case '--event':
                opts.eventId = parseInt(args[++i]);
                break;
            case '--batch':
                opts.batchSize = parseInt(args[++i]);
                break;
            case '--wallet':
                opts.walletIndex = parseInt(args[++i]);
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
            case '--fee':
                opts.fee = parseInt(args[++i]);
                break;
            case '--name':
                opts.eventName = args[++i];
                break;
            case '--description':
                opts.eventDescription = args[++i];
                break;
            case '--max-supply':
                opts.maxSupply = parseInt(args[++i]);
                break;
            case '--start-block':
                opts.startBlock = parseInt(args[++i]);
                break;
            case '--end-block':
                opts.endBlock = parseInt(args[++i]);
                break;
            case '--uri':
                opts.metadataUri = args[++i];
                break;
            case '--recipient':
                opts.recipient = args[++i];
                break;
            case '--token-id':
                opts.tokenId = parseInt(args[++i]);
                break;
        }
    }
    return opts;
}

function loadWallets() {
    if (!existsSync(WALLETS_FILE)) {
        console.error('❌ wallets.json not found. Run generate-wallets.js first.');
        process.exit(1);
    }
    return JSON.parse(readFileSync(WALLETS_FILE, 'utf-8'));
}

function saveWallets(data) {
    writeFileSync(WALLETS_FILE, JSON.stringify(data, null, 2));
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

async function callReadOnly(functionName, functionArgs = [], senderAddress = DEPLOYER_ADDRESS) {
    try {
        const result = await callReadOnlyFunction({
            contractAddress: DEPLOYER_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName,
            functionArgs,
            senderAddress,
            network,
        });
        return result;
    } catch (err) {
        throw new Error(`Read-only call '${functionName}' failed: ${err.message}`);
    }
}

async function getDeployerAccount() {
    const mnemonic = process.env.DEPLOYER_MNEMONIC;
    if (mnemonic) {
        const wallet = await generateWallet({ secretKey: mnemonic, password: '' });
        const account = wallet.accounts[0];
        const address = getStxAddress({
            account,
            transactionVersion: TransactionVersion.Mainnet,
        });
        return { account, address };
    }

    const privateKey = process.env.DEPLOYER_PK;
    if (privateKey) {
        const address = getAddressFromPrivateKey(privateKey, TransactionVersion.Mainnet);
        return {
            account: { stxPrivateKey: privateKey },
            address,
        };
    }

    throw new Error('Set DEPLOYER_MNEMONIC or DEPLOYER_PK in .env');
}

async function getCurrentBlockHeight() {
    try {
        const res = await fetch('https://api.mainnet.hiro.so/v2/info');
        const data = await res.json();
        // In Nakamoto Stacks, Clarity's block-height keyword returns burn_block_height
        // (not stacks_tip_height which counts fast blocks).
        return data.burn_block_height;
    } catch {
        return 0;
    }
}

// ─── Commands ────────────────────────────────────────────────────────────────

async function cmdInfo(opts) {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  📋 Contract Info');
    console.log('═══════════════════════════════════════════════════════════\n');

    console.log(`  Contract:     ${CONTRACT_ID}`);

    const blockHeight = await getCurrentBlockHeight();
    console.log(`  Block Height: ${blockHeight}`);

    try {
        const lastTokenIdCV = await callReadOnly('get-last-token-id');
        console.log(`  Total Minted: ${Cl.prettyPrint(lastTokenIdCV)}`);
    } catch (e) {
        console.log(`  Total Minted: Unable to fetch (${e.message})`);
    }

    try {
        const mintFeeCV = await callReadOnly('get-mint-fee');
        const feeVal = Cl.unwrap(mintFeeCV);
        console.log(`  Mint Fee:     ${(Number(feeVal) / 1_000_000).toFixed(6)} STX`);
    } catch (e) {
        console.log(`  Mint Fee:     0.025 STX (default)`);
    }

    try {
        const pausedCV = await callReadOnly('is-contract-paused');
        console.log(`  Paused:       ${Cl.prettyPrint(pausedCV)}`);
    } catch (e) {
        console.log(`  Paused:       Unable to fetch`);
    }

    // Check specific event
    try {
        const eventCV = await callReadOnly('get-event', [Cl.uint(opts.eventId)]);
        if (eventCV && eventCV.type !== 10) { // 10 is ResponseErr, 9 is OptionalNone
            console.log(`\n  ── Event #${opts.eventId} ──`);
            console.log(`  Details:      ${Cl.prettyPrint(eventCV)}`);
        } else {
            console.log(`\n  Event #${opts.eventId}: Not found or not active`);
        }
    } catch (e) {
        console.log(`  Event #${opts.eventId}: Error fetching (${e.message})`);
    }

    console.log();
}

async function cmdCreateEvent(opts) {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  🎉 Create POAP Event');
    console.log('═══════════════════════════════════════════════════════════\n');

    const { account: deployerAccount, address: deployerAddr } =
        await getDeployerAccount();

    const blockHeight = await getCurrentBlockHeight();

    // Defaults if not provided
    const eventName = opts.eventName || 'Achievement POAP Event';
    const eventDesc = opts.eventDescription || 'Achievement Proof of Attendance Protocol NFT';
    const maxSupply = opts.maxSupply || 200;
    const startBlock = opts.startBlock || blockHeight;
    const endBlock = opts.endBlock || blockHeight + 50000; // ~2 weeks
    const metadataUri =
        opts.metadataUri ||
        `https://achievementpoap.xyz/api/metadata/event-1`;

    console.log(`  Creator:      ${deployerAddr}`);
    console.log(`  Name:         ${eventName}`);
    console.log(`  Description:  ${eventDesc.slice(0, 60)}...`);
    console.log(`  Max Supply:   ${maxSupply}`);
    console.log(`  Block Range:  ${startBlock} — ${endBlock}`);
    console.log(`  Metadata URI: ${metadataUri}`);
    console.log();

    if (opts.dryRun) {
        console.log('  🏃 DRY RUN — No transaction sent');
        return;
    }

    const nonce = await getNonce(deployerAddr);

    const txOptions = {
        contractAddress: DEPLOYER_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'create-event',
        functionArgs: [
            stringAsciiCV(eventName),
            stringAsciiCV(eventDesc),
            uintCV(maxSupply),
            uintCV(startBlock),
            uintCV(endBlock),
            stringAsciiCV(metadataUri),
        ],
        senderKey: deployerAccount.stxPrivateKey,
        network,
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Deny,
        fee: BigInt(opts.fee),
        nonce: BigInt(nonce),
    };

    const transaction = await makeContractCall(txOptions);
    const txid = await broadcastTx(transaction);

    console.log(`  ✅ Event created!`);
    console.log(`  📝 TX: ${txid}`);
    console.log(`  🔗 https://explorer.stacks.co/txid/${txid}?chain=mainnet`);
    console.log();
}

async function cmdMint(opts) {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  ⛏️  Mint POAPs');
    console.log('═══════════════════════════════════════════════════════════\n');

    const walletsData = loadWallets();

    // Filter target wallets
    let targetWallets = walletsData.wallets.filter((w) => {
        if (opts.walletIndex !== null) return w.index === opts.walletIndex;
        if (w.index < opts.start) return false;
        if (opts.end && w.index > opts.end) return false;
        // Only skip if wallet is already marked minted for this specific event.
        if (w.minted && w.mint_event_id === opts.eventId) return false;
        return true;
    });

    if (targetWallets.length === 0) {
        console.log('  ✅ All wallets in range have already minted!');
        return;
    }

    console.log(`  Contract:    ${CONTRACT_ID}`);
    console.log(`  Event ID:    ${opts.eventId}`);
    console.log(`  Wallets:     ${targetWallets.length}`);
    console.log(`  Mint Fee:    ${(MINT_FEE / 1_000_000).toFixed(6)} STX per wallet`);
    console.log(`  TX Fee:      ${(opts.fee / 1_000_000).toFixed(6)} STX per wallet`);
    console.log(
        `  Total Cost:  ${((targetWallets.length * (MINT_FEE + opts.fee)) / 1_000_000).toFixed(6)} STX`
    );
    console.log();

    if (opts.dryRun) {
        console.log('  🏃 DRY RUN — No transactions will be sent\n');
        targetWallets.forEach((w) => {
            console.log(`    Would mint for #${String(w.index).padStart(3)} ${w.address}`);
        });
        return;
    }

    let successCount = 0;
    let failCount = 0;

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
                // Generate wallet account from mnemonic
                const w = await generateWallet({
                    secretKey: wallet.mnemonic,
                    password: '',
                });
                const account = w.accounts[0];

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

                console.log(
                    `    ✅ #${String(wallet.index).padStart(3)} ${wallet.address} — txid: ${txid.slice(0, 16)}...`
                );

                // Update wallet status
                const walletInFile = walletsData.wallets.find(
                    (w) => w.index === wallet.index
                );
                if (walletInFile) {
                    walletInFile.minted = true;
                    walletInFile.mint_txid = txid;
                    walletInFile.mint_event_id = opts.eventId;
                }

                successCount++;
                await sleep(DELAY_BETWEEN_TX);
            } catch (err) {
                console.log(
                    `    ❌ #${String(wallet.index).padStart(3)} ${wallet.address} — ${err.message.slice(0, 80)}`
                );
                failCount++;
            }
        }

        // Save progress after each batch
        saveWallets(walletsData);
        console.log(`  💾 Progress saved.\n`);

        if (batchIdx < batches.length - 1) {
            console.log(
                `  ⏳ Waiting ${DELAY_BETWEEN_BATCHES / 1000}s before next batch...\n`
            );
            await sleep(DELAY_BETWEEN_BATCHES);
        }
    }

    // Summary
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  📊 Mint Summary');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`  ✅ Successful:  ${successCount}`);
    console.log(`  ❌ Failed:      ${failCount}`);
    console.log('═══════════════════════════════════════════════════════════\n');
}

async function cmdStatus(opts) {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  📊 Wallet Minting Status');
    console.log('═══════════════════════════════════════════════════════════\n');

    const walletsData = loadWallets();
    const total = walletsData.wallets.length;
    const funded = walletsData.wallets.filter((w) => w.funded).length;
    const minted = walletsData.wallets.filter((w) => w.minted).length;

    console.log(`  Total wallets:    ${total}`);
    console.log(`  Funded:           ${funded}/${total}`);
    console.log(`  Minted:           ${minted}/${total}`);
    console.log(`  Pending fund:     ${total - funded}`);
    console.log(`  Pending mint:     ${funded - minted}`);
    console.log();

    // Table
    console.log('  Idx  | Address                                  | Funded | Minted');
    console.log('  ─────┼──────────────────────────────────────────┼────────┼───────');
    walletsData.wallets.forEach((w) => {
        const f = w.funded ? '  ✅  ' : '  ⭕  ';
        const m = w.minted ? '  ✅  ' : '  ⭕  ';
        console.log(
            `  ${String(w.index).padStart(3)}  | ${w.address} | ${f} | ${m}`
        );
    });
    console.log();
}

async function cmdBalance(opts) {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  💰 Wallet Balances');
    console.log('═══════════════════════════════════════════════════════════\n');

    const walletsData = loadWallets();

    let targetWallets = walletsData.wallets.filter((w) => {
        if (opts.walletIndex !== null) return w.index === opts.walletIndex;
        if (w.index < opts.start) return false;
        if (opts.end && w.index > opts.end) return false;
        return true;
    });

    let totalBalance = 0;

    for (const w of targetWallets) {
        const bal = await getBalance(w.address);
        totalBalance += bal;
        const status = bal > 0 ? '✅' : '⭕';
        console.log(
            `  ${status} #${String(w.index).padStart(3)} ${w.address} — ${(bal / 1_000_000).toFixed(6)} STX`
        );
        await sleep(200); // Rate limiting
    }

    console.log(
        `\n  Total Balance: ${(totalBalance / 1_000_000).toFixed(6)} STX across ${targetWallets.length} wallets\n`
    );
}

async function cmdTransfer(opts) {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  🔄 Transfer POAP');
    console.log('═══════════════════════════════════════════════════════════\n');

    if (!opts.walletIndex || !opts.recipient || opts.tokenId === null) {
        console.log('  Usage: node tools/interact.js transfer --wallet <idx> --token-id <id> --recipient <address>');
        console.log('  Example: node tools/interact.js transfer --wallet 1 --token-id 5 --recipient SP2...');
        return;
    }

    const walletsData = loadWallets();
    const wallet = walletsData.wallets.find((w) => w.index === opts.walletIndex);

    if (!wallet) {
        console.error(`  ❌ Wallet #${opts.walletIndex} not found`);
        return;
    }

    console.log(`  From:     #${wallet.index} ${wallet.address}`);
    console.log(`  To:       ${opts.recipient}`);
    console.log(`  Token ID: ${opts.tokenId}`);
    console.log();

    if (opts.dryRun) {
        console.log('  🏃 DRY RUN — No transaction sent');
        return;
    }

    const w = await generateWallet({ secretKey: wallet.mnemonic, password: '' });
    const account = w.accounts[0];
    const nonce = await getNonce(wallet.address);

    const txOptions = {
        contractAddress: DEPLOYER_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'transfer',
        functionArgs: [
            uintCV(opts.tokenId),
            principalCV(wallet.address),
            principalCV(opts.recipient),
        ],
        senderKey: account.stxPrivateKey,
        network,
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Deny,
        fee: BigInt(opts.fee),
        nonce: BigInt(nonce),
    };

    const transaction = await makeContractCall(txOptions);
    const txid = await broadcastTx(transaction);

    console.log(`  ✅ Transfer successful!`);
    console.log(`  📝 TX: ${txid}`);
    console.log(`  🔗 https://explorer.stacks.co/txid/${txid}?chain=mainnet`);
    console.log();
}

async function cmdPause(opts) {
    console.log('  ⏸️  Pausing contract...\n');

    const { account: deployerAccount, address: deployerAddr } = await getDeployerAccount();
    const nonce = await getNonce(deployerAddr);

    if (opts.dryRun) {
        console.log('  🏃 DRY RUN — Would pause contract');
        return;
    }

    const txOptions = {
        contractAddress: DEPLOYER_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'pause-contract',
        functionArgs: [],
        senderKey: deployerAccount.stxPrivateKey,
        network,
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Deny,
        fee: BigInt(opts.fee),
        nonce: BigInt(nonce),
    };

    const transaction = await makeContractCall(txOptions);
    const txid = await broadcastTx(transaction);
    console.log(`  ✅ Contract paused! TX: ${txid}`);
}

async function cmdUnpause(opts) {
    console.log('  ▶️  Unpausing contract...\n');

    const { account: deployerAccount, address: deployerAddr } = await getDeployerAccount();
    const nonce = await getNonce(deployerAddr);

    if (opts.dryRun) {
        console.log('  🏃 DRY RUN — Would unpause contract');
        return;
    }

    const txOptions = {
        contractAddress: DEPLOYER_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'unpause-contract',
        functionArgs: [],
        senderKey: deployerAccount.stxPrivateKey,
        network,
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Deny,
        fee: BigInt(opts.fee),
        nonce: BigInt(nonce),
    };

    const transaction = await makeContractCall(txOptions);
    const txid = await broadcastTx(transaction);
    console.log(`  ✅ Contract unpaused! TX: ${txid}`);
}

async function cmdDeactivateEvent(opts) {
    console.log(`  🚫 Deactivating event #${opts.eventId}...\n`);

    const { account: deployerAccount, address: deployerAddr } = await getDeployerAccount();
    const nonce = await getNonce(deployerAddr);

    if (opts.dryRun) {
        console.log('  🏃 DRY RUN — Would deactivate event');
        return;
    }

    const txOptions = {
        contractAddress: DEPLOYER_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'deactivate-event',
        functionArgs: [uintCV(opts.eventId)],
        senderKey: deployerAccount.stxPrivateKey,
        network,
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Deny,
        fee: BigInt(opts.fee),
        nonce: BigInt(nonce),
    };

    const transaction = await makeContractCall(txOptions);
    const txid = await broadcastTx(transaction);
    console.log(`  ✅ Event #${opts.eventId} deactivated! TX: ${txid}`);
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
    const opts = parseArgs();

    if (!opts.command) {
        console.log('═══════════════════════════════════════════════════════════');
        console.log('  🏆 Achievement POAP — Interaction CLI');
        console.log('═══════════════════════════════════════════════════════════\n');
        console.log('  Commands:');
        console.log('    info               Show contract & event info');
        console.log('    create-event       Create a new POAP event');
        console.log('    mint               Mint POAPs for wallets');
        console.log('    transfer           Transfer a POAP');
        console.log('    status             Check minting status');
        console.log('    balance            Check wallet balances');
        console.log('    pause              Pause contract (admin)');
        console.log('    unpause            Unpause contract (admin)');
        console.log('    deactivate-event   Deactivate an event (admin)');
        console.log('\n  Options:');
        console.log('    --event <id>       Event ID (default: 14)');
        console.log('    --wallet <idx>     Specific wallet index');
        console.log('    --start <idx>      Start from wallet index');
        console.log('    --end <idx>        End at wallet index');
        console.log('    --batch <size>     Batch size (default: 25)');
        console.log('    --dry-run          Preview without sending tx');
        console.log('    --fee <amount>     TX fee in microSTX (default: 2500)');
        console.log('\n  Examples:');
        console.log('    node tools/interact.js info --event 1');
        console.log('    node tools/interact.js create-event --name "My Event" --uri "https://..."');
        console.log('    node tools/interact.js mint --event 1 --start 1 --end 50');
        console.log('    node tools/interact.js mint --event 1 --wallet 5');
        console.log('    node tools/interact.js transfer --wallet 1 --token-id 5 --recipient SP2...');
        console.log();
        return;
    }

    switch (opts.command) {
        case 'info':
            await cmdInfo(opts);
            break;
        case 'create-event':
            await cmdCreateEvent(opts);
            break;
        case 'mint':
            await cmdMint(opts);
            break;
        case 'status':
            await cmdStatus(opts);
            break;
        case 'balance':
            await cmdBalance(opts);
            break;
        case 'transfer':
            await cmdTransfer(opts);
            break;
        case 'pause':
            await cmdPause(opts);
            break;
        case 'unpause':
            await cmdUnpause(opts);
            break;
        case 'deactivate-event':
            await cmdDeactivateEvent(opts);
            break;
        default:
            console.error(`  ❌ Unknown command: ${opts.command}`);
            console.log('  Run without arguments to see available commands.');
            process.exit(1);
    }
}

main().catch((err) => {
    console.error('❌ Fatal error:', err.message);
    process.exit(1);
});

// add error handling and edge cases for deployment-runbook — ref:docs/deployment-runbook#5 (1776635184278)

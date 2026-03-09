import { callReadOnlyFunction, Cl } from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';
import { execSync } from 'child_process';

const network = new StacksMainnet();
const CONTRACT_ADDRESS = 'SP2KYZRNME33Y39GP3RKC90DQJ45EF1N0NZNVRE09';
const CONTRACT_NAME = 'achievement-poap';

async function findEventByName(name) {
    console.log(`[${new Date().toLocaleTimeString()}] Scanning for event: "${name}"...`);
    // Scan IDs 1-20
    for (let i = 1; i <= 20; i++) {
        try {
            const res = await callReadOnlyFunction({
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: 'get-event',
                functionArgs: [Cl.uint(i)],
                senderAddress: CONTRACT_ADDRESS,
                network,
            });

            if (res.type !== 9 && res.type !== 10) { // Not None and not Error
                const eventData = Cl.unwrap(res);
                const eventName = Cl.unwrap(eventData.name).toString();

                if (eventName.toLowerCase().includes(name.toLowerCase())) {
                    return { id: i, name: eventName };
                }
            }
        } catch (e) {
            // Move to next ID
        }
    }
    return null;
}

async function monitor() {
    const targetName = "race award";
    let found = null;

    while (!found) {
        found = await findEventByName(targetName);
        if (!found) {
            console.log(`   ...not found yet. Waiting 60 seconds.`);
            await new Promise(r => setTimeout(r, 60000));
        }
    }

    console.log(`\n🚀 SUCCESS! Found Event #${found.id}: "${found.name}"`);
    console.log(`Starting minting for 100 wallets...\n`);

    try {
        // Execute the minting command for all wallets
        // We use --batch 10 to stay within safe mempool limits on mainnet
        const command = `node tools/interact.js mint --event ${found.id} --batch 10`;
        console.log(`Executing: ${command}`);

        // Note: This will block and run through the batches
        execSync(command, { stdio: 'inherit' });

        console.log(`\n✅ ALL MINTING COMPLETED!`);
    } catch (err) {
        console.error(`❌ Minting command failed: ${err.message}`);
    }
}

monitor().catch(console.error);

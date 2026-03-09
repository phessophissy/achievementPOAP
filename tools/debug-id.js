import { callReadOnlyFunction, Cl } from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';

const network = new StacksMainnet();

async function checkTokenId(id) {
    try {
        const result = await callReadOnlyFunction({
            contractAddress: 'SP2KYZRNME33Y39GP3RKC90DQJ45EF1N0NZNVRE09',
            contractName: 'achievement-poap',
            functionName: 'get-token-metadata',
            functionArgs: [Cl.uint(id)],
            senderAddress: 'SP2KYZRNME33Y39GP3RKC90DQJ45EF1N0NZNVRE09',
            network,
        });
        console.log(`Metadata for Token #${id}:`, Cl.prettyPrint(result));
    } catch (err) {
        console.error(`Error: ${err.message}`);
    }
}

checkTokenId(1);
checkTokenId(100);

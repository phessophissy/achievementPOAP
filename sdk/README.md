# Achievement POAP SDK

A professional, lightweight JavaScript/TypeScript SDK for interacting with the **Achievement POAP** smart contract on Stacks (Bitcoin's Layer 2).

This SDK provides utility classes to effortlessly fetch POAP events from the blockchain and build standardized transaction objects for minting, transferring, and creating events, which can be broadcasted via `@stacks/transactions` or used with Stacks wallets.

## Installation

```bash
npm install achievement-poap @stacks/transactions @stacks/network
```

## Initialization

Import and initialize the `AchievementPOAP` class. By default, it points to the official mainnet smart contract.

```javascript
import { AchievementPOAP } from 'achievement-poap';
import { StacksMainnet, StacksTestnet } from '@stacks/network';

// 1. Default setup (Points automatically to the official Mainnet contract)
const poap = new AchievementPOAP();

// 2. Custom setup (e.g. Testnet or a custom contract deployment)
const customPoap = new AchievementPOAP({
    contractAddress: '<TESTNET_STX_ADDRESS>',
    contractName: 'achievement-poap',
    network: new StacksTestnet()
});
```

## Usage

### 1. Fetching Event Information

Fetch on-chain metadata for a specific POAP event ID.

```javascript
import { cvToJSON } from '@stacks/transactions';

async function checkEvent() {
    // Get raw Clarity value
    const eventCV = await poap.getEvent(1);
    
    // Convert to readable JSON
    console.log(cvToJSON(eventCV));
}
```

### 2. Getting the Global Mint Fee

The minting fee is configured globally on the contract.

```javascript
import { cvToValue } from '@stacks/transactions';

async function checkFee() {
    const feeCV = await poap.getMintFee();
    console.log(`Current Mint Fee: ${cvToValue(feeCV)} microSTX`);
}
```

### 3. Minting a POAP

Build a transaction payload to mint an NFT for a specific event. This outputs a standard `makeContractCall` transaction object.

```javascript
import { broadcastTransaction } from '@stacks/transactions';

async function mint() {
    const senderKey = 'YOUR_PRIVATE_KEY_HERE';
    const eventId = 1;

    // Generate the unsigned or strictly signed transaction payload
    const transaction = await poap.buildMintTransaction(eventId, senderKey);

    // Broadcast to the network
    const txid = await broadcastTransaction(transaction, poap.network);
    console.log(`Mint TX successfully broadcasted! TXID: ${txid}`);
}
```

### 4. Transferring a POAP

Build a transaction to transfer an owned POAP to another Principal address.

```javascript
async function transferToken() {
    const senderKey = 'YOUR_PRIVATE_KEY_HERE';
    
    const transaction = await poap.buildTransferTransaction(
        5, // Token ID
        '<SENDER_STX_ADDRESS>', // Sender Stacks Address
        '<RECIPIENT_STX_ADDRESS>', // Recipient Stacks Address
        senderKey
    );

    const txid = await broadcastTransaction(transaction, poap.network);
    console.log(`Transfer TXID: ${txid}`);
}
```

### 5. Creating a POAP Event (Admin Only)

If you are the deployer of the contract, you can create new POAP events using the SDK.

```javascript
async function deployEvent() {
    const adminKey = 'ADMIN_PRIVATE_KEY';
    
    const eventDetails = {
        name: "My Awesome Hackathon",
        description: "Awarded to participants of the 2026 Hackathon",
        maxSupply: 1000,
        startBlock: 120000, // Stacks block height
        endBlock: 140000,
        metadataUri: "ipfs://QmYourHashHere"
    };

    const transaction = await poap.buildCreateEventTransaction(eventDetails, adminKey);
    const txid = await broadcastTransaction(transaction, poap.network);
}
```

## Dependencies
- peer dependencies: `@stacks/transactions`, `@stacks/network`

## License

MIT License

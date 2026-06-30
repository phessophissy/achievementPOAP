# SDK Reference

The `achievement-poap` SDK (`sdk/index.js`) wraps the on-chain `achievement-poap`
Clarity contract. It provides read-only lookups (no signing required) and unsigned
transaction builders that you sign and broadcast yourself or via a wallet.

## Initialization

```js
import { AchievementPOAP } from 'achievement-poap';
import { StacksTestnet } from '@stacks/network';

// Defaults: mainnet + the deployed contract address
const poap = new AchievementPOAP();

// Override the network (e.g. testnet)
const poapTestnet = new AchievementPOAP({ network: new StacksTestnet() });

// Override the contract address/name (e.g. your own deployment)
const poapCustom = new AchievementPOAP({
  contractAddress: 'SPXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  contractName: 'achievement-poap',
});
```

### Constructor options

| Option             | Type     | Default                  | Description                              |
|--------------------|----------|--------------------------|------------------------------------------|
| `contractAddress`  | string   | deployed mainnet address | Stacks address that deployed the contract|
| `contractName`     | string   | `achievement-poap`       | Name of the contract                     |
| `network`          | object   | `StacksMainnet`          | `@stacks/network` instance               |

## Read-only methods

Read methods call the contract's read-only functions via the Stacks API. They do
**not** require a signer and do not change chain state. Each returns a Clarity
value (`cv`); errors are wrapped in a descriptive `Error`.

### `getEvent(eventId)`

Fetch the full event record (name, description, supply, block window, etc.).

```js
const event = await poap.getEvent(1);
// event → Clarity optional tuple
```

### `getMintFee()`

Return the configured mint fee in microSTX.

```js
const fee = await poap.getMintFee();
// fee → (ok u25000)  // 0.025 STX
```

### `getOwner(tokenId)`

SIP-009 ownership lookup for a token id.

```js
const owner = await poap.getOwner(1);
// owner → (ok (some 'SP...')) or (ok none)
```

### `getTokenUri(tokenId)`

Resolve a token id to its owning event's `metadata-uri`.

```js
const uri = await poap.getTokenUri(1);
// uri → (ok (some "ipfs://...")) or (ok none)
```

### `hasMintedEvent(eventId, user)`

Check whether a wallet has already minted a POAP for an event. Useful for gating
UI before building a mint transaction.

```js
const claimed = await poap.hasMintedEvent(1, 'SP2KYZRNME33Y39GP3RKC90DQJ45EF1N0NZNVRE09');
// claimed → (ok true) or (ok false)
```

### `getEventSupply(eventId)`

Read the current and max mint counts for an event.

```js
const supply = await poap.getEventSupply(1);
// supply → (ok { current: u5, max: u100 })
```

### `getUserTokens(user)`

List the token ids owned by a wallet (up to 100, per the contract cap).

```js
const tokens = await poap.getUserTokens('SP2KYZRNME33Y39GP3RKC90DQJ45EF1N0NZNVRE09');
// tokens → (ok (list u1 u3 u7))
```

### `isContractPaused()`

Check whether the contract is currently paused (minting is blocked when paused).

```js
const paused = await poap.isContractPaused();
// paused → (ok false)
```

## Transaction builders

Transaction builders return a **signed** Stacks transaction object (via
`makeContractCall`). They do **not** broadcast — you broadcast the serialized
transaction yourself or hand it to a wallet.

All builders accept an optional `fee` (in microSTX, default `2500`) and `nonce`.
Pass a `senderKey` (private key hex) to sign.

### `buildMintTransaction(eventId, senderKey, fee?, nonce?)`

Build a `mint-poap` transaction. The sender must pay the contract mint fee
(0.025 STX) in addition to the transaction fee.

```js
const tx = await poap.buildMintTransaction(1, senderKey);
// Broadcast `tx.serialize()` to the Stacks API.
```

### `buildTransferTransaction(tokenId, senderAddress, recipientAddress, senderKey, fee?, nonce?)`

Build a SIP-009 `transfer` transaction to move a POAP between wallets. The
`senderAddress` must own the token and match the `senderKey`.

```js
const tx = await poap.buildTransferTransaction(
  1,
  'SP2KYZRNME33Y39GP3RKC90DQJ45EF1N0NZNVRE09', // sender
  'ST2KYZRNME33Y39GP3RKC90DQJ45EF1N0NZNVRE09', // recipient
  senderKey,
);
```

### `buildCreateEventTransaction(eventOptions, senderKey, fee?, nonce?)`

Build a `create-event` transaction (admin). `eventOptions` is an object:

| Field          | Type   | Description                          |
|----------------|--------|--------------------------------------|
| `name`         | string | Event name (max 64 ASCII chars)      |
| `description`  | string | Event description (max 256 ASCII)    |
| `maxSupply`    | number | Maximum mintable POAPs               |
| `startBlock`   | number | Start block of the mint window       |
| `endBlock`     | number | End block of the mint window         |
| `metadataUri`  | string | IPFS/HTTPS metadata URI              |

```js
const tx = await poap.buildCreateEventTransaction(
  {
    name: 'Stacks Summit 2026',
    description: 'Attendance POAP for the Stacks Summit builder track.',
    maxSupply: 1000,
    startBlock: 180000,
    endBlock: 200000,
    metadataUri: 'ipfs://QmExample/metadata.json',
  },
  senderKey,
);
```

## Broadcasting a transaction

The SDK intentionally stops at building + signing. To broadcast, POST the
serialized transaction to a Stacks API endpoint:

```js
const response = await fetch('https://api.mainnet.hiro.so/v2/transactions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/octet-stream' },
  body: tx.serialize(),
});
const txid = (await response.text()).replace(/"/g, '');
console.log('Broadcast txid:', txid);
console.log(`https://explorer.stacks.co/txid/${txid}?chain=mainnet`);
```

## Error handling

All read methods wrap lower-level failures in a descriptive `Error`. Catch and
handle them at the call site:

```js
try {
  const event = await poap.getEvent(999);
} catch (err) {
  console.error(err.message); // "Failed to fetch event #999: ..."
}
```

Common failure reasons:

- **Network / API errors** — the Stacks API was unreachable or returned a non-200.
- **Invalid arguments** — e.g. a non-numeric `eventId` or malformed principal.
- **Contract revert on read** — rare for read-only functions, but possible if a
  precondition inside the function is not met.



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

# achievementPOAP

A POAP (Proof of Attendance Protocol) NFT minting platform built on Stacks, Bitcoin's Layer 2 smart contract network.

## Overview

achievementPOAP enables event organizers to create achievement-based NFTs that can be claimed by participants. Each POAP serves as a verifiable on-chain proof of attendance or achievement.

## Features

- **Event Creation**: Create custom POAP events with configurable parameters
- **Time-Bound Minting**: Set start and end blocks for minting windows
- **Supply Limits**: Define maximum supply per event
- **Unique Claims**: One POAP per wallet per event
- **On-chain Metadata**: Full metadata stored on Stacks blockchain
- **Low Minting Fee**: Only 0.025 STX per mint

## Contract Architecture

### Core Functions

#### Event Management
- `create-event`: Create a new POAP event
- `deactivate-event`: Deactivate an existing event

#### Minting
- `mint-poap`: Mint a POAP for a specific event (costs 0.025 STX)

#### Transfers
- `transfer`: Transfer a POAP to another address

#### Read Functions
- `get-event`: Get event details
- `get-token-metadata`: Get token metadata
- `get-user-tokens`: Get all tokens owned by a user
- `has-minted-event`: Check if user has minted from an event
- `get-event-supply`: Get current and max supply for an event

### Error Codes

| Code | Description |
|------|-------------|
| u100 | Not authorized |
| u101 | Already minted this event |
| u102 | Event not found |
| u103 | Event expired |
| u104 | Insufficient funds |
| u105 | Mint failed |
| u106 | Event not active |
| u107 | Invalid URI |

## Getting Started

### Prerequisites

- [Clarinet](https://github.com/hirosystems/clarinet) installed
- Node.js v18+
- STX tokens for deployment and testing

### Installation

```bash
npm install
npm run audit:sensitive
```

### Testing

```bash
clarinet test
```

### Deployment

1. Configure your deployment settings in `settings/Devnet.toml`
2. Run deployment:

```bash
clarinet deployments apply -p deployments/default.devnet-plan.yaml
```

## Usage Examples

### Create an Event

```clarity
(contract-call? .achievement-poap create-event 
    "Stacks Hackathon 2024"
    "Participated in the Stacks Global Hackathon"
    u1000
    u100000
    u200000
    "ipfs://QmXxx.../metadata.json"
)
```

### Mint a POAP

```clarity
(contract-call? .achievement-poap mint-poap u1)
```

### Check Ownership

```clarity
(contract-call? .achievement-poap get-user-tokens 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM)
```

## Integration

The contract follows the SIP-009 NFT standard and can be integrated with:
- Stacks wallets (Hiro Wallet, Xverse)
- NFT marketplaces
- Event platforms
- Achievement systems

## SDK

A JavaScript SDK is published from `sdk/index.js` and exposes the `AchievementPOAP`
class for both read-only lookups and unsigned transaction building.

### Installation

```bash
npm install achievement-poap
```

### Quick start

```js
import { AchievementPOAP } from 'achievement-poap';

const poap = new AchievementPOAP(); // defaults to mainnet + deployed contract

// Read event details and mint fee
const event = await poap.getEvent(1);
const fee = await poap.getMintFee();

// Check whether a wallet already claimed
const claimed = await poap.hasMintedEvent(1, 'SP2KYZRNME33Y39GP3RKC90DQJ45EF1N0NZNVRE09');
```

### Building a mint transaction

The SDK builds (but does not broadcast) signed transactions. Pass a sender key and
broadcast the resulting transaction yourself, or hand it to a wallet for signing.

```js
const tx = await poap.buildMintTransaction(1, senderKey, 2500);
// tx is a signed Stacks transaction — broadcast via the Stacks API or a wallet.
```

See [docs/sdk-reference.md](docs/sdk-reference.md) for the full method reference
and more examples.

## API Reference

### Data Structures

#### Event
```clarity
{
    name: (string-ascii 64),
    description: (string-ascii 256),
    creator: principal,
    max-supply: uint,
    current-supply: uint,
    start-block: uint,
    end-block: uint,
    metadata-uri: (string-ascii 256),
    active: bool
}
```

#### Token Metadata
```clarity
{
    event-id: uint,
    minted-at: uint,
    minter: principal
}
```

## Configuration

| Parameter | Value |
|-----------|-------|
| Minting Fee | 0.025 STX |
| Max Tokens Per User | 100 |
| Contract Name | achievement-poap |

## License

MIT License

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Security Notes

- Use `.env.example` as a placeholder template only.
- Keep wallet exports and local snapshots out of git.
- Run `npm run audit:sensitive` before opening a PR.
- See [SECURITY.md](SECURITY.md) and [docs/security/sensitive-files.md](docs/security/sensitive-files.md) for the full policy.
- See [docs/sdk-reference.md](docs/sdk-reference.md) for the complete SDK method reference and examples.

<!-- Maintenance update 536 -->

<!-- Maintenance update 139 -->

<!-- Maintenance update 178 -->

<!-- Maintenance update 918 -->

<!-- Maintenance update 430 -->

<!-- Maintenance update 386 -->

<!-- Maintenance update 208 -->

<!-- Maintenance update 143 -->

<!-- Maintenance update 258 -->

<!-- Maintenance update 201 -->

<!-- Maintenance update 188 -->

<!-- Maintenance update 377 -->

<!-- PR-1: a11y progress -->

<!-- add core logic for deployment-runbook — ref:docs/deployment-runbook#1 (1776635184233) -->

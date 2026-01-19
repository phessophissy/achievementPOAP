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

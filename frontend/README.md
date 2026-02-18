# Achievement POAP Frontend

A modern React-based frontend for the Achievement POAP (Proof of Attendance Protocol) application built on the Stacks blockchain.

## 🏆 Features

- **Wallet Integration**: Connect with Hiro Wallet to interact with the blockchain
- **Event Browsing**: View all available POAP events
- **POAP Minting**: Mint POAPs for events you've attended
- **My POAPs**: View your collected POAPs
- **Event Creation**: Create new POAP events (organizers)
- **Gallery**: Browse all minted POAPs
- **Real-time Updates**: Live countdown timers and mint progress

## 🛠️ Tech Stack

- **React 18** - UI Library
- **Vite** - Build Tool
- **React Router v6** - Client-side Routing
- **@stacks/connect** - Wallet Connection
- **@stacks/transactions** - Smart Contract Interactions
- **@stacks/network** - Stacks Network Configuration

## 📁 Project Structure

```
frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Countdown/
│   │   ├── Event/
│   │   ├── Layout/
│   │   ├── POAP/
│   │   ├── Stats/
│   │   ├── UI/
│   │   └── Wallet/
│   ├── config/
│   │   └── constants.js
│   ├── context/
│   │   ├── ToastContext.jsx
│   │   └── WalletContext.jsx
│   ├── hooks/
│   │   └── useContract.js
│   ├── pages/
│   │   ├── About.jsx
│   │   ├── CreateEvent.jsx
│   │   ├── EventDetail.jsx
│   │   ├── Events.jsx
│   │   ├── Gallery.jsx
│   │   ├── Home.jsx
│   │   ├── MyPOAPs.jsx
│   │   └── NotFound.jsx
│   ├── services/
│   │   └── contractService.js
│   ├── styles/
│   │   └── index.css
│   ├── utils/
│   │   └── helpers.js
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Hiro Wallet browser extension

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🧪 Testing

Run the current smoke suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Legacy assertions that no longer match current component contracts were moved to `src/tests/*.legacy.test.*` and are intentionally excluded from CI until they are rewritten.

## 🔧 Configuration

The contract configuration is in `src/config/constants.js`:

```javascript
export const CONTRACT_ADDRESS = 'SP2KYZRNME33Y39GP3RKC90DQJ45EF1N0NZNVRE09';
export const CONTRACT_NAME = 'achievement-poap';
export const NETWORK_TYPE = 'mainnet';
export const MINT_FEE = 25000; // 0.025 STX
```

## 📱 Pages

| Route | Description |
|-------|-------------|
| `/` | Home page with featured events |
| `/events` | Browse all POAP events |
| `/events/:id` | Event details and minting |
| `/my-poaps` | View your collected POAPs |
| `/create` | Create a new event |
| `/gallery` | Browse all minted POAPs |
| `/about` | About the project |

## 🎨 Design System

The frontend uses a custom gold-themed design system with CSS variables:

- **Primary Colors**: Gold gradient (#FFD700 → #D4AF37)
- **Background**: Dark theme (#0a0a0a)
- **Typography**: Inter font family
- **Border Radius**: 4px - 16px scale
- **Animations**: Smooth transitions (150ms - 350ms)

## 🔌 Smart Contract Integration

The frontend interacts with the `achievement-poap` Clarity smart contract:

### Read Functions
- `get-event-count` - Get total number of events
- `get-event` - Get event details
- `has-minted` - Check if user has minted
- `get-last-token-id` - Get total supply

### Write Functions
- `mint-poap` - Mint a POAP for an event
- `create-event` - Create a new event
- `transfer` - Transfer a POAP to another address

## 📦 Component Library

### UI Components
- Button, Card, Modal
- Input, Textarea
- Badge, ProgressBar
- LoadingSpinner, Toast

### Feature Components
- EventCard, EventGrid
- POAPCard
- Countdown
- WalletConnect
- StatCard

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- [Stacks Documentation](https://docs.stacks.co/)
- [Hiro Wallet](https://wallet.hiro.so/)
- [Stacks Explorer](https://explorer.stacks.co/)

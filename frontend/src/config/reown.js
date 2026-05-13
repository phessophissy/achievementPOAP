/**
 * REOWN AppKit Configuration
 * Uses Bitcoin adapter — supports Leather, Xverse, OKX, Phantom
 * These wallets also support Stacks. @stacks/connect is used for all
 * Clarity contract interactions, signing, and STX transfers.
 */
import { createAppKit } from '@reown/appkit/react';
import { BitcoinAdapter } from '@reown/appkit-adapter-bitcoin';
import { bitcoin } from '@reown/appkit/networks';

// Get from https://dashboard.reown.com — add VITE_REOWN_PROJECT_ID to .env.local
const projectId = import.meta.env.VITE_REOWN_PROJECT_ID || '3a8170812b534d0ff9d794f19a901d64';

const bitcoinAdapter = new BitcoinAdapter({ projectId });

const metadata = {
  name: 'Achievement POAP',
  description: 'Proof of Achievement Protocol — collect verifiable on-chain milestones on Stacks, Bitcoin L2.',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://achievementpoap.xyz',
  icons: ['https://achievementpoap.xyz/favicon.svg'],
};

createAppKit({
  adapters: [bitcoinAdapter],
  networks: [bitcoin],
  projectId,
  metadata,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#FF5500',
    '--w3m-color-mix': '#FF5500',
    '--w3m-color-mix-strength': 20,
    '--w3m-border-radius-master': '12px',
    '--w3m-font-family': 'Inter, sans-serif',
  },
  features: {
    analytics: false,
    swaps: false,
    onramp: false,
  },
});

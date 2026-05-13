/**
 * WalletContext — bridges REOWN AppKit (wallet modal / WalletConnect)
 * with @stacks/connect (Stacks contract calls, signing, minting).
 */
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { APP_NAME, APP_ICON, STACKS_API_URL } from '../config/constants';

const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });

export const STACKS_WALLETS = [
  {
    id: 'leather', name: 'Leather', subtitle: 'Bitcoin + Stacks',
    fallbackIcon: '🟠',
    installed: () => typeof window !== 'undefined' && !!(window.LeatherProvider || window.HiroWalletProvider),
    downloadUrl: 'https://leather.io/install-extension',
  },
  {
    id: 'xverse', name: 'Xverse', subtitle: 'Bitcoin + Stacks',
    fallbackIcon: '✦',
    installed: () => typeof window !== 'undefined' && !!(window.XverseProviders?.StacksProvider || window.StacksProvider),
    downloadUrl: 'https://www.xverse.app/download',
  },
  {
    id: 'asigna', name: 'Asigna', subtitle: 'Multi-sig Stacks',
    fallbackIcon: '🔐',
    installed: () => typeof window !== 'undefined' && !!window.AsignaProvider,
    downloadUrl: 'https://asigna.io',
  },
  {
    id: 'okx', name: 'OKX Wallet', subtitle: 'Web3 · Stacks',
    fallbackIcon: '⬛',
    installed: () => typeof window !== 'undefined' && !!window.okxwallet?.stacks,
    downloadUrl: 'https://www.okx.com/web3',
  },
];

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const { open: openReown } = useAppKit();
  const { address: reownAddress, isConnected: reownConnected } = useAppKitAccount();

  const [walletAddress, setWalletAddress] = useState(null);
  const [userData, setUserData] = useState(null);
  const [balance, setBalance] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [activeWallet, setActiveWallet] = useState(null);
  const [showWalletModal, setShowWalletModal] = useState(false);

  useEffect(() => {
    try {
      if (userSession.isUserSignedIn()) {
        const data = userSession.loadUserData();
        const address = data.profile.stxAddress.mainnet;
        setWalletAddress(address);
        setUserData(data);
        setActiveWallet(localStorage.getItem('stacks_active_wallet') || 'leather');
        _fetchBalance(address);
      } else if (userSession.isSignInPending()) {
        userSession.handlePendingSignIn()
          .then((data) => {
            const address = data.profile.stxAddress.mainnet;
            setWalletAddress(address);
            setUserData(data);
            _fetchBalance(address);
          })
          .catch(console.error);
      }
    } catch (err) {
      console.error('Session restore error:', err);
    }
  }, []);

  const _fetchBalance = async (address) => {
    try {
      const res = await fetch(`${STACKS_API_URL}/extended/v1/address/${address}/balances`);
      const data = await res.json();
      setBalance(parseInt(data.stx?.balance || 0) / 1_000_000);
    } catch { /* non-critical */ }
  };

  const connectWithWallet = useCallback(async (walletId) => {
    setIsConnecting(true);
    setShowWalletModal(false);
    try {
      await new Promise((resolve, reject) => {
        showConnect({
          appDetails: { name: APP_NAME, icon: window.location.origin + APP_ICON },
          userSession,
          onFinish: () => {
            if (userSession.isUserSignedIn()) {
              const data = userSession.loadUserData();
              const address = data.profile.stxAddress.mainnet;
              setWalletAddress(address);
              setUserData(data);
              setActiveWallet(walletId);
              localStorage.setItem('stacks_active_wallet', walletId);
              _fetchBalance(address);
            }
            resolve();
          },
          onCancel: () => reject(new Error('cancelled')),
        });
      });
    } catch (err) {
      if (err.message !== 'cancelled') console.error('Connect error:', err);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const connectViaWalletConnect = useCallback(() => {
    setShowWalletModal(false);
    openReown();
  }, [openReown]);

  const disconnect = useCallback(() => {
    userSession.signUserOut();
    setWalletAddress(null);
    setUserData(null);
    setBalance(null);
    setActiveWallet(null);
    localStorage.removeItem('stacks_active_wallet');
  }, []);

  const shortenAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const value = {
    walletAddress, userData, balance, isConnecting,
    isConnected: !!walletAddress,
    activeWallet, userSession,
    reownAddress, reownConnected,
    showWalletModal,
    wallets: STACKS_WALLETS,
    openWalletModal: () => setShowWalletModal(true),
    closeWalletModal: () => setShowWalletModal(false),
    connect: () => setShowWalletModal(true),
    connectWithWallet, connectViaWalletConnect, disconnect, shortenAddress,
    refreshBalance: () => walletAddress && _fetchBalance(walletAddress),
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within WalletProvider');
  return ctx;
}

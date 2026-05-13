/**
 * WalletContext — Stacks wallet connection for AchievementPOAP.
 *
 * Primary strategy: use each wallet's native injected provider API to get the
 * STX address directly (no popup/redirect needed).  This works immediately and
 * avoids the unreliable showConnect popup flow.
 *
 * Fallback: showConnect() from @stacks/connect for wallets without a known
 * provider API (e.g. future wallets, Asigna).
 *
 * Transaction signing still uses @stacks/connect openContractCall (imported
 * directly in each page that needs it — not here).
 */
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { APP_NAME, STACKS_API_URL } from '../config/constants';

const STX_ADDR_KEY  = 'stacks_stx_address';
const WALLET_ID_KEY = 'stacks_active_wallet';

const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });

/** Returns true for Stacks mainnet (SP…) or testnet (ST…) addresses */
const isStxAddress = (addr) => typeof addr === 'string' && /^S[PT]/.test(addr);

/** Pull an STX address out of an array of { address } objects */
const pickStx = (arr = []) =>
  arr.find((a) => isStxAddress(a?.address))?.address ?? null;

export const STACKS_WALLETS = [
  {
    id: 'leather', name: 'Leather', subtitle: 'Bitcoin + Stacks',
    fallbackIcon: '🟠',
    installed: () => typeof window !== 'undefined' &&
      !!(window.LeatherProvider || window.HiroWalletProvider),
    downloadUrl: 'https://leather.io/install-extension',
  },
  {
    id: 'xverse', name: 'Xverse', subtitle: 'Bitcoin + Stacks',
    fallbackIcon: '✦',
    installed: () => typeof window !== 'undefined' &&
      !!(window.XverseProviders?.StacksProvider || window.StacksProvider),
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
  const [userData, setUserData]           = useState(null);
  const [balance, setBalance]             = useState(null);
  const [isConnecting, setIsConnecting]   = useState(false);
  const [activeWallet, setActiveWallet]   = useState(null);
  const [showWalletModal, setShowWalletModal] = useState(false);

  /* ── restore persisted session on mount ─────────────────────────────────── */
  useEffect(() => {
    const stored       = localStorage.getItem(STX_ADDR_KEY);
    const storedWallet = localStorage.getItem(WALLET_ID_KEY);

    if (stored && isStxAddress(stored)) {
      setWalletAddress(stored);
      setActiveWallet(storedWallet);
      _fetchBalance(stored);
      return;
    }

    // fallback: userSession (showConnect redirect flow)
    try {
      if (userSession.isUserSignedIn()) {
        const data    = userSession.loadUserData();
        const address = data?.profile?.stxAddress?.mainnet;
        if (address) {
          setWalletAddress(address);
          setUserData(data);
          setActiveWallet(storedWallet || 'leather');
          localStorage.setItem(STX_ADDR_KEY, address);
          _fetchBalance(address);
        }
      } else if (userSession.isSignInPending()) {
        userSession.handlePendingSignIn()
          .then((data) => {
            const address = data?.profile?.stxAddress?.mainnet;
            if (address) {
              setWalletAddress(address);
              setUserData(data);
              localStorage.setItem(STX_ADDR_KEY, address);
              _fetchBalance(address);
            }
          })
          .catch(console.error);
      }
    } catch (err) {
      console.error('[WalletContext] session restore error:', err);
    }
  }, []);

  /* ── balance fetch ───────────────────────────────────────────────────────── */
  const _fetchBalance = async (address) => {
    try {
      const res  = await fetch(`${STACKS_API_URL}/extended/v1/address/${address}/balances`);
      const data = await res.json();
      setBalance(parseInt(data.stx?.balance ?? 0, 10) / 1_000_000);
    } catch { /* non-critical */ }
  };

  /* ── connect via native provider API (primary path) ─────────────────────── */
  const connectWithWallet = useCallback(async (walletId) => {
    setIsConnecting(true);
    setShowWalletModal(false);

    try {
      let stxAddress = null;

      /* Leather — request('getAddresses') returns all BTC + STX addresses */
      if (walletId === 'leather') {
        const provider = window.LeatherProvider || window.HiroWalletProvider;
        if (provider?.request) {
          const res = await provider.request('getAddresses');
          stxAddress = pickStx(res?.result?.addresses);
        }
      }

      /* Xverse — StacksProvider.connect() or getAddresses() */
      if (walletId === 'xverse') {
        const provider =
          window.XverseProviders?.StacksProvider || window.StacksProvider;
        if (provider) {
          // Try SIP-030 compatible method first, then legacy connect
          try {
            const res = await provider.request('stx_getAddresses', null);
            stxAddress = pickStx(res?.result?.addresses);
          } catch {
            const res = await provider.connect({
              message: `Connect to ${APP_NAME}`,
            }).catch(() => null);
            stxAddress =
              pickStx(res?.addresses) ||
              (isStxAddress(res?.address) ? res.address : null);
          }
        }
      }

      /* OKX Wallet — window.okxwallet.stacks.connect() */
      if (walletId === 'okx') {
        const stacks = window.okxwallet?.stacks;
        if (stacks?.connect) {
          const res  = await stacks.connect();
          stxAddress = isStxAddress(res?.address) ? res.address
            : isStxAddress(res?.stxAddress) ? res.stxAddress
            : pickStx(res?.addresses);
        }
      }

      /* Asigna — window.AsignaProvider.connect() */
      if (walletId === 'asigna') {
        const asigna = window.AsignaProvider;
        if (asigna?.connect) {
          const res  = await asigna.connect();
          stxAddress = isStxAddress(res?.address)    ? res.address
            : isStxAddress(res?.stxAddress) ? res.stxAddress
            : pickStx(res?.addresses);
        }
      }

      /* Universal fallback — showConnect popup/redirect */
      if (!stxAddress) {
        stxAddress = await new Promise((resolve, reject) => {
          showConnect({
            appDetails: {
              name: APP_NAME,
              icon: `${window.location.origin}/favicon.svg`,
            },
            redirectTo: window.location.pathname,
            userSession,
            onFinish: (payload) => {
              try {
                const sess = payload?.userSession ?? userSession;
                const data = sess.loadUserData?.() ?? userSession.loadUserData();
                const addr = data?.profile?.stxAddress?.mainnet;
                if (addr) resolve(addr);
                else reject(new Error('No STX address in auth response'));
              } catch (e) {
                reject(e);
              }
            },
            onCancel: () => reject(new Error('cancelled')),
          });
        });
      }

      /* Persist and update state */
      if (stxAddress) {
        setWalletAddress(stxAddress);
        setActiveWallet(walletId);
        localStorage.setItem(STX_ADDR_KEY,  stxAddress);
        localStorage.setItem(WALLET_ID_KEY, walletId);
        _fetchBalance(stxAddress);
      } else {
        console.error(`[WalletContext] ${walletId}: could not obtain STX address`);
      }
    } catch (err) {
      if (err?.message !== 'cancelled') {
        console.error(`[WalletContext] ${walletId} connect error:`, err);
      }
    } finally {
      setIsConnecting(false);
    }
  }, []);

  /* ── WalletConnect (REOWN) ────────────────────────────────────────────────── */
  const connectViaWalletConnect = useCallback(() => {
    setShowWalletModal(false);
    openReown();
  }, [openReown]);

  /* ── disconnect ──────────────────────────────────────────────────────────── */
  const disconnect = useCallback(() => {
    try { userSession.signUserOut(); } catch {}
    setWalletAddress(null);
    setUserData(null);
    setBalance(null);
    setActiveWallet(null);
    localStorage.removeItem(STX_ADDR_KEY);
    localStorage.removeItem(WALLET_ID_KEY);
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
    openWalletModal:  () => setShowWalletModal(true),
    closeWalletModal: () => setShowWalletModal(false),
    connect:           () => setShowWalletModal(true),
    connectWithWallet, connectViaWalletConnect, disconnect, shortenAddress,
    refreshBalance: () => walletAddress && _fetchBalance(walletAddress),
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within WalletProvider');
  return ctx;
}

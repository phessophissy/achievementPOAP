import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { APP_NAME, APP_ICON, STACKS_API_URL } from '../config/constants';

const WalletContext = createContext(null);

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

export function WalletProvider({ children }) {
  const [walletAddress, setWalletAddress] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [balance, setBalance] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const data = userSession.loadUserData();
      const address = data.profile.stxAddress.mainnet;
      setWalletAddress(address);
      setUserData(data);
      fetchBalance(address);
    } else if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((data) => {
        const address = data.profile.stxAddress.mainnet;
        setWalletAddress(address);
        setUserData(data);
        fetchBalance(address);
      });
    }
  }, []);

  const fetchBalance = async (address) => {
    try {
      const response = await fetch(
        STACKS_API_URL + '/extended/v1/address/' + address + '/balances'
      );
      const data = await response.json();
      const stxBalance = parseInt(data.stx?.balance || 0) / 1000000;
      setBalance(stxBalance);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    }
  };

  const connect = useCallback(async () => {
    setIsConnecting(true);
    
    try {
      await showConnect({
        appDetails: {
          name: APP_NAME,
          icon: window.location.origin + APP_ICON,
        },
        onFinish: () => {
          const data = userSession.loadUserData();
          const address = data.profile.stxAddress.mainnet;
          setWalletAddress(address);
          setUserData(data);
          fetchBalance(address);
          setIsConnecting(false);
        },
        onCancel: () => {
          setIsConnecting(false);
        },
        userSession,
      });
    } catch (error) {
      console.error('Connect error:', error);
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    userSession.signUserOut();
    setWalletAddress(null);
    setUserData(null);
    setBalance(null);
  }, []);

  const shortenAddress = (address) => {
    if (!address) return '';
    return address.slice(0, 6) + '...' + address.slice(-4);
  };

  const value = {
    walletAddress,
    userData,
    balance,
    isConnecting,
    isConnected: !!walletAddress,
    userSession,
    connect,
    disconnect,
    shortenAddress,
    fetchBalance: () => walletAddress && fetchBalance(walletAddress),
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

export { userSession };

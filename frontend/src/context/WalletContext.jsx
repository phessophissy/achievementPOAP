import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AppConfig, showConnect, disconnect as stacksDisconnect } from '@stacks/connect';
import { StacksMainnet } from '@stacks/network';
import { APP_NAME, APP_ICON, STACKS_API_URL } from '../config/constants';

const WalletContext = createContext(null);

const appConfig = new AppConfig(['store_write', 'publish_data']);

export function WalletProvider({ children }) {
  const [walletAddress, setWalletAddress] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [balance, setBalance] = useState(null);

  const network = new StacksMainnet();

  // Check for existing session on mount
  useEffect(() => {
    const savedAddress = localStorage.getItem('wallet_address');
    if (savedAddress) {
      setWalletAddress(savedAddress);
      fetchBalance(savedAddress);
    }
  }, []);

  const fetchBalance = async (address) => {
    try {
      const response = await fetch(
        `${STACKS_API_URL}/extended/v1/address/${address}/balances`
      );
      const data = await response.json();
      const stxBalance = parseInt(data.stx?.balance || 0) / 1000000;
      setBalance(stxBalance);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    }
  };

  const connect = useCallback(() => {
    setIsConnecting(true);
    
    showConnect({
      appDetails: {
        name: APP_NAME,
        icon: window.location.origin + APP_ICON,
      },
      onFinish: ({ userSession }) => {
        const userData = userSession.loadUserData();
        const address = userData.profile.stxAddress.mainnet;
        
        setWalletAddress(address);
        setUserData(userData);
        localStorage.setItem('wallet_address', address);
        fetchBalance(address);
        setIsConnecting(false);
      },
      onCancel: () => {
        setIsConnecting(false);
      },
      userSession: null,
    });
  }, []);

  const disconnect = useCallback(() => {
    setWalletAddress(null);
    setUserData(null);
    setBalance(null);
    localStorage.removeItem('wallet_address');
  }, []);

  const shortenAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const value = {
    walletAddress,
    userData,
    balance,
    isConnecting,
    isConnected: !!walletAddress,
    network,
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

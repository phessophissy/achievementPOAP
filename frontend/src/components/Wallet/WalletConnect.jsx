import React from 'react';
import { useWallet } from '../../context/WalletContext';
import Button from '../UI/Button';
import './WalletConnect.css';

const WalletConnect = ({ showBalance = false }) => {
  const { 
    isConnected, 
    walletAddress, 
    balance, 
    isConnecting, 
    connect, 
    disconnect,
    shortenAddress 
  } = useWallet();

  if (isConnecting) {
    return (
      <Button variant="primary" size="medium" disabled>
        <span className="loading-spinner"></span>
        Connecting...
      </Button>
    );
  }

  if (isConnected && walletAddress) {
    return (
      <div className="wallet-connected">
        {showBalance && balance !== null && (
          <span className="wallet-balance">{balance.toFixed(2)} STX</span>
        )}
        <div className="wallet-dropdown">
          <button className="wallet-address-btn">
            <span className="wallet-indicator" />
            <span className="wallet-address">{shortenAddress(walletAddress)}</span>
            <span className="dropdown-arrow">▼</span>
          </button>
          <div className="wallet-dropdown-menu">
            <div className="dropdown-address">
              <span className="dropdown-label">Connected</span>
              <span className="dropdown-value">{shortenAddress(walletAddress)}</span>
            </div>
            <hr className="dropdown-divider" />
            <button 
              className="dropdown-item" 
              onClick={() => navigator.clipboard.writeText(walletAddress)}
            >
              📋 Copy Address
            </button>
            <a
              href={'https://explorer.stacks.co/address/' + walletAddress + '?chain=mainnet'}
              target="_blank"
              rel="noopener noreferrer"
              className="dropdown-item"
            >
              🔗 View in Explorer
            </a>
            <hr className="dropdown-divider" />
            <button className="dropdown-item disconnect" onClick={disconnect}>
              🚪 Disconnect
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Button variant="primary" size="medium" onClick={connect}>
      Connect Wallet
    </Button>
  );
};

export default WalletConnect;

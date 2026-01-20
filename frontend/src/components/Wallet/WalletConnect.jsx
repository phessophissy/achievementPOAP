import React from 'react';
import { useWallet } from '../../context/WalletContext';
import Button from '../UI/Button';
import { formatAddress } from '../../utils/helpers';
import './WalletConnect.css';

const WalletConnect = ({ showBalance = false }) => {
  const { isConnected, address, balance, connecting, connect, disconnect } = useWallet();

  if (connecting) {
    return (
      <Button variant="primary" size="medium" disabled>
        Connecting...
      </Button>
    );
  }

  if (isConnected) {
    return (
      <div className="wallet-connected">
        {showBalance && balance && (
          <span className="wallet-balance">{balance} STX</span>
        )}
        <div className="wallet-dropdown">
          <button className="wallet-address-btn">
            <span className="wallet-indicator" />
            <span className="wallet-address">{formatAddress(address)}</span>
            <span className="dropdown-arrow">▼</span>
          </button>
          <div className="wallet-dropdown-menu">
            <div className="dropdown-address">
              <span className="dropdown-label">Connected</span>
              <span className="dropdown-value">{formatAddress(address, 8, 6)}</span>
            </div>
            <hr className="dropdown-divider" />
            <button className="dropdown-item" onClick={() => navigator.clipboard.writeText(address)}>
              📋 Copy Address
            </button>
            <a 
              href={`https://explorer.stacks.co/address/${address}?chain=mainnet`}
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

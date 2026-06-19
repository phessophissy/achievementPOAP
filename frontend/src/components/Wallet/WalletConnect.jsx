import React, { useState } from 'react';
import { useWallet } from '../../context/WalletContext';
import WalletModal from './WalletModal';
import './WalletConnect.css';

export default function WalletConnect({ showBalance = true }) {
  const {
    isConnected, walletAddress, balance, isConnecting,
    connect, disconnect, shortenAddress, showWalletModal, closeWalletModal,
  } = useWallet();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  if (isConnecting) {
    return (
      <button className="wallet-btn connecting" disabled aria-busy="true">
        <span className="wallet-btn-spinner" />
        Connecting…
      </button>
    );
  }

  if (isConnected && walletAddress) {
    return (
      <>
        <div className="wallet-connected" onMouseLeave={() => setDropdownOpen(false)}>
          {showBalance && balance !== null && (
            <div className="balance-pill">
              <span className="balance-dot" />
              <span>{balance.toFixed(2)}</span>
              <span className="balance-unit">STX</span>
            </div>
          )}
          <div className="wallet-dropdown-wrap">
            <button className="wallet-addr-btn" onClick={() => setDropdownOpen(!dropdownOpen)} aria-expanded={dropdownOpen} aria-haspopup="menu">
              <span className="wallet-indicator" />
              <span>{shortenAddress(walletAddress)}</span>
              <svg className={`caret ${dropdownOpen ? 'open' : ''}`} viewBox="0 0 10 6" fill="none" width="10" height="6">
                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            {dropdownOpen && (
              <div className="wallet-dropdown-menu">
                <div className="dropdown-header">
                  <span className="dropdown-label">Connected</span>
                  <span className="dropdown-addr">{shortenAddress(walletAddress)}</span>
                </div>
                <div className="dropdown-divider" />
                <button className="dropdown-item" onClick={copyAddress}>
                  <span>{copied ? '✅' : '📋'}</span>
                  {copied ? 'Copied!' : 'Copy Address'}
                </button>
                <a
                  href={`https://explorer.stacks.co/address/${walletAddress}?chain=mainnet`}
                  target="_blank" rel="noopener noreferrer"
                  className="dropdown-item"
                  onClick={() => setDropdownOpen(false)}
                >
                  <span>🔗</span>View in Explorer
                </a>
                <div className="dropdown-divider" />
                <button className="dropdown-item danger" onClick={() => { disconnect(); setDropdownOpen(false); }}>
                  <span>⏏</span>Disconnect
                </button>
              </div>
            )}
          </div>
        </div>
        <WalletModal open={showWalletModal} onClose={closeWalletModal} />
      </>
    );
  }

  return (
    <>
      <button className="wallet-btn primary" onClick={connect}>
        <svg viewBox="0 0 24 24" fill="none" width="15" height="15">
          <rect x="2" y="6" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M16 13.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" fill="currentColor"/>
          <path d="M2 10h20" stroke="currentColor" strokeWidth="2"/>
        </svg>
        Connect Wallet
      </button>
      <WalletModal open={showWalletModal} onClose={closeWalletModal} />
    </>
  );
}

import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { useToast } from '../context/ToastContext';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { formatAddress, copyToClipboard } from '../utils/helpers';
import { CONTRACT_ADDRESS, CONTRACT_NAME, NETWORK_TYPE, MINT_FEE } from '../config/constants';
import './Settings.css';

const Settings = () => {
  const { isConnected, address, disconnect } = useWallet();
  const { showToast } = useToast();
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState(true);

  const handleCopyAddress = async () => {
    const success = await copyToClipboard(address);
    if (success) {
      showToast('Address copied to clipboard!', 'success');
    }
  };

  const handleCopyContract = async () => {
    const success = await copyToClipboard(`${CONTRACT_ADDRESS}.${CONTRACT_NAME}`);
    if (success) {
      showToast('Contract address copied!', 'success');
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1 className="settings-title">Settings</h1>
        <p className="settings-subtitle">Manage your preferences and account</p>
      </div>

      <div className="settings-sections">
        {/* Wallet Section */}
        <section className="settings-section">
          <h2 className="section-title">Wallet</h2>
          <Card className="settings-card">
            {isConnected ? (
              <div className="wallet-info">
                <div className="info-row">
                  <span className="info-label">Connected Address</span>
                  <div className="info-value-group">
                    <code className="info-value">{formatAddress(address, 12, 8)}</code>
                    <Button variant="ghost" size="small" onClick={handleCopyAddress}>
                      📋 Copy
                    </Button>
                  </div>
                </div>
                <div className="info-row">
                  <span className="info-label">Network</span>
                  <span className="info-value badge">{NETWORK_TYPE}</span>
                </div>
                <div className="settings-actions">
                  <Button variant="outline" onClick={disconnect}>
                    Disconnect Wallet
                  </Button>
                </div>
              </div>
            ) : (
              <div className="wallet-disconnected">
                <p>No wallet connected</p>
                <p className="hint">Connect your wallet to access all features</p>
              </div>
            )}
          </Card>
        </section>

        {/* Contract Info Section */}
        <section className="settings-section">
          <h2 className="section-title">Contract Information</h2>
          <Card className="settings-card">
            <div className="info-row">
              <span className="info-label">Contract Address</span>
              <div className="info-value-group">
                <code className="info-value">{formatAddress(CONTRACT_ADDRESS, 10, 10)}</code>
                <Button variant="ghost" size="small" onClick={handleCopyContract}>
                  📋 Copy
                </Button>
              </div>
            </div>
            <div className="info-row">
              <span className="info-label">Contract Name</span>
              <span className="info-value">{CONTRACT_NAME}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Minting Fee</span>
              <span className="info-value">{(MINT_FEE / 1_000_000).toFixed(6)} STX</span>
            </div>
            <div className="settings-actions">
              <a
                href={`https://explorer.stacks.co/txid/${CONTRACT_ADDRESS}.${CONTRACT_NAME}?chain=${NETWORK_TYPE}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline">
                  View on Explorer →
                </Button>
              </a>
            </div>
          </Card>
        </section>

        {/* Preferences Section */}
        <section className="settings-section">
          <h2 className="section-title">Preferences</h2>
          <Card className="settings-card">
            <div className="preference-row">
              <div className="preference-info">
                <span className="preference-label">Theme</span>
                <span className="preference-hint">Choose your preferred color scheme</span>
              </div>
              <select 
                value={theme} 
                onChange={(e) => setTheme(e.target.value)}
                className="preference-select"
              >
                <option value="dark">Dark (Default)</option>
                <option value="light" disabled>Light (Coming Soon)</option>
              </select>
            </div>
            <div className="preference-row">
              <div className="preference-info">
                <span className="preference-label">Notifications</span>
                <span className="preference-hint">Show toast notifications</span>
              </div>
              <label className="toggle">
                <input 
                  type="checkbox" 
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </Card>
        </section>

        {/* About Section */}
        <section className="settings-section">
          <h2 className="section-title">About</h2>
          <Card className="settings-card">
            <div className="about-info">
              <div className="app-logo">🏆</div>
              <h3>Achievement POAP</h3>
              <p className="version">Version 1.0.0</p>
              <p className="description">
                A decentralized proof of attendance protocol built on Stacks blockchain.
              </p>
              <div className="about-links">
                <a href="https://github.com/phessophissy/achievementPOAP" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
                <span className="separator">•</span>
                <a href="https://docs.stacks.co" target="_blank" rel="noopener noreferrer">
                  Stacks Docs
                </a>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Settings;

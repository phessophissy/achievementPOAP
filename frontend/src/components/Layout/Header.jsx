import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWallet } from '../../context/WalletContext';
import './Header.css';

function Header() {
  const { isConnected, walletAddress, balance, connect, disconnect, isConnecting, shortenAddress } = useWallet();
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/events', label: 'Events' },
    { path: '/my-poaps', label: 'My POAPs' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/about', label: 'About' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">🏆</span>
          <span className="logo-text">Achievement POAP</span>
        </Link>

        <nav className="nav">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          {isConnected ? (
            <div className="wallet-info">
              <div className="balance-display">
                <span className="balance-amount">{balance?.toFixed(4) || '0.00'}</span>
                <span className="balance-currency">STX</span>
              </div>
              <div className="wallet-dropdown">
                <button className="wallet-address-btn">
                  {shortenAddress(walletAddress)}
                </button>
                <div className="dropdown-content">
                  <Link to="/my-poaps" className="dropdown-item">
                    <span className="dropdown-icon">🎨</span>
                    My POAPs
                  </Link>
                  <Link to="/create-event" className="dropdown-item">
                    <span className="dropdown-icon">➕</span>
                    Create Event
                  </Link>
                  <hr className="dropdown-divider" />
                  <button onClick={disconnect} className="dropdown-item disconnect">
                    <span className="dropdown-icon">🚪</span>
                    Disconnect
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              className="connect-btn"
              onClick={connect}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <>
                  <span className="btn-spinner"></span>
                  Connecting...
                </>
              ) : (
                'Connect Wallet'
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;

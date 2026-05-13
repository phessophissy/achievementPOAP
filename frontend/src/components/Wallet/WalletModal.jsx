import React, { useEffect, useRef } from 'react';
import { useWallet } from '../../context/WalletContext';
import './WalletModal.css';

function WalletModal({ open, onClose }) {
  const { wallets, connectWithWallet, connectViaWalletConnect, isConnecting } = useWallet();
  const overlayRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const handleOverlay = (e) => { if (e.target === overlayRef.current) onClose(); };

  return (
    <div className="wm-overlay" ref={overlayRef} onClick={handleOverlay}>
      <div className="wm-modal" role="dialog" aria-modal="true">
        <div className="wm-header">
          <div>
            <h2 className="wm-title">Connect Wallet</h2>
            <p className="wm-subtitle">Choose your Stacks wallet to continue</p>
          </div>
          <button className="wm-close" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="wm-wallets">
          {wallets.map((w) => {
            const isInstalled = w.installed();
            return (
              <button
                key={w.id}
                className={`wm-wallet-btn ${isInstalled ? 'installed' : 'not-installed'}`}
                onClick={() => isInstalled ? connectWithWallet(w.id) : window.open(w.downloadUrl, '_blank')}
                disabled={isConnecting}
              >
                <span className="wm-wallet-icon">{w.fallbackIcon}</span>
                <div className="wm-wallet-info">
                  <span className="wm-wallet-name">{w.name}</span>
                  <span className="wm-wallet-desc">{w.subtitle}</span>
                </div>
                <span className={`status-badge ${isInstalled ? 'installed' : 'install'}`}>
                  {isInstalled ? 'Detected' : 'Install'}
                </span>
              </button>
            );
          })}

          <div className="wm-divider">
            <div className="wm-divider-line" />
            <span className="wm-divider-text">or use WalletConnect</span>
            <div className="wm-divider-line" />
          </div>

          <button className="wm-wc-btn" onClick={connectViaWalletConnect}>
            <span className="wm-wc-logo">
              <svg viewBox="0 0 300 185" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M61.4385 36.2562C114.181 -14.7188 200.485 -14.7188 253.227 36.2562L259.341 42.2194C262.072 44.8582 262.072 49.1418 259.341 51.7806L238.553 72.0542C237.188 73.3736 234.984 73.3736 233.619 72.0542L225.19 63.7966C190.201 29.8766 141.465 29.8766 106.476 63.7966L97.4546 72.6456C96.0895 73.965 93.8857 73.965 92.5206 72.6456L71.7325 52.372C70.3675 51.0526 70.3675 48.7474 71.7325 47.428L61.4385 36.2562ZM298.401 79.8398L316.928 97.9892C319.659 100.628 319.659 104.911 316.928 107.55L231.733 190.104C228.967 192.776 224.525 192.776 221.759 190.104L162.086 131.836C161.388 131.155 160.252 131.155 159.554 131.836L99.882 190.104C97.1157 192.776 92.6745 192.776 89.9083 190.104L4.71286 107.55C1.98153 104.911 1.98153 100.628 4.71286 97.9892L23.2402 79.8398C26.0065 77.168 30.4477 77.168 33.2139 79.8398L92.8862 137.108C93.5845 137.789 94.7205 137.789 95.4188 137.108L155.091 79.8398C157.857 77.168 162.299 77.168 165.065 79.8398L224.737 137.108C225.435 137.789 226.571 137.789 227.269 137.108L286.942 79.8398C289.674 77.168 294.149 77.168 298.401 79.8398Z" fill="#3B99FC"/>
              </svg>
            </span>
            <div className="wm-wallet-info">
              <span className="wm-wallet-name">WalletConnect</span>
              <span className="wm-wallet-desc">600+ wallets · QR & mobile</span>
            </div>
            <span className="status-badge install">via REOWN</span>
          </button>
        </div>

        <div className="wm-footer">
          <svg viewBox="0 0 16 16" fill="none" width="13" height="13">
            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3a1 1 0 110 2 1 1 0 010-2zm0 3.5a.5.5 0 01.5.5v3a.5.5 0 01-1 0V8a.5.5 0 01.5-.5z" fill="currentColor"/>
          </svg>
          New to Stacks?{' '}
          <a href="https://www.stacks.co/learn/introduction" target="_blank" rel="noopener noreferrer">
            Learn more about Stacks wallets
          </a>
        </div>
      </div>
    </div>
  );
}

export default WalletModal;

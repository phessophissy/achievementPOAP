/** @file frontend/src/components/Layout/Footer.jsx - UI component module documenting rendering and interaction intent. */
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <svg viewBox="0 0 32 32" fill="none" width="24" height="24">
              <rect width="32" height="32" rx="8" fill="#FF5500"/>
              <path d="M8 20l8-12 8 12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="16" cy="22" r="2" fill="#fff"/>
            </svg>
            <span>Achievement<b>POAP</b></span>
          </div>
          <p>Proof-of-Achievement protocol on Stacks — Bitcoin's smart contract layer. Collect verifiable on-chain badges.</p>
          <div className="footer-pills">
            <span className="footer-pill">🟠 Stacks L2</span>
            <span className="footer-pill">⚡ Bitcoin-secured</span>
            <span className="footer-pill">0.025 STX / mint</span>
          </div>
        </div>
        <div className="footer-links">
          <div>
            <h5>Platform</h5>
            <Link to="/events">Events</Link>
            <Link to="/gallery">Gallery</Link>
            <Link to="/leaderboard">Leaderboard</Link>
            <Link to="/create-event">Create Event</Link>
          </div>
          <div>
            <h5>Resources</h5>
            <a href="https://docs.stacks.co" target="_blank" rel="noopener noreferrer">Stacks Docs</a>
            <a href="https://explorer.stacks.co" target="_blank" rel="noopener noreferrer">Explorer</a>
            <Link to="/about">About</Link>
          </div>
          <div>
            <h5>Wallets</h5>
            <a href="https://leather.io" target="_blank" rel="noopener noreferrer">Leather</a>
            <a href="https://www.xverse.app" target="_blank" rel="noopener noreferrer">Xverse</a>
            <a href="https://asigna.io" target="_blank" rel="noopener noreferrer">Asigna</a>
            <a href="https://www.okx.com/web3" target="_blank" rel="noopener noreferrer">OKX Wallet</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Achievement POAP. Built on <a href="https://www.stacks.co" target="_blank" rel="noopener noreferrer">Stacks</a>.</p>
        <p className="footer-btc">Secured by Bitcoin</p>
      </div>
    </footer>
  );
}

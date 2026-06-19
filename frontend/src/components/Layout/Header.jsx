import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWallet } from '../../context/WalletContext';
import WalletConnect from '../Wallet/WalletConnect';
import ThemeToggle from '../Theme/ThemeToggle';
import './Header.css';

const NAV = [
  { path: '/', label: 'Home' },
  { path: '/events', label: 'Events' },
  { path: '/my-poaps', label: 'My POAPs' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/leaderboard', label: 'Leaderboard' },
  { path: '/settings', label: 'Settings' },
  { path: '/about', label: 'About' },
];

export default function Header() {
  const { isConnected } = useWallet();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <header className={`header ${scrolled ? 'header-scrolled' : ''}`}>
      <div className="header-inner">
        <Link to="/" className="logo">
          <span className="logo-icon">
            <img src="/favicon.svg" alt="Achievement POAP" width="32" height="32" style={{display:'block'}} />
          </span>
          <span className="logo-text">Achievement<span className="logo-accent">POAP</span></span>
        </Link>

        <nav className="nav" aria-label="Main navigation">
          {NAV.map((link) => (
            <Link key={link.path} to={link.path}
              className={`nav-link ${isActive(link.path) ? 'active' : ''}`}>
              {link.label}
            </Link>
          ))}
          {isConnected && (
            <Link to="/create-event" className="nav-link nav-create">
              <svg viewBox="0 0 16 16" fill="none" width="12" height="12">
                <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Create
            </Link>
          )}
        </nav>

        <div className="header-right">
          <ThemeToggle />
          <WalletConnect showBalance={true} />
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span className={`hamburger ${menuOpen ? 'open' : ''}`}>
              <span/><span/><span/>
            </span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="mobile-nav">
          {NAV.map((link) => (
            <Link key={link.path} to={link.path}
              className={`mobile-nav-link ${isActive(link.path) ? 'active' : ''}`}>
              {link.label}
            </Link>
          ))}
          {isConnected && (
            <Link to="/create-event" className="mobile-nav-link mobile-create">+ Create Event</Link>
          )}
          <div className="mobile-wallet">
            <WalletConnect showBalance={true} />
          </div>
        </div>
      )}
    </header>
  );
}

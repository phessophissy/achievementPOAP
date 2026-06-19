import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { usePageTitle } from '../hooks/usePageTitle';
import './Home.css';

const FEATURES = [
  { icon: '⛓️', title: 'On-Chain Achievements', desc: 'Every POAP is an immutable SIP-009 NFT on Stacks, anchored to Bitcoin.' },
  { icon: '⚡', title: 'Bitcoin-Secured', desc: 'Stacks smart contracts settle on Bitcoin. Your achievements are as permanent as Bitcoin itself.' },
  { icon: '💸', title: '0.025 STX per Mint', desc: 'Collect achievements without breaking the bank. Low fees, high value.' },
  { icon: '🔐', title: 'One POAP per Event', desc: 'Exclusive minting ensures scarcity — one NFT per wallet per event.' },
  { icon: '🌐', title: 'All Stacks Wallets', desc: 'Connect with Leather, Xverse, Asigna, OKX, or any WalletConnect-compatible wallet.' },
  { icon: '📊', title: 'Fully On-Chain Metadata', desc: 'Event data lives on the blockchain, not on a server that can disappear.' },
];

const STATS = [
  { value: '100+', label: 'Events Created' },
  { value: '5K+', label: 'POAPs Minted' },
  { value: '0.025', label: 'STX per Mint' },
  { value: '100%', label: 'On-Chain' },
];

const STEPS = [
  { n: '01', title: 'Connect Wallet', desc: 'Use Leather, Xverse, Asigna, or OKX to connect your Stacks wallet in seconds.' },
  { n: '02', title: 'Find an Event', desc: 'Browse active events — hackathons, meetups, AMAs, milestones.' },
  { n: '03', title: 'Mint Your POAP', desc: 'Pay 0.025 STX to mint a permanent proof of your participation.' },
  { n: '04', title: 'Showcase It', desc: 'Your on-chain collection grows over time. Show off your Stacks journey.' },
];

export default function Home() {
  usePageTitle('Home', 'Mint achievement POAPs on Stacks');
  const { isConnected, connect } = useWallet();
  const heroRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const onMove = (e) => {
      const rect = hero.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      hero.style.setProperty('--mx', x + '%');
      hero.style.setProperty('--my', y + '%');
    };
    hero.addEventListener('mousemove', onMove);
    return () => hero.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div className="home">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="hero" ref={heroRef}>
        <div className="hero-glow" />
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Built on Stacks · Bitcoin L2
          </div>
          <h1 className="hero-title">
            Proof of<br />
            <span className="gradient-text">Achievement</span>
          </h1>
          <p className="hero-desc">
            Collect verifiable on-chain achievement badges on Stacks.
            Each POAP is a unique SIP-009 NFT anchored to Bitcoin,
            proving you were there.
          </p>
          <div className="hero-actions">
            {isConnected ? (
              <>
                <Link to="/events" className="btn btn-primary btn-large">
                  <svg viewBox="0 0 20 20" fill="none" width="16" height="16"><path d="M10 2l2.5 5 5.5.8-4 3.9.9 5.5L10 14.5 5.1 17.2l.9-5.5-4-3.9 5.5-.8L10 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
                  Explore Events
                </Link>
                <Link to="/my-poaps" className="btn btn-secondary btn-large">My Collection</Link>
              </>
            ) : (
              <>
                <button className="btn btn-primary btn-large" onClick={connect}>
                  <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><rect x="2" y="6" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M16 13.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" fill="currentColor"/><path d="M2 10h20" stroke="currentColor" strokeWidth="2"/></svg>
                  Connect Wallet
                </button>
                <Link to="/events" className="btn btn-secondary btn-large">Explore Events</Link>
              </>
            )}
          </div>
          <div className="hero-wallets">
            <span className="hw-label">Supported wallets</span>
            {['Leather','Xverse','Asigna','OKX'].map(n => (
              <span className="hw-chip" key={n}>{n}</span>
            ))}
          </div>
        </div>
        <div className="hero-visual">
          <div className="poap-showcase">
            {[0,1,2].map(i => (
              <div key={i} className={`showcase-card sc-${i}`}>
                <div className="sc-inner">
                  <div className="sc-icon">{['🏆','⚡','🎯'][i]}</div>
                  <div className="sc-name">{['Bitcoin Hodler','Stacks Builder','DeFi Pioneer'][i]}</div>
                  <div className="sc-id">#{(1337+i*111).toString().padStart(4,'0')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <section className="stats-bar">
        <div className="stats-inner">
          {STATS.map(({ value, label }) => (
            <div className="stat" key={label}>
              <span className="stat-value">{value}</span>
              <span className="stat-label">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="features-section page">
        <div className="section-header">
          <h2 className="section-title">Why Achievement POAP?</h2>
          <p className="section-subtitle">Everything you need to prove, collect, and showcase your on-chain milestones.</p>
        </div>
        <div className="features-grid">
          {FEATURES.map(({ icon, title, desc }) => (
            <div className="feature-card" key={title}>
              <div className="feature-icon">{icon}</div>
              <h3 className="feature-title">{title}</h3>
              <p className="feature-desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="how-section page">
        <div className="section-header">
          <h2 className="section-title">How it works</h2>
          <p className="section-subtitle">Get your first achievement badge in under two minutes.</p>
        </div>
        <div className="steps-grid">
          {STEPS.map(({ n, title, desc }) => (
            <div className="step-card" key={n}>
              <div className="step-num">{n}</div>
              <h3 className="step-title">{title}</h3>
              <p className="step-desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="cta-section">
        <div className="cta-inner">
          <h2>Start collecting your achievements</h2>
          <p>Join thousands of Stacks users building verifiable on-chain identities.</p>
          <div className="cta-actions">
            {isConnected ? (
              <Link to="/events" className="btn btn-primary btn-large">Browse Events</Link>
            ) : (
              <button className="btn btn-primary btn-large" onClick={connect}>Connect Wallet</button>
            )}
            <Link to="/about" className="btn btn-secondary btn-large">Learn More</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

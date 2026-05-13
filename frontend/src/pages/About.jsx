import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const TEAM = [
  { name: 'Alex Rivera', role: 'Protocol Architect', avatar: '🧑‍💻' },
  { name: 'Maria Santos', role: 'Smart Contracts', avatar: '👩‍🔬' },
  { name: 'Dev Chen', role: 'Frontend & UX', avatar: '🎨' },
];

export default function About() {
  return (
    <div className="page about-page">
      <section className="about-hero">
        <div className="about-hero-badge">The Protocol</div>
        <h1>About Achievement POAP</h1>
        <p>We believe every on-chain action deserves a permanent record. Achievement POAP turns your Stacks milestones into verifiable, soulbound-style NFT badges anchored to Bitcoin.</p>
      </section>

      <section className="about-mission">
        <div className="about-card">
          <h2>Our Mission</h2>
          <p>Build a trustless, permissionless protocol that lets anyone create and distribute proof-of-participation badges on Stacks — with zero reliance on centralized servers or metadata APIs.</p>
          <p>Every piece of event data, every mint, every ownership record lives entirely on-chain and is secured by Bitcoin's proof-of-work consensus via the Stacks PoX mechanism.</p>
        </div>
      </section>

      <section className="about-tech">
        <h2 className="section-title">Tech Stack</h2>
        <div className="tech-grid">
          {[
            { icon: '🟠', name: 'Stacks Blockchain', desc: 'Smart contract layer settling on Bitcoin. Uses Clarity — a decidable language with no surprises.' },
            { icon: '₿', name: 'Bitcoin-Anchored', desc: 'Every Stacks block is anchored to Bitcoin, giving your POAPs the same security as Bitcoin itself.' },
            { icon: '🎖️', name: 'SIP-009 NFT Standard', desc: 'Achievement POAPs are fully compliant SIP-009 non-fungible tokens. Trade, display, verify.' },
            { icon: '🔌', name: 'Multi-Wallet Support', desc: 'Leather, Xverse, Asigna, OKX — all Stacks-compatible wallets work out of the box.' },
            { icon: '⚡', name: 'REOWN AppKit', desc: 'WalletConnect integration for 600+ wallets via QR code and mobile deep links.' },
            { icon: '🔍', name: 'Hiro Explorer', desc: 'Every transaction is publicly verifiable on the Hiro/Stacks explorer. No trust required.' },
          ].map(({ icon, name, desc }) => (
            <div className="tech-card" key={name}>
              <span className="tech-icon">{icon}</span>
              <h3>{name}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="about-contract">
        <h2>Smart Contract</h2>
        <div className="contract-info">
          <div className="contract-row">
            <span className="cr-label">Contract</span>
            <a href="https://explorer.stacks.co/txid/SP2KYZRNME33Y39GP3RKC90DQJ45EF1N0NZNVRE09.achievement-poap?chain=mainnet"
              target="_blank" rel="noopener noreferrer" className="cr-value monospace">
              SP2KYZRNME33Y39GP3RKC90DQJ45EF1N0NZNVRE09.achievement-poap
            </a>
          </div>
          <div className="contract-row">
            <span className="cr-label">Network</span>
            <span className="cr-value">Stacks Mainnet</span>
          </div>
          <div className="contract-row">
            <span className="cr-label">Mint Fee</span>
            <span className="cr-value">0.025 STX</span>
          </div>
          <div className="contract-row">
            <span className="cr-label">Token Standard</span>
            <span className="cr-value">SIP-009</span>
          </div>
        </div>
      </section>

      <section className="about-cta">
        <h2>Ready to collect your first achievement?</h2>
        <div className="cta-actions">
          <Link to="/events" className="btn btn-primary btn-large">Explore Events</Link>
          <a href="https://docs.stacks.co" target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-large">Stacks Docs</a>
        </div>
      </section>
    </div>
  );
}

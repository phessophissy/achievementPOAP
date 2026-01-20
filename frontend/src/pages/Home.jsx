import React from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import './Home.css';

function Home() {
  const { isConnected, connect } = useWallet();

  const features = [
    {
      icon: '🏆',
      title: 'Verifiable Achievements',
      description: 'Every POAP is stored on the Stacks blockchain, providing immutable proof of your participation.',
    },
    {
      icon: '⚡',
      title: 'Powered by Bitcoin',
      description: 'Built on Stacks, the leading Bitcoin L2 for smart contracts. Your achievements are secured by Bitcoin.',
    },
    {
      icon: '💰',
      title: 'Low Minting Cost',
      description: 'Only 0.025 STX per mint. Collect achievements without breaking the bank.',
    },
    {
      icon: '🎨',
      title: 'Unique NFTs',
      description: 'Each POAP is a unique SIP-009 compliant NFT that you can collect, showcase, and trade.',
    },
    {
      icon: '🔒',
      title: 'One Per Event',
      description: 'Exclusive minting ensures only one POAP per wallet per event, making each achievement special.',
    },
    {
      icon: '📊',
      title: 'On-Chain Metadata',
      description: 'All event details and metadata are stored directly on the blockchain for permanence.',
    },
  ];

  const stats = [
    { value: '100+', label: 'Events Created' },
    { value: '5,000+', label: 'POAPs Minted' },
    { value: '0.025', label: 'STX per Mint' },
    { value: '100%', label: 'On-Chain' },
  ];

  const steps = [
    {
      number: '01',
      title: 'Connect Wallet',
      description: 'Connect your Stacks wallet (Hiro or Xverse) to get started.',
    },
    {
      number: '02',
      title: 'Browse Events',
      description: 'Explore active events and find achievements you can claim.',
    },
    {
      number: '03',
      title: 'Mint Your POAP',
      description: 'Pay 0.025 STX to mint your unique achievement NFT.',
    },
    {
      number: '04',
      title: 'Showcase',
      description: 'View and share your collection of achievements.',
    },
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">🏆 Built on Bitcoin L2</div>
          <h1 className="hero-title">
            <span className="title-line">Proof of</span>
            <span className="title-line gradient">Achievement</span>
          </h1>
          <p className="hero-description">
            Collect verifiable on-chain achievements on Stacks. 
            Each POAP is a unique NFT that proves your participation 
            in events, hackathons, and milestones.
          </p>
          <div className="hero-actions">
            {isConnected ? (
              <>
                <Link to="/events">
                  <Button size="large" icon="🎯">Explore Events</Button>
                </Link>
                <Link to="/my-poaps">
                  <Button variant="secondary" size="large" icon="🎨">My Collection</Button>
                </Link>
              </>
            ) : (
              <>
                <Button size="large" onClick={connect} icon="🔗">
                  Connect Wallet
                </Button>
                <Link to="/events">
                  <Button variant="secondary" size="large" icon="👀">
                    Browse Events
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-poap poap-1">🏆</div>
          <div className="floating-poap poap-2">⭐</div>
          <div className="floating-poap poap-3">🎯</div>
          <div className="floating-poap poap-4">🚀</div>
          <div className="hero-ring ring-1"></div>
          <div className="hero-ring ring-2"></div>
          <div className="hero-ring ring-3"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Why Achievement POAP?</h2>
          <p className="section-subtitle">
            The premier platform for collecting verifiable on-chain achievements
          </p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <Card key={index} hoverable className="feature-card">
              <Card.Body>
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </Card.Body>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="section-header">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Get started in just a few simple steps</p>
        </div>
        <div className="steps-container">
          {steps.map((step, index) => (
            <div key={index} className="step-card">
              <div className="step-number">{step.number}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
              {index < steps.length - 1 && <div className="step-connector"></div>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <Card variant="featured" glowing>
          <Card.Body>
            <div className="cta-content">
              <h2 className="cta-title">Ready to Start Collecting?</h2>
              <p className="cta-description">
                Join thousands of collectors building their on-chain achievement portfolio.
              </p>
              <div className="cta-actions">
                {isConnected ? (
                  <Link to="/events">
                    <Button size="large">Browse Events</Button>
                  </Link>
                ) : (
                  <Button size="large" onClick={connect}>
                    Connect Wallet to Begin
                  </Button>
                )}
              </div>
            </div>
          </Card.Body>
        </Card>
      </section>
    </div>
  );
}

export default Home;

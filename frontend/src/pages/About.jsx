import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { CONTRACT_ADDRESS, CONTRACT_NAME, MINT_FEE_STX, EXPLORER_URL } from '../config/constants';
import './About.css';

function About() {
  const techStack = [
    { name: 'Stacks', description: 'Bitcoin Layer 2 for smart contracts', icon: '⚡' },
    { name: 'Clarity', description: 'Decidable smart contract language', icon: '💎' },
    { name: 'SIP-009', description: 'NFT token standard on Stacks', icon: '🎨' },
    { name: 'React', description: 'Modern frontend framework', icon: '⚛️' },
  ];

  const faqs = [
    {
      question: 'What is a POAP?',
      answer: 'POAP (Proof of Attendance Protocol) is a type of NFT that serves as proof that you attended or participated in an event. Each POAP is unique and recorded on the blockchain.',
    },
    {
      question: 'How much does it cost to mint?',
      answer: `Each POAP mint costs ${MINT_FEE_STX} STX plus a small network fee. This helps maintain the platform and ensures only genuine participants claim POAPs.`,
    },
    {
      question: 'Can I create my own event?',
      answer: 'Yes! Anyone can create a POAP event. Simply connect your wallet and fill out the event creation form with details like name, description, supply limit, and block range.',
    },
    {
      question: 'How are POAPs secured?',
      answer: 'POAPs are secured by the Stacks blockchain, which is anchored to Bitcoin through Proof of Transfer. This provides Bitcoin-level security for your achievements.',
    },
    {
      question: 'Can I transfer or sell my POAPs?',
      answer: 'Yes, POAPs follow the SIP-009 NFT standard and can be transferred to other wallets or sold on compatible NFT marketplaces.',
    },
  ];

  return (
    <div className="about-page">
      <section className="hero-section">
        <h1 className="hero-title">About Achievement POAP</h1>
        <p className="hero-subtitle">
          The premier platform for collecting verifiable on-chain achievements on Bitcoin's Layer 2
        </p>
      </section>

      <section className="mission-section">
        <Card variant="featured">
          <Card.Body>
            <div className="mission-content">
              <div className="mission-icon">🎯</div>
              <div>
                <h2>Our Mission</h2>
                <p>
                  To provide a trustless, decentralized way for communities to recognize 
                  participation and achievements. We believe every milestone deserves 
                  verifiable, permanent recognition on the blockchain.
                </p>
              </div>
            </div>
          </Card.Body>
        </Card>
      </section>

      <section className="tech-section">
        <h2 className="section-title">Technology Stack</h2>
        <div className="tech-grid">
          {techStack.map((tech, index) => (
            <Card key={index} hoverable>
              <Card.Body>
                <div className="tech-card-content">
                  <span className="tech-icon">{tech.icon}</span>
                  <h3>{tech.name}</h3>
                  <p>{tech.description}</p>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      </section>

      <section className="contract-section">
        <h2 className="section-title">Smart Contract</h2>
        <Card>
          <Card.Body>
            <div className="contract-info">
              <div className="contract-row">
                <span className="label">Contract Address</span>
                <span className="value address">{CONTRACT_ADDRESS}</span>
              </div>
              <div className="contract-row">
                <span className="label">Contract Name</span>
                <span className="value">{CONTRACT_NAME}</span>
              </div>
              <div className="contract-row">
                <span className="label">Minting Fee</span>
                <span className="value">{MINT_FEE_STX} STX</span>
              </div>
              <div className="contract-row">
                <span className="label">NFT Standard</span>
                <span className="value">SIP-009</span>
              </div>
            </div>
            <div className="contract-actions">
              <a
                href={`${EXPLORER_URL}/address/${CONTRACT_ADDRESS}.${CONTRACT_NAME}?chain=mainnet`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="secondary">View on Explorer ↗</Button>
              </a>
              <a
                href="https://github.com/phessophissy/achievementPOAP"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="ghost">GitHub Source ↗</Button>
              </a>
            </div>
          </Card.Body>
        </Card>
      </section>

      <section className="faq-section">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <Card key={index} className="faq-card">
              <Card.Body>
                <h3 className="faq-question">{faq.question}</h3>
                <p className="faq-answer">{faq.answer}</p>
              </Card.Body>
            </Card>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <Card variant="featured" glowing>
          <Card.Body>
            <div className="cta-content">
              <h2>Ready to Get Started?</h2>
              <p>Connect your wallet and start collecting achievement POAPs today.</p>
              <div className="cta-buttons">
                <Link to="/events">
                  <Button size="large">Browse Events</Button>
                </Link>
                <Link to="/create-event">
                  <Button variant="secondary" size="large">Create Event</Button>
                </Link>
              </div>
            </div>
          </Card.Body>
        </Card>
      </section>
    </div>
  );
}

export default About;

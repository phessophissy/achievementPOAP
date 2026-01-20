import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { label: 'Events', path: '/events' },
      { label: 'Gallery', path: '/gallery' },
      { label: 'Create Event', path: '/create-event' },
    ],
    resources: [
      { label: 'About', path: '/about' },
      { label: 'Documentation', path: 'https://docs.stacks.co', external: true },
      { label: 'Stacks Explorer', path: 'https://explorer.stacks.co', external: true },
    ],
    community: [
      { label: 'Twitter', path: 'https://twitter.com/staboratory', external: true },
      { label: 'Discord', path: '#', external: true },
      { label: 'GitHub', path: 'https://github.com/phessophissy/achievementPOAP', external: true },
    ],
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-icon">🏆</span>
              <span className="logo-text">Achievement POAP</span>
            </div>
            <p className="footer-description">
              Proof of Attendance Protocol on Stacks - Bitcoin's smart contract layer. 
              Collect verifiable on-chain achievements and showcase your participation.
            </p>
            <div className="footer-stats">
              <div className="stat">
                <span className="stat-value">0.025</span>
                <span className="stat-label">STX per mint</span>
              </div>
              <div className="stat">
                <span className="stat-value">100%</span>
                <span className="stat-label">On-chain</span>
              </div>
            </div>
          </div>

          <div className="footer-links-container">
            <div className="footer-links-section">
              <h4>Platform</h4>
              <ul>
                {footerLinks.platform.map((link) => (
                  <li key={link.label}>
                    <Link to={link.path}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-links-section">
              <h4>Resources</h4>
              <ul>
                {footerLinks.resources.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a href={link.path} target="_blank" rel="noopener noreferrer">
                        {link.label}
                        <span className="external-icon">↗</span>
                      </a>
                    ) : (
                      <Link to={link.path}>{link.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-links-section">
              <h4>Community</h4>
              <ul>
                {footerLinks.community.map((link) => (
                  <li key={link.label}>
                    <a href={link.path} target="_blank" rel="noopener noreferrer">
                      {link.label}
                      <span className="external-icon">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Achievement POAP. Built on Stacks.</p>
          <div className="footer-badges">
            <span className="badge">Bitcoin L2</span>
            <span className="badge">SIP-009</span>
            <span className="badge">Clarity</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

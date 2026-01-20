import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import './Gallery.css';

function Gallery() {
  // Mock featured POAPs for display
  const featuredPoaps = [
    { id: 1, name: 'Stacks Hackathon 2025', eventId: 1, count: 250 },
    { id: 2, name: 'Bitcoin Conference Miami', eventId: 2, count: 1000 },
    { id: 3, name: 'Clarity Developer Bootcamp', eventId: 3, count: 75 },
    { id: 4, name: 'Stacks 2.1 Launch', eventId: 4, count: 500 },
    { id: 5, name: 'DeFi Summit Keynote', eventId: 5, count: 300 },
    { id: 6, name: 'NFT Art Exhibition', eventId: 6, count: 150 },
  ];

  return (
    <div className="gallery-page">
      <div className="page-header">
        <h1 className="page-title">POAP Gallery</h1>
        <p className="page-subtitle">
          Explore the most popular POAPs minted on the platform
        </p>
      </div>

      <div className="gallery-stats">
        <Card className="gallery-stat-card">
          <Card.Body>
            <div className="stat-content">
              <span className="stat-icon">🏆</span>
              <div>
                <span className="stat-value">5,000+</span>
                <span className="stat-label">POAPs Minted</span>
              </div>
            </div>
          </Card.Body>
        </Card>
        <Card className="gallery-stat-card">
          <Card.Body>
            <div className="stat-content">
              <span className="stat-icon">🎭</span>
              <div>
                <span className="stat-value">100+</span>
                <span className="stat-label">Events Created</span>
              </div>
            </div>
          </Card.Body>
        </Card>
        <Card className="gallery-stat-card">
          <Card.Body>
            <div className="stat-content">
              <span className="stat-icon">👥</span>
              <div>
                <span className="stat-value">2,500+</span>
                <span className="stat-label">Collectors</span>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      <section className="featured-section">
        <h2 className="section-title">🌟 Featured POAPs</h2>
        <div className="featured-grid">
          {featuredPoaps.map((poap) => (
            <Link key={poap.id} to={`/events/${poap.eventId}`} className="gallery-card-link">
              <Card hoverable className="gallery-card">
                <Card.Body>
                  <div className="poap-showcase">
                    <div className="showcase-circle">
                      <span className="showcase-emoji">🏆</span>
                    </div>
                    <div className="showcase-glow"></div>
                  </div>
                  <h3 className="poap-title">{poap.name}</h3>
                  <div className="poap-stats">
                    <span className="mint-count">{poap.count} minted</span>
                  </div>
                </Card.Body>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="categories-section">
        <h2 className="section-title">📂 Categories</h2>
        <div className="categories-grid">
          <Card hoverable className="category-card">
            <Card.Body>
              <span className="category-icon">💻</span>
              <h3>Hackathons</h3>
              <p>Development competitions and coding events</p>
            </Card.Body>
          </Card>
          <Card hoverable className="category-card">
            <Card.Body>
              <span className="category-icon">🎤</span>
              <h3>Conferences</h3>
              <p>Industry conferences and summits</p>
            </Card.Body>
          </Card>
          <Card hoverable className="category-card">
            <Card.Body>
              <span className="category-icon">📚</span>
              <h3>Education</h3>
              <p>Workshops, courses, and bootcamps</p>
            </Card.Body>
          </Card>
          <Card hoverable className="category-card">
            <Card.Body>
              <span className="category-icon">🎨</span>
              <h3>Art & Culture</h3>
              <p>NFT drops, exhibitions, and creative events</p>
            </Card.Body>
          </Card>
        </div>
      </section>

      <section className="cta-section">
        <Card variant="featured" glowing>
          <Card.Body>
            <div className="cta-content">
              <h2>Create Your Own Event</h2>
              <p>Launch a POAP event and let participants mint their achievements.</p>
              <Link to="/create-event">
                <Button size="large">Create Event</Button>
              </Link>
            </div>
          </Card.Body>
        </Card>
      </section>
    </div>
  );
}

export default Gallery;

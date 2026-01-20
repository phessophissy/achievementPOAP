import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { useToast } from '../context/ToastContext';
import { fetchUserPOAPs } from '../services/contractService';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import './MyPOAPs.css';

function MyPOAPs() {
  const { isConnected, walletAddress, connect } = useWallet();
  const { error: showError } = useToast();
  
  const [poaps, setPoaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    if (walletAddress) {
      loadUserPOAPs();
    } else {
      setLoading(false);
    }
  }, [walletAddress]);

  const loadUserPOAPs = async () => {
    try {
      setLoading(true);
      const userPoaps = await fetchUserPOAPs(walletAddress);
      setPoaps(userPoaps);
    } catch (err) {
      showError('Failed to load your POAPs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sortedPoaps = [...poaps].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return b.mintedAt - a.mintedAt;
      case 'oldest':
        return a.mintedAt - b.mintedAt;
      case 'name':
        return a.eventName.localeCompare(b.eventName);
      default:
        return 0;
    }
  });

  if (!isConnected) {
    return (
      <div className="my-poaps not-connected">
        <div className="connect-prompt">
          <div className="prompt-icon">🔗</div>
          <h2>Connect Your Wallet</h2>
          <p>Connect your Stacks wallet to view your POAP collection.</p>
          <Button size="large" onClick={connect}>
            Connect Wallet
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading your collection..." />;
  }

  return (
    <div className="my-poaps">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">My Collection</h1>
          <p className="page-subtitle">
            {poaps.length} {poaps.length === 1 ? 'POAP' : 'POAPs'} collected
          </p>
        </div>
        <div className="header-actions">
          <div className="view-toggle">
            <button
              className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              ⊞
            </button>
            <button
              className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              ☰
            </button>
          </div>
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">By Name</option>
          </select>
        </div>
      </div>

      {poaps.length === 0 ? (
        <div className="empty-collection">
          <div className="empty-icon">🎭</div>
          <h3>No POAPs Yet</h3>
          <p>Start collecting by minting from active events!</p>
          <Link to="/events">
            <Button>Browse Events</Button>
          </Link>
        </div>
      ) : (
        <div className={`poaps-container ${viewMode}`}>
          {sortedPoaps.map((poap) => (
            <POAPCard key={poap.tokenId} poap={poap} viewMode={viewMode} />
          ))}
        </div>
      )}

      {poaps.length > 0 && (
        <div className="collection-stats">
          <Card>
            <Card.Body>
              <div className="stats-grid">
                <div className="collection-stat">
                  <span className="stat-value">{poaps.length}</span>
                  <span className="stat-label">Total POAPs</span>
                </div>
                <div className="collection-stat">
                  <span className="stat-value">
                    {new Set(poaps.map(p => p.eventId)).size}
                  </span>
                  <span className="stat-label">Unique Events</span>
                </div>
                <div className="collection-stat">
                  <span className="stat-value">
                    {poaps.length > 0 
                      ? new Date(Math.max(...poaps.map(p => p.mintedAt)) * 1000).toLocaleDateString()
                      : '-'
                    }
                  </span>
                  <span className="stat-label">Latest Mint</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      )}
    </div>
  );
}

function POAPCard({ poap, viewMode }) {
  if (viewMode === 'list') {
    return (
      <Card className="poap-list-item" hoverable>
        <Card.Body>
          <div className="list-content">
            <div className="poap-badge">🏆</div>
            <div className="poap-info">
              <h4 className="poap-name">{poap.eventName}</h4>
              <p className="poap-meta">
                Token #{poap.tokenId} • Event #{poap.eventId}
              </p>
            </div>
            <div className="poap-date">
              {new Date(poap.mintedAt * 1000).toLocaleDateString()}
            </div>
            <Link to={`/events/${poap.eventId}`}>
              <Button variant="ghost" size="small">View Event</Button>
            </Link>
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="poap-grid-item" hoverable>
      <Card.Body>
        <div className="poap-visual">
          <div className="poap-circle">
            <span className="poap-emoji">🏆</span>
          </div>
          <div className="poap-glow"></div>
        </div>
        <h4 className="poap-name">{poap.eventName}</h4>
        <div className="poap-details">
          <span className="detail-item">Token #{poap.tokenId}</span>
          <span className="detail-item">Event #{poap.eventId}</span>
        </div>
        <p className="poap-date">
          Minted {new Date(poap.mintedAt * 1000).toLocaleDateString()}
        </p>
        <Link to={`/events/${poap.eventId}`}>
          <Button variant="secondary" size="small" fullWidth>
            View Event
          </Button>
        </Link>
      </Card.Body>
    </Card>
  );
}

export default MyPOAPs;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { useToast } from '../context/ToastContext';
import { fetchEvent, mintPOAP, checkHasMinted } from '../services/contractService';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { EXPLORER_URL, MINT_FEE_STX } from '../config/constants';
import './EventDetail.css';

function EventDetail() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { isConnected, walletAddress, connect } = useWallet();
  const { success, error: showError, info } = useToast();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [minting, setMinting] = useState(false);
  const [hasMinted, setHasMinted] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [txId, setTxId] = useState(null);

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  useEffect(() => {
    if (walletAddress && event) {
      checkMintStatus();
    }
  }, [walletAddress, event]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      const eventData = await fetchEvent(eventId);
      setEvent(eventData);
    } catch (err) {
      showError('Failed to load event');
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  const checkMintStatus = async () => {
    try {
      const minted = await checkHasMinted(eventId, walletAddress);
      setHasMinted(minted);
    } catch (err) {
      console.error('Failed to check mint status:', err);
    }
  };

  const handleMint = async () => {
    if (!isConnected) {
      connect();
      return;
    }

    setShowConfirmModal(false);
    setMinting(true);
    info('Initiating minting transaction...');

    try {
      const result = await mintPOAP(eventId);
      setTxId(result.txId);
      success('POAP minted successfully! 🎉');
      setHasMinted(true);
    } catch (err) {
      showError(err.message || 'Minting failed. Please try again.');
    } finally {
      setMinting(false);
    }
  };

  const getEventStatus = () => {
    if (!event) return 'unknown';
    const currentBlock = 150000;
    if (currentBlock < event.startBlock) return 'upcoming';
    if (currentBlock > event.endBlock) return 'ended';
    if (event.currentSupply >= event.maxSupply) return 'sold-out';
    return 'active';
  };

  const canMint = () => {
    return isConnected && !hasMinted && getEventStatus() === 'active';
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading event..." />;
  }

  if (!event) {
    return (
      <div className="event-not-found">
        <h2>Event Not Found</h2>
        <p>The event you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/events')}>Back to Events</Button>
      </div>
    );
  }

  const status = getEventStatus();

  return (
    <div className="event-detail">
      <button className="back-button" onClick={() => navigate('/events')}>
        ← Back to Events
      </button>

      <div className="event-content">
        <div className="event-main">
          <Card variant="featured">
            <Card.Body>
              <div className="event-header">
                <span className="event-label">Event #{eventId}</span>
                <span className={`status-badge ${status}`}>
                  {status === 'active' && '🟢 Active'}
                  {status === 'upcoming' && '🟡 Upcoming'}
                  {status === 'ended' && '🔴 Ended'}
                  {status === 'sold-out' && '⚫ Sold Out'}
                </span>
              </div>

              <h1 className="event-title">{event.name}</h1>
              <p className="event-desc">{event.description}</p>

              <div className="event-meta">
                <div className="meta-item">
                  <span className="meta-icon">👤</span>
                  <div className="meta-content">
                    <span className="meta-label">Created by</span>
                    <span className="meta-value address">{event.creator}</span>
                  </div>
                </div>

                <div className="meta-item">
                  <span className="meta-icon">📅</span>
                  <div className="meta-content">
                    <span className="meta-label">Block Range</span>
                    <span className="meta-value">
                      {event.startBlock} - {event.endBlock}
                    </span>
                  </div>
                </div>

                {event.metadataUri && (
                  <div className="meta-item">
                    <span className="meta-icon">🔗</span>
                    <div className="meta-content">
                      <span className="meta-label">Metadata</span>
                      <a 
                        href={event.metadataUri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="meta-value link"
                      >
                        View Metadata ↗
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>

          {txId && (
            <Card className="tx-card">
              <Card.Body>
                <div className="tx-success">
                  <span className="tx-icon">✓</span>
                  <div className="tx-info">
                    <h4>Transaction Submitted!</h4>
                    <p>Your POAP is being minted.</p>
                    <a 
                      href={`${EXPLORER_URL}/txid/${txId}?chain=mainnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tx-link"
                    >
                      View on Explorer →
                    </a>
                  </div>
                </div>
              </Card.Body>
            </Card>
          )}
        </div>

        <div className="event-sidebar">
          <Card className="mint-card">
            <Card.Body>
              <h3 className="mint-title">Mint This POAP</h3>
              
              <div className="mint-stats">
                <div className="mint-stat">
                  <span className="stat-label">Supply</span>
                  <span className="stat-value">
                    {event.currentSupply} / {event.maxSupply}
                  </span>
                </div>
                <div className="mint-stat">
                  <span className="stat-label">Price</span>
                  <span className="stat-value">{MINT_FEE_STX} STX</span>
                </div>
              </div>

              <div className="progress-container">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${(event.currentSupply / event.maxSupply) * 100}%` }}
                  ></div>
                </div>
                <span className="progress-text">
                  {Math.round((event.currentSupply / event.maxSupply) * 100)}% minted
                </span>
              </div>

              {hasMinted ? (
                <div className="already-minted">
                  <span className="minted-icon">✓</span>
                  <span>You already own this POAP</span>
                </div>
              ) : (
                <Button
                  fullWidth
                  size="large"
                  onClick={() => setShowConfirmModal(true)}
                  disabled={!canMint() || minting}
                  loading={minting}
                >
                  {!isConnected 
                    ? 'Connect Wallet to Mint'
                    : status !== 'active'
                    ? status === 'upcoming' ? 'Coming Soon' : 'Event Ended'
                    : minting 
                    ? 'Minting...' 
                    : `Mint for ${MINT_FEE_STX} STX`
                  }
                </Button>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Mint"
      >
        <div className="confirm-content">
          <p>You are about to mint:</p>
          <h3 className="confirm-event-name">{event.name}</h3>
          <div className="confirm-details">
            <div className="confirm-row">
              <span>Mint Fee</span>
              <span>{MINT_FEE_STX} STX</span>
            </div>
            <div className="confirm-row">
              <span>Network Fee</span>
              <span>~0.001 STX</span>
            </div>
            <div className="confirm-row total">
              <span>Total</span>
              <span>~{(MINT_FEE_STX + 0.001).toFixed(3)} STX</span>
            </div>
          </div>
        </div>
        <Modal.Footer>
          <Button variant="ghost" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleMint} loading={minting}>
            Confirm Mint
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default EventDetail;

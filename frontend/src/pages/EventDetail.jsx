import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { openContractCall } from '@stacks/connect';
import { fetchEvent, checkHasMinted, mintPOAP } from '../services/contractService';
import { useWallet } from '../context/WalletContext';
import { useToast } from '../context/ToastContext';
import { usePageTitle } from '../hooks/usePageTitle';
import SharePOAPButton from '../components/POAP/SharePOAPButton';
import './EventDetail.css';

export default function EventDetail() {
  const { eventId: id } = useParams();
  const { isConnected, walletAddress, connect } = useWallet();
  const { success, error: toastError, info } = useToast();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [minting, setMinting] = useState(false);
  const [hasMinted, setHasMinted] = useState(false);

  usePageTitle(
    event?.name || (id ? `Event #${id}` : 'Event'),
    event?.description?.slice(0, 140),
  );

  useEffect(() => {
    if (!id) return;
    fetchEvent(parseInt(id))
      .then(ev => {
        setEvent(ev);
        if (walletAddress) {
          checkHasMinted(parseInt(id), walletAddress).then(setHasMinted);
        }
      })
      .catch(() => toastError('Failed to load event'))
      .finally(() => setLoading(false));
  }, [id, walletAddress]);

  const handleMint = async () => {
    if (!isConnected) { connect(); return; }
    setMinting(true);
    try {
      info('Confirm the transaction in your wallet…');
      await mintPOAP(parseInt(id), walletAddress, openContractCall);
      success('POAP minted successfully!');
      setHasMinted(true);
    } catch (err) {
      toastError(err?.message || 'Minting failed');
    } finally {
      setMinting(false);
    }
  };

  if (loading) return (
    <div className="page"><div className="empty-state"><div className="spinner" /><p>Loading event…</p></div></div>
  );
  if (!event) return (
    <div className="page"><div className="empty-state"><span className="empty-icon">&#128269;</span><p>Event not found.</p><Link to="/events" className="btn btn-secondary btn-sm">Back to Events</Link></div></div>
  );

  const isActive = event.isActive;
  const isEnded = event.isEnded;

  return (
    <div className="page event-detail-page">
      <div className="detail-breadcrumb">
        <Link to="/events">Events</Link>
        <svg viewBox="0 0 6 10" fill="none" width="5" height="9"><path d="M1 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        <span>{event.name || `Event #${id}`}</span>
      </div>

      <div className="detail-grid">
        <div className="detail-main">
          <div className="detail-header">
            <div className="detail-icon">&#127942;</div>
            <div>
              <div className="detail-meta-row">
                <span className={`badge ${isActive ? 'badge-active' : isEnded ? 'badge-ended' : 'badge-upcoming'}`}>
                  {isActive ? 'Active' : isEnded ? 'Ended' : 'Upcoming'}
                </span>
                <span className="detail-id">ID #{id}</span>
              </div>
              <h1 className="detail-title">{event.name || `Event #${id}`}</h1>
              <SharePOAPButton eventName={event.name || `Event #${id}`} eventId={id} />
            </div>
          </div>

          <p className="detail-desc">{event.description || 'No description provided.'}</p>

          <div className="detail-stats-row">
            <div className="detail-stat">
              <span className="ds-value">{event.currentSupply || 0}</span>
              <span className="ds-label">Minted</span>
            </div>
            <div className="detail-stat">
              <span className="ds-value">{event.maxSupply || '∞'}</span>
              <span className="ds-label">Max Supply</span>
            </div>
            <div className="detail-stat">
              <span className="ds-value">0.025</span>
              <span className="ds-label">STX per Mint</span>
            </div>
          </div>

          <div className="detail-contract">
            <span className="detail-contract-label">Contract</span>
            <a href="https://explorer.stacks.co/txid/SP2KYZRNME33Y39GP3RKC90DQJ45EF1N0NZNVRE09.achievement-poap?chain=mainnet"
              target="_blank" rel="noopener noreferrer" className="detail-contract-addr">
              SP2KYZ…NVRE09.achievement-poap
              <svg viewBox="0 0 12 12" fill="none" width="10" height="10"><path d="M5 2H2v8h8V7M7 1h4v4M7 5l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </a>
          </div>
        </div>

        <div className="detail-sidebar">
          <div className="mint-card">
            <h2 className="mint-card-title">Collect this POAP</h2>
            <div className="mint-badge">
              <div className="mint-badge-icon">&#127942;</div>
              <div className="mint-badge-name">{event.name || `Event #${id}`}</div>
              <div className="mint-badge-fee">0.025 STX</div>
            </div>
            {hasMinted ? (
              <div className="mint-success-state">
                <span>&#9989;</span>
                <p>You own this POAP!</p>
                <Link to="/my-poaps" className="btn btn-secondary btn-sm" style={{marginTop:'1rem'}}>View Collection</Link>
              </div>
            ) : (
              <>
                {!isConnected ? (
                  <button className="btn btn-primary" style={{width:'100%'}} onClick={connect}>Connect Wallet to Mint</button>
                ) : !isActive ? (
                  <button className="btn btn-secondary" style={{width:'100%'}} disabled>
                    {isEnded ? 'Event Ended' : 'Not Yet Active'}
                  </button>
                ) : (
                  <button className="btn btn-primary" style={{width:'100%'}} onClick={handleMint} disabled={minting}>
                    {minting ? <><span className="spinner" style={{width:'14px',height:'14px',borderWidth:'2px'}} /> Minting…</> : 'Mint POAP · 0.025 STX'}
                  </button>
                )}
                <p className="mint-note">One POAP per wallet per event. Transaction on Stacks mainnet.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

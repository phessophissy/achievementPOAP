import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchUserPOAPs } from '../services/contractService';
import { useWallet } from '../context/WalletContext';
import { usePageTitle } from '../hooks/usePageTitle';
import './MyPOAPs.css';

export default function MyPOAPs() {
  usePageTitle('My POAPs', 'Your on-chain achievement collection on Stacks');
  const { isConnected, walletAddress, connect, shortenAddress } = useWallet();
  const [poaps, setPoaps] = useState([]);
  const [sort, setSort] = useState('newest');
  const [loading, setLoading] = useState(false);

  const sortedPoaps = useMemo(() => {
    const list = [...poaps];
    if (sort === 'name') return list.sort((a, b) => (a.eventName || '').localeCompare(b.eventName || ''));
    return list.sort((a, b) => Number(b.tokenId) - Number(a.tokenId));
  }, [poaps, sort]);

  useEffect(() => {
    if (!walletAddress) return;
    setLoading(true);
    fetchUserPOAPs(walletAddress)
      .then(setPoaps)
      .catch(() => setPoaps([]))
      .finally(() => setLoading(false));
  }, [walletAddress]);

  if (!isConnected) return (
    <div className="page">
      <div className="empty-state" style={{minHeight:'50vh'}}>
        <span className="empty-icon">&#128274;</span>
        <h2>Connect to see your POAPs</h2>
        <p>Your achievement collection lives on-chain. Connect your Stacks wallet to view it.</p>
        <button className="btn btn-primary" onClick={connect}>Connect Wallet</button>
      </div>
    </div>
  );

  return (
    <div className="page my-poaps-page">
      <div className="my-poaps-header">
        <div>
          <h1 className="page-title">My POAPs</h1>
          <p className="page-subtitle">
            {walletAddress && <span className="wallet-chip">{shortenAddress(walletAddress)}</span>}
            {' '}· {poaps.length} achievements collected
          </p>
        </div>
        <select className="poaps-sort" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort POAPs">
          <option value="newest">Newest first</option>
          <option value="name">Name A–Z</option>
        </select>
        <Link to="/events" className="btn btn-primary btn-sm">+ Collect More</Link>
      </div>

      {loading && (
        <div className="empty-state"><div className="spinner" /><p>Loading your collection…</p></div>
      )}

      {!loading && poaps.length === 0 && (
        <div className="empty-state" style={{minHeight:'40vh'}}>
          <span className="empty-icon">&#127885;</span>
          <h3>No POAPs yet</h3>
          <p>Start collecting achievement badges by participating in Stacks events.</p>
          <Link to="/events" className="btn btn-primary">Browse Events</Link>
        </div>
      )}

      <div className="poaps-grid">
        {sortedPoaps.map((poap) => (
          <div key={poap.tokenId} className="poap-card">
            <div className="poap-card-visual">
              <div className="poap-icon">&#127942;</div>
              <div className="poap-token-id">#{String(poap.tokenId).padStart(4,'0')}</div>
            </div>
            <div className="poap-card-info">
              <h3 className="poap-name">{poap.eventName || `POAP #${poap.tokenId}`}</h3>
              <p className="poap-event">Event #{poap.eventId}</p>
            </div>
            <div className="poap-card-footer">
              <a
                href={`https://explorer.stacks.co/address/${poap.owner}?chain=mainnet`}
                target="_blank" rel="noopener noreferrer"
                className="poap-explorer-link"
              >
                View on Explorer
                <svg viewBox="0 0 12 12" fill="none" width="10" height="10"><path d="M5 2H2v8h8V7M7 1h4v4M7 5l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

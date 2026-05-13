import React, { useState, useEffect } from 'react';
import { fetchPOAP, getTotalSupply } from '../services/contractService';
import './Gallery.css';

export default function Gallery() {
  const [poaps, setPoaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const supply = await getTotalSupply();
        setTotal(supply);
        // Load last 50 at most for performance
        const ids = Array.from({ length: Math.min(supply, 50) }, (_, i) => supply - i).filter(id => id > 0);
        const results = await Promise.allSettled(ids.map(id => fetchPOAP(id)));
        setPoaps(results.filter(r => r.status === 'fulfilled' && r.value).map(r => r.value));
      } catch (e) {
        setPoaps([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="page gallery-page">
      <div className="gallery-header">
        <h1 className="page-title">Gallery</h1>
        <p className="page-subtitle">All achievement POAPs minted on Stacks</p>
        {!loading && <span className="gallery-count badge">{total} total</span>}
      </div>

      {loading && (
        <div className="empty-state"><div className="spinner" /><p>Loading gallery…</p></div>
      )}

      {!loading && poaps.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">&#128444;</span>
          <p>No POAPs minted yet. Be the first to collect one!</p>
        </div>
      )}

      <div className="gallery-grid">
        {poaps.map((poap) => (
          <div key={poap.tokenId} className="gallery-card">
            <div className="gallery-visual">
              <div className="gallery-icon">&#127942;</div>
              <div className="gallery-token-id">#{String(poap.tokenId).padStart(4,'0')}</div>
            </div>
            <div className="gallery-info">
              <p className="gallery-name">{poap.eventName || `POAP #${poap.tokenId}`}</p>
              <p className="gallery-owner">
                {poap.owner ? poap.owner.slice(0,8) + '…' + poap.owner.slice(-4) : 'Unknown'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

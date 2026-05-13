import React, { useState, useEffect } from 'react';
import { fetchPOAP, getTotalSupply } from '../services/contractService';
import { useWallet } from '../context/WalletContext';
import './Leaderboard.css';

export default function Leaderboard() {
  const { walletAddress, shortenAddress } = useWallet();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const supply = await getTotalSupply();
        const ids = Array.from({ length: Math.min(supply, 200) }, (_, i) => i + 1);
        const results = await Promise.allSettled(ids.map(id => fetchPOAP(id)));
        const valid = results.filter(r => r.status === 'fulfilled' && r.value).map(r => r.value);

        // Tally by owner
        const tally = {};
        for (const p of valid) {
          if (!p.owner) continue;
          tally[p.owner] = (tally[p.owner] || 0) + 1;
        }
        const sorted = Object.entries(tally)
          .map(([address, count]) => ({ address, count }))
          .sort((a, b) => b.count - a.count);
        setEntries(sorted);
      } catch (e) {
        setEntries([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const getMedal = (rank) => {
    if (rank === 1) return '&#129351;';
    if (rank === 2) return '&#129352;';
    if (rank === 3) return '&#129353;';
    return null;
  };

  return (
    <div className="page leaderboard-page">
      <div className="lb-header">
        <h1 className="page-title">Leaderboard</h1>
        <p className="page-subtitle">Top collectors on the Stacks network by POAPs minted</p>
      </div>

      {loading && (
        <div className="empty-state"><div className="spinner" /><p>Loading leaderboard…</p></div>
      )}

      {!loading && entries.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">&#127885;</span>
          <p>No entries yet. Start minting to appear here!</p>
        </div>
      )}

      {!loading && entries.length > 0 && (
        <div className="lb-table-wrap">
          <table className="lb-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Wallet</th>
                <th>POAPs</th>
                <th>Explorer</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => {
                const rank = i + 1;
                const isMe = walletAddress && entry.address === walletAddress;
                return (
                  <tr key={entry.address} className={`lb-row ${isMe ? 'lb-row-me' : ''} ${rank <= 3 ? 'lb-row-top' : ''}`}>
                    <td className="lb-rank">
                      {rank <= 3
                        ? <span className="lb-medal">{['&#129351;','&#129352;','&#129353;'][rank-1]}</span>
                        : <span className="lb-num">#{rank}</span>}
                    </td>
                    <td className="lb-addr">
                      <span className="lb-addr-text">{shortenAddress(entry.address)}</span>
                      {isMe && <span className="lb-you-badge">You</span>}
                    </td>
                    <td className="lb-count">
                      <span className="lb-count-value">{entry.count}</span>
                      <span className="lb-count-label"> POAPs</span>
                    </td>
                    <td className="lb-explorer">
                      <a href={`https://explorer.stacks.co/address/${entry.address}?chain=mainnet`}
                        target="_blank" rel="noopener noreferrer" className="lb-explorer-link">
                        View
                        <svg viewBox="0 0 12 12" fill="none" width="9" height="9"><path d="M5 2H2v8h8V7M7 1h4v4M7 5l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

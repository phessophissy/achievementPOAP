/** @file frontend/src/pages/Leaderboard.jsx - Frontend module documenting responsibilities and expected usage. */
import React from 'react';
import Card from '../components/UI/Card';
import './Leaderboard.css';

function Leaderboard() {
  const leaders = [
    { rank: 1, address: 'SP1..2k3', count: 45, level: 'Legend', color: 'var(--gold)' },
    { rank: 2, address: 'SP2..4m5', count: 38, level: 'Elite', color: 'var(--vibrant-pink)' },
    { rank: 3, address: 'SP3..6n7', count: 31, level: 'Expert', color: 'var(--neon-cyan)' },
    { rank: 4, address: 'SP1..8p9', count: 28, level: 'Collector', color: 'var(--text-secondary)' },
    { rank: 5, address: 'SP2..1q2', count: 24, level: 'Collector', color: 'var(--text-secondary)' },
    { rank: 6, address: 'SP3..3r4', count: 19, level: 'Explorer', color: 'var(--text-secondary)' },
    { rank: 7, address: 'SP4..5s6', count: 17, level: 'Explorer', color: 'var(--text-secondary)' },
    { rank: 8, address: 'SP1..7t8', count: 14, level: 'Novice', color: 'var(--text-secondary)' },
    { rank: 9, address: 'SP2..9u0', count: 12, level: 'Novice', color: 'var(--text-secondary)' },
    { rank: 10, address: 'SP3..1v2', count: 10, level: 'Novice', color: 'var(--text-secondary)' },
  ];

  return (
    <div className="leaderboard-page">
      <div className="section-header">
        <h1 className="section-title">POAP Leaderboard</h1>
        <p className="section-subtitle">Top achievement collectors in the Stacks ecosystem</p>
      </div>

      <div className="leaderboard-grid">
        <div className="top-three">
          {leaders.slice(0, 3).map((leader) => (
            <Card key={leader.rank} className={`top-card rank-${leader.rank}`} hoverable>
              <div className="rank-badge" style={{ backgroundColor: leader.color }}>#{leader.rank}</div>
              <div className="leader-info">
                <div className="leader-address">{leader.address}</div>
                <div className="leader-level">{leader.level}</div>
                <div className="leader-count">{leader.count} <span>POAPs</span></div>
              </div>
            </Card>
          ))}
        </div>

        <div className="leaderboard-table-container glass">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Collector</th>
                <th>Level</th>
                <th>Total POAPs</th>
              </tr>
            </thead>
            <tbody>
              {leaders.slice(3).map((leader) => (
                <tr key={leader.rank}>
                  <td className="rank-cell">#{leader.rank}</td>
                  <td className="address-cell">{leader.address}</td>
                  <td className="level-cell"><span className="level-badge">{leader.level}</span></td>
                  <td className="count-cell">{leader.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;

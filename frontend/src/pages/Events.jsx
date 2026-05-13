import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchEvents } from '../services/contractService';
import './Events.css';

const FILTERS = ['All', 'Active', 'Upcoming', 'Ended'];

export default function Events() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents()
      .then(setEvents)
      .catch(() => setError('Failed to load events.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = events.filter(ev => {
    const matchSearch = ev.name?.toLowerCase().includes(search.toLowerCase()) ||
      ev.description?.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (filter === 'All') return true;
    if (filter === 'Active') return ev.isActive && !ev.isEnded;
    if (filter === 'Upcoming') return !ev.isActive && !ev.isEnded;
    if (filter === 'Ended') return ev.isEnded;
    return true;
  });

  const getStatus = (ev) => {
    if (ev.isEnded) return { label: 'Ended', cls: 'ended' };
    if (ev.isActive) return { label: 'Active', cls: 'active' };
    return { label: 'Upcoming', cls: 'upcoming' };
  };

  return (
    <div className="page events-page">
      <div className="events-header">
        <div>
          <h1 className="page-title">Events</h1>
          <p className="page-subtitle">Discover achievements to collect on Stacks</p>
        </div>
      </div>

      <div className="events-toolbar">
        <div className="search-wrap">
          <svg viewBox="0 0 20 20" fill="none" width="16" height="16" className="search-icon">
            <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M15 15l-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            type="text" className="search-input" placeholder="Search events…"
            value={search} onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          {FILTERS.map(f => (
            <button key={f} className={`filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="empty-state">
          <div className="spinner" />
          <p>Loading events…</p>
        </div>
      )}
      {error && (
        <div className="empty-state">
          <span className="empty-icon">⚠️</span>
          <p>{error}</p>
        </div>
      )}
      {!loading && !error && filtered.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">🔍</span>
          <p>No events found. Try adjusting your search or filter.</p>
        </div>
      )}

      <div className="events-grid">
        {filtered.map(ev => {
          const { label, cls } = getStatus(ev);
          return (
            <Link to={`/events/${ev.id}`} key={ev.id} className="event-card">
              <div className="event-card-header">
                <div className="event-icon">🏆</div>
                <span className={`badge badge-${cls}`}>{label}</span>
              </div>
              <div className="event-card-body">
                <h3 className="event-name">{ev.name || `Event #${ev.id}`}</h3>
                <p className="event-desc">{ev.description || 'No description.'}</p>
              </div>
              <div className="event-card-footer">
                <span className="event-meta">
                  <svg viewBox="0 0 16 16" fill="none" width="13" height="13">
                    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  {ev.mintedCount || 0} minted
                </span>
                <span className="event-meta event-mint-fee">0.025 STX</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

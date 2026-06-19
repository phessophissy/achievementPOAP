import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchEvents } from '../services/contractService';
import { useDebounce } from '../hooks/useDebounce';
import { usePageTitle } from '../hooks/usePageTitle';
import EventListSkeleton from '../components/UI/EventListSkeleton';
import './Events.css';

const FILTERS = ['All', 'Active', 'Upcoming', 'Ended'];
const SORT_OPTIONS = ['Newest', 'Name A–Z', 'Supply'];

export default function Events() {
  usePageTitle('Events', 'Browse and mint achievement POAPs on Stacks');
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('Newest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const debouncedSearch = useDebounce(search, 250);

  useEffect(() => {
    fetchEvents()
      .then(setEvents)
      .catch(() => setError('Failed to load events.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const list = events.filter((ev) => {
      const q = debouncedSearch.toLowerCase();
      const matchSearch =
        ev.name?.toLowerCase().includes(q) ||
        ev.description?.toLowerCase().includes(q);
      if (!matchSearch) return false;
      if (filter === 'All') return true;
      if (filter === 'Active') return ev.isActive && !ev.isEnded;
      if (filter === 'Upcoming') return !ev.isActive && !ev.isEnded;
      if (filter === 'Ended') return ev.isEnded;
      return true;
    });
    if (sort === 'Name A–Z') {
      return [...list].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }
    if (sort === 'Supply') {
      return [...list].sort((a, b) => (b.mintedCount || 0) - (a.mintedCount || 0));
    }
    return [...list].sort((a, b) => Number(b.id) - Number(a.id));
  }, [events, debouncedSearch, filter, sort]);

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
            type="text"
            className="search-input"
            placeholder="Search events…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              className={`filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <select
          className="events-sort"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="Sort events"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>

      {loading && <EventListSkeleton count={6} />}
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

      {!loading && !error && filtered.length > 0 && (
        <div className="events-grid">
          {filtered.map((ev) => {
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
                    {ev.mintedCount || 0} minted · 0.025 STX
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

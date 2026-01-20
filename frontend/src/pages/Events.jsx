import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { useToast } from '../context/ToastContext';
import { fetchEvents } from '../services/contractService';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import './Events.css';

function Events() {
  const { isConnected } = useWallet();
  const { error: showError } = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const eventsData = await fetchEvents();
      setEvents(eventsData);
    } catch (err) {
      showError('Failed to load events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getEventStatus = (event) => {
    const currentBlock = 150000; // This would come from API in production
    if (currentBlock < event.startBlock) return 'upcoming';
    if (currentBlock > event.endBlock) return 'ended';
    if (event.currentSupply >= event.maxSupply) return 'sold-out';
    return 'active';
  };

  const filteredEvents = events.filter((event) => {
    const status = getEventStatus(event);
    const matchesFilter = filter === 'all' || status === filter;
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading events..." />;
  }

  return (
    <div className="events-page">
      <div className="events-header">
        <div className="header-content">
          <h1 className="page-title">Explore Events</h1>
          <p className="page-subtitle">
            Discover and mint POAPs from active events
          </p>
        </div>
        {isConnected && (
          <Link to="/create-event">
            <Button icon="➕">Create Event</Button>
          </Link>
        )}
      </div>

      <div className="events-controls">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-tabs">
          {['all', 'active', 'upcoming', 'ended'].map((tab) => (
            <button
              key={tab}
              className={`filter-tab ${filter === tab ? 'active' : ''}`}
              onClick={() => setFilter(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎭</div>
          <h3>No Events Found</h3>
          <p>
            {filter !== 'all'
              ? `No ${filter} events at the moment.`
              : searchQuery
              ? 'Try a different search term.'
              : 'Be the first to create an event!'}
          </p>
          {isConnected && (
            <Link to="/create-event">
              <Button>Create First Event</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="events-grid">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} status={getEventStatus(event)} />
          ))}
        </div>
      )}
    </div>
  );
}

function EventCard({ event, status }) {
  const statusConfig = {
    active: { label: 'Active', className: 'active' },
    upcoming: { label: 'Upcoming', className: 'upcoming' },
    ended: { label: 'Ended', className: 'ended' },
    'sold-out': { label: 'Sold Out', className: 'ended' },
  };

  const { label, className } = statusConfig[status] || statusConfig.active;

  return (
    <Link to={`/events/${event.id}`} className="event-card-link">
      <Card hoverable className="event-card">
        <Card.Header>
          <div className="event-header-content">
            <span className="event-id">Event #{event.id}</span>
            <span className={`event-status ${className}`}>{label}</span>
          </div>
        </Card.Header>
        <Card.Body>
          <h3 className="event-name">{event.name}</h3>
          <p className="event-description">{event.description}</p>
          
          <div className="event-stats">
            <div className="event-stat">
              <span className="stat-icon">🎫</span>
              <span className="stat-text">
                {event.currentSupply} / {event.maxSupply} minted
              </span>
            </div>
            <div className="event-stat">
              <span className="stat-icon">💰</span>
              <span className="stat-text">0.025 STX</span>
            </div>
          </div>

          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${(event.currentSupply / event.maxSupply) * 100}%` }}
            ></div>
          </div>
        </Card.Body>
        <Card.Footer>
          <Button fullWidth disabled={status !== 'active'}>
            {status === 'active' ? 'Mint POAP' : status === 'upcoming' ? 'Coming Soon' : 'Event Ended'}
          </Button>
        </Card.Footer>
      </Card>
    </Link>
  );
}

export default Events;

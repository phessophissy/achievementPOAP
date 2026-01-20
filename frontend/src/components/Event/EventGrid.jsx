import React from 'react';
import EventCard from './EventCard';
import LoadingSpinner from '../UI/LoadingSpinner';
import './EventGrid.css';

const EventGrid = ({ events, loading, error, emptyMessage = 'No events found' }) => {
  if (loading) {
    return (
      <div className="event-grid-loading">
        <LoadingSpinner size="large" />
        <p>Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="event-grid-error">
        <span className="error-icon">⚠️</span>
        <h3>Failed to load events</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="event-grid-empty">
        <span className="empty-icon">📭</span>
        <h3>{emptyMessage}</h3>
        <p>Check back later for new events</p>
      </div>
    );
  }

  return (
    <div className="event-grid">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

export default EventGrid;

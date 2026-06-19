/** @file frontend/src/components/POAP/POAPCard.jsx - UI component module documenting rendering and interaction intent. */
import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../UI/Card';
import './POAPCard.css';

const POAPCard = ({ poap, showDetails = true }) => {
  if (!poap) return null;

  const event = poap.event || poap;

  return (
    <Card className="poap-card poap-card--interactive" hoverable>
      <div className="poap-card-image">
        {event.imageUri ? (
          <img src={event.imageUri} alt={event.name} loading="lazy" decoding="async" />
        ) : (
          <div className="poap-card-placeholder" aria-hidden="true">
            <span>🏆</span>
          </div>
        )}
        <div className="poap-card-badge">
          <span className="poap-owned">✓ Owned</span>
        </div>
      </div>
      
      <div className="poap-card-content">
        <h3 className="poap-card-title">{event.name}</h3>
        
        {showDetails && (
          <>
            {event.description && (
              <p className="poap-card-description">
                {event.description.length > 60 
                  ? `${event.description.substring(0, 60)}...` 
                  : event.description}
              </p>
            )}
            
            <Link to={`/events/${event.id || poap.eventId}`} className="poap-card-link" aria-label={`View event ${event.name}`}>
              View Event →
            </Link>
          </>
        )}
      </div>
    </Card>
  );
};

export default POAPCard;

// implement styling and layout for event-card-overflow — ref:fix/event-card-overflow#2 (1776635109939)

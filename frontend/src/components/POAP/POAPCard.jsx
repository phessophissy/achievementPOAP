import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../UI/Card';
import './POAPCard.css';

const POAPCard = ({ poap, showDetails = true }) => {
  if (!poap) return null;

  const event = poap.event || poap;

  return (
    <Card className="poap-card" hoverable>
      <div className="poap-card-image">
        {event.imageUri ? (
          <img src={event.imageUri} alt={event.name} loading="lazy" />
        ) : (
          <div className="poap-card-placeholder">
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
            
            <Link to={`/events/${event.id || poap.eventId}`} className="poap-card-link">
              View Event →
            </Link>
          </>
        )}
      </div>
    </Card>
  );
};

export default POAPCard;

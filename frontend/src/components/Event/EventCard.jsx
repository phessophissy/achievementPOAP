import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../UI/Card';
import Badge from '../UI/Badge';
import ProgressBar from '../UI/ProgressBar';
import { formatDate, getEventStatus, getProgress } from '../../utils/helpers';
import './EventCard.css';

const EventCard = ({ event, showProgress = true }) => {
  if (!event) return null;

  const status = getEventStatus(event);
  const progress = getProgress(event.currentMints, event.maxMints);
  const isActive = status.label === 'Active';

  return (
    <Link to={`/events/${event.id}`} className="event-card-link">
      <Card className={`event-card ${isActive ? 'active' : ''}`} hoverable>
        <div className="event-card-image">
          {event.imageUri ? (
            <img src={event.imageUri} alt={event.name} loading="lazy" />
          ) : (
            <div className="event-card-placeholder">
              <span>🏆</span>
            </div>
          )}
          <div className="event-card-overlay">
            <Badge variant={status.className.replace('badge-', '')}>{status.label}</Badge>
          </div>
        </div>
        
        <div className="event-card-content">
          <h3 className="event-card-title">{event.name}</h3>
          
          {event.description && (
            <p className="event-card-description">
              {event.description.length > 80 
                ? `${event.description.substring(0, 80)}...` 
                : event.description}
            </p>
          )}
          
          <div className="event-card-meta">
            <div className="event-card-date">
              <span className="meta-label">Ends</span>
              <span className="meta-value">{formatDate(event.endTime, { month: 'short', day: 'numeric' })}</span>
            </div>
            <div className="event-card-mints">
              <span className="meta-label">Minted</span>
              <span className="meta-value">{event.currentMints} / {event.maxMints}</span>
            </div>
          </div>
          
          {showProgress && (
            <ProgressBar 
              value={event.currentMints} 
              max={event.maxMints} 
              showLabel={false}
              size="small"
              variant={progress >= 90 ? 'error' : progress >= 70 ? 'warning' : 'gold'}
            />
          )}
        </div>
      </Card>
    </Link>
  );
};

export default EventCard;

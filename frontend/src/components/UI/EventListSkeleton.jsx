import React from 'react';
import Skeleton from './Skeleton';
import './EventListSkeleton.css';

export default function EventListSkeleton({ count = 6 }) {
  return (
    <div className="event-list-skeleton" aria-busy="true" aria-label="Loading events">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="event-skeleton-card">
          <Skeleton width="48px" height="48px" variant="circle" />
          <div className="event-skeleton-body">
            <Skeleton width="60%" height="18px" />
            <Skeleton width="90%" height="14px" />
            <Skeleton width="40%" height="12px" />
          </div>
        </div>
      ))}
    </div>
  );
}

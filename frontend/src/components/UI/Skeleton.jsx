import React from 'react';
import './Skeleton.css';

const Skeleton = ({ 
  variant = 'text', 
  width, 
  height, 
  count = 1, 
  className = '' 
}) => {
  const items = Array.from({ length: count }, (_, i) => i);

  const getStyles = () => {
    const styles = {};
    if (width) styles.width = typeof width === 'number' ? `${width}px` : width;
    if (height) styles.height = typeof height === 'number' ? `${height}px` : height;
    return styles;
  };

  return (
    <>
      {items.map((i) => (
        <div
          key={i}
          className={`skeleton skeleton-${variant} ${className}`}
          style={getStyles()}
        />
      ))}
    </>
  );
};

// Card Skeleton Component
export const CardSkeleton = () => (
  <div className="skeleton-card">
    <Skeleton variant="rectangular" height={180} />
    <div className="skeleton-card-content">
      <Skeleton variant="text" width="80%" height={24} />
      <Skeleton variant="text" width="60%" height={16} />
      <Skeleton variant="text" width="40%" height={16} />
    </div>
  </div>
);

// List Skeleton Component
export const ListSkeleton = ({ items = 3 }) => (
  <div className="skeleton-list">
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="skeleton-list-item">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="skeleton-list-content">
          <Skeleton variant="text" width="60%" height={20} />
          <Skeleton variant="text" width="40%" height={16} />
        </div>
      </div>
    ))}
  </div>
);

export default Skeleton;

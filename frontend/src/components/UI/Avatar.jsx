import React from 'react';
import './Avatar.css';

const Avatar = ({
  src,
  alt = '',
  size = 'medium',
  fallback = null,
  className = '',
}) => {
  const [error, setError] = React.useState(false);

  const getFallback = () => {
    if (fallback) return fallback;
    if (alt) return alt.charAt(0).toUpperCase();
    return '?';
  };

  return (
    <div className={`avatar avatar-${size} ${className}`}>
      {src && !error ? (
        <img
          src={src}
          alt={alt}
          onError={() => setError(true)}
          className="avatar-image"
        />
      ) : (
        <span className="avatar-fallback">{getFallback()}</span>
      )}
    </div>
  );
};

export default Avatar;

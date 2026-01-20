import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/UI/Button';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <span className="not-found-icon">🔍</span>
        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">Page Not Found</h2>
        <p className="not-found-description">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="not-found-actions">
          <Link to="/">
            <Button variant="primary" size="large">
              Go Home
            </Button>
          </Link>
          <Link to="/events">
            <Button variant="outline" size="large">
              Browse Events
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../UI/Card';
import './FeatureCard.css';

const FeatureCard = ({
  icon,
  title,
  description,
  link = null,
  linkText = 'Learn More',
  className = '',
}) => {
  return (
    <Card className={`feature-card ${className}`} hoverable>
      <div className="feature-icon">{icon}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
      {link && (
        <Link to={link} className="feature-link">
          {linkText} →
        </Link>
      )}
    </Card>
  );
};

export default FeatureCard;

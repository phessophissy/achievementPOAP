import React from 'react';
import './Hero.css';

const Hero = ({
  title,
  subtitle,
  backgroundImage = null,
  action = null,
  stats = null,
  children,
  className = '',
}) => {
  return (
    <section
      className={`hero ${className}`}
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}}
    >
      <div className="hero-overlay" />
      <div className="hero-content">
        <h1 className="hero-title">{title}</h1>
        {subtitle && <p className="hero-subtitle">{subtitle}</p>}
        {action && <div className="hero-action">{action}</div>}
        {stats && (
          <div className="hero-stats">
            {stats.map((stat, index) => (
              <div key={index} className="hero-stat">
                <span className="hero-stat-value">{stat.value}</span>
                <span className="hero-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        )}
        {children}
      </div>
    </section>
  );
};

export default Hero;

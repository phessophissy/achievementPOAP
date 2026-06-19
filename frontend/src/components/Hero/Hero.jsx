/** @file frontend/src/components/Hero/Hero.jsx - UI component module documenting rendering and interaction intent. */
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
      aria-labelledby="hero-title"
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}}
    >
      <div className="hero-overlay" />
      <div className="hero-content">
        <h1 id="hero-title" className="hero-title">{title}</h1>
        {subtitle && <p className="hero-subtitle" id="hero-subtitle">{subtitle}</p>}
        {action && <div className="hero-action">{action}</div>}
        {stats && (
          <div className="hero-stats" role="list">
            {stats.map((stat, index) => (
              <div key={index} className="hero-stat" role="listitem">
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

// optimize performance for scroll-to-top — ref:feat/scroll-to-top#8 (1776634618329)

import React from 'react';
import './Timeline.css';

const Timeline = ({ items, className = '' }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className={`timeline ${className}`}>
      {items.map((item, index) => (
        <div key={item.id || index} className="timeline__item">
          <div className="timeline__marker">
            <div className={`timeline__dot timeline__dot--${item.status || 'default'}`}>
              {item.icon}
            </div>
            {index < items.length - 1 && <div className="timeline__line" />}
          </div>
          <div className="timeline__content">
            {item.date && <time className="timeline__date">{item.date}</time>}
            <h4 className="timeline__title">{item.title}</h4>
            {item.description && (
              <p className="timeline__description">{item.description}</p>
            )}
            {item.content && <div className="timeline__body">{item.content}</div>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;

import React from 'react';
import './Testimonial.css';

const Testimonial = ({ quote, author, role, avatar, className = '' }) => {
  return (
    <div className={`testimonial ${className}`}>
      <blockquote className="testimonial-quote">"{quote}"</blockquote>
      <div className="testimonial-author">
        {avatar && (
          <img src={avatar} alt={author} className="testimonial-avatar" />
        )}
        <div className="testimonial-info">
          <span className="testimonial-name">{author}</span>
          {role && <span className="testimonial-role">{role}</span>}
        </div>
      </div>
    </div>
  );
};

export default Testimonial;

import React from 'react';
import './Divider.css';

const Divider = ({
  text = null,
  orientation = 'horizontal',
  className = '',
}) => {
  if (!text) {
    return (
      <hr
        className={`divider divider-${orientation} ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <div className={`divider-with-text ${className}`}>
      <hr className="divider" />
      <span className="divider-text">{text}</span>
      <hr className="divider" />
    </div>
  );
};

export default Divider;

import React from 'react';
import './LoadingSpinner.css';

function LoadingSpinner({ size = 'medium', fullScreen = false, text = '' }) {
  const spinner = (
    <div className={`spinner-container ${size}`}>
      <div className="spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-core"></div>
      </div>
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return <div className="spinner-fullscreen">{spinner}</div>;
  }

  return spinner;
}

export default LoadingSpinner;

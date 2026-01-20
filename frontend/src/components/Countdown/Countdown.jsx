import React from 'react';
import { useCountdown } from '../../hooks/useContract';
import './Countdown.css';

const Countdown = ({ endTime, label = 'Time Remaining', onExpire = null }) => {
  const { days, hours, minutes, seconds, expired } = useCountdown(endTime);

  React.useEffect(() => {
    if (expired && onExpire) {
      onExpire();
    }
  }, [expired, onExpire]);

  if (expired) {
    return (
      <div className="countdown expired">
        <span className="countdown-label">{label}</span>
        <span className="countdown-expired-text">Event has ended</span>
      </div>
    );
  }

  return (
    <div className="countdown">
      <span className="countdown-label">{label}</span>
      <div className="countdown-timer">
        <div className="countdown-unit">
          <span className="countdown-value">{String(days).padStart(2, '0')}</span>
          <span className="countdown-unit-label">Days</span>
        </div>
        <span className="countdown-separator">:</span>
        <div className="countdown-unit">
          <span className="countdown-value">{String(hours).padStart(2, '0')}</span>
          <span className="countdown-unit-label">Hours</span>
        </div>
        <span className="countdown-separator">:</span>
        <div className="countdown-unit">
          <span className="countdown-value">{String(minutes).padStart(2, '0')}</span>
          <span className="countdown-unit-label">Mins</span>
        </div>
        <span className="countdown-separator">:</span>
        <div className="countdown-unit">
          <span className="countdown-value">{String(seconds).padStart(2, '0')}</span>
          <span className="countdown-unit-label">Secs</span>
        </div>
      </div>
    </div>
  );
};

export default Countdown;

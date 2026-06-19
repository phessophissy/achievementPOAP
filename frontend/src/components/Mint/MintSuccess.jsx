/** @file frontend/src/components/Mint/MintSuccess.jsx - UI component module documenting rendering and interaction intent. */
import React from 'react';
import Card from '../UI/Card';
import Badge from '../UI/Badge';
import './MintSuccess.css';

const MintSuccess = ({ event, txId }) => {
  if (!event) return null;

  return (
    <Card className="mint-success">
      <div className="success-animation">
        <div className="success-checkmark">
          <span>✓</span>
        </div>
      </div>

      <h2 className="success-title">Congratulations! 🎉</h2>
      <p className="success-message">You've successfully minted your POAP!</p>
      <p className="success-hint">Share your achievement from the event page.</p>

      <div className="success-poap">
        {event.imageUri ? (
          <img src={event.imageUri} alt={event.name} className="success-image" />
        ) : (
          <div className="success-placeholder">🏆</div>
        )}
        <h3 className="success-event-name">{event.name}</h3>
        <Badge variant="success">Owned</Badge>
      </div>

      {txId && (
        <a
          href={`https://explorer.stacks.co/txid/${txId}?chain=mainnet`}
          target="_blank"
          rel="noopener noreferrer"
          className="success-tx-link"
        >
          View Transaction on Explorer →
        </a>
      )}
    </Card>
  );
};

export default MintSuccess;

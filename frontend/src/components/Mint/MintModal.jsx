import React from 'react';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import { formatSTX } from '../../utils/helpers';
import { MINT_FEE } from '../../config/constants';
import './MintModal.css';

const MintModal = ({
  isOpen,
  onClose,
  event,
  onConfirm,
  loading = false,
}) => {
  if (!event) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Minting">
      <div className="mint-modal">
        <div className="mint-modal-preview">
          {event.imageUri ? (
            <img src={event.imageUri} alt={event.name} />
          ) : (
            <div className="mint-modal-placeholder">🏆</div>
          )}
        </div>

        <div className="mint-modal-info">
          <h3 className="mint-modal-title">{event.name}</h3>
          <p className="mint-modal-description">{event.description}</p>
        </div>

        <div className="mint-modal-details">
          <div className="detail-row">
            <span className="detail-label">Minting Fee</span>
            <span className="detail-value">{formatSTX(MINT_FEE)} STX</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Network Fee</span>
            <span className="detail-value">~0.001 STX</span>
          </div>
          <div className="detail-row total">
            <span className="detail-label">Total</span>
            <span className="detail-value">~{formatSTX(MINT_FEE + 1000)} STX</span>
          </div>
        </div>

        <p className="mint-modal-note">
          By minting this POAP, you confirm your attendance at this event.
          This action is irreversible.
        </p>

        <div className="mint-modal-actions">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onConfirm} loading={loading}>
            {loading ? 'Minting...' : 'Confirm Mint'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default MintModal;

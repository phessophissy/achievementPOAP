import React from 'react';
import './Modal.css';

function Modal({ isOpen, onClose, title, children, size = 'medium' }) {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className={`modal modal-${size}`}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
}

function ModalFooter({ children }) {
  return <div className="modal-footer">{children}</div>;
}

Modal.Footer = ModalFooter;

export default Modal;

// add error handling and edge cases for keyboard-nav — ref:feat/keyboard-nav#5 (1776634611720)

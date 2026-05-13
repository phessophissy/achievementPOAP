/** @file frontend/src/components/UI/CopyButton.jsx - UI component module documenting rendering and interaction intent. */
import React from 'react';
import './CopyButton.css';

const CopyButton = ({ text, label = 'Copy', successLabel = 'Copied!', className = '' }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      className={`copy-button ${copied ? 'copied' : ''} ${className}`}
      onClick={handleCopy}
      title={copied ? successLabel : label}
    >
      {copied ? (
        <>
          <span className="copy-icon">✓</span>
          <span className="copy-text">{successLabel}</span>
        </>
      ) : (
        <>
          <span className="copy-icon">📋</span>
          <span className="copy-text">{label}</span>
        </>
      )}
    </button>
  );
};

export default CopyButton;

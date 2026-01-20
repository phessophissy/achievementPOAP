import React from 'react';
import CopyButton from './CopyButton';
import { formatAddress } from '../../utils/helpers';
import './AddressDisplay.css';

const AddressDisplay = ({
  address,
  startChars = 8,
  endChars = 6,
  showCopy = true,
  showExplorer = true,
  full = false,
  className = '',
}) => {
  if (!address) return null;

  const displayAddress = full ? address : formatAddress(address, startChars, endChars);
  const explorerUrl = `https://explorer.stacks.co/address/${address}?chain=mainnet`;

  return (
    <div className={`address-display ${className}`}>
      <code className="address-text" title={address}>
        {displayAddress}
      </code>
      <div className="address-actions">
        {showCopy && (
          <CopyButton text={address} className="compact icon-only" />
        )}
        {showExplorer && (
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="address-explorer-link"
            title="View on Explorer"
          >
            ↗
          </a>
        )}
      </div>
    </div>
  );
};

export default AddressDisplay;

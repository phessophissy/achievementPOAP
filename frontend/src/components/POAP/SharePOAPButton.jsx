import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import './SharePOAPButton.css';

export default function SharePOAPButton({ eventName, eventId }) {
  const { success, error } = useToast();
  const [open, setOpen] = useState(false);

  const url = typeof window !== 'undefined'
    ? `${window.location.origin}/events/${eventId}`
    : '';

  const share = async () => {
    const text = `I collected a POAP for ${eventName} on Achievement POAP (Stacks)!`;
    try {
      if (navigator.share) {
        await navigator.share({ title: eventName, text, url });
        success('Shared successfully');
      } else {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        success('Link copied to clipboard');
      }
    } catch (err) {
      if (err?.name !== 'AbortError') error('Could not share');
    }
    setOpen(false);
  };

  return (
    <div className="share-poap-wrap">
      <button type="button" className="btn btn-secondary btn-sm" onClick={() => setOpen(!open)} aria-expanded={open}>
        Share
      </button>
      {open && (
        <div className="share-poap-menu" role="menu">
          <button type="button" role="menuitem" onClick={share}>Copy / native share</button>
          <a
            role="menuitem"
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I earned a POAP at ${eventName}!`)}&url=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
          >
            Post on X
          </a>
        </div>
      )}
    </div>
  );
}

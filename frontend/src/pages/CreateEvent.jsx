import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { openContractCall } from '@stacks/connect';
import { createEvent } from '../services/contractService';
import { useWallet } from '../context/WalletContext';
import { useToast } from '../context/ToastContext';
import './CreateEvent.css';

// Rough estimate: show approximate date from block number (10 min/block from a known anchor)
const ANCHOR_BLOCK = 7948528;
const ANCHOR_MS = new Date('2026-05-13T21:40:52Z').getTime();
const blockToDate = (block) => {
  if (!block || isNaN(Number(block)) || Number(block) === 0) return null;
  const ms = ANCHOR_MS + (Number(block) - ANCHOR_BLOCK) * 10 * 60 * 1000;
  return new Date(ms).toUTCString().replace(':00 GMT', ' UTC');
};

export default function CreateEvent() {
  const { isConnected, connect } = useWallet();
  const { success, error: toastError, info } = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [form, setForm] = useState({
    name:        params.get('name')        || '',
    description: params.get('description') || '',
    maxSupply:   params.get('maxSupply')   || '',
    startBlock:  params.get('startBlock')  || '',
    endBlock:    params.get('endBlock')    || '',
    metadataUri: params.get('metadataUri') || '',
  });
  const [submitting, setSubmitting] = useState(false);

  if (!isConnected) return (
    <div className="page">
      <div className="empty-state" style={{minHeight:'50vh'}}>
        <span className="empty-icon">&#128274;</span>
        <h2>Connect Wallet to Create Events</h2>
        <p>You need a connected Stacks wallet to create events.</p>
        <button className="btn btn-primary" onClick={connect}>Connect Wallet</button>
      </div>
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toastError('Event name is required'); return; }
    setSubmitting(true);
    try {
      info('Confirm the transaction in your wallet…');
      await createEvent({
        name: form.name,
        description: form.description,
        maxSupply: parseInt(form.maxSupply) || 0,
        startBlock: parseInt(form.startBlock) || 0,
        endBlock: parseInt(form.endBlock) || 0,
        metadataUri: form.metadataUri || '',
      }, openContractCall);
      success('Event created successfully!');
      navigate('/events');
    } catch (err) {
      toastError(err?.message || 'Failed to create event');
    } finally {
      setSubmitting(false);
    }
  };

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="page create-event-page">
      <div className="create-header">
        <h1 className="page-title">Create Event</h1>
        <p className="page-subtitle">Launch a new achievement POAP on Stacks mainnet</p>
      </div>

      <div className="create-grid">
        <form className="create-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Event Name <span className="required">*</span></label>
            <input
              id="name" type="text" className="input"
              placeholder="e.g. Stacks Hackathon 2025"
              value={form.name} onChange={set('name')} maxLength={64}
              required
            />
            <span className="form-hint">{form.name.length}/64</span>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">Description</label>
            <textarea
              id="description" className="input input-textarea"
              placeholder="Describe the achievement or event…"
              value={form.description} onChange={set('description')} rows={4} maxLength={256}
            />
            <span className="form-hint">{form.description.length}/256</span>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="maxSupply">Max Supply <span className="form-label-note">(0 = unlimited)</span></label>
            <input
              id="maxSupply" type="number" className="input" min="0"
              placeholder="0"
              value={form.maxSupply} onChange={set('maxSupply')}
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label" htmlFor="startBlock">Start Block <span className="form-label-note">(0 = immediate)</span></label>
              <input
                id="startBlock" type="number" className="input" min="0"
                placeholder="0"
                value={form.startBlock} onChange={set('startBlock')}
              />
              {blockToDate(form.startBlock) && (
                <span className="form-hint">≈ {blockToDate(form.startBlock)}</span>
              )}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="endBlock">End Block <span className="form-label-note">(0 = no end)</span></label>
              <input
                id="endBlock" type="number" className="input" min="0"
                placeholder="0"
                value={form.endBlock} onChange={set('endBlock')}
              />
              {blockToDate(form.endBlock) && (
                <span className="form-hint">≈ {blockToDate(form.endBlock)}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="metadataUri">Metadata URI <span className="form-label-note">(optional)</span></label>
            <input
              id="metadataUri" type="url" className="input"
              placeholder="https://example.com/metadata.json"
              value={form.metadataUri} onChange={set('metadataUri')} maxLength={256}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{width:'100%',padding:'.875rem'}} disabled={submitting}>
            {submitting ? <><span className="spinner" style={{width:'14px',height:'14px',borderWidth:'2px'}} /> Creating…</> : 'Create Event'}
          </button>
        </form>

        <div className="create-info">
          <div className="info-card">
            <h3>What happens next?</h3>
            <div className="info-steps">
              <div className="info-step">
                <span className="info-step-num">1</span>
                <p>A Clarity transaction is submitted to the Stacks mainnet smart contract.</p>
              </div>
              <div className="info-step">
                <span className="info-step-num">2</span>
                <p>Once confirmed, your event is live and visible in the Events page.</p>
              </div>
              <div className="info-step">
                <span className="info-step-num">3</span>
                <p>Participants can mint POAPs for 0.025 STX each — up to your max supply.</p>
              </div>
            </div>
          </div>
          <div className="info-card info-fee">
            <div className="fee-row">
              <span>Creation fee</span>
              <span className="fee-val">~0.001 STX</span>
            </div>
            <div className="fee-row">
              <span>Mint fee per POAP</span>
              <span className="fee-val">0.025 STX</span>
            </div>
            <div className="fee-row">
              <span>Network</span>
              <span className="fee-val">Stacks Mainnet</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

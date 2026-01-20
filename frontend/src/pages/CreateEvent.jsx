import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { useToast } from '../context/ToastContext';
import { createEvent } from '../services/contractService';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import './CreateEvent.css';

function CreateEvent() {
  const { isConnected, walletAddress, connect } = useWallet();
  const { success, error: showError, info } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    maxSupply: '',
    startBlock: '',
    endBlock: '',
    metadataUri: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Event name is required';
    } else if (formData.name.length > 64) {
      newErrors.name = 'Name must be 64 characters or less';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 256) {
      newErrors.description = 'Description must be 256 characters or less';
    }

    if (!formData.maxSupply) {
      newErrors.maxSupply = 'Max supply is required';
    } else if (parseInt(formData.maxSupply) < 1) {
      newErrors.maxSupply = 'Max supply must be at least 1';
    }

    if (!formData.startBlock) {
      newErrors.startBlock = 'Start block is required';
    }

    if (!formData.endBlock) {
      newErrors.endBlock = 'End block is required';
    } else if (parseInt(formData.endBlock) <= parseInt(formData.startBlock)) {
      newErrors.endBlock = 'End block must be greater than start block';
    }

    if (!formData.metadataUri.trim()) {
      newErrors.metadataUri = 'Metadata URI is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isConnected) {
      connect();
      return;
    }

    if (!validateForm()) {
      showError('Please fix the errors in the form');
      return;
    }

    setSubmitting(true);
    info('Creating event transaction...');

    try {
      const result = await createEvent({
        name: formData.name.trim(),
        description: formData.description.trim(),
        maxSupply: parseInt(formData.maxSupply),
        startBlock: parseInt(formData.startBlock),
        endBlock: parseInt(formData.endBlock),
        metadataUri: formData.metadataUri.trim(),
      });

      success('Event created successfully! 🎉');
      navigate('/events');
    } catch (err) {
      showError(err.message || 'Failed to create event');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="create-event not-connected">
        <div className="connect-prompt">
          <div className="prompt-icon">➕</div>
          <h2>Connect Your Wallet</h2>
          <p>You need to connect your wallet to create events.</p>
          <Button size="large" onClick={connect}>
            Connect Wallet
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="create-event">
      <div className="page-header">
        <h1 className="page-title">Create Event</h1>
        <p className="page-subtitle">
          Create a new POAP event for participants to mint
        </p>
      </div>

      <div className="form-container">
        <Card>
          <Card.Body>
            <form onSubmit={handleSubmit} className="event-form">
              <div className="form-group">
                <label htmlFor="name">Event Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="e.g., Stacks Hackathon 2026"
                  value={formData.name}
                  onChange={handleChange}
                  maxLength={64}
                />
                <div className="field-footer">
                  <span className="error-message">{errors.name}</span>
                  <span className="char-count">{formData.name.length}/64</span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  className={`form-input form-textarea ${errors.description ? 'error' : ''}`}
                  placeholder="Describe your event..."
                  value={formData.description}
                  onChange={handleChange}
                  maxLength={256}
                  rows={4}
                />
                <div className="field-footer">
                  <span className="error-message">{errors.description}</span>
                  <span className="char-count">{formData.description.length}/256</span>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="maxSupply">Max Supply *</label>
                  <input
                    type="number"
                    id="maxSupply"
                    name="maxSupply"
                    className={`form-input ${errors.maxSupply ? 'error' : ''}`}
                    placeholder="e.g., 1000"
                    value={formData.maxSupply}
                    onChange={handleChange}
                    min={1}
                  />
                  <span className="error-message">{errors.maxSupply}</span>
                </div>

                <div className="form-group">
                  <label htmlFor="startBlock">Start Block *</label>
                  <input
                    type="number"
                    id="startBlock"
                    name="startBlock"
                    className={`form-input ${errors.startBlock ? 'error' : ''}`}
                    placeholder="e.g., 150000"
                    value={formData.startBlock}
                    onChange={handleChange}
                    min={1}
                  />
                  <span className="error-message">{errors.startBlock}</span>
                </div>

                <div className="form-group">
                  <label htmlFor="endBlock">End Block *</label>
                  <input
                    type="number"
                    id="endBlock"
                    name="endBlock"
                    className={`form-input ${errors.endBlock ? 'error' : ''}`}
                    placeholder="e.g., 200000"
                    value={formData.endBlock}
                    onChange={handleChange}
                    min={1}
                  />
                  <span className="error-message">{errors.endBlock}</span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="metadataUri">Metadata URI *</label>
                <input
                  type="text"
                  id="metadataUri"
                  name="metadataUri"
                  className={`form-input ${errors.metadataUri ? 'error' : ''}`}
                  placeholder="e.g., ipfs://QmXxx.../metadata.json"
                  value={formData.metadataUri}
                  onChange={handleChange}
                />
                <span className="error-message">{errors.metadataUri}</span>
                <span className="help-text">
                  IPFS link or URL to the event's metadata JSON
                </span>
              </div>

              <div className="form-actions">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate('/events')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="large"
                  loading={submitting}
                  disabled={submitting}
                >
                  {submitting ? 'Creating...' : 'Create Event'}
                </Button>
              </div>
            </form>
          </Card.Body>
        </Card>

        <Card className="info-card">
          <Card.Body>
            <h3>📋 Event Guidelines</h3>
            <ul className="guidelines-list">
              <li>
                <strong>Name:</strong> Keep it short and memorable (max 64 characters)
              </li>
              <li>
                <strong>Description:</strong> Clearly describe what the event is about
              </li>
              <li>
                <strong>Max Supply:</strong> Total number of POAPs that can be minted
              </li>
              <li>
                <strong>Block Range:</strong> The event will only be mintable between these blocks
              </li>
              <li>
                <strong>Metadata URI:</strong> Should point to a JSON file with event details and image
              </li>
            </ul>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default CreateEvent;

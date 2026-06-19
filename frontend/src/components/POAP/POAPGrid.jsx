/** @file frontend/src/components/POAP/POAPGrid.jsx - UI component module documenting rendering and interaction intent. */
import React from 'react';
import './POAPGrid.css';
import POAPCard from './POAPCard';
import LoadingSpinner from '../UI/LoadingSpinner';

const POAPGrid = ({ poaps, loading, error, emptyMessage = 'No POAPs found' }) => {
  if (loading) {
    return (
      <div className="poap-grid-loading">
        <LoadingSpinner size="large" />
        <p>Loading POAPs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="poap-grid-error">
        <span className="error-icon">⚠️</span>
        <h3>Failed to load POAPs</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!poaps || poaps.length === 0) {
    return (
      <div className="poap-grid-empty">
        <span className="empty-icon">🏆</span>
        <h3>{emptyMessage}</h3>
        <p>Start minting POAPs to build your collection</p>
      </div>
    );
  }

  return (
    <div className="poap-grid" role="list">
      {poaps.map((poap, index) => (
        <POAPCard key={poap.tokenId || poap.id || index} poap={poap} />
      ))}
    </div>
  );
};

export default POAPGrid;

// implement styling and layout for drag-sort-gallery — ref:feat/drag-sort-gallery#2 (1776635022376)

/** @file frontend/src/components/Search/SearchBar.jsx - UI component module documenting rendering and interaction intent. */
import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
}) => {
  const [focused, setFocused] = useState(false);

  const handleClear = () => {
    onChange({ target: { value: '' } });
  };

  return (
    <div className={`search-bar ${focused ? 'focused' : ''} ${className}`}>
      <span className="search-icon">🔍</span>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="search-input"
      />
      {value && (
        <button className="search-clear" onClick={handleClear}>
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;

// scaffold initial structure for search-autocomplete — ref:feat/search-autocomplete#0 (1776634950770)

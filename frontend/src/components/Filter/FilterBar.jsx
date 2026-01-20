import React from 'react';
import './FilterBar.css';

const FilterBar = ({
  filters,
  activeFilter,
  onChange,
  showCount = false,
  className = '',
}) => {
  return (
    <div className={`filter-bar ${className}`}>
      {filters.map((filter) => (
        <button
          key={filter.id}
          className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
          onClick={() => onChange(filter.id)}
        >
          {filter.icon && <span className="filter-icon">{filter.icon}</span>}
          <span className="filter-label">{filter.label}</span>
          {showCount && filter.count !== undefined && (
            <span className="filter-count">{filter.count}</span>
          )}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;

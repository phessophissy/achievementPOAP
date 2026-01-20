import React, { useState, useRef, useEffect } from 'react';
import './Dropdown.css';

const Dropdown = ({
  trigger,
  children,
  placement = 'bottom-start',
  closeOnSelect = true,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleTriggerClick = () => setIsOpen(!isOpen);
  
  const handleSelect = () => {
    if (closeOnSelect) setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`dropdown ${className}`}>
      <div
        ref={triggerRef}
        className="dropdown__trigger"
        onClick={handleTriggerClick}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {trigger}
      </div>
      {isOpen && (
        <div className={`dropdown__menu dropdown__menu--${placement}`} role="menu">
          <div onClick={handleSelect}>{children}</div>
        </div>
      )}
    </div>
  );
};

export const DropdownItem = ({ children, onClick, disabled, icon, className = '' }) => (
  <button
    className={`dropdown__item ${disabled ? 'dropdown__item--disabled' : ''} ${className}`}
    onClick={onClick}
    disabled={disabled}
    role="menuitem"
  >
    {icon && <span className="dropdown__item-icon">{icon}</span>}
    {children}
  </button>
);

export const DropdownDivider = () => <div className="dropdown__divider" role="separator" />;

export default Dropdown;

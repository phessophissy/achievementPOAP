import React from 'react';
import './Accordion.css';

const Accordion = ({ items, allowMultiple = false, className = '' }) => {
  const [openItems, setOpenItems] = React.useState(new Set());

  const toggleItem = (id) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        if (!allowMultiple) newSet.clear();
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className={`accordion ${className}`}>
      {items.map((item, index) => {
        const id = item.id || index;
        const isOpen = openItems.has(id);
        return (
          <div key={id} className={`accordion__item ${isOpen ? 'accordion__item--open' : ''}`}>
            <button
              className="accordion__header"
              onClick={() => toggleItem(id)}
              aria-expanded={isOpen}
              aria-controls={`accordion-panel-${id}`}
            >
              <span className="accordion__title">{item.title}</span>
              <span className={`accordion__icon ${isOpen ? 'accordion__icon--open' : ''}`}>
                ▼
              </span>
            </button>
            <div
              id={`accordion-panel-${id}`}
              className="accordion__panel"
              role="region"
              hidden={!isOpen}
            >
              <div className="accordion__content">{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;

import React from 'react';
import './Breadcrumb.css';

const Breadcrumb = ({ items, separator = '/' }) => {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="breadcrumb">
      <ol className="breadcrumb__list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="breadcrumb__item">
              {isLast ? (
                <span className="breadcrumb__current" aria-current="page">
                  {item.icon && <span className="breadcrumb__icon">{item.icon}</span>}
                  {item.label}
                </span>
              ) : (
                <>
                  <a href={item.href} className="breadcrumb__link">
                    {item.icon && <span className="breadcrumb__icon">{item.icon}</span>}
                    {item.label}
                  </a>
                  <span className="breadcrumb__separator" aria-hidden="true">
                    {separator}
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;

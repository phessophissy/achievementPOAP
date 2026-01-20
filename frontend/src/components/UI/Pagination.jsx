import React from 'react';
import './Pagination.css';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  showFirstLast = true,
  className = '',
}) => {
  const range = (start, end) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, idx) => start + idx);
  };

  const getPageNumbers = () => {
    const totalPageNumbers = siblingCount * 2 + 5;
    if (totalPages <= totalPageNumbers) return range(1, totalPages);

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;

    if (!showLeftDots && showRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);
      return [...leftRange, '...', totalPages];
    }

    if (showLeftDots && !showRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(totalPages - rightItemCount + 1, totalPages);
      return [1, '...', ...rightRange];
    }

    const middleRange = range(leftSiblingIndex, rightSiblingIndex);
    return [1, '...', ...middleRange, '...', totalPages];
  };

  const pages = getPageNumbers();

  return (
    <nav className={`pagination ${className}`} aria-label="Pagination">
      {showFirstLast && (
        <button
          className="pagination__btn pagination__btn--first"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          aria-label="First page"
        >
          ««
        </button>
      )}
      <button
        className="pagination__btn pagination__btn--prev"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        ‹
      </button>
      
      <div className="pagination__pages">
        {pages.map((page, index) =>
          page === '...' ? (
            <span key={`dots-${index}`} className="pagination__dots">…</span>
          ) : (
            <button
              key={page}
              className={`pagination__page ${currentPage === page ? 'pagination__page--active' : ''}`}
              onClick={() => onPageChange(page)}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          )
        )}
      </div>

      <button
        className="pagination__btn pagination__btn--next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        ›
      </button>
      {showFirstLast && (
        <button
          className="pagination__btn pagination__btn--last"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          aria-label="Last page"
        >
          »»
        </button>
      )}
    </nav>
  );
};

export default Pagination;

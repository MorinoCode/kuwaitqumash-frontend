import React, { memo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import './Pagination.css';

const Pagination = memo(({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className = ''
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  if (totalPages <= 1) {
    return null;
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      onPageChange(newPage);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {

      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {

      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        end = Math.min(4, totalPages - 1);
      }

      if (currentPage >= totalPages - 2) {
        start = Math.max(2, totalPages - 3);
      }

      if (start > 2) {
        pages.push('...');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push('...');
      }

      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={`pagination pagination--${theme} ${className}`}>
      <div className="pagination__info">
        <span className="pagination__text">
          {t('showing') || 'Showing'} {startItem}-{endItem} {t('of') || 'of'} {totalItems} {t('items') || 'items'}
        </span>
      </div>

      <div className="pagination__controls">
        <button
          className={`pagination__btn pagination__btn--prev pagination__btn--${theme}`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label={t('previous_page', 'Previous page')}
        >
          <ChevronLeft size={18} />
        </button>

        <div className="pagination__pages">
          {getPageNumbers().map((page, index) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${index}`} className="pagination__ellipsis">
                  ...
                </span>
              );
            }

            return (
              <button
                key={page}
                className={`pagination__page pagination__page--${theme} ${
                  page === currentPage ? 'pagination__page--active' : ''
                }`}
                onClick={() => handlePageChange(page)}
                aria-label={t('page', 'Page') + ` ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          className={`pagination__btn pagination__btn--next pagination__btn--${theme}`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label={t('next_page', 'Next page')}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
});

Pagination.displayName = 'Pagination';

export default Pagination;

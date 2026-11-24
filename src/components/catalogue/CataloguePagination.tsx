
import {
  useMemo,
} from 'react';

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

import {
  useCatalogueStore,
} from '../../store/catalogueStore';

/* ========================================
   NO BEIGE STUDIO
   Universal Catalogue Pagination

   Scalable page navigation.
   Accessible navigation controls.
   Responsive and compact layouts.
======================================== */

interface CataloguePaginationProps {
  totalResults: number;

  currentPage?: number;

  pageSize?: number;

  compact?: boolean;

  showFirstLast?: boolean;

  showPageNumbers?: boolean;

  showSummary?: boolean;

  hideSinglePage?: boolean;

  disabled?: boolean;

  onPageChange?: (
    page: number
  ) => void;

  className?: string;
}

type PaginationItem =
  | number
  | 'ellipsis-start'
  | 'ellipsis-end';

/* ========================================
   NUMBER UTILITIES
======================================== */

const NUMBER_FORMATTER =
  new Intl.NumberFormat('en-GB');

function formatNumber(
  value: number
): string {
  return NUMBER_FORMATTER.format(
    value
  );
}

function normaliseInteger(
  value: number,

  minimum: number,

  fallback: number
): number {
  if (
    !Number.isFinite(value)
  ) {
    return fallback;
  }

  return Math.max(
    minimum,

    Math.floor(value)
  );
}

/* ========================================
   PAGINATION RANGE GENERATOR

   Keeps navigation manageable even
   when the catalogue contains millions
   of assets.
======================================== */

export function createPaginationItems(
  currentPage: number,

  totalPages: number,

  siblingCount = 1
): PaginationItem[] {
  const safeTotal =
    normaliseInteger(
      totalPages,

      1,

      1
    );

  const safeCurrent =
    Math.min(
      normaliseInteger(
        currentPage,

        1,

        1
      ),

      safeTotal
    );

  const safeSiblings =
    Math.min(
      3,

      normaliseInteger(
        siblingCount,

        0,

        1
      )
    );

  const maximumVisible =
    safeSiblings * 2 + 5;

  if (
    safeTotal <= maximumVisible
  ) {
    return Array.from(
      {
        length: safeTotal,
      },

      (_, index) =>
        index + 1
    );
  }

  const leftSibling =
    Math.max(
      safeCurrent - safeSiblings,

      1
    );

  const rightSibling =
    Math.min(
      safeCurrent + safeSiblings,

      safeTotal
    );

  const showLeftEllipsis =
    leftSibling > 2;

  const showRightEllipsis =
    rightSibling <
      safeTotal - 1;

  /* START OF RESULTS */

  if (
    !showLeftEllipsis &&
    showRightEllipsis
  ) {
    const visibleCount =
      maximumVisible - 2;

    return [
      ...Array.from(
        {
          length: visibleCount,
        },

        (_, index) =>
          index + 1
      ),

      'ellipsis-end',

      safeTotal,
    ];
  }

  /* END OF RESULTS */

  if (
    showLeftEllipsis &&
    !showRightEllipsis
  ) {
    const visibleCount =
      maximumVisible - 2;

    const start =
      safeTotal -
      visibleCount +
      1;

    return [
      1,

      'ellipsis-start',

      ...Array.from(
        {
          length: visibleCount,
        },

        (_, index) =>
          start + index
      ),
    ];
  }

  /* MIDDLE OF RESULTS */

  const middlePages =
    Array.from(
      {
        length:
          rightSibling -
          leftSibling +
          1,
      },

      (_, index) =>
        leftSibling + index
    );

  return [
    1,

    ...(showLeftEllipsis
      ? [
          'ellipsis-start' as const,
        ]
      : []),

    ...middlePages,

    ...(showRightEllipsis
      ? [
          'ellipsis-end' as const,
        ]
      : []),

    safeTotal,
  ].filter(
    (item, index, items) =>
      items.indexOf(item) === index
  );
}

/* ========================================
   PAGINATION NAVIGATION BUTTON
======================================== */

function NavigationButton({
  direction,

  disabled,

  compact,

  onClick,
}: {
  direction:
    | 'first'
    | 'previous'
    | 'next'
    | 'last';

  disabled: boolean;

  compact: boolean;

  onClick: () => void;
}) {
  const configuration = {
    first: {
      icon: ChevronsLeft,

      label: 'First page',

      text: 'First',
    },

    previous: {
      icon: ChevronLeft,

      label: 'Previous page',

      text: 'Previous',
    },

    next: {
      icon: ChevronRight,

      label: 'Next page',

      text: 'Next',
    },

    last: {
      icon: ChevronsRight,

      label: 'Last page',

      text: 'Last',
    },
  }[direction];

  const Icon =
    configuration.icon;

  const iconAfterText =
    direction === 'next' ||
    direction === 'last';

  return (
    <button
      type="button"
      className={[
        'catalogue-pagination-navigation',

        `catalogue-pagination-${direction}`,

        compact
          ? 'catalogue-pagination-icon-only'
          : '',
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={disabled}
      aria-label={
        configuration.label
      }
      title={
        configuration.label
      }
      onClick={onClick}
    >
      {!iconAfterText && (
        <Icon
          size={18}
          aria-hidden="true"
        />
      )}

      {!compact && (
        <span className="catalogue-pagination-navigation-label">

          {configuration.text}

        </span>
      )}

      {iconAfterText && (
        <Icon
          size={18}
          aria-hidden="true"
        />
      )}

    </button>
  );
}

/* ========================================
   INDIVIDUAL PAGE BUTTON
======================================== */

function PageButton({
  page,

  current,

  disabled,

  onClick,
}: {
  page: number;

  current: boolean;

  disabled: boolean;

  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={[
        'catalogue-pagination-page',

        current
          ? 'catalogue-pagination-page-active'
          : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={
        current
          ? `Page ${page}, current page`
          : `Go to page ${page}`
      }
      aria-current={
        current
          ? 'page'
          : undefined
      }
      disabled={disabled}
      onClick={onClick}
    >
      {formatNumber(page)}
    </button>
  );
}

/* ========================================
   PAGINATION SUMMARY
======================================== */

function PaginationSummary({
  currentPage,

  totalPages,

  totalResults,

  pageSize,
}: {
  currentPage: number;

  totalPages: number;

  totalResults: number;

  pageSize: number;
}) {
  const start =
    totalResults > 0
      ? (
          currentPage - 1
        ) * pageSize + 1
      : 0;

  const end =
    Math.min(
      currentPage * pageSize,

      totalResults
    );

  return (
    <div
      className="catalogue-pagination-summary"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="catalogue-pagination-page-summary">

        Page{' '}

        <strong>
          {formatNumber(
            currentPage
          )}
        </strong>

        {' of '}

        <strong>
          {formatNumber(
            totalPages
          )}
        </strong>

      </span>

      <span className="catalogue-pagination-results-summary">

        {totalResults > 0 ? (
          <>
            Showing{' '}

            {formatNumber(start)}

            {'–'}

            {formatNumber(end)}

            {' of '}

            {formatNumber(
              totalResults
            )}

            {' assets'}
          </>

        ) : (
          'No assets to display'
        )}

      </span>

    </div>
  );
}

/* ========================================
   MAIN PAGINATION COMPONENT
======================================== */

export default function CataloguePagination({
  totalResults,

  currentPage,

  pageSize,

  compact = false,

  showFirstLast = true,

  showPageNumbers = true,

  showSummary = true,

  hideSinglePage = true,

  disabled = false,

  onPageChange,

  className = '',
}: CataloguePaginationProps) {
  const storedPage =
    useCatalogueStore(
      (state) =>
        state.page
    );

  const storedPageSize =
    useCatalogueStore(
      (state) =>
        state.pageSize
    );

  const setPage =
    useCatalogueStore(
      (state) =>
        state.setPage
    );

  /* ====================================
     SAFE PAGINATION VALUES
  ==================================== */

  const safeTotalResults =
    normaliseInteger(
      totalResults,

      0,

      0
    );

  const safePageSize =
    normaliseInteger(
      pageSize ??
        storedPageSize,

      1,

      24
    );

  const totalPages =
    Math.max(
      1,

      Math.ceil(
        safeTotalResults /
        safePageSize
      )
    );

  const activePage =
    Math.min(
      normaliseInteger(
        currentPage ??
          storedPage,

        1,

        1
      ),

      totalPages
    );

  const isFirstPage =
    activePage === 1;

  const isLastPage =
    activePage === totalPages;

  const navigationDisabled =
    disabled ||
    safeTotalResults === 0;

  /* ====================================
     GENERATE PAGE NUMBERS
  ==================================== */

  const paginationItems =
    useMemo(
      () =>
        createPaginationItems(
          activePage,

          totalPages,

          compact ? 0 : 1
        ),

      [
        activePage,
        totalPages,
        compact,
      ]
    );

  /* ====================================
     PAGE CHANGE HANDLER
  ==================================== */

  function changePage(
    requestedPage: number
  ): void {
    if (
      navigationDisabled
    ) {
      return;
    }

    const nextPage =
      Math.min(
        normaliseInteger(
          requestedPage,

          1,

          activePage
        ),

        totalPages
      );

    if (
      nextPage === activePage
    ) {
      return;
    }

    if (onPageChange) {
      onPageChange(nextPage);

    } else {
      setPage(nextPage);
    }
  }

  /* ====================================
     SINGLE PAGE AND EMPTY STATES
  ==================================== */

  if (
    hideSinglePage &&
    totalPages <= 1
  ) {
    return null;
  }

  /* ====================================
     PAGINATION NAVIGATION
  ==================================== */

  return (
    <nav
      className={[
        'catalogue-pagination',

        compact
          ? 'catalogue-pagination-compact'
          : '',

        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label="Catalogue pagination"
    >
      {showSummary && (
        <PaginationSummary
          currentPage={activePage}
          totalPages={totalPages}
          totalResults={
            safeTotalResults
          }
          pageSize={safePageSize}
        />
      )}

      <div className="catalogue-pagination-controls">

        {/* FIRST PAGE */}

        {showFirstLast && (
          <NavigationButton
            direction="first"
            compact
            disabled={
              navigationDisabled ||
              isFirstPage
            }
            onClick={() =>
              changePage(1)
            }
          />
        )}

        {/* PREVIOUS PAGE */}

        <NavigationButton
          direction="previous"
          compact={compact}
          disabled={
            navigationDisabled ||
            isFirstPage
          }
          onClick={() =>
            changePage(
              activePage - 1
            )
          }
        />

        {/* PAGE NUMBERS */}

        {showPageNumbers ? (
          <div className="catalogue-pagination-pages">

            {paginationItems.map(
              (item) => {
                if (
                  typeof item !==
                    'number'
                ) {
                  return (
                    <span
                      key={item}
                      className="catalogue-pagination-ellipsis"
                      aria-hidden="true"
                    >
                      …
                    </span>
                  );
                }

                return (
                  <PageButton
                    key={item}
                    page={item}
                    current={
                      item ===
                      activePage
                    }
                    disabled={
                      navigationDisabled
                    }
                    onClick={() =>
                      changePage(item)
                    }
                  />
                );
              }
            )}

          </div>

        ) : (
          <span className="catalogue-pagination-position">

            {formatNumber(
              activePage
            )}

            {' / '}

            {formatNumber(
              totalPages
            )}

          </span>
        )}

        {/* NEXT PAGE */}

        <NavigationButton
          direction="next"
          compact={compact}
          disabled={
            navigationDisabled ||
            isLastPage
          }
          onClick={() =>
            changePage(
              activePage + 1
            )
          }
        />

        {/* LAST PAGE */}

        {showFirstLast && (
          <NavigationButton
            direction="last"
            compact
            disabled={
              navigationDisabled ||
              isLastPage
            }
            onClick={() =>
              changePage(
                totalPages
              )
            }
          />
        )}

      </div>

    </nav>
  );
}

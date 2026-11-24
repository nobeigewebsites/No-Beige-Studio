
import {
  useId,
} from 'react';

import {
  Search,
  X,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Grid3X3,
  ArrowDownUp,
  ChevronDown,
} from 'lucide-react';

import type {
  LucideIcon,
} from 'lucide-react';

import type {
  CatalogueSort,
  CatalogueView,
} from '../../types/catalogue';

import {
  CATALOGUE_PAGE_SIZE_OPTIONS,
} from '../../types/catalogue';

import {
  useCatalogueStore,
  selectActiveFilterCount,
} from '../../store/catalogueStore';

/* ========================================
   NO BEIGE STUDIO
   Universal Catalogue Toolbar

   Search and sorting.
   Display preferences.
   Results and pagination controls.
   Responsive filter panel integration.
======================================== */

interface CatalogueToolbarProps {
  totalResults: number;

  visibleResults?: number;

  currentPage?: number;

  isLoading?: boolean;

  filtersOpen?: boolean;

  showSearch?: boolean;

  showSort?: boolean;

  showViewControls?: boolean;

  showPageSize?: boolean;

  showResultCount?: boolean;

  compact?: boolean;

  filterPanelId?: string;

  searchPlaceholder?: string;

  onToggleFilters?: () => void;

  className?: string;
}

/* ========================================
   SORT OPTIONS
======================================== */

interface SortOption {
  value: CatalogueSort;

  label: string;
}

const SORT_OPTIONS: SortOption[] = [
  {
    value: 'relevance',

    label: 'Most relevant',
  },

  {
    value: 'featured',

    label: 'Featured first',
  },

  {
    value: 'newest',

    label: 'Newest first',
  },

  {
    value: 'oldest',

    label: 'Oldest first',
  },

  {
    value: 'name-asc',

    label: 'Name: A–Z',
  },

  {
    value: 'name-desc',

    label: 'Name: Z–A',
  },

  {
    value: 'price-low-high',

    label: 'Physical price: low to high',
  },

  {
    value: 'price-high-low',

    label: 'Physical price: high to low',
  },
];

/* ========================================
   DISPLAY VIEW OPTIONS
======================================== */

interface ViewOption {
  value: CatalogueView;

  label: string;

  icon: LucideIcon;
}

const VIEW_OPTIONS: ViewOption[] = [
  {
    value: 'grid',

    label: 'Grid view',

    icon: LayoutGrid,
  },

  {
    value: 'list',

    label: 'List view',

    icon: List,
  },

  {
    value: 'compact',

    label: 'Compact view',

    icon: Grid3X3,
  },
];

/* ========================================
   NUMBER FORMATTING
======================================== */

const NUMBER_FORMATTER =
  new Intl.NumberFormat('en-GB');

function formatNumber(
  value: number
): string {
  return NUMBER_FORMATTER.format(
    Number.isFinite(value)
      ? Math.max(
          0,
          Math.floor(value)
        )
      : 0
  );
}

/* ========================================
   CATALOGUE SEARCH
======================================== */

function CatalogueSearch({
  placeholder,
}: {
  placeholder: string;
}) {
  const search =
    useCatalogueStore(
      (state) =>
        state.filters.search
    );

  const setSearch =
    useCatalogueStore(
      (state) =>
        state.setSearch
    );

  const searchId =
    useId();

  return (
    <div className="catalogue-toolbar-search">

      <label
        htmlFor={searchId}
        className="sr-only"
      >
        Search catalogue assets
      </label>

      <Search
        size={20}
        className="catalogue-toolbar-search-icon"
        aria-hidden="true"
      />

      <input
        id={searchId}
        type="search"
        value={search}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
        onChange={(event) =>
          setSearch(
            event.target.value
          )
        }
      />

      {search.length > 0 && (
        <button
          type="button"
          className="catalogue-toolbar-clear-search"
          aria-label="Clear catalogue search"
          title="Clear search"
          onClick={() =>
            setSearch('')
          }
        >
          <X
            size={18}
            aria-hidden="true"
          />
        </button>
      )}

    </div>
  );
}

/* ========================================
   FILTER PANEL BUTTON
======================================== */

function FilterToggle({
  open,

  panelId,

  onToggle,
}: {
  open: boolean;

  panelId?: string;

  onToggle: () => void;
}) {
  const activeFilterCount =
    useCatalogueStore(
      selectActiveFilterCount
    );

  return (
    <button
      type="button"
      className={[
        'button',

        'button-secondary',

        'catalogue-toolbar-filter-button',

        open
          ? 'catalogue-toolbar-filter-active'
          : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-expanded={open}
      aria-controls={panelId}
      aria-label={
        `${
          open
            ? 'Hide'
            : 'Show'
        } catalogue filters${
          activeFilterCount > 0
            ? `, ${activeFilterCount} active`
            : ''
        }`
      }
      onClick={onToggle}
    >
      <SlidersHorizontal
        size={18}
        aria-hidden="true"
      />

      <span>
        Filters
      </span>

      {activeFilterCount > 0 && (
        <span
          className="catalogue-toolbar-filter-count"
          aria-hidden="true"
        >
          {activeFilterCount}
        </span>
      )}

    </button>
  );
}

/* ========================================
   SORT CONTROL
======================================== */

function CatalogueSortControl() {
  const sort =
    useCatalogueStore(
      (state) =>
        state.sort
    );

  const setSort =
    useCatalogueStore(
      (state) =>
        state.setSort
    );

  const sortId =
    useId();

  return (
    <div className="catalogue-toolbar-sort">

      <label
        htmlFor={sortId}
        className="catalogue-toolbar-control-label"
      >
        <ArrowDownUp
          size={16}
          aria-hidden="true"
        />

        <span>
          Sort by
        </span>

      </label>

      <div className="catalogue-toolbar-select-wrapper">

        <select
          id={sortId}
          className="catalogue-toolbar-select"
          value={sort}
          onChange={(event) => {
            const selected =
              SORT_OPTIONS.find(
                (option) =>
                  option.value ===
                  event.target.value
              );

            if (selected) {
              setSort(
                selected.value
              );
            }
          }}
        >
          {SORT_OPTIONS.map(
            (option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            )
          )}
        </select>

        <ChevronDown
          size={15}
          className="catalogue-toolbar-select-chevron"
          aria-hidden="true"
        />

      </div>

    </div>
  );
}

/* ========================================
   VIEW MODE CONTROLS
======================================== */

function CatalogueViewControls() {
  const view =
    useCatalogueStore(
      (state) =>
        state.view
    );

  const setView =
    useCatalogueStore(
      (state) =>
        state.setView
    );

  return (
    <div
      className="catalogue-toolbar-view-controls"
      role="group"
      aria-label="Catalogue display layout"
    >
      {VIEW_OPTIONS.map(
        (option) => {
          const Icon =
            option.icon;

          const active =
            view === option.value;

          return (
            <button
              key={option.value}
              type="button"
              className={[
                'catalogue-toolbar-view-button',

                active
                  ? 'catalogue-toolbar-view-active'
                  : '',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-label={
                option.label
              }
              aria-pressed={active}
              title={
                option.label
              }
              onClick={() =>
                setView(
                  option.value
                )
              }
            >
              <Icon
                size={19}
                aria-hidden="true"
                strokeWidth={
                  active
                    ? 2
                    : 1.7
                }
              />
            </button>
          );
        }
      )}
    </div>
  );
}

/* ========================================
   RESULTS PER PAGE
======================================== */

function CataloguePageSizeControl() {
  const pageSize =
    useCatalogueStore(
      (state) =>
        state.pageSize
    );

  const setPageSize =
    useCatalogueStore(
      (state) =>
        state.setPageSize
    );

  const pageSizeId =
    useId();

  return (
    <div className="catalogue-toolbar-page-size">

      <label
        htmlFor={pageSizeId}
        className="catalogue-toolbar-control-label"
      >
        Show
      </label>

      <div className="catalogue-toolbar-select-wrapper">

        <select
          id={pageSizeId}
          className="catalogue-toolbar-select"
          value={pageSize}
          aria-label="Results per page"
          onChange={(event) => {
            const selected =
              CATALOGUE_PAGE_SIZE_OPTIONS.find(
                (option) =>
                  option ===
                  Number(
                    event.target.value
                  )
              );

            if (
              selected !== undefined
            ) {
              setPageSize(selected);
            }
          }}
        >
          {CATALOGUE_PAGE_SIZE_OPTIONS.map(
            (option) => (
              <option
                key={option}
                value={option}
              >
                {option}
              </option>
            )
          )}
        </select>

        <ChevronDown
          size={15}
          className="catalogue-toolbar-select-chevron"
          aria-hidden="true"
        />

      </div>

      <span className="catalogue-toolbar-page-size-label">
        per page
      </span>

    </div>
  );
}

/* ========================================
   RESULTS SUMMARY
======================================== */

function CatalogueResultsSummary({
  totalResults,

  visibleResults,

  currentPage,

  isLoading,
}: {
  totalResults: number;

  visibleResults?: number;

  currentPage?: number;

  isLoading: boolean;
}) {
  const storedPage =
    useCatalogueStore(
      (state) =>
        state.page
    );

  const pageSize =
    useCatalogueStore(
      (state) =>
        state.pageSize
    );

  const search =
    useCatalogueStore(
      (state) =>
        state.filters.search
    );

  const safeTotal =
    Number.isFinite(totalResults)
      ? Math.max(
          0,
          Math.floor(totalResults)
        )
      : 0;

  const safePageSize =
    Number.isFinite(pageSize)
      ? Math.max(
          1,
          Math.floor(pageSize)
        )
      : 24;

  const requestedPage =
    currentPage ?? storedPage;

  const safePage =
    Number.isFinite(requestedPage)
      ? Math.min(
          Math.max(
            1,
            Math.floor(requestedPage)
          ),

          Math.max(
            1,

            Math.ceil(
              safeTotal /
              safePageSize
            )
          )
        )
      : 1;

  const offset =
    (safePage - 1) *
    safePageSize;

  const availableResults =
    Math.max(
      0,

      safeTotal - offset
    );

  const requestedVisible =
    visibleResults ??
    Math.min(
      safePageSize,

      availableResults
    );

  const safeVisible =
    Number.isFinite(requestedVisible)
      ? Math.max(
          0,

          Math.min(
            Math.floor(
              requestedVisible
            ),

            safePageSize,

            availableResults
          )
        )
      : 0;

  const start =
    safeVisible > 0
      ? offset + 1
      : 0;

  const end =
    safeVisible > 0
      ? offset + safeVisible
      : 0;

  return (
    <div
      className="catalogue-toolbar-results"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {isLoading ? (
        <span className="catalogue-toolbar-loading">

          <span
            className="catalogue-toolbar-loading-spinner"
            aria-hidden="true"
          />

          Loading catalogue...

        </span>

      ) : safeTotal === 0 ? (
        <span>

          <strong>
            No assets found
          </strong>

          {search.trim() && (
            <span className="catalogue-toolbar-search-summary">

              {' for "'}

              {search.trim()}

              {'"'}

            </span>
          )}

        </span>

      ) : (
        <>

          <span className="catalogue-toolbar-total-results">

            <strong>
              {formatNumber(safeTotal)}
            </strong>

            {' '}

            {safeTotal === 1
              ? 'asset found'
              : 'assets found'}

          </span>

          {safeVisible > 0 &&
            safeTotal > safeVisible && (
              <span className="catalogue-toolbar-result-range">

                Showing{' '}

                {formatNumber(start)}

                {'–'}

                {formatNumber(end)}

                {' of '}

                {formatNumber(safeTotal)}

              </span>
            )}

          {search.trim() && (
            <span className="catalogue-toolbar-search-summary">

              {'Matching "'}

              {search.trim()}

              {'"'}

            </span>
          )}

        </>
      )}

    </div>
  );
}

/* ========================================
   MAIN CATALOGUE TOOLBAR
======================================== */

export default function CatalogueToolbar({
  totalResults,

  visibleResults,

  currentPage,

  isLoading = false,

  filtersOpen = false,

  showSearch = true,

  showSort = true,

  showViewControls = true,

  showPageSize = true,

  showResultCount = true,

  compact = false,

  filterPanelId,

  searchPlaceholder =
    'Search furniture, materials, eras, styles and more...',

  onToggleFilters,

  className = '',
}: CatalogueToolbarProps) {
  const hasPrimaryControls =
    showSearch ||
    Boolean(onToggleFilters);

  const hasDisplayControls =
    showSort ||
    showViewControls ||
    showPageSize;

  return (
    <section
      className={[
        'catalogue-toolbar',

        compact
          ? 'catalogue-toolbar-compact'
          : '',

        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label="Catalogue browsing controls"
    >
      {hasPrimaryControls && (
        <div className="catalogue-toolbar-primary">

          {showSearch && (
            <CatalogueSearch
              placeholder={
                searchPlaceholder
              }
            />
          )}

          {onToggleFilters && (
            <FilterToggle
              open={filtersOpen}
              panelId={filterPanelId}
              onToggle={
                onToggleFilters
              }
            />
          )}

        </div>
      )}

      {(
        showResultCount ||
        hasDisplayControls
      ) && (
        <div className="catalogue-toolbar-secondary">

          {showResultCount && (
            <CatalogueResultsSummary
              totalResults={
                totalResults
              }
              visibleResults={
                visibleResults
              }
              currentPage={
                currentPage
              }
              isLoading={
                isLoading
              }
            />
          )}

          {hasDisplayControls && (
            <div className="catalogue-toolbar-display-controls">

              {showSort && (
                <CatalogueSortControl />
              )}

              {showPageSize && (
                <CataloguePageSizeControl />
              )}

              {showViewControls && (
                <CatalogueViewControls />
              )}

            </div>
          )}

        </div>
      )}

    </section>
  );
}

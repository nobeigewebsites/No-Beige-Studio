
import {
  useId,
  useMemo,
  useState,
} from 'react';

import {
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  RotateCcw,
  Search,
  X,
} from 'lucide-react';

import type {
  ReactNode,
} from 'react';

import type {
  CatalogueFilters as CatalogueFilterValues,
  AssetSource,
  AssetAccess,
  AssetCategory,
} from '../../types/catalogue';

import type {
  StudioId,
} from '../../types/studio';

import {
  CATALOGUE_CATEGORIES,
  HISTORICAL_PERIOD_LABELS,
  DESIGN_STYLE_LABELS,
  MATERIAL_FAMILY_LABELS,
  COLOUR_FAMILY_OPTIONS,
  SURFACE_FINISH_LABELS,
  ASSET_CONDITION_LABELS,
} from '../../config/catalogue';

import {
  STUDIOS,
} from '../../config/studios';

import {
  useCatalogueStore,
  selectActiveFilterCount,
} from '../../store/catalogueStore';

/* ========================================
   NO BEIGE STUDIO
   Universal Catalogue Filters

   Shared filtering across all studios.
   Accessible controls.
   Independent category and style choices.
======================================== */

interface CatalogueFiltersProps {
  compact?: boolean;

  showSearch?: boolean;

  showStudioFilters?: boolean;

  lockedStudio?: StudioId;

  onClose?: () => void;

  className?: string;
}

interface FilterOption<T extends string> {
  value: T;

  label: string;

  colour?: string;
}

/* ========================================
   FILTER OPTIONS
======================================== */

const CATEGORY_OPTIONS:
  FilterOption<AssetCategory>[] =
    CATALOGUE_CATEGORIES.map(
      (category) => ({
        value: category.id,

        label: category.name,
      })
    );

const STUDIO_OPTIONS:
  FilterOption<StudioId>[] =
    STUDIOS.map(
      (studio) => ({
        value: studio.id,

        label: studio.shortName,

        colour: studio.colour,
      })
    );

const SOURCE_OPTIONS:
  FilterOption<AssetSource>[] = [
    {
      value: 'studio-original',

      label: 'NO BEIGE originals',
    },

    {
      value: 'licensed-library',

      label: 'Licensed libraries',
    },

    {
      value: 'manufacturer',

      label: 'Manufacturers',
    },

    {
      value: 'community',

      label: 'Community creations',
    },

    {
      value: 'user-upload',

      label: 'User uploads',
    },

    {
      value: 'creator-marketplace',

      label: 'Creator marketplace',
    },

    {
      value: 'public-domain',

      label: 'Public domain',
    },

    {
      value: 'open-source',

      label: 'Open source',
    },

    {
      value: 'procedural',

      label: 'Procedural assets',
    },
  ];

const ACCESS_OPTIONS:
  FilterOption<AssetAccess>[] = [
    {
      value: 'free',

      label: 'Free assets',
    },

    {
      value: 'premium',

      label: 'Premium assets',
    },

    {
      value: 'marketplace',

      label: 'Marketplace assets',
    },
  ];

const COLOUR_OPTIONS =
  COLOUR_FAMILY_OPTIONS.map(
    (colour) => ({
      value: colour.id,

      label: colour.name,

      colour: colour.hex,
    })
  );

const CURRENCIES = [
  'GBP',
  'EUR',
  'USD',
  'CAD',
  'AUD',
  'NZD',
  'JPY',
  'INR',
  'CHF',
  'ZAR',
];

/* ========================================
   LABEL CONVERSION
======================================== */

function toOptions<T extends string>(
  labels: Record<T, string>
): FilterOption<T>[] {
  return (
    Object.keys(labels) as T[]
  ).map(
    (value) => ({
      value,

      label: labels[value],
    })
  );
}

const PERIOD_OPTIONS =
  toOptions(
    HISTORICAL_PERIOD_LABELS
  );

const STYLE_OPTIONS =
  toOptions(
    DESIGN_STYLE_LABELS
  );

const MATERIAL_OPTIONS =
  toOptions(
    MATERIAL_FAMILY_LABELS
  );

const FINISH_OPTIONS =
  toOptions(
    SURFACE_FINISH_LABELS
  );

const CONDITION_OPTIONS =
  toOptions(
    ASSET_CONDITION_LABELS
  );

/* ========================================
   FILTER UTILITIES
======================================== */

function toggleValue<T>(
  values: T[],

  value: T
): T[] {
  return values.includes(value)
    ? values.filter(
        (candidate) =>
          candidate !== value
      )
    : [
        ...values,
        value,
      ];
}

function normaliseSearch(
  value: string
): string {
  return value
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      ''
    )
    .toLowerCase()
    .trim();
}

/* ========================================
   COLLAPSIBLE FILTER SECTION
======================================== */

function FilterSection({
  title,

  count = 0,

  defaultOpen = false,

  children,
}: {
  title: string;

  count?: number;

  defaultOpen?: boolean;

  children: ReactNode;
}) {
  const [open, setOpen] =
    useState(defaultOpen);

  const sectionId =
    useId();

  return (
    <section className="catalogue-filter-section">

      <button
        type="button"
        className="catalogue-filter-section-toggle"
        aria-expanded={open}
        aria-controls={sectionId}
        onClick={() =>
          setOpen(
            (previous) => !previous
          )
        }
      >
        <span className="catalogue-filter-section-title">

          {title}

          {count > 0 && (
            <span className="catalogue-filter-section-count">
              {count}
            </span>
          )}

        </span>

        {open ? (
          <ChevronDown
            size={17}
            aria-hidden="true"
          />

        ) : (
          <ChevronRight
            size={17}
            aria-hidden="true"
          />
        )}

      </button>

      <div
        id={sectionId}
        className="catalogue-filter-section-content"
        hidden={!open}
      >
        {children}
      </div>

    </section>
  );
}

/* ========================================
   SEARCHABLE MULTI-SELECT FILTER
======================================== */

function MultiSelectFilter<T extends string>({
  options,

  selected,

  onChange,

  searchable = false,

  searchPlaceholder = 'Find an option...',

  initialLimit = 8,

  label,
}: {
  options: FilterOption<T>[];

  selected: T[];

  onChange: (
    values: T[]
  ) => void;

  searchable?: boolean;

  searchPlaceholder?: string;

  initialLimit?: number;

  label: string;
}) {
  const [search, setSearch] =
    useState('');

  const [showAll, setShowAll] =
    useState(false);

  const filteredOptions =
    useMemo(() => {
      const query =
        normaliseSearch(search);

      if (!query) {
        return options;
      }

      return options.filter(
        (option) =>
          normaliseSearch(
            option.label
          ).includes(query)
      );
    }, [
      options,
      search,
    ]);

  const visibleOptions =
    useMemo(() => {
      if (
        showAll ||
        search.trim()
      ) {
        return filteredOptions;
      }

      /*
        Keep selected options visible
        even when the list is collapsed.
      */

      const selectedOptions =
        filteredOptions.filter(
          (option) =>
            selected.includes(
              option.value
            )
        );

      const remainingOptions =
        filteredOptions.filter(
          (option) =>
            !selected.includes(
              option.value
            )
        );

      return [
        ...selectedOptions,

        ...remainingOptions.slice(
          0,

          Math.max(
            0,

            initialLimit -
              selectedOptions.length
          )
        ),
      ];
    }, [
      filteredOptions,
      selected,
      showAll,
      search,
      initialLimit,
    ]);

  const hiddenCount =
    filteredOptions.length -
    visibleOptions.length;

  return (
    <div
      className="catalogue-multi-select"
      role="group"
      aria-label={label}
    >
      {searchable && (
        <div className="catalogue-filter-option-search">

          <Search
            size={15}
            aria-hidden="true"
          />

          <input
            type="search"
            value={search}
            placeholder={searchPlaceholder}
            aria-label={`Search ${label.toLowerCase()}`}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />

        </div>
      )}

      <div className="catalogue-filter-options">

        {visibleOptions.map(
          (option) => (
            <label
              key={option.value}
              className={[
                'catalogue-filter-option',

                selected.includes(
                  option.value
                )
                  ? 'catalogue-filter-option-selected'
                  : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <input
                type="checkbox"
                checked={
                  selected.includes(
                    option.value
                  )
                }
                onChange={() =>
                  onChange(
                    toggleValue(
                      selected,

                      option.value
                    )
                  )
                }
              />

              {option.colour && (
                <span
                  className="catalogue-filter-colour-dot"
                  style={{
                    backgroundColor:
                      option.colour,
                  }}
                  aria-hidden="true"
                />
              )}

              <span>
                {option.label}
              </span>

            </label>
          )
        )}

        {visibleOptions.length === 0 && (
          <p className="catalogue-filter-no-options">
            No matching options.
          </p>
        )}

      </div>

      {!search.trim() &&
        hiddenCount > 0 && (
          <button
            type="button"
            className="catalogue-filter-show-more"
            onClick={() =>
              setShowAll(true)
            }
          >
            Show {hiddenCount} more

            <ChevronDown
              size={14}
              aria-hidden="true"
            />
          </button>
        )}

      {!search.trim() &&
        showAll &&
        filteredOptions.length >
          initialLimit && (
            <button
              type="button"
              className="catalogue-filter-show-more"
              onClick={() =>
                setShowAll(false)
              }
            >
              Show fewer

              <ChevronRight
                size={14}
                aria-hidden="true"
              />
            </button>
          )}

      {selected.length > 0 && (
        <button
          type="button"
          className="catalogue-filter-clear-selection"
          onClick={() =>
            onChange([])
          }
        >
          Clear selection
        </button>
      )}

    </div>
  );
}

/* ========================================
   BOOLEAN FILTER
======================================== */

function BooleanFilter({
  label,

  description,

  checked,

  onChange,
}: {
  label: string;

  description?: string;

  checked: boolean;

  onChange: (
    checked: boolean
  ) => void;
}) {
  return (
    <label
      className={[
        'catalogue-boolean-filter',

        checked
          ? 'catalogue-boolean-filter-active'
          : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) =>
          onChange(
            event.target.checked
          )
        }
      />

      <span className="catalogue-boolean-filter-text">

        <span className="catalogue-boolean-filter-label">
          {label}
        </span>

        {description && (
          <span className="catalogue-boolean-filter-description">
            {description}
          </span>
        )}

      </span>

    </label>
  );
}

/* ========================================
   PRICE RANGE FILTER

   Filters physical product estimates.
   Does not perform currency conversion.
======================================== */

function PriceRangeFilter({
  filters,

  onChange,
}: {
  filters: CatalogueFilterValues;

  onChange: (
    updates: Partial<
      CatalogueFilterValues
    >
  ) => void;
}) {
  const minimumId =
    useId();

  const maximumId =
    useId();

  const currencyId =
    useId();

  const errorId =
    useId();

  const invalidRange =
    filters.minimumPrice !== null &&
    filters.maximumPrice !== null &&
    filters.minimumPrice >
      filters.maximumPrice;

  function parsePrice(
    value: string
  ): number | null {
    if (!value.trim()) {
      return null;
    }

    const number =
      Number(value);

    if (
      !Number.isFinite(number) ||
      number < 0
    ) {
      return null;
    }

    return (
      Math.round(number * 100) /
      100
    );
  }

  const currencies =
    Array.from(
      new Set([
        ...CURRENCIES,

        filters.priceCurrency,
      ])
    );

  return (
    <div className="catalogue-price-filter">

      <p className="catalogue-filter-hint">
        Filter estimated physical product costs,
        not digital asset prices.
      </p>

      <div className="form-group">

        <label
          className="form-label"
          htmlFor={currencyId}
        >
          Currency
        </label>

        <select
          id={currencyId}
          className="select"
          value={
            filters.priceCurrency
          }
          onChange={(event) =>
            onChange({
              priceCurrency:
                event.target.value,
            })
          }
        >
          {currencies.map(
            (currency) => (
              <option
                key={currency}
                value={currency}
              >
                {currency}
              </option>
            )
          )}
        </select>

      </div>

      <div className="catalogue-price-range">

        <div className="form-group">

          <label
            className="form-label"
            htmlFor={minimumId}
          >
            Minimum
          </label>

          <input
            id={minimumId}
            className="input"
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            placeholder="No minimum"
            value={
              filters.minimumPrice ??
              ''
            }
            aria-invalid={invalidRange}
            aria-describedby={
              invalidRange
                ? errorId
                : undefined
            }
            onChange={(event) =>
              onChange({
                minimumPrice:
                  parsePrice(
                    event.target.value
                  ),
              })
            }
          />

        </div>

        <div className="form-group">

          <label
            className="form-label"
            htmlFor={maximumId}
          >
            Maximum
          </label>

          <input
            id={maximumId}
            className="input"
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            placeholder="No maximum"
            value={
              filters.maximumPrice ??
              ''
            }
            aria-invalid={invalidRange}
            aria-describedby={
              invalidRange
                ? errorId
                : undefined
            }
            onChange={(event) =>
              onChange({
                maximumPrice:
                  parsePrice(
                    event.target.value
                  ),
              })
            }
          />

        </div>

      </div>

      {invalidRange && (
        <p
          id={errorId}
          className="catalogue-filter-error"
          role="alert"
        >
          Maximum price must be equal to
          or greater than minimum price.
        </p>
      )}

      <p className="catalogue-filter-hint">
        Only assets with a recorded price
        in the selected currency are
        included when a price limit is set.
      </p>

      {(
        filters.minimumPrice !== null ||
        filters.maximumPrice !== null
      ) && (
        <button
          type="button"
          className="catalogue-filter-clear-selection"
          onClick={() =>
            onChange({
              minimumPrice: null,

              maximumPrice: null,
            })
          }
        >
          Clear price range
        </button>
      )}

    </div>
  );
}

/* ========================================
   BOOLEAN FILTER DEFINITIONS
======================================== */

type BooleanFilterKey =
  | 'freeOnly'
  | 'favouritesOnly'
  | 'verifiedOnly'
  | 'accessibleOnly'
  | 'sustainableOnly'
  | 'restorationOnly'
  | 'lightweightOnly'
  | 'commercialUseOnly'
  | 'has3DModel'
  | 'has2DSymbol';

interface BooleanFilterDefinition {
  key: BooleanFilterKey;

  label: string;

  description?: string;
}

const QUICK_FILTERS:
  BooleanFilterDefinition[] = [
    {
      key: 'freeOnly',

      label: 'Free assets only',

      description:
        'Browse assets with no digital purchase cost.',
    },

    {
      key: 'favouritesOnly',

      label: 'My favourites',
    },

    {
      key: 'verifiedOnly',

      label: 'Verified assets only',

      description:
        'Assets marked as verified in the catalogue.',
    },
  ];

const SPECIALIST_FILTERS:
  BooleanFilterDefinition[] = [
    {
      key: 'accessibleOnly',

      label: 'Verified accessible design',

      description:
        'Assets with verified accessibility information.',
    },

    {
      key: 'sustainableOnly',

      label: 'Verified sustainability',

      description:
        'Assets with verified sustainability characteristics.',
    },

    {
      key: 'restorationOnly',

      label: 'Restoration assets',

      description:
        'Assets identified as suitable for restoration.',
    },
  ];

const TECHNICAL_FILTERS:
  BooleanFilterDefinition[] = [
    {
      key: 'has3DModel',

      label: '3D model available',
    },

    {
      key: 'has2DSymbol',

      label: '2D symbol available',
    },

    {
      key: 'lightweightOnly',

      label: 'Lightweight models',

      description:
        'Models recommended for lower-powered devices.',
    },

    {
      key: 'commercialUseOnly',

      label: 'Verified commercial-use licence',

      description:
        'Assets with verified commercial-use permission.',
    },
  ];

/* ========================================
   BOOLEAN FILTER GROUP
======================================== */

function BooleanFilterGroup({
  definitions,

  filters,

  onChange,
}: {
  definitions:
    BooleanFilterDefinition[];

  filters:
    CatalogueFilterValues;

  onChange: (
    updates: Partial<
      CatalogueFilterValues
    >
  ) => void;
}) {
  return (
    <div className="catalogue-boolean-filter-group">

      {definitions.map(
        (definition) => (
          <BooleanFilter
            key={definition.key}
            label={definition.label}
            description={
              definition.description
            }
            checked={
              filters[definition.key]
            }
            onChange={(checked) =>
              onChange({
                [definition.key]:
                  checked,
              })
            }
          />
        )
      )}

    </div>
  );
}

/* ========================================
   MAIN CATALOGUE FILTER COMPONENT
======================================== */

export default function CatalogueFilters({
  compact = false,

  showSearch = true,

  showStudioFilters = true,

  lockedStudio,

  onClose,

  className = '',
}: CatalogueFiltersProps) {
  const filters =
    useCatalogueStore(
      (state) =>
        state.filters
    );

  const setFilters =
    useCatalogueStore(
      (state) =>
        state.setFilters
    );

  const setSearch =
    useCatalogueStore(
      (state) =>
        state.setSearch
    );

  const resetFilters =
    useCatalogueStore(
      (state) =>
        state.resetFilters
    );

  const activeFilterCount =
    useCatalogueStore(
      selectActiveFilterCount
    );

  /* ====================================
     SUBCATEGORY OPTIONS

     Categories narrow the available
     subcategory choices.
  ==================================== */

  const subcategoryOptions =
    useMemo(() => {
      const categories =
        filters.categories.length > 0
          ? CATALOGUE_CATEGORIES.filter(
              (category) =>
                filters.categories.includes(
                  category.id
                )
            )
          : CATALOGUE_CATEGORIES;

      const subcategories =
        new Set<string>();

      for (
        const category of categories
      ) {
        for (
          const subcategory of
            category.subcategories
        ) {
          subcategories.add(
            subcategory
          );
        }
      }

      return Array.from(
        subcategories
      )
        .sort(
          (a, b) =>
            a.localeCompare(b)
        )
        .map(
          (subcategory) => ({
            value: subcategory,

            label: subcategory,
          })
        );
    }, [
      filters.categories,
    ]);

  /* ====================================
     FILTER UPDATES
  ==================================== */

  function updateFilters(
    updates: Partial<
      CatalogueFilterValues
    >
  ): void {
    setFilters({
      ...updates,

      ...(
        lockedStudio
          ? {
              studios: [
                lockedStudio,
              ],
            }
          : {}
      ),
    });
  }

  function updateCategories(
    categories: AssetCategory[]
  ): void {
    const availableCategories =
      categories.length > 0
        ? CATALOGUE_CATEGORIES.filter(
            (category) =>
              categories.includes(
                category.id
              )
          )
        : CATALOGUE_CATEGORIES;

    const availableSubcategories =
      new Set(
        availableCategories.flatMap(
          (category) =>
            category.subcategories
        )
      );

    updateFilters({
      categories,

      subcategories:
        filters.subcategories.filter(
          (subcategory) =>
            availableSubcategories.has(
              subcategory
            )
        ),
    });
  }

  function handleReset(): void {
    resetFilters();

    if (lockedStudio) {
      setFilters({
        studios: [
          lockedStudio,
        ],
      });
    }
  }

  const countBooleanFilters = (
    definitions:
      BooleanFilterDefinition[]
  ): number =>
    definitions.filter(
      (definition) =>
        filters[definition.key]
    ).length;

  const priceFilterCount =
    Number(
      filters.minimumPrice !== null
    ) +
    Number(
      filters.maximumPrice !== null
    );

  /* ====================================
     FILTER PANEL
  ==================================== */

  return (
    <aside
      className={[
        'catalogue-filters',

        compact
          ? 'catalogue-filters-compact'
          : '',

        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label="Catalogue filters"
    >
      <header className="catalogue-filters-header">

        <div className="catalogue-filters-heading">

          <SlidersHorizontal
            size={20}
            aria-hidden="true"
          />

          <h2>
            Filters
          </h2>

          {activeFilterCount > 0 && (
            <span
              className="catalogue-active-filter-count"
              aria-label={`${activeFilterCount} active filters`}
            >
              {activeFilterCount}
            </span>
          )}

        </div>

        {onClose && (
          <button
            type="button"
            className="icon-button"
            aria-label="Close filters"
            onClick={onClose}
          >
            <X
              size={20}
              aria-hidden="true"
            />
          </button>
        )}

      </header>

      <div className="catalogue-filters-reset-row">

        <span aria-live="polite">

          {activeFilterCount === 0
            ? 'All catalogue assets'
            : `${activeFilterCount} active filters`}

        </span>

        <button
          type="button"
          className="catalogue-filter-reset-button"
          onClick={handleReset}
          disabled={
            activeFilterCount === 0 &&
            !filters.search
          }
        >
          <RotateCcw
            size={14}
            aria-hidden="true"
          />

          Reset all
        </button>

      </div>

      {showSearch && (
        <div className="catalogue-filter-main-search">

          <Search
            size={18}
            aria-hidden="true"
          />

          <input
            type="search"
            placeholder="Search the catalogue..."
            aria-label="Search catalogue assets"
            value={filters.search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />

          {filters.search && (
            <button
              type="button"
              className="icon-button"
              aria-label="Clear catalogue search"
              onClick={() =>
                setSearch('')
              }
            >
              <X
                size={16}
                aria-hidden="true"
              />
            </button>
          )}

        </div>
      )}

      {lockedStudio && (
        <div className="catalogue-filter-locked-studio">

          <span>
            Current studio
          </span>

          <strong>

            {STUDIOS.find(
              (studio) =>
                studio.id === lockedStudio
            )?.name ?? lockedStudio}

          </strong>

        </div>
      )}

      <div className="catalogue-filter-sections">

        {/* QUICK FILTERS */}

        <FilterSection
          title="Quick filters"
          defaultOpen
          count={
            countBooleanFilters(
              QUICK_FILTERS
            )
          }
        >
          <BooleanFilterGroup
            definitions={QUICK_FILTERS}
            filters={filters}
            onChange={updateFilters}
          />
        </FilterSection>

        {/* CATEGORIES */}

        <FilterSection
          title="Categories"
          defaultOpen
          count={
            filters.categories.length
          }
        >
          <MultiSelectFilter
            label="Categories"
            options={CATEGORY_OPTIONS}
            selected={
              filters.categories
            }
            onChange={
              updateCategories
            }
            searchable
            searchPlaceholder="Find a category..."
            initialLimit={10}
          />
        </FilterSection>

        {/* SUBCATEGORIES */}

        <FilterSection
          title="Subcategories"
          count={
            filters.subcategories.length
          }
        >
          <MultiSelectFilter
            label="Subcategories"
            options={
              subcategoryOptions
            }
            selected={
              filters.subcategories
            }
            onChange={(subcategories) =>
              updateFilters({
                subcategories,
              })
            }
            searchable
            searchPlaceholder="Find a subcategory..."
          />
        </FilterSection>

        {/* STUDIOS */}

        {showStudioFilters &&
          !lockedStudio && (
            <FilterSection
              title="Design studios"
              count={
                filters.studios.length
              }
            >
              <MultiSelectFilter
                label="Design studios"
                options={STUDIO_OPTIONS}
                selected={
                  filters.studios
                }
                onChange={(studios) =>
                  updateFilters({
                    studios,
                  })
                }
                initialLimit={5}
              />
            </FilterSection>
          )}

        {/* HISTORICAL PERIODS */}

        <FilterSection
          title="Historical periods"
          count={
            filters.periods.length
          }
        >
          <MultiSelectFilter
            label="Historical periods"
            options={PERIOD_OPTIONS}
            selected={
              filters.periods
            }
            onChange={(periods) =>
              updateFilters({
                periods,
              })
            }
            searchable
            searchPlaceholder="Find an era..."
            initialLimit={10}
          />
        </FilterSection>

        {/* DESIGN STYLES */}

        <FilterSection
          title="Design styles"
          count={
            filters.styles.length
          }
        >
          <MultiSelectFilter
            label="Design styles"
            options={STYLE_OPTIONS}
            selected={
              filters.styles
            }
            onChange={(styles) =>
              updateFilters({
                styles,
              })
            }
            searchable
            searchPlaceholder="Find a design style..."
            initialLimit={10}
          />
        </FilterSection>

        {/* MATERIALS */}

        <FilterSection
          title="Materials"
          count={
            filters.materials.length
          }
        >
          <MultiSelectFilter
            label="Materials"
            options={MATERIAL_OPTIONS}
            selected={
              filters.materials
            }
            onChange={(materials) =>
              updateFilters({
                materials,
              })
            }
            searchable
            searchPlaceholder="Find a material..."
          />
        </FilterSection>

        {/* COLOURS */}

        <FilterSection
          title="Colours"
          count={
            filters.colours.length
          }
        >
          <MultiSelectFilter
            label="Colours"
            options={COLOUR_OPTIONS}
            selected={
              filters.colours
            }
            onChange={(colours) =>
              updateFilters({
                colours,
              })
            }
            initialLimit={20}
          />
        </FilterSection>

        {/* SURFACE FINISHES */}

        <FilterSection
          title="Surface finishes"
          count={
            filters.finishes.length
          }
        >
          <MultiSelectFilter
            label="Surface finishes"
            options={FINISH_OPTIONS}
            selected={
              filters.finishes
            }
            onChange={(finishes) =>
              updateFilters({
                finishes,
              })
            }
            searchable
            searchPlaceholder="Find a finish..."
          />
        </FilterSection>

        {/* ASSET CONDITION */}

        <FilterSection
          title="Condition"
          count={
            filters.conditions.length
          }
        >
          <MultiSelectFilter
            label="Asset condition"
            options={CONDITION_OPTIONS}
            selected={
              filters.conditions
            }
            onChange={(conditions) =>
              updateFilters({
                conditions,
              })
            }
          />
        </FilterSection>

        {/* SPECIALIST FILTERS */}

        <FilterSection
          title="Specialist design"
          count={
            countBooleanFilters(
              SPECIALIST_FILTERS
            )
          }
        >
          <BooleanFilterGroup
            definitions={
              SPECIALIST_FILTERS
            }
            filters={filters}
            onChange={updateFilters}
          />
        </FilterSection>

        {/* TECHNICAL CAPABILITIES */}

        <FilterSection
          title="Technical capabilities"
          count={
            countBooleanFilters(
              TECHNICAL_FILTERS
            )
          }
        >
          <BooleanFilterGroup
            definitions={
              TECHNICAL_FILTERS
            }
            filters={filters}
            onChange={updateFilters}
          />
        </FilterSection>

        {/* ASSET SOURCES */}

        <FilterSection
          title="Asset sources"
          count={
            filters.sources.length
          }
        >
          <MultiSelectFilter
            label="Asset sources"
            options={SOURCE_OPTIONS}
            selected={
              filters.sources
            }
            onChange={(sources) =>
              updateFilters({
                sources,
              })
            }
            initialLimit={10}
          />
        </FilterSection>

        {/* DIGITAL ACCESS */}

        <FilterSection
          title="Digital asset access"
          count={
            filters.access.length
          }
        >
          <MultiSelectFilter
            label="Digital asset access"
            options={ACCESS_OPTIONS}
            selected={
              filters.access
            }
            onChange={(access) =>
              updateFilters({
                access,

                freeOnly:
                  filters.freeOnly &&
                  (
                    access.length === 0 ||
                    access.includes('free')
                  ),
              })
            }
            initialLimit={3}
          />
        </FilterSection>

        {/* PHYSICAL PRICE RANGE */}

        <FilterSection
          title="Physical product budget"
          count={priceFilterCount}
        >
          <PriceRangeFilter
            filters={filters}
            onChange={updateFilters}
          />
        </FilterSection>

      </div>

      {onClose && (
        <footer className="catalogue-filters-footer">

          <button
            type="button"
            className="button button-primary"
            onClick={onClose}
          >
            Show results
          </button>

        </footer>
      )}

    </aside>
  );
}

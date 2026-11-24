
import {
  useMemo,
} from 'react';

import {
  X,
  RotateCcw,
  Search,
} from 'lucide-react';

import type {
  CatalogueFilters,
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
} from '../../store/catalogueStore';

/* ========================================
   NO BEIGE STUDIO
   Active Catalogue Filter Chips

   Individual filter removal.
   Accessible filter summaries.
   Studio-aware reset controls.
======================================== */

interface ActiveFilterChipsProps {
  showSearch?: boolean;

  showReset?: boolean;

  showGroupLabels?: boolean;

  lockedStudio?: StudioId;

  className?: string;
}

interface FilterChip {
  id: string;

  label: string;

  group: string;

  colour?: string;

  search?: boolean;

  remove: () => void;
}

type UpdateFilters = (
  updates: Partial<CatalogueFilters>
) => void;

/* ========================================
   FILTER LABEL UTILITIES
======================================== */

function formatLabel(
  value: string
): string {
  return value
    .replace(/-/g, ' ')
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase()
    );
}

function formatPrice(
  amount: number,

  currency: string
): string {
  try {
    return new Intl.NumberFormat(
      'en-GB',
      {
        style: 'currency',

        currency,

        maximumFractionDigits: 2,
      }
    ).format(amount);

  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

/* ========================================
   CATEGORY LOOKUP
======================================== */

const CATEGORY_LABELS =
  new Map(
    CATALOGUE_CATEGORIES.map(
      (category) => [
        category.id,

        category.name,
      ]
    )
  );

const CATEGORY_COLOURS =
  new Map(
    CATALOGUE_CATEGORIES.map(
      (category) => [
        category.id,

        category.colour,
      ]
    )
  );

/* ========================================
   STUDIO LOOKUP
======================================== */

const STUDIO_LABELS =
  new Map(
    STUDIOS.map(
      (studio) => [
        studio.id,

        studio.shortName,
      ]
    )
  );

const STUDIO_COLOURS =
  new Map(
    STUDIOS.map(
      (studio) => [
        studio.id,

        studio.colour,
      ]
    )
  );

/* ========================================
   COLOUR LOOKUP
======================================== */

const COLOUR_LABELS =
  new Map(
    COLOUR_FAMILY_OPTIONS.map(
      (colour) => [
        colour.id,

        colour.name,
      ]
    )
  );

const COLOUR_VALUES =
  new Map(
    COLOUR_FAMILY_OPTIONS.map(
      (colour) => [
        colour.id,

        colour.hex,
      ]
    )
  );

/* ========================================
   SOURCE LABELS
======================================== */

const SOURCE_LABELS: Record<
  string,
  string
> = {
  'studio-original':
    'NO BEIGE originals',

  'licensed-library':
    'Licensed libraries',

  manufacturer:
    'Manufacturers',

  community:
    'Community creations',

  'user-upload':
    'User uploads',

  'creator-marketplace':
    'Creator marketplace',

  'public-domain':
    'Public domain',

  'open-source':
    'Open source',

  procedural:
    'Procedural assets',
};

/* ========================================
   ACCESS LABELS
======================================== */

const ACCESS_LABELS: Record<
  string,
  string
> = {
  free:
    'Free assets',

  premium:
    'Premium assets',

  marketplace:
    'Marketplace assets',

  private:
    'Private assets',
};

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

interface BooleanChipDefinition {
  key: BooleanFilterKey;

  label: string;

  group: string;

  colour?: string;
}

const BOOLEAN_CHIPS:
  BooleanChipDefinition[] = [
    {
      key: 'freeOnly',

      label: 'Free only',

      group: 'Access',

      colour: '#a9e52c',
    },

    {
      key: 'favouritesOnly',

      label: 'My favourites',

      group: 'Personal',

      colour: '#ff3d8d',
    },

    {
      key: 'verifiedOnly',

      label: 'Verified assets',

      group: 'Verification',

      colour: '#00d5e8',
    },

    {
      key: 'accessibleOnly',

      label: 'Verified accessibility',

      group: 'Specialist',

      colour: '#00d5e8',
    },

    {
      key: 'sustainableOnly',

      label: 'Verified sustainability',

      group: 'Specialist',

      colour: '#a9e52c',
    },

    {
      key: 'restorationOnly',

      label: 'Restoration assets',

      group: 'Specialist',

      colour: '#b18aff',
    },

    {
      key: 'lightweightOnly',

      label: 'Lightweight models',

      group: 'Performance',

      colour: '#a9e52c',
    },

    {
      key: 'commercialUseOnly',

      label: 'Verified commercial licence',

      group: 'Licensing',

      colour: '#00d5e8',
    },

    {
      key: 'has3DModel',

      label: '3D model available',

      group: 'Technical',

      colour: '#b18aff',
    },

    {
      key: 'has2DSymbol',

      label: '2D symbol available',

      group: 'Technical',

      colour: '#00d5e8',
    },
  ];

/* ========================================
   CHIP GENERATION
======================================== */

function createFilterChips(
  filters: CatalogueFilters,

  updateFilters: UpdateFilters,

  showSearch: boolean,

  lockedStudio?: StudioId
): FilterChip[] {
  const chips: FilterChip[] = [];

  /* SEARCH */

  if (
    showSearch &&
    filters.search.trim()
  ) {
    chips.push({
      id: 'search',

      label: filters.search.trim(),

      group: 'Search',

      search: true,

      remove: () =>
        updateFilters({
          search: '',
        }),
    });
  }

  /* CATEGORIES */

  for (
    const category of filters.categories
  ) {
    chips.push({
      id: `category-${category}`,

      label:
        CATEGORY_LABELS.get(category) ??
        formatLabel(category),

      group: 'Category',

      colour:
        CATEGORY_COLOURS.get(category),

      remove: () => {
        const remainingCategories =
          filters.categories.filter(
            (value) =>
              value !== category
          );

        const availableCategories =
          remainingCategories.length > 0
            ? CATALOGUE_CATEGORIES.filter(
                (candidate) =>
                  remainingCategories.includes(
                    candidate.id
                  )
              )
            : CATALOGUE_CATEGORIES;

        const availableSubcategories =
          new Set(
            availableCategories.flatMap(
              (candidate) =>
                candidate.subcategories
            )
          );

        updateFilters({
          categories:
            remainingCategories,

          subcategories:
            filters.subcategories.filter(
              (subcategory) =>
                availableSubcategories.has(
                  subcategory
                )
            ),
        });
      },
    });
  }

  /* SUBCATEGORIES */

  for (
    const subcategory of filters.subcategories
  ) {
    chips.push({
      id: `subcategory-${subcategory}`,

      label: subcategory,

      group: 'Subcategory',

      remove: () =>
        updateFilters({
          subcategories:
            filters.subcategories.filter(
              (value) =>
                value !== subcategory
            ),
        }),
    });
  }

  /* DESIGN STUDIOS */

  for (
    const studio of filters.studios
  ) {
    if (studio === lockedStudio) {
      continue;
    }

    chips.push({
      id: `studio-${studio}`,

      label:
        STUDIO_LABELS.get(studio) ??
        formatLabel(studio),

      group: 'Studio',

      colour:
        STUDIO_COLOURS.get(studio),

      remove: () =>
        updateFilters({
          studios:
            filters.studios.filter(
              (value) =>
                value !== studio
            ),
        }),
    });
  }

  /* HISTORICAL PERIODS */

  for (
    const period of filters.periods
  ) {
    chips.push({
      id: `period-${period}`,

      label:
        HISTORICAL_PERIOD_LABELS[period] ??
        formatLabel(period),

      group: 'Historical period',

      colour: '#b18aff',

      remove: () =>
        updateFilters({
          periods:
            filters.periods.filter(
              (value) =>
                value !== period
            ),
        }),
    });
  }

  /* DESIGN STYLES */

  for (
    const style of filters.styles
  ) {
    chips.push({
      id: `style-${style}`,

      label:
        DESIGN_STYLE_LABELS[style] ??
        formatLabel(style),

      group: 'Design style',

      colour: '#ff9b36',

      remove: () =>
        updateFilters({
          styles:
            filters.styles.filter(
              (value) =>
                value !== style
            ),
        }),
    });
  }

  /* MATERIALS */

  for (
    const material of filters.materials
  ) {
    chips.push({
      id: `material-${material}`,

      label:
        MATERIAL_FAMILY_LABELS[material] ??
        formatLabel(material),

      group: 'Material',

      colour: '#b18aff',

      remove: () =>
        updateFilters({
          materials:
            filters.materials.filter(
              (value) =>
                value !== material
            ),
        }),
    });
  }

  /* COLOURS */

  for (
    const colour of filters.colours
  ) {
    chips.push({
      id: `colour-${colour}`,

      label:
        COLOUR_LABELS.get(colour) ??
        formatLabel(colour),

      group: 'Colour',

      colour:
        COLOUR_VALUES.get(colour),

      remove: () =>
        updateFilters({
          colours:
            filters.colours.filter(
              (value) =>
                value !== colour
            ),
        }),
    });
  }

  /* SURFACE FINISHES */

  for (
    const finish of filters.finishes
  ) {
    chips.push({
      id: `finish-${finish}`,

      label:
        SURFACE_FINISH_LABELS[finish] ??
        formatLabel(finish),

      group: 'Surface finish',

      remove: () =>
        updateFilters({
          finishes:
            filters.finishes.filter(
              (value) =>
                value !== finish
            ),
        }),
    });
  }

  /* ASSET CONDITIONS */

  for (
    const condition of filters.conditions
  ) {
    chips.push({
      id: `condition-${condition}`,

      label:
        ASSET_CONDITION_LABELS[condition] ??
        formatLabel(condition),

      group: 'Condition',

      colour: '#b18aff',

      remove: () =>
        updateFilters({
          conditions:
            filters.conditions.filter(
              (value) =>
                value !== condition
            ),
        }),
    });
  }

  /* ASSET SOURCES */

  for (
    const source of filters.sources
  ) {
    chips.push({
      id: `source-${source}`,

      label:
        SOURCE_LABELS[source] ??
        formatLabel(source),

      group: 'Source',

      remove: () =>
        updateFilters({
          sources:
            filters.sources.filter(
              (value) =>
                value !== source
            ),
        }),
    });
  }

  /* DIGITAL ACCESS */

  for (
    const access of filters.access
  ) {
    chips.push({
      id: `access-${access}`,

      label:
        ACCESS_LABELS[access] ??
        formatLabel(access),

      group: 'Digital access',

      colour:
        access === 'free'
          ? '#a9e52c'
          : access === 'premium'
            ? '#b18aff'
            : '#ff9b36',

      remove: () =>
        updateFilters({
          access:
            filters.access.filter(
              (value) =>
                value !== access
            ),
        }),
    });
  }

  /* MINIMUM PHYSICAL PRICE */

  if (
    filters.minimumPrice !== null
  ) {
    chips.push({
      id: 'minimum-price',

      label:
        `Min. ${formatPrice(
          filters.minimumPrice,

          filters.priceCurrency
        )}`,

      group: 'Physical budget',

      colour: '#ff9b36',

      remove: () =>
        updateFilters({
          minimumPrice: null,
        }),
    });
  }

  /* MAXIMUM PHYSICAL PRICE */

  if (
    filters.maximumPrice !== null
  ) {
    chips.push({
      id: 'maximum-price',

      label:
        `Max. ${formatPrice(
          filters.maximumPrice,

          filters.priceCurrency
        )}`,

      group: 'Physical budget',

      colour: '#ff9b36',

      remove: () =>
        updateFilters({
          maximumPrice: null,
        }),
    });
  }

  /* BOOLEAN FILTERS */

  for (
    const definition of BOOLEAN_CHIPS
  ) {
    if (
      !filters[definition.key]
    ) {
      continue;
    }

    chips.push({
      id: definition.key,

      label: definition.label,

      group: definition.group,

      colour: definition.colour,

      remove: () =>
        updateFilters({
          [definition.key]: false,
        }),
    });
  }

  return chips;
}

/* ========================================
   INDIVIDUAL FILTER CHIP
======================================== */

function ActiveFilterChip({
  chip,

  showGroupLabel,
}: {
  chip: FilterChip;

  showGroupLabel: boolean;
}) {
  return (
    <button
      type="button"
      className={[
        'catalogue-active-filter-chip',

        chip.search
          ? 'catalogue-search-chip'
          : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={
        `Remove ${chip.group.toLowerCase()} filter: ${chip.label}`
      }
      title={
        `Remove ${chip.group.toLowerCase()} filter: ${chip.label}`
      }
      onClick={chip.remove}
    >
      {chip.search ? (
        <Search
          size={14}
          aria-hidden="true"
        />

      ) : chip.colour ? (
        <span
          className="catalogue-filter-chip-dot"
          style={{
            backgroundColor:
              chip.colour,
          }}
          aria-hidden="true"
        />

      ) : null}

      {showGroupLabel && (
        <span className="catalogue-filter-chip-group">

          {chip.group}:

        </span>
      )}

      <span className="catalogue-filter-chip-label">

        {chip.search
          ? `"${chip.label}"`
          : chip.label}

      </span>

      <X
        size={14}
        className="catalogue-filter-chip-remove"
        aria-hidden="true"
      />

    </button>
  );
}

/* ========================================
   MAIN ACTIVE FILTER COMPONENT
======================================== */

export default function ActiveFilterChips({
  showSearch = true,

  showReset = true,

  showGroupLabels = false,

  lockedStudio,

  className = '',
}: ActiveFilterChipsProps) {
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

  const resetFilters =
    useCatalogueStore(
      (state) =>
        state.resetFilters
    );

  /* ====================================
     BUILD ACTIVE CHIPS
  ==================================== */

  const chips =
    useMemo(
      () =>
        createFilterChips(
          filters,

          (updates) =>
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
            }),

          showSearch,

          lockedStudio
        ),

      [
        filters,
        setFilters,
        showSearch,
        lockedStudio,
      ]
    );

  /* ====================================
     RESET REMOVABLE FILTERS

     Preserve the locked studio context.
     Preserve hidden search text.
  ==================================== */

  function handleReset(): void {
    const previousSearch =
      filters.search;

    const previousCurrency =
      filters.priceCurrency;

    resetFilters();

    setFilters({
      priceCurrency:
        previousCurrency,

      ...(
        lockedStudio
          ? {
              studios: [
                lockedStudio,
              ],
            }
          : {}
      ),

      ...(
        !showSearch
          ? {
              search:
                previousSearch,
            }
          : {}
      ),
    });
  }

  /* ====================================
     EMPTY STATE

     Avoid occupying space when no
     removable filters are selected.
  ==================================== */

  if (
    chips.length === 0
  ) {
    return null;
  }

  /* ====================================
     ACTIVE FILTER SUMMARY
  ==================================== */

  return (
    <section
      className={[
        'catalogue-active-filters',

        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label="Active catalogue filters"
    >
      <div className="catalogue-active-filters-header">

        <span
          className="catalogue-active-filters-summary"
          aria-live="polite"
          aria-atomic="true"
        >
          {chips.length}

          {' '}

          {chips.length === 1
            ? 'active filter'
            : 'active filters'}

        </span>

        {showReset && (
          <button
            type="button"
            className="catalogue-clear-all-filters"
            onClick={handleReset}
          >
            <RotateCcw
              size={14}
              aria-hidden="true"
            />

            Clear all
          </button>
        )}

      </div>

      <div
        className="catalogue-active-filter-list"
        role="group"
        aria-label="Remove individual filters"
      >
        {chips.map(
          (chip) => (
            <ActiveFilterChip
              key={chip.id}
              chip={chip}
              showGroupLabel={
                showGroupLabels
              }
            />
          )
        )}
      </div>

    </section>
  );
}

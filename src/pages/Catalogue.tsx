
import {
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react';

import {
  LibraryBig,
  Layers3,
  Heart,
  FolderHeart,
  FolderPlus,
  Sparkles,
  Clock3,
  Search,
  RefreshCw,
  AlertCircle,
  ArrowRight,
  X,
  Plus,
  Globe2,
  Infinity as InfinityIcon,
  ShieldCheck,
} from 'lucide-react';

import type {
  CatalogueAsset,
  CatalogueCollection,
} from '../types/catalogue';

import {
  CATALOGUE_CATEGORIES,
} from '../config/catalogue';

import {
  useCatalogueStore,
  filterCatalogueAssets,
  sortCatalogueAssets,
  paginateCatalogueAssets,
} from '../store/catalogueStore';

import {
  useCatalogueContext,
} from '../components/CatalogueProvider';

import AssetCard from '../components/catalogue/AssetCard';

import AssetPreview, {
  AssetCategoryIcon,
} from '../components/catalogue/AssetPreview';

import CollectionCard from '../components/catalogue/CollectionCard';

import CatalogueFilters from '../components/catalogue/CatalogueFilters';

import ActiveFilterChips from '../components/catalogue/ActiveFilterChips';

import CatalogueToolbar from '../components/catalogue/CatalogueToolbar';

import CataloguePagination from '../components/catalogue/CataloguePagination';

import AssetDetailsDialog from '../components/catalogue/AssetDetailsDialog';

import CollectionDetailsDialog from '../components/catalogue/CollectionDetailsDialog';

import '../styles/catalogue.css';

/* ========================================
   NO BEIGE STUDIO
   Universal Design Catalogue

   One connected design library.
   Every era. Every style.
   Every creative possibility.
======================================== */

type CatalogueTab =
  | 'discover'
  | 'all-assets'
  | 'collections'
  | 'favourites'
  | 'personal'
  | 'recent';

type CollectionDialogMode =
  | 'create'
  | 'rename';

interface CollectionFormState {
  mode: CollectionDialogMode;

  collection?: CatalogueCollection;
}

/* ========================================
   CATALOGUE NAVIGATION
======================================== */

const CATALOGUE_TABS = [
  {
    id: 'discover' as const,

    label: 'Discover',

    icon: Sparkles,
  },

  {
    id: 'all-assets' as const,

    label: 'All assets',

    icon: LibraryBig,
  },

  {
    id: 'collections' as const,

    label: 'Collections',

    icon: Layers3,
  },

  {
    id: 'favourites' as const,

    label: 'Favourites',

    icon: Heart,
  },

  {
    id: 'personal' as const,

    label: 'My collections',

    icon: FolderHeart,
  },

  {
    id: 'recent' as const,

    label: 'Recently viewed',

    icon: Clock3,
  },
];

/* ========================================
   GENERAL UTILITIES
======================================== */

function formatNumber(
  value: number
): string {
  return new Intl.NumberFormat(
    'en-GB'
  ).format(value);
}

function normaliseText(
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

function searchCollections(
  collections: CatalogueCollection[],

  search: string
): CatalogueCollection[] {
  const terms =
    normaliseText(search)
      .split(/\s+/)
      .filter(Boolean);

  if (!terms.length) {
    return collections;
  }

  return collections.filter(
    (collection) => {
      const text =
        normaliseText(
          [
            collection.name,

            collection.description,

            collection.type,
          ].join(' ')
        );

      return terms.every(
        (term) =>
          text.includes(term)
      );
    }
  );
}

/* ========================================
   CATALOGUE HERO
======================================== */

function CatalogueHero({
  assetCount,

  collectionCount,

  freeCount,

  onBrowse,
}: {
  assetCount: number;

  collectionCount: number;

  freeCount: number;

  onBrowse: () => void;
}) {
  return (
    <section className="catalogue-hero">

      <div className="catalogue-hero-content">

        <span className="catalogue-hero-eyebrow">

          <Sparkles
            size={17}
            aria-hidden="true"
          />

          THE UNIVERSAL DESIGN LIBRARY

        </span>

        <h1 className="catalogue-hero-title">

          Every era.

          <br />

          Every style.

          <br />

          <span>
            Endless possibilities.
          </span>

        </h1>

        <p className="catalogue-hero-description">
          Explore furniture, architecture,
          historical treasures, materials,
          landscapes and original creations
          across all five design studios.
        </p>

        <div className="catalogue-hero-actions">

          <button
            type="button"
            className="button button-primary"
            onClick={onBrowse}
          >
            <LibraryBig
              size={19}
              aria-hidden="true"
            />

            Explore all assets

            <ArrowRight
              size={17}
              aria-hidden="true"
            />

          </button>

          <span className="catalogue-hero-free-note">

            <InfinityIcon
              size={18}
              aria-hidden="true"
            />

            Free catalogue access

          </span>

        </div>

      </div>

      <div
        className="catalogue-hero-art"
        aria-hidden="true"
      >
        <div className="catalogue-hero-orbit catalogue-hero-orbit-one" />

        <div className="catalogue-hero-orbit catalogue-hero-orbit-two" />

        <div className="catalogue-hero-orbit catalogue-hero-orbit-three" />

        <div className="catalogue-hero-centre">

          <LibraryBig size={76} />

        </div>

        <div className="catalogue-hero-floating catalogue-hero-floating-one">

          <AssetCategoryIcon
            category="furniture"
            size={32}
          />

        </div>

        <div className="catalogue-hero-floating catalogue-hero-floating-two">

          <AssetCategoryIcon
            category="architecture"
            size={32}
          />

        </div>

        <div className="catalogue-hero-floating catalogue-hero-floating-three">

          <AssetCategoryIcon
            category="plants"
            size={32}
          />

        </div>

        <div className="catalogue-hero-floating catalogue-hero-floating-four">

          <AssetCategoryIcon
            category="materials"
            size={32}
          />

        </div>

      </div>

      <div className="catalogue-hero-statistics">

        <div className="catalogue-hero-statistic">

          <strong>
            {formatNumber(assetCount)}
          </strong>

          <span>
            Catalogue assets
          </span>

        </div>

        <div className="catalogue-hero-statistic">

          <strong>
            {formatNumber(collectionCount)}
          </strong>

          <span>
            Curated collections
          </span>

        </div>

        <div className="catalogue-hero-statistic">

          <strong>
            {formatNumber(freeCount)}
          </strong>

          <span>
            Free assets
          </span>

        </div>

        <div className="catalogue-hero-statistic">

          <strong>
            5
          </strong>

          <span>
            Connected studios
          </span>

        </div>

      </div>

    </section>
  );
}

/* ========================================
   SECTION HEADING
======================================== */

function CatalogueSectionHeading({
  title,

  description,

  actionLabel,

  onAction,
}: {
  title: string;

  description?: string;

  actionLabel?: string;

  onAction?: () => void;
}) {
  return (
    <div className="catalogue-section-heading">

      <div>

        <h2 className="section-title">
          {title}
        </h2>

        {description && (
          <p className="section-description">
            {description}
          </p>
        )}

      </div>

      {actionLabel && onAction && (
        <button
          type="button"
          className="catalogue-section-action"
          onClick={onAction}
        >
          {actionLabel}

          <ArrowRight
            size={17}
            aria-hidden="true"
          />

        </button>
      )}

    </div>
  );
}

/* ========================================
   EMPTY STATE
======================================== */

function CatalogueEmptyState({
  type,

  title,

  description,

  actionLabel,

  onAction,
}: {
  type:
    | 'search'
    | 'favourites'
    | 'collections'
    | 'recent'
    | 'assets';

  title: string;

  description: string;

  actionLabel?: string;

  onAction?: () => void;
}) {
  const Icon = {
    search: Search,

    favourites: Heart,

    collections: FolderHeart,

    recent: Clock3,

    assets: LibraryBig,
  }[type];

  return (
    <div className="catalogue-empty-state">

      <div className="catalogue-empty-state-icon">

        <Icon
          size={42}
          aria-hidden="true"
        />

      </div>

      <h3>
        {title}
      </h3>

      <p>
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          type="button"
          className="button button-primary"
          onClick={onAction}
        >
          {actionLabel}

          <ArrowRight
            size={17}
            aria-hidden="true"
          />

        </button>
      )}

    </div>
  );
}

/* ========================================
   LOADING STATE
======================================== */

function CatalogueLoading() {
  return (
    <section
      className="catalogue-loading-state"
      aria-busy="true"
      aria-label="Loading catalogue"
    >
      <div className="catalogue-loading-heading">

        <RefreshCw
          size={22}
          className="catalogue-loading-spinner"
          aria-hidden="true"
        />

        <span>
          Preparing your design library...
        </span>

      </div>

      <div
        className="catalogue-loading-grid"
        aria-hidden="true"
      >
        {Array.from(
          {
            length: 8,
          },

          (_, index) => (
            <div
              key={index}
              className="catalogue-loading-card"
            >
              <div className="catalogue-loading-preview" />

              <div className="catalogue-loading-line" />

              <div className="catalogue-loading-line catalogue-loading-line-short" />

            </div>
          )
        )}

      </div>

    </section>
  );
}

/* ========================================
   CATEGORY EXPLORER
======================================== */

function CatalogueCategories({
  assets,

  onSelect,
}: {
  assets: CatalogueAsset[];

  onSelect: (
    category: CatalogueAsset['category']
  ) => void;
}) {
  const [expanded, setExpanded] =
    useState(false);

  const counts =
    useMemo(() => {
      const result =
        new Map<string, number>();

      for (
        const asset of assets
      ) {
        result.set(
          asset.category,

          (
            result.get(
              asset.category
            ) ?? 0
          ) + 1
        );
      }

      return result;
    }, [
      assets,
    ]);

  const categories =
    useMemo(
      () =>
        [...CATALOGUE_CATEGORIES]
          .sort(
            (first, second) =>
              first.sortOrder -
              second.sortOrder
          ),

      []
    );

  const visibleCategories =
    expanded
      ? categories
      : categories.slice(0, 12);

  return (
    <section className="catalogue-category-section">

      <CatalogueSectionHeading
        title="Explore by category"
        description="Find exactly what you need, or discover something completely unexpected."
      />

      <div className="catalogue-category-grid">

        {visibleCategories.map(
          (category) => {
            const count =
              counts.get(
                category.id
              ) ?? 0;

            return (
              <button
                key={category.id}
                type="button"
                className="catalogue-category-card"
                style={{
                  borderTopColor:
                    category.colour,
                }}
                onClick={() =>
                  onSelect(
                    category.id
                  )
                }
              >
                <div
                  className="catalogue-category-icon"
                  style={{
                    color:
                      category.colour,
                  }}
                >
                  <AssetCategoryIcon
                    category={category.id}
                    size={29}
                  />
                </div>

                <div className="catalogue-category-card-content">

                  <strong>
                    {category.name}
                  </strong>

                  <span>

                    {count > 0
                      ? `${formatNumber(count)} ${count === 1 ? 'asset' : 'assets'}`
                      : 'Library expanding'}

                  </span>

                </div>

                <ArrowRight
                  size={16}
                  className="catalogue-category-arrow"
                  aria-hidden="true"
                />

              </button>
            );
          }
        )}

      </div>

      {categories.length > 12 && (
        <button
          type="button"
          className="button button-secondary catalogue-category-expand"
          aria-expanded={expanded}
          onClick={() =>
            setExpanded(
              (previous) =>
                !previous
            )
          }
        >
          {expanded
            ? 'Show fewer categories'
            : `Explore all ${categories.length} categories`}

        </button>
      )}

    </section>
  );
}

/* ========================================
   FEATURED ASSETS
======================================== */

function FeaturedAssets({
  assets,

  onSelect,

  onBrowse,
}: {
  assets: CatalogueAsset[];

  onSelect: (
    asset: CatalogueAsset
  ) => void;

  onBrowse: () => void;
}) {
  if (!assets.length) {
    return null;
  }

  return (
    <section className="catalogue-featured-section">

      <CatalogueSectionHeading
        title="Featured discoveries"
        description="A little inspiration to get your creativity flowing."
        actionLabel="Browse all assets"
        onAction={onBrowse}
      />

      <div className="catalogue-featured-grid">

        {assets.map(
          (asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              onSelect={onSelect}
            />
          )
        )}

      </div>

    </section>
  );
}

/* ========================================
   FEATURED COLLECTIONS
======================================== */

function FeaturedCollections({
  collections,

  onSelect,

  onBrowse,
}: {
  collections: CatalogueCollection[];

  onSelect: (
    collection: CatalogueCollection
  ) => void;

  onBrowse: () => void;
}) {
  if (!collections.length) {
    return null;
  }

  return (
    <section className="catalogue-featured-collections">

      <CatalogueSectionHeading
        title="Curated inspiration"
        description="Discover collections spanning centuries, cultures, materials and creative styles."
        actionLabel="All collections"
        onAction={onBrowse}
      />

      <div className="catalogue-collection-grid">

        {collections.map(
          (collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              onSelect={onSelect}
            />
          )
        )}

      </div>

    </section>
  );
}

/* ========================================
   RECENTLY VIEWED PREVIEW
======================================== */

function RecentlyViewedPreview({
  assets,

  onSelect,

  onBrowse,
}: {
  assets: CatalogueAsset[];

  onSelect: (
    asset: CatalogueAsset
  ) => void;

  onBrowse: () => void;
}) {
  if (!assets.length) {
    return null;
  }

  return (
    <section className="catalogue-recent-preview">

      <CatalogueSectionHeading
        title="Pick up where you left off"
        description="Your recently explored assets."
        actionLabel="View history"
        onAction={onBrowse}
      />

      <div className="catalogue-recent-preview-grid">

        {assets.slice(0, 6).map(
          (asset) => (
            <button
              key={asset.id}
              type="button"
              className="catalogue-recent-preview-card"
              onClick={() =>
                onSelect(asset)
              }
            >
              <AssetPreview
                asset={asset}
                size="small"
                showLabels={false}
              />

              <span>
                {asset.name}
              </span>

            </button>
          )
        )}

      </div>

    </section>
  );
}

/* ========================================
   PLATFORM PHILOSOPHY
======================================== */

function CataloguePhilosophy() {
  return (
    <section className="catalogue-philosophy">

      <div className="catalogue-philosophy-heading">

        <Globe2
          size={35}
          aria-hidden="true"
        />

        <div>

          <h2>
            Creativity belongs to everyone.
          </h2>

          <p>
            A design library built for
            curiosity, individuality
            and freedom.
          </p>

        </div>

      </div>

      <div className="catalogue-philosophy-grid">

        <article>

          <InfinityIcon
            size={24}
            aria-hidden="true"
          />

          <h3>
            Free access
          </h3>

          <p>
            Explore the catalogue and
            build personal inspiration
            collections without a subscription.
          </p>

        </article>

        <article>

          <Layers3
            size={24}
            aria-hidden="true"
          />

          <h3>
            Connected creativity
          </h3>

          <p>
            One shared asset library
            across architecture, interiors,
            restoration, landscape and creation.
          </p>

        </article>

        <article>

          <ShieldCheck
            size={24}
            aria-hidden="true"
          />

          <h3>
            Transparent information
          </h3>

          <p>
            Clear asset origins, licensing,
            verification and available
            design capabilities.
          </p>

        </article>

      </div>

    </section>
  );
}

/* ========================================
   COLLECTION CREATE / RENAME FORM
======================================== */

function CollectionForm({
  form,

  onClose,

  onSaved,
}: {
  form: CollectionFormState;

  onClose: () => void;

  onSaved: (
    collectionId: string
  ) => void;
}) {
  const createCollection =
    useCatalogueStore(
      (state) =>
        state.createPersonalCollection
    );

  const renameCollection =
    useCatalogueStore(
      (state) =>
        state.renamePersonalCollection
    );

  const [name, setName] =
    useState(
      form.collection?.name ??
      ''
    );

  const [description, setDescription] =
    useState(
      form.collection?.description ??
      ''
    );

  const [error, setError] =
    useState('');

  const nameId =
    useId();

  const descriptionId =
    useId();

  function handleSubmit(): void {
    const trimmedName =
      name.trim();

    if (!trimmedName) {
      setError(
        'Enter a collection name.'
      );

      return;
    }

    try {
      if (
        form.mode === 'rename' &&
        form.collection
      ) {
        renameCollection(
          form.collection.id,

          trimmedName
        );

        onSaved(
          form.collection.id
        );

      } else {
        const collection =
          createCollection(
            trimmedName,

            description.trim()
          );

        onSaved(
          collection.id
        );
      }

    } catch {
      setError(
        'Unable to save your collection.'
      );
    }
  }

  return (
    <section
      className="catalogue-collection-form panel"
      aria-label={
        form.mode === 'rename'
          ? 'Rename collection'
          : 'Create collection'
      }
    >
      <div className="catalogue-collection-form-heading">

        <div>

          <h3>

            {form.mode === 'rename'
              ? 'Rename your collection'
              : 'Create a collection'}

          </h3>

          <p>
            Organise inspiration your way.
          </p>

        </div>

        <button
          type="button"
          className="icon-button"
          aria-label="Close collection form"
          onClick={onClose}
        >
          <X
            size={21}
            aria-hidden="true"
          />
        </button>

      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();

          handleSubmit();
        }}
      >
        <div className="form-group">

          <label
            htmlFor={nameId}
            className="form-label"
          >
            Collection name
          </label>

          <input
            id={nameId}
            className="input"
            value={name}
            maxLength={100}
            placeholder="My dream Italian villa..."
            required
            autoFocus
            onChange={(event) => {
              setName(
                event.target.value
              );

              setError('');
            }}
          />

        </div>

        {form.mode === 'create' && (
          <div className="form-group">

            <label
              htmlFor={descriptionId}
              className="form-label"
            >
              Description (optional)
            </label>

            <textarea
              id={descriptionId}
              className="textarea"
              value={description}
              maxLength={1000}
              rows={3}
              placeholder="What inspires this collection?"
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
            />

          </div>
        )}

        {error && (
          <p
            className="form-error"
            role="alert"
          >
            {error}
          </p>
        )}

        <div className="catalogue-collection-form-actions">

          <button
            type="submit"
            className="button button-primary"
          >
            <FolderPlus
              size={18}
              aria-hidden="true"
            />

            {form.mode === 'rename'
              ? 'Save changes'
              : 'Create collection'}

          </button>

          <button
            type="button"
            className="button button-secondary"
            onClick={onClose}
          >
            Cancel
          </button>

        </div>

      </form>

    </section>
  );
}

/* ========================================
   MAIN CATALOGUE PAGE
======================================== */

export default function Catalogue() {
  const {
    isReady,

    isLoading,

    hasError,

    error,

    retry,

    refresh,
  } = useCatalogueContext();

  /* ====================================
     SHARED CATALOGUE STATE
  ==================================== */

  const assets =
    useCatalogueStore(
      (state) =>
        state.assets
    );

  const collections =
    useCatalogueStore(
      (state) =>
        state.collections
    );

  const favourites =
    useCatalogueStore(
      (state) =>
        state.favourites
    );

  const personalCollections =
    useCatalogueStore(
      (state) =>
        state.personalCollections
    );

  const recentlyViewed =
    useCatalogueStore(
      (state) =>
        state.recentlyViewed
    );

  const filters =
    useCatalogueStore(
      (state) =>
        state.filters
    );

  const sort =
    useCatalogueStore(
      (state) =>
        state.sort
    );

  const view =
    useCatalogueStore(
      (state) =>
        state.view
    );

  const page =
    useCatalogueStore(
      (state) =>
        state.page
    );

  const pageSize =
    useCatalogueStore(
      (state) =>
        state.pageSize
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

  const setPage =
    useCatalogueStore(
      (state) =>
        state.setPage
    );

  const deletePersonalCollection =
    useCatalogueStore(
      (state) =>
        state.deletePersonalCollection
    );

  const clearRecentlyViewed =
    useCatalogueStore(
      (state) =>
        state.clearRecentlyViewed
    );

  /* ====================================
     PAGE INTERFACE STATE
  ==================================== */

  const [activeTab, setActiveTab] =
    useState<CatalogueTab>(
      'discover'
    );

  const [filtersOpen, setFiltersOpen] =
    useState(false);

  const [collectionSearch, setCollectionSearch] =
    useState('');

  const [selectedAssetId, setSelectedAssetId] =
    useState<string | null>(
      null
    );

  const [selectedCollectionId, setSelectedCollectionId] =
    useState<string | null>(
      null
    );

  const [collectionForm, setCollectionForm] =
    useState<CollectionFormState | null>(
      null
    );

  const [message, setMessage] =
    useState('');

  const filterPanelId =
    useId();

  const collectionSearchId =
    useId();

  /* ====================================
     AVAILABLE ASSETS
  ==================================== */

  const publicAssets =
    useMemo(
      () =>
        assets.filter(
          (asset) =>
            asset.published &&
            asset.access !== 'private'
        ),

      [
        assets,
      ]
    );

  const publicCollections =
    useMemo(
      () =>
        collections.filter(
          (collection) =>
            collection.published
        ),

      [
        collections,
      ]
    );

  const assetMap =
    useMemo(
      () =>
        new Map(
          publicAssets.map(
            (asset) => [
              asset.id,

              asset,
            ]
          )
        ),

      [
        publicAssets,
      ]
    );

  const favouriteAssets =
    useMemo(
      () => {
        const favouriteIds =
          new Set(
            favourites.map(
              (item) =>
                item.assetId
            )
          );

        return publicAssets.filter(
          (asset) =>
            favouriteIds.has(
              asset.id
            )
        );
      },

      [
        favourites,
        publicAssets,
      ]
    );

  const recentAssets =
    useMemo(
      () =>
        recentlyViewed.flatMap(
          (entry) => {
            const assetId =
              typeof entry === 'string'
                ? entry
                : (
                    entry as {
                      assetId?: string;
                    }
                  ).assetId;

            const asset =
              assetId
                ? assetMap.get(assetId)
                : undefined;

            return asset
              ? [asset]
              : [];
          }
        ),

      [
        recentlyViewed,
        assetMap,
      ]
    );

  const featuredAssets =
    useMemo(
      () =>
        publicAssets
          .filter(
            (asset) =>
              asset.featured
          )
          .slice(0, 8),

      [
        publicAssets,
      ]
    );

  const featuredCollections =
    useMemo(
      () =>
        publicCollections
          .filter(
            (collection) =>
              collection.featured
          )
          .slice(0, 6),

      [
        publicCollections,
      ]
    );

  const freeAssetCount =
    useMemo(
      () =>
        publicAssets.filter(
          (asset) =>
            asset.access === 'free'
        ).length,

      [
        publicAssets,
      ]
    );

  /* ====================================
     ACTIVE TAB ASSET SCOPE
  ==================================== */

  const scopedAssets =
    useMemo(() => {
      switch (activeTab) {
        case 'favourites':
          return favouriteAssets;

        case 'recent':
          return recentAssets;

        default:
          return publicAssets;
      }
    }, [
      activeTab,
      favouriteAssets,
      recentAssets,
      publicAssets,
    ]);

  /* ====================================
     FILTERED AND SORTED RESULTS
  ==================================== */

  const filteredAssets =
    useMemo(
      () =>
        filterCatalogueAssets(
          scopedAssets,

          filters,

          favourites
        ),

      [
        scopedAssets,
        filters,
        favourites,
      ]
    );

  const sortedAssets =
    useMemo(
      () => {
        if (
          activeTab === 'recent' &&
          sort === 'relevance' &&
          !filters.search.trim()
        ) {
          return filteredAssets;
        }

        return sortCatalogueAssets(
          filteredAssets,

          sort,

          filters.search,

          filters.priceCurrency
        );
      },

      [
        filteredAssets,
        sort,
        filters.search,
        filters.priceCurrency,
        activeTab,
      ]
    );

  const results =
    useMemo(
      () =>
        paginateCatalogueAssets(
          sortedAssets,

          page,

          pageSize
        ),

      [
        sortedAssets,
        page,
        pageSize,
      ]
    );

  /* ====================================
     COLLECTION RESULTS
  ==================================== */

  const visibleCollections =
    useMemo(
      () =>
        searchCollections(
          activeTab === 'personal'
            ? personalCollections
            : publicCollections,

          collectionSearch
        ),

      [
        activeTab,
        personalCollections,
        publicCollections,
        collectionSearch,
      ]
    );

  /* ====================================
     SELECTED DIALOG CONTENT
  ==================================== */

  const selectedAsset =
    selectedAssetId
      ? assetMap.get(
          selectedAssetId
        ) ?? null
      : null;

  const selectedCollection =
    selectedCollectionId
      ? (
          personalCollections.find(
            (collection) =>
              collection.id ===
              selectedCollectionId
          ) ??
          publicCollections.find(
            (collection) =>
              collection.id ===
              selectedCollectionId
          ) ??
          null
        )
      : null;

  /* ====================================
     PAGE SYNCHRONISATION
  ==================================== */

  useEffect(() => {
    if (
      page !== results.page
    ) {
      setPage(
        results.page
      );
    }
  }, [
    page,
    results.page,
    setPage,
  ]);

  /* ====================================
     TAB NAVIGATION
  ==================================== */

  function changeTab(
    tab: CatalogueTab
  ): void {
    setActiveTab(tab);

    setPage(1);

    setCollectionSearch('');

    setCollectionForm(null);

    setFiltersOpen(false);

    setMessage('');
  }

  function browseAllAssets(): void {
    resetFilters();

    changeTab(
      'all-assets'
    );
  }

  function browseCategory(
    category: CatalogueAsset['category']
  ): void {
    resetFilters();

    setFilters({
      categories: [
        category,
      ],
    });

    changeTab(
      'all-assets'
    );
  }

  function openAsset(
    asset: CatalogueAsset
  ): void {
    setSelectedCollectionId(null);

    setSelectedAssetId(
      asset.id
    );
  }

  function openCollection(
    collection: CatalogueCollection
  ): void {
    setSelectedAssetId(null);

    setSelectedCollectionId(
      collection.id
    );
  }

  function handleDeleteCollection(
    collection: CatalogueCollection
  ): void {
    deletePersonalCollection(
      collection.id
    );

    if (
      selectedCollectionId ===
      collection.id
    ) {
      setSelectedCollectionId(null);
    }

    setMessage(
      `"${collection.name}" deleted. Original catalogue assets have been preserved.`
    );
  }

  function handleClearHistory(): void {
    const confirmed =
      window.confirm(
        'Clear your recently viewed assets? Your favourites and collections will not be affected.'
      );

    if (!confirmed) {
      return;
    }

    clearRecentlyViewed();

    setMessage(
      'Browsing history cleared.'
    );
  }

  /* ====================================
     TAB COUNTS
  ==================================== */

  const tabCounts:
    Partial<Record<CatalogueTab, number>> = {
      'all-assets':
        publicAssets.length,

      collections:
        publicCollections.length,

      favourites:
        favouriteAssets.length,

      personal:
        personalCollections.length,

      recent:
        recentAssets.length,
    };

  const assetTab =
    activeTab === 'all-assets' ||
    activeTab === 'favourites' ||
    activeTab === 'recent';

  const collectionTab =
    activeTab === 'collections' ||
    activeTab === 'personal';

  const waitingForCatalogue =
    !isReady &&
    !hasError;

  /* ====================================
     MAIN PAGE
  ==================================== */

  return (
    <div className="page-container catalogue-page">

      <header className="page-heading catalogue-page-heading">

        <div>

          <span className="catalogue-page-eyebrow">

            <LibraryBig
              size={17}
              aria-hidden="true"
            />

            NO BEIGE STUDIO

          </span>

          <h1 className="page-title">
            Design Catalogue
          </h1>

          <p className="page-description">
            One universal library.
            Five connected studios.
            No limits on imagination.
          </p>

        </div>

        <button
          type="button"
          className="button button-secondary catalogue-refresh-button"
          disabled={isLoading}
          onClick={() => {
            void refresh();
          }}
        >
          <RefreshCw
            size={17}
            className={
              isLoading
                ? 'catalogue-loading-spinner'
                : undefined
            }
            aria-hidden="true"
          />

          Refresh library

        </button>

      </header>

      {/* CATALOGUE NAVIGATION */}

      <nav
        className="catalogue-navigation"
        aria-label="Catalogue sections"
      >
        {CATALOGUE_TABS.map(
          (tab) => {
            const Icon =
              tab.icon;

            const active =
              activeTab === tab.id;

            const count =
              tabCounts[tab.id];

            return (
              <button
                key={tab.id}
                type="button"
                className={[
                  'catalogue-navigation-tab',

                  active
                    ? 'catalogue-navigation-tab-active'
                    : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                aria-pressed={active}
                onClick={() =>
                  changeTab(
                    tab.id
                  )
                }
              >
                <Icon
                  size={19}
                  aria-hidden="true"
                />

                <span>
                  {tab.label}
                </span>

                {count !== undefined && (
                  <span className="catalogue-navigation-count">

                    {formatNumber(count)}

                  </span>
                )}

              </button>
            );
          }
        )}

      </nav>

      {message && (
        <div
          className="catalogue-page-message"
          role="status"
          aria-live="polite"
        >
          <span>
            {message}
          </span>

          <button
            type="button"
            className="icon-button"
            aria-label="Dismiss message"
            onClick={() =>
              setMessage('')
            }
          >
            <X
              size={17}
              aria-hidden="true"
            />
          </button>

        </div>
      )}

      {/* ERROR STATE */}

      {hasError && (
        <section
          className="catalogue-error-state panel"
          role="alert"
        >
          <AlertCircle
            size={34}
            aria-hidden="true"
          />

          <div>

            <h2>
              Unable to load the catalogue
            </h2>

            <p>
              {error ||
                'The design library could not be loaded.'}
            </p>

          </div>

          <button
            type="button"
            className="button button-primary"
            onClick={() => {
              void retry();
            }}
          >
            <RefreshCw
              size={18}
              aria-hidden="true"
            />

            Try again

          </button>

        </section>
      )}

      {/* LOADING STATE */}

      {waitingForCatalogue && (
        <CatalogueLoading />
      )}

      {/* DISCOVERY PAGE */}

      {isReady &&
        activeTab === 'discover' && (
          <div className="catalogue-discover-content">

            <CatalogueHero
              assetCount={
                publicAssets.length
              }
              collectionCount={
                publicCollections.length
              }
              freeCount={
                freeAssetCount
              }
              onBrowse={
                browseAllAssets
              }
            />

            <CatalogueCategories
              assets={publicAssets}
              onSelect={
                browseCategory
              }
            />

            <FeaturedAssets
              assets={featuredAssets}
              onSelect={openAsset}
              onBrowse={
                browseAllAssets
              }
            />

            <FeaturedCollections
              collections={
                featuredCollections
              }
              onSelect={
                openCollection
              }
              onBrowse={() =>
                changeTab(
                  'collections'
                )
              }
            />

            <RecentlyViewedPreview
              assets={recentAssets}
              onSelect={openAsset}
              onBrowse={() =>
                changeTab(
                  'recent'
                )
              }
            />

            <CataloguePhilosophy />

          </div>
        )}

      {/* ASSET BROWSING */}

      {isReady && assetTab && (
        <section className="catalogue-browse-section">

          {activeTab === 'favourites' && (
            <CatalogueSectionHeading
              title="Your favourite discoveries"
              description="All the assets you love, saved together in one place."
            />
          )}

          {activeTab === 'recent' && (
            <CatalogueSectionHeading
              title="Recently viewed"
              description="Rediscover assets you have previously explored."
              actionLabel={
                recentAssets.length > 0
                  ? 'Clear history'
                  : undefined
              }
              onAction={
                handleClearHistory
              }
            />
          )}

          <CatalogueToolbar
            totalResults={
              results.totalResults
            }
            visibleResults={
              results.assets.length
            }
            currentPage={
              results.page
            }
            isLoading={isLoading}
            filtersOpen={
              filtersOpen
            }
            filterPanelId={
              filterPanelId
            }
            onToggleFilters={() =>
              setFiltersOpen(
                (previous) =>
                  !previous
              )
            }
          />

          <ActiveFilterChips />

          <div
            className={[
              'catalogue-browser-layout',

              filtersOpen
                ? 'catalogue-browser-filters-open'
                : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {filtersOpen && (
              <aside
                id={filterPanelId}
                className="catalogue-filter-sidebar"
              >
                <CatalogueFilters
                  showSearch={false}
                  onClose={() =>
                    setFiltersOpen(false)
                  }
                />
              </aside>
            )}

            <div className="catalogue-browser-results">

              {results.assets.length > 0 ? (
                <>

                  <div
                    className={[
                      'catalogue-results-grid',

                      `catalogue-results-${view}`,
                    ].join(' ')}
                  >
                    {results.assets.map(
                      (asset) => (
                        <AssetCard
                          key={asset.id}
                          asset={asset}
                          view={view}
                          onSelect={
                            openAsset
                          }
                        />
                      )
                    )}

                  </div>

                  <CataloguePagination
                    totalResults={
                      results.totalResults
                    }
                    currentPage={
                      results.page
                    }
                    pageSize={
                      results.pageSize
                    }
                    onPageChange={
                      setPage
                    }
                    disabled={
                      isLoading
                    }
                  />

                </>

              ) : scopedAssets.length > 0 ? (
                <CatalogueEmptyState
                  type="search"
                  title="No matching assets"
                  description="Try another search or remove some filters to discover more possibilities."
                  actionLabel="Clear filters"
                  onAction={
                    resetFilters
                  }
                />

              ) : activeTab === 'favourites' ? (
                <CatalogueEmptyState
                  type="favourites"
                  title="Your favourites are waiting"
                  description="Select the heart on any catalogue asset to save it here."
                  actionLabel="Explore the catalogue"
                  onAction={
                    browseAllAssets
                  }
                />

              ) : activeTab === 'recent' ? (
                <CatalogueEmptyState
                  type="recent"
                  title="Nothing viewed yet"
                  description="Assets you explore will appear here automatically."
                  actionLabel="Discover assets"
                  onAction={
                    browseAllAssets
                  }
                />

              ) : (
                <CatalogueEmptyState
                  type="assets"
                  title="The library is growing"
                  description="New assets will appear here as the catalogue expands."
                />
              )}

            </div>

          </div>

        </section>
      )}

      {/* COLLECTION BROWSING */}

      {isReady && collectionTab && (
        <section className="catalogue-collections-section">

          <div className="catalogue-collections-heading">

            <CatalogueSectionHeading
              title={
                activeTab === 'personal'
                  ? 'Your inspiration library'
                  : 'Explore curated collections'
              }
              description={
                activeTab === 'personal'
                  ? 'Create collections for your projects, favourite styles and future ideas.'
                  : 'Explore thoughtfully grouped assets from different eras, styles and design disciplines.'
              }
            />

            {activeTab === 'personal' && (
              <button
                type="button"
                className="button button-primary"
                onClick={() =>
                  setCollectionForm({
                    mode: 'create',
                  })
                }
              >
                <Plus
                  size={19}
                  aria-hidden="true"
                />

                New collection

              </button>
            )}

          </div>

          {collectionForm && (
            <CollectionForm
              key={
                collectionForm.collection?.id ??
                'new-collection'
              }
              form={collectionForm}
              onClose={() =>
                setCollectionForm(null)
              }
              onSaved={(collectionId) => {
                setCollectionForm(null);

                setCollectionSearch('');

                setMessage(
                  'Collection saved.'
                );

                setSelectedCollectionId(
                  collectionId
                );
              }}
            />
          )}

          <div className="catalogue-collection-search">

            <Search
              size={20}
              aria-hidden="true"
            />

            <label
              htmlFor={collectionSearchId}
              className="sr-only"
            >
              Search collections
            </label>

            <input
              id={collectionSearchId}
              type="search"
              value={
                collectionSearch
              }
              placeholder="Search collections..."
              autoComplete="off"
              onChange={(event) =>
                setCollectionSearch(
                  event.target.value
                )
              }
            />

            {collectionSearch && (
              <button
                type="button"
                className="icon-button"
                aria-label="Clear collection search"
                onClick={() =>
                  setCollectionSearch('')
                }
              >
                <X
                  size={18}
                  aria-hidden="true"
                />
              </button>
            )}

          </div>

          <p
            className="catalogue-collection-results-count"
            role="status"
            aria-live="polite"
          >
            {formatNumber(
              visibleCollections.length
            )}

            {' '}

            {visibleCollections.length === 1
              ? 'collection'
              : 'collections'}

          </p>

          {visibleCollections.length > 0 ? (
            <div className="catalogue-collection-grid">

              {visibleCollections.map(
                (collection) => (
                  <CollectionCard
                    key={collection.id}
                    collection={collection}
                    personal={
                      activeTab === 'personal'
                    }
                    onSelect={
                      openCollection
                    }
                    onRename={
                      activeTab === 'personal'
                        ? (selected) =>
                            setCollectionForm({
                              mode: 'rename',

                              collection:
                                selected,
                            })
                        : undefined
                    }
                    onDelete={
                      activeTab === 'personal'
                        ? handleDeleteCollection
                        : undefined
                    }
                  />
                )
              )}

            </div>

          ) : collectionSearch.trim() ? (
            <CatalogueEmptyState
              type="search"
              title="No matching collections"
              description="Try searching for a different collection name or style."
              actionLabel="Clear search"
              onAction={() =>
                setCollectionSearch('')
              }
            />

          ) : activeTab === 'personal' ? (
            <CatalogueEmptyState
              type="collections"
              title="Make inspiration your own"
              description="Create your first personal collection and start saving the assets that inspire you."
              actionLabel="Create a collection"
              onAction={() =>
                setCollectionForm({
                  mode: 'create',
                })
              }
            />

          ) : (
            <CatalogueEmptyState
              type="collections"
              title="Collections are coming"
              description="New curated collections will appear as our design library grows."
            />
          )}

        </section>
      )}

      {/* ASSET DETAILS */}

      <AssetDetailsDialog
        asset={selectedAsset}
        open={
          selectedAsset !== null
        }
        onClose={() =>
          setSelectedAssetId(null)
        }
      />

      {/* COLLECTION DETAILS */}

      <CollectionDetailsDialog
        collection={
          selectedCollection
        }
        open={
          selectedCollection !== null
        }
        onClose={() =>
          setSelectedCollectionId(null)
        }
        onSelectAsset={
          openAsset
        }
        onSelectCollection={
          openCollection
        }
      />

      {/* CATALOGUE FOOTER */}

      <footer className="catalogue-page-footer">

        <span>
          NO BEIGE STUDIO
        </span>

        <span>
          Every era. Every style. Every imagination.
        </span>

        <span>
          Pay for what you need.
          Not what you don't.
        </span>

      </footer>

    </div>
  );
}

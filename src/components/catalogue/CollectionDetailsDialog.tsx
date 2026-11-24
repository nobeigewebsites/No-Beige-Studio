
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  X,
  FolderOpen,
  FolderHeart,
  Search,
  Pencil,
  Trash2,
  Check,
  LayoutGrid,
  List,
  Grid3X3,
  Layers3,
  ArrowLeft,
  ArrowRight,
  Info,
} from 'lucide-react';

import type {
  CatalogueAsset,
  CatalogueCollection,
  CatalogueView,
} from '../../types/catalogue';

import {
  useCatalogueStore,
} from '../../store/catalogueStore';

import {
  getStudio,
} from '../../config/studios';

import AssetCard from './AssetCard';

import AssetPreview from './AssetPreview';

import CataloguePagination from './CataloguePagination';

/* ========================================
   NO BEIGE STUDIO
   Collection Details Dialog

   Curated and personal collections.
   Independent collection browsing.
   Collection management.
   Responsive asset layouts.
======================================== */

interface CollectionDetailsDialogProps {
  collection: CatalogueCollection | null;

  open: boolean;

  onClose: () => void;

  onSelectAsset?: (
    asset: CatalogueAsset
  ) => void;

  onAddAsset?: (
    asset: CatalogueAsset
  ) => void;

  onSelectCollection?: (
    collection: CatalogueCollection
  ) => void;
}

type CollectionSort =
  | 'collection-order'
  | 'name-asc'
  | 'name-desc'
  | 'newest'
  | 'featured';

/* ========================================
   COLLECTION CONFIGURATION
======================================== */

const COLLECTION_PAGE_SIZE = 12;

const COLLECTION_SORT_OPTIONS: {
  value: CollectionSort;

  label: string;
}[] = [
  {
    value: 'collection-order',

    label: 'Collection order',
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
    value: 'newest',

    label: 'Newest first',
  },

  {
    value: 'featured',

    label: 'Featured first',
  },
];

const COLLECTION_VIEW_OPTIONS = [
  {
    value: 'grid' as const,

    label: 'Grid view',

    icon: LayoutGrid,
  },

  {
    value: 'list' as const,

    label: 'List view',

    icon: List,
  },

  {
    value: 'compact' as const,

    label: 'Compact view',

    icon: Grid3X3,
  },
];

/* ========================================
   TEXT UTILITIES
======================================== */

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

function formatDate(
  value: string
): string {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return 'Not recorded';
  }

  return new Intl.DateTimeFormat(
    'en-GB',

    {
      day: 'numeric',

      month: 'short',

      year: 'numeric',
    }
  ).format(date);
}

/* ========================================
   COLLECTION ASSET RESOLUTION
======================================== */

function resolveCollectionAssets(
  collection: CatalogueCollection,

  assets: CatalogueAsset[]
): CatalogueAsset[] {
  const assetMap =
    new Map(
      assets.map(
        (asset) => [
          asset.id,

          asset,
        ]
      )
    );

  const uniqueIds =
    Array.from(
      new Set(
        collection.assetIds
      )
    );

  return uniqueIds.flatMap(
    (assetId) => {
      const asset =
        assetMap.get(assetId);

      if (
        !asset ||
        !asset.published ||
        asset.access === 'private'
      ) {
        return [];
      }

      return [asset];
    }
  );
}

/* ========================================
   COLLECTION SEARCH
======================================== */

function searchCollectionAssets(
  assets: CatalogueAsset[],

  search: string
): CatalogueAsset[] {
  const terms =
    normaliseText(search)
      .split(/\s+/)
      .filter(Boolean);

  if (
    terms.length === 0
  ) {
    return assets;
  }

  return assets.filter(
    (asset) => {
      const searchableText =
        normaliseText(
          [
            asset.name,

            asset.description,

            asset.category,

            asset.subcategory,

            asset.creatorName ?? '',

            asset.manufacturerName ?? '',

            ...asset.tags,

            ...asset.styles,

            ...asset.historicalPeriods,

            ...asset.materialFamilies,

            ...asset.colourFamilies,
          ]
            .join(' ')
            .replace(/-/g, ' ')
        );

      return terms.every(
        (term) =>
          searchableText.includes(
            term
          )
      );
    }
  );
}

/* ========================================
   COLLECTION SORTING
======================================== */

function sortCollectionAssets(
  assets: CatalogueAsset[],

  sort: CollectionSort
): CatalogueAsset[] {
  const sorted =
    [...assets];

  switch (sort) {
    case 'name-asc':
      return sorted.sort(
        (first, second) =>
          first.name.localeCompare(
            second.name,

            'en-GB'
          )
      );

    case 'name-desc':
      return sorted.sort(
        (first, second) =>
          second.name.localeCompare(
            first.name,

            'en-GB'
          )
      );

    case 'newest':
      return sorted.sort(
        (first, second) =>
          (
            Date.parse(
              second.createdAt
            ) || 0
          ) -
          (
            Date.parse(
              first.createdAt
            ) || 0
          )
      );

    case 'featured':
      return sorted.sort(
        (first, second) =>
          Number(second.featured) -
          Number(first.featured)
      );

    default:
      return sorted;
  }
}

/* ========================================
   COLLECTION COVER
======================================== */

function CollectionCover({
  assets,

  personal,
}: {
  assets: CatalogueAsset[];

  personal: boolean;
}) {
  const previews =
    useMemo(() => {
      const selected:
        CatalogueAsset[] = [];

      const categories =
        new Set<string>();

      for (
        const asset of assets
      ) {
        if (
          !categories.has(
            asset.category
          )
        ) {
          selected.push(asset);

          categories.add(
            asset.category
          );
        }

        if (
          selected.length >= 4
        ) {
          break;
        }
      }

      for (
        const asset of assets
      ) {
        if (
          selected.length >= 4
        ) {
          break;
        }

        if (
          !selected.some(
            (item) =>
              item.id === asset.id
          )
        ) {
          selected.push(asset);
        }
      }

      return selected;
    }, [
      assets,
    ]);

  if (
    previews.length === 0
  ) {
    const Icon =
      personal
        ? FolderHeart
        : FolderOpen;

    return (
      <div className="collection-details-cover-empty">

        <Icon
          size={56}
          aria-hidden="true"
        />

        <span>
          Empty collection
        </span>

      </div>
    );
  }

  return (
    <div
      className={[
        'collection-details-cover',

        `collection-details-cover-${previews.length}`,
      ].join(' ')}
      aria-hidden="true"
    >
      {previews.map(
        (asset) => (
          <div
            key={asset.id}
            className="collection-details-cover-item"
          >
            <AssetPreview
              asset={asset}
              size="medium"
              showLabels={false}
            />
          </div>
        )
      )}

    </div>
  );
}

/* ========================================
   COLLECTION METADATA
======================================== */

function CollectionMetadata({
  collection,

  assetCount,

  personal,
}: {
  collection: CatalogueCollection;

  assetCount: number;

  personal: boolean;
}) {
  return (
    <div className="collection-details-metadata">

      <div className="collection-details-labels">

        <span
          className={
            personal
              ? 'collection-private-label'
              : 'collection-curated-label'
          }
        >
          {personal
            ? 'Personal collection'
            : 'Curated collection'}

        </span>

        {collection.featured &&
          !personal && (
            <span className="collection-featured-label">
              Featured
            </span>
          )}

      </div>

      <p className="collection-details-description">

        {collection.description ||
          'A collection of design inspiration.'}

      </p>

      <div className="collection-details-statistics">

        <div className="collection-details-statistic">

          <strong>
            {assetCount}
          </strong>

          <span>
            {assetCount === 1
              ? 'Asset'
              : 'Assets'}
          </span>

        </div>

        <div className="collection-details-statistic">

          <strong>
            {collection.compatibleStudios.length}
          </strong>

          <span>
            Compatible studios
          </span>

        </div>

        <div className="collection-details-statistic">

          <strong>
            {formatLabel(
              collection.type
            )}
          </strong>

          <span>
            Collection type
          </span>

        </div>

      </div>

      <div className="collection-details-studios">

        {collection.compatibleStudios.map(
          (studioId) => {
            const studio =
              getStudio(studioId);

            return (
              <span
                key={studioId}
                className="collection-details-studio"
              >
                <span
                  className="collection-studio-dot"
                  style={{
                    backgroundColor:
                      studio.colour,
                  }}
                  aria-hidden="true"
                />

                {studio.shortName}

              </span>
            );
          }
        )}

      </div>

      {personal && (
        <div className="collection-details-dates">

          <span>

            Created{' '}

            {formatDate(
              collection.createdAt
            )}

          </span>

          <span>

            Updated{' '}

            {formatDate(
              collection.updatedAt
            )}

          </span>

        </div>
      )}

    </div>
  );
}

/* ========================================
   COLLECTION RENAME FORM
======================================== */

function CollectionRenameForm({
  collection,

  onCancel,

  onSaved,
}: {
  collection: CatalogueCollection;

  onCancel: () => void;

  onSaved: () => void;
}) {
  const renameCollection =
    useCatalogueStore(
      (state) =>
        state.renamePersonalCollection
    );

  const [name, setName] =
    useState(
      collection.name
    );

  const [error, setError] =
    useState('');

  const inputId =
    useId();

  function handleSave(): void {
    const trimmedName =
      name.trim();

    if (
      !trimmedName
    ) {
      setError(
        'Enter a collection name.'
      );

      return;
    }

    try {
      renameCollection(
        collection.id,

        trimmedName
      );

      onSaved();

    } catch {
      setError(
        'Unable to rename this collection.'
      );
    }
  }

  return (
    <form
      className="collection-details-rename-form"
      onSubmit={(event) => {
        event.preventDefault();

        handleSave();
      }}
    >
      <label
        htmlFor={inputId}
        className="form-label"
      >
        Collection name
      </label>

      <input
        id={inputId}
        className="input"
        value={name}
        maxLength={100}
        required
        autoFocus
        onChange={(event) => {
          setName(
            event.target.value
          );

          setError('');
        }}
      />

      {error && (
        <p
          className="form-error"
          role="alert"
        >
          {error}
        </p>
      )}

      <div className="collection-details-rename-actions">

        <button
          type="submit"
          className="button button-primary"
        >
          <Check
            size={17}
            aria-hidden="true"
          />

          Save name

        </button>

        <button
          type="button"
          className="button button-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>

      </div>

    </form>
  );
}

/* ========================================
   COLLECTION BROWSING TOOLBAR
======================================== */

function CollectionToolbar({
  search,

  sort,

  view,

  totalResults,

  onSearchChange,

  onSortChange,

  onViewChange,
}: {
  search: string;

  sort: CollectionSort;

  view: CatalogueView;

  totalResults: number;

  onSearchChange: (
    search: string
  ) => void;

  onSortChange: (
    sort: CollectionSort
  ) => void;

  onViewChange: (
    view: CatalogueView
  ) => void;
}) {
  const searchId =
    useId();

  const sortId =
    useId();

  return (
    <section
      className="collection-details-toolbar"
      aria-label="Collection browsing controls"
    >
      <div className="collection-details-search">

        <label
          htmlFor={searchId}
          className="sr-only"
        >
          Search this collection
        </label>

        <Search
          size={19}
          aria-hidden="true"
        />

        <input
          id={searchId}
          type="search"
          value={search}
          placeholder="Search this collection..."
          autoComplete="off"
          onChange={(event) =>
            onSearchChange(
              event.target.value
            )
          }
        />

        {search && (
          <button
            type="button"
            className="icon-button"
            aria-label="Clear collection search"
            onClick={() =>
              onSearchChange('')
            }
          >
            <X
              size={17}
              aria-hidden="true"
            />
          </button>
        )}

      </div>

      <div className="collection-details-toolbar-controls">

        <span
          className="collection-details-results-count"
          role="status"
          aria-live="polite"
        >
          {totalResults}{' '}

          {totalResults === 1
            ? 'asset'
            : 'assets'}

        </span>

        <div className="collection-details-sort">

          <label
            htmlFor={sortId}
            className="sr-only"
          >
            Sort collection assets
          </label>

          <select
            id={sortId}
            className="select"
            value={sort}
            onChange={(event) => {
              const selected =
                COLLECTION_SORT_OPTIONS.find(
                  (option) =>
                    option.value ===
                    event.target.value
                );

              if (selected) {
                onSortChange(
                  selected.value
                );
              }
            }}
          >
            {COLLECTION_SORT_OPTIONS.map(
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

        </div>

        <div
          className="collection-details-view-controls"
          role="group"
          aria-label="Collection display layout"
        >
          {COLLECTION_VIEW_OPTIONS.map(
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
                    'collection-details-view-button',

                    active
                      ? 'collection-details-view-active'
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
                    onViewChange(
                      option.value
                    )
                  }
                >
                  <Icon
                    size={18}
                    aria-hidden="true"
                  />
                </button>
              );
            }
          )}

        </div>

      </div>

    </section>
  );
}

/* ========================================
   RELATED COLLECTIONS
======================================== */

function RelatedCollections({
  collection,

  onSelect,
}: {
  collection: CatalogueCollection;

  onSelect: (
    collection: CatalogueCollection
  ) => void;
}) {
  const collections =
    useCatalogueStore(
      (state) =>
        state.collections
    );

  const related =
    useMemo(() => {
      const currentIds =
        new Set(
          collection.assetIds
        );

      return collections
        .filter(
          (candidate) =>
            candidate.id !==
              collection.id &&
            candidate.published
        )
        .map(
          (candidate) => ({
            collection:
              candidate,

            score:
              candidate.assetIds.filter(
                (assetId) =>
                  currentIds.has(
                    assetId
                  )
              ).length,
          })
        )
        .filter(
          (candidate) =>
            candidate.score > 0
        )
        .sort(
          (first, second) =>
            second.score -
            first.score
        )
        .slice(0, 4)
        .map(
          (candidate) =>
            candidate.collection
        );
    }, [
      collection,
      collections,
    ]);

  if (
    related.length === 0
  ) {
    return null;
  }

  return (
    <section className="collection-details-related">

      <h3>
        Explore related collections
      </h3>

      <div className="collection-details-related-grid">

        {related.map(
          (candidate) => (
            <button
              key={candidate.id}
              type="button"
              className="collection-details-related-card"
              onClick={() =>
                onSelect(candidate)
              }
            >
              <Layers3
                size={23}
                aria-hidden="true"
              />

              <span>

                <strong>
                  {candidate.name}
                </strong>

                <small>
                  {candidate.description}
                </small>

              </span>

              <ArrowRight
                size={18}
                aria-hidden="true"
              />

            </button>
          )
        )}

      </div>

    </section>
  );
}

/* ========================================
   COLLECTION CONTENT
======================================== */

function CollectionDetailsContent({
  collection,

  onClose,

  onSelectAsset,

  onAddAsset,

  onSelectCollection,

  titleId,
}: {
  collection: CatalogueCollection;

  onClose: () => void;

  onSelectAsset?: (
    asset: CatalogueAsset
  ) => void;

  onAddAsset?: (
    asset: CatalogueAsset
  ) => void;

  onSelectCollection?: (
    collection: CatalogueCollection
  ) => void;

  titleId: string;
}) {
  const assets =
    useCatalogueStore(
      (state) =>
        state.assets
    );

  const personalCollections =
    useCatalogueStore(
      (state) =>
        state.personalCollections
    );

  const deleteCollection =
    useCatalogueStore(
      (state) =>
        state.deletePersonalCollection
    );

  const removeAsset =
    useCatalogueStore(
      (state) =>
        state.removeAssetFromCollection
    );

  const [search, setSearch] =
    useState('');

  const [sort, setSort] =
    useState<CollectionSort>(
      'collection-order'
    );

  const [view, setView] =
    useState<CatalogueView>(
      'grid'
    );

  const [page, setPage] =
    useState(1);

  const [renaming, setRenaming] =
    useState(false);

  const [message, setMessage] =
    useState('');

  const [error, setError] =
    useState('');

  const personalCollection =
    personalCollections.find(
      (candidate) =>
        candidate.id ===
        collection.id
    );

  const personal =
    Boolean(
      personalCollection
    );

  const currentCollection =
    personalCollection ??
    collection;

  const collectionAssets =
    useMemo(
      () =>
        resolveCollectionAssets(
          currentCollection,

          assets
        ),

      [
        currentCollection,
        assets,
      ]
    );

  const filteredAssets =
    useMemo(
      () =>
        sortCollectionAssets(
          searchCollectionAssets(
            collectionAssets,

            search
          ),

          sort
        ),

      [
        collectionAssets,
        search,
        sort,
      ]
    );

  const totalPages =
    Math.max(
      1,

      Math.ceil(
        filteredAssets.length /
        COLLECTION_PAGE_SIZE
      )
    );

  const activePage =
    Math.min(
      page,

      totalPages
    );

  const visibleAssets =
    useMemo(() => {
      const offset =
        (
          activePage - 1
        ) *
        COLLECTION_PAGE_SIZE;

      return filteredAssets.slice(
        offset,

        offset +
          COLLECTION_PAGE_SIZE
      );
    }, [
      filteredAssets,
      activePage,
    ]);

  const unavailableAssetCount =
    Math.max(
      0,

      new Set(
        currentCollection.assetIds
      ).size -
        collectionAssets.length
    );

  /* ====================================
     PERSONAL COLLECTION ACTIONS
  ==================================== */

  function handleDelete(): void {
    if (!personal) {
      return;
    }

    const confirmed =
      window.confirm(
        `Delete "${currentCollection.name}"? This removes the collection, not the original catalogue assets.`
      );

    if (!confirmed) {
      return;
    }

    try {
      deleteCollection(
        currentCollection.id
      );

      onClose();

    } catch {
      setError(
        'Unable to delete this collection.'
      );
    }
  }

  function handleRemoveAsset(
    asset: CatalogueAsset
  ): void {
    if (!personal) {
      return;
    }

    try {
      removeAsset(
        currentCollection.id,

        asset.id
      );

      setMessage(
        `${asset.name} removed from the collection.`
      );

      setError('');

    } catch {
      setError(
        'Unable to remove this asset.'
      );
    }
  }

  /* ====================================
     COLLECTION INTERFACE
  ==================================== */

  return (
    <div className="collection-details-dialog-inner">

      <header className="collection-details-dialog-header">

        <div className="collection-details-heading">

          <span className="collection-details-eyebrow">

            {personal
              ? 'My inspiration library'
              : 'Explore the catalogue'}

          </span>

          <h2 id={titleId}>

            {currentCollection.name}

          </h2>

        </div>

        <button
          type="button"
          className="icon-button"
          aria-label="Close collection"
          onClick={onClose}
        >
          <X
            size={24}
            aria-hidden="true"
          />
        </button>

      </header>

      <div className="collection-details-dialog-body">

        <section className="collection-details-hero">

          <CollectionCover
            assets={collectionAssets}
            personal={personal}
          />

          <CollectionMetadata
            collection={
              currentCollection
            }
            assetCount={
              collectionAssets.length
            }
            personal={personal}
          />

        </section>

        {personal && (
          <section
            className="collection-details-management"
            aria-label="Manage personal collection"
          >
            {renaming ? (
              <CollectionRenameForm
                collection={
                  currentCollection
                }
                onCancel={() =>
                  setRenaming(false)
                }
                onSaved={() => {
                  setRenaming(false);

                  setMessage(
                    'Collection name updated.'
                  );
                }}
              />

            ) : (
              <div className="collection-details-management-actions">

                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() =>
                    setRenaming(true)
                  }
                >
                  <Pencil
                    size={17}
                    aria-hidden="true"
                  />

                  Rename collection

                </button>

                <button
                  type="button"
                  className="button button-secondary collection-details-delete-button"
                  onClick={
                    handleDelete
                  }
                >
                  <Trash2
                    size={17}
                    aria-hidden="true"
                  />

                  Delete collection

                </button>

              </div>
            )}

          </section>
        )}

        {message && (
          <p
            className="collection-details-message"
            role="status"
            aria-live="polite"
          >
            {message}
          </p>
        )}

        {error && (
          <p
            className="form-error"
            role="alert"
          >
            {error}
          </p>
        )}

        {personal &&
          unavailableAssetCount > 0 && (
            <div className="collection-details-notice">

              <Info
                size={18}
                aria-hidden="true"
              />

              <span>

                {unavailableAssetCount}{' '}

                {unavailableAssetCount === 1
                  ? 'saved asset is'
                  : 'saved assets are'}

                {' '}currently unavailable.
                Their saved references
                have been preserved.

              </span>

            </div>
          )}

        <section className="collection-details-assets">

          <h3>
            Explore this collection
          </h3>

          <CollectionToolbar
            search={search}
            sort={sort}
            view={view}
            totalResults={
              filteredAssets.length
            }
            onSearchChange={(value) => {
              setSearch(value);

              setPage(1);
            }}
            onSortChange={(value) => {
              setSort(value);

              setPage(1);
            }}
            onViewChange={
              setView
            }
          />

          {visibleAssets.length > 0 ? (
            <div
              className={[
                'collection-details-asset-grid',

                `collection-details-assets-${view}`,
              ].join(' ')}
            >
              {visibleAssets.map(
                (asset) => (
                  <div
                    key={asset.id}
                    className="collection-details-asset-item"
                  >
                    <AssetCard
                      asset={asset}
                      view={view}
                      showAddButton={
                        Boolean(
                          onAddAsset
                        )
                      }
                      onSelect={
                        onSelectAsset
                      }
                      onAdd={
                        onAddAsset
                      }
                    />

                    {personal && (
                      <button
                        type="button"
                        className="collection-details-remove-asset"
                        aria-label={
                          `Remove ${asset.name} from collection`
                        }
                        onClick={() =>
                          handleRemoveAsset(
                            asset
                          )
                        }
                      >
                        <Trash2
                          size={15}
                          aria-hidden="true"
                        />

                        Remove from collection

                      </button>
                    )}

                  </div>
                )
              )}

            </div>

          ) : (
            <div className="collection-details-empty-state">

              {search.trim() ? (
                <Search
                  size={42}
                  aria-hidden="true"
                />

              ) : (
                <FolderOpen
                  size={42}
                  aria-hidden="true"
                />
              )}

              <h4>

                {search.trim()
                  ? 'No matching assets'
                  : 'Nothing here yet'}

              </h4>

              <p>

                {search.trim()
                  ? 'Try another search within this collection.'
                  : personal
                    ? 'Save assets from the catalogue to build your own inspiration library.'
                    : 'This collection currently has no available assets.'}

              </p>

              {search.trim() && (
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => {
                    setSearch('');

                    setPage(1);
                  }}
                >
                  Clear search
                </button>
              )}

            </div>
          )}

          <CataloguePagination
            totalResults={
              filteredAssets.length
            }
            currentPage={
              activePage
            }
            pageSize={
              COLLECTION_PAGE_SIZE
            }
            onPageChange={
              setPage
            }
            compact
          />

        </section>

        {onSelectCollection && (
          <RelatedCollections
            collection={
              currentCollection
            }
            onSelect={
              onSelectCollection
            }
          />
        )}

      </div>

      <footer className="collection-details-dialog-footer">

        <button
          type="button"
          className="button button-secondary"
          onClick={onClose}
        >
          <ArrowLeft
            size={18}
            aria-hidden="true"
          />

          Back to catalogue

        </button>

        <span className="collection-details-footer-note">

          {personal
            ? 'Your inspiration. Your collection.'
            : 'Discover. Imagine. Create.'}

        </span>

      </footer>

    </div>
  );
}

/* ========================================
   MAIN NATIVE COLLECTION DIALOG
======================================== */

export default function CollectionDetailsDialog({
  collection,

  open,

  onClose,

  onSelectAsset,

  onAddAsset,

  onSelectCollection,
}: CollectionDetailsDialogProps) {
  const dialogRef =
    useRef<HTMLDialogElement>(
      null
    );

  const titleId =
    useId();

  const shouldOpen =
    open &&
    Boolean(collection);

  useEffect(() => {
    const dialog =
      dialogRef.current;

    if (!dialog) {
      return;
    }

    if (
      shouldOpen &&
      !dialog.open
    ) {
      dialog.showModal();

    } else if (
      !shouldOpen &&
      dialog.open
    ) {
      dialog.close();
    }
  }, [
    shouldOpen,
  ]);

  return (
    <dialog
      ref={dialogRef}
      className="studio-dialog collection-details-dialog"
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();

        onClose();
      }}
      onClick={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      {collection &&
        shouldOpen && (
          <CollectionDetailsContent
            key={collection.id}
            collection={collection}
            onClose={onClose}
            onSelectAsset={
              onSelectAsset
            }
            onAddAsset={
              onAddAsset
            }
            onSelectCollection={
              onSelectCollection
            }
            titleId={titleId}
          />
        )}

    </dialog>
  );
}

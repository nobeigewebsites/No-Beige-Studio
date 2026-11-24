
import {
  ArrowRight,
  Layers3,
  Sparkles,
  FolderOpen,
  Lock,
  Pencil,
  Trash2,
} from 'lucide-react';

import {
  useMemo,
} from 'react';

import type {
  CatalogueAsset,
  CatalogueCollection,
} from '../../types/catalogue';

import {
  useCatalogueStore,
} from '../../store/catalogueStore';

import {
  getStudio,
} from '../../config/studios';

import AssetPreview from './AssetPreview';

/* ========================================
   NO BEIGE STUDIO
   Universal Collection Card

   Curated collections.
   Personal collections.
   Shared visual discovery.
======================================== */

interface CollectionCardProps {
  collection: CatalogueCollection;

  compact?: boolean;

  personal?: boolean;

  showStudios?: boolean;

  onSelect?: (
    collection: CatalogueCollection
  ) => void;

  onRename?: (
    collection: CatalogueCollection
  ) => void;

  onDelete?: (
    collection: CatalogueCollection
  ) => void;

  className?: string;
}

/* ========================================
   COLLECTION DISPLAY LABELS
======================================== */

const COLLECTION_TYPE_LABELS:
  Record<
    CatalogueCollection['type'],
    string
  > = {
    'historical-period':
      'Historical collection',

    'design-style':
      'Design style',

    material:
      'Material collection',

    colour:
      'Colour collection',

    room:
      'Room collection',

    architecture:
      'Architecture',

    landscape:
      'Landscape',

    restoration:
      'Restoration',

    accessibility:
      'Inclusive design',

    sustainability:
      'Sustainability',

    creator:
      'Creator collection',

    manufacturer:
      'Manufacturer collection',

    curated:
      'Curated collection',

    personal:
      'Personal collection',
  };

/* ========================================
   COLLECTION COLOURS
======================================== */

const COLLECTION_TYPE_COLOURS:
  Record<
    CatalogueCollection['type'],
    string
  > = {
    'historical-period':
      '#b18aff',

    'design-style':
      '#ff9b36',

    material:
      '#b18aff',

    colour:
      '#ff3d8d',

    room:
      '#ff9b36',

    architecture:
      '#00d5e8',

    landscape:
      '#a9e52c',

    restoration:
      '#b18aff',

    accessibility:
      '#00d5e8',

    sustainability:
      '#a9e52c',

    creator:
      '#ff3d8d',

    manufacturer:
      '#8b9bb4',

    curated:
      '#00d5e8',

    personal:
      '#ff3d8d',
  };

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

  return [
    ...new Set(
      collection.assetIds
    ),
  ]
    .map(
      (assetId) =>
        assetMap.get(assetId)
    )
    .filter(
      (
        asset
      ): asset is CatalogueAsset =>
        asset !== undefined &&
        asset.published &&
        asset.access !== 'private'
    );
}

/* ========================================
   COLLECTION PREVIEW SELECTION

   Prioritises visual variety rather
   than repeating similar asset types.
======================================== */

function selectPreviewAssets(
  assets: CatalogueAsset[],

  limit = 4
): CatalogueAsset[] {
  const selected:
    CatalogueAsset[] = [];

  const selectedIds =
    new Set<string>();

  const categories =
    new Set<string>();

  const sorted =
    [...assets].sort(
      (a, b) => {
        const aHasImage =
          Boolean(
            a.thumbnailUrl ||
            a.media.some(
              (media) =>
                media.type === 'image' ||
                media.type === 'thumbnail'
            )
          );

        const bHasImage =
          Boolean(
            b.thumbnailUrl ||
            b.media.some(
              (media) =>
                media.type === 'image' ||
                media.type === 'thumbnail'
            )
          );

        return (
          Number(bHasImage) -
          Number(aHasImage) ||

          Number(b.featured) -
          Number(a.featured)
        );
      }
    );

  for (const asset of sorted) {
    if (
      selected.length >= limit
    ) {
      break;
    }

    if (
      categories.has(
        asset.category
      )
    ) {
      continue;
    }

    selected.push(asset);

    selectedIds.add(asset.id);

    categories.add(
      asset.category
    );
  }

  for (const asset of sorted) {
    if (
      selected.length >= limit
    ) {
      break;
    }

    if (
      selectedIds.has(asset.id)
    ) {
      continue;
    }

    selected.push(asset);

    selectedIds.add(asset.id);
  }

  return selected;
}

/* ========================================
   COLLECTION ACCENT COLOUR
======================================== */

function getCollectionColour(
  collection: CatalogueCollection
): string {
  if (
    collection.type === 'personal'
  ) {
    return '#ff3d8d';
  }

  if (
    collection.compatibleStudios.length === 1
  ) {
    const studioId =
      collection.compatibleStudios[0];

    if (studioId) {
      return getStudio(
        studioId
      ).colour;
    }
  }

  return COLLECTION_TYPE_COLOURS[
    collection.type
  ] ?? '#00d5e8';
}

/* ========================================
   COLLECTION PREVIEW MOSAIC
======================================== */

function CollectionPreview({
  collection,

  assets,

  personal,
}: {
  collection: CatalogueCollection;

  assets: CatalogueAsset[];

  personal: boolean;
}) {
  const previews =
    useMemo(
      () =>
        selectPreviewAssets(
          assets,
          4
        ),

      [assets]
    );

  const colour =
    getCollectionColour(
      collection
    );

  return (
    <div
      className="collection-card-preview"
      style={{
        background: `
          radial-gradient(
            circle at 50% 35%,
            ${colour}25,
            transparent 80%
          ),
          #101827
        `,
      }}
    >
      {previews.length > 0 ? (
        <div
          className={[
            'collection-preview-mosaic',

            `collection-mosaic-${previews.length}`,
          ].join(' ')}
          aria-hidden="true"
        >
          {previews.map(
            (asset) => (
              <div
                key={asset.id}
                className="collection-mosaic-item"
              >
                <AssetPreview
                  asset={asset}
                  size="small"
                  showLabels={false}
                />
              </div>
            )
          )}
        </div>

      ) : (
        <div className="collection-preview-empty">

          <div
            className="collection-empty-icon"
            style={{
              color: colour,

              backgroundColor:
                `${colour}15`,

              borderColor:
                `${colour}35`,
            }}
          >
            <FolderOpen
              size={42}
              strokeWidth={1.4}
              aria-hidden="true"
            />
          </div>

          <span>
            {personal
              ? 'Your inspiration starts here'
              : 'No available assets'}
          </span>

        </div>
      )}

      <div className="collection-preview-overlay" />

      <div className="collection-preview-labels">

        {personal ? (
          <span className="collection-private-label">

            <Lock
              size={12}
              aria-hidden="true"
            />

            Personal

          </span>

        ) : collection.featured ? (
          <span className="collection-featured-label">

            <Sparkles
              size={13}
              aria-hidden="true"
            />

            Featured

          </span>

        ) : (
          <span className="collection-curated-label">
            Collection
          </span>
        )}

      </div>

      <span className="collection-asset-count">

        <Layers3
          size={15}
          aria-hidden="true"
        />

        {assets.length}

        {' '}

        {assets.length === 1
          ? 'asset'
          : 'assets'}

      </span>

    </div>
  );
}

/* ========================================
   COLLECTION STUDIO COMPATIBILITY
======================================== */

function CollectionStudios({
  collection,
}: {
  collection: CatalogueCollection;
}) {
  const studios =
    [
      ...new Set(
        collection.compatibleStudios
      ),
    ];

  if (
    studios.length === 0
  ) {
    return null;
  }

  if (
    studios.length === 5
  ) {
    return (
      <div className="collection-all-studios">

        <Layers3
          size={14}
          aria-hidden="true"
        />

        All five studios

      </div>
    );
  }

  return (
    <div
      className="collection-studio-tags"
      aria-label="Compatible studios"
    >
      {studios.map(
        (studioId) => {
          const studio =
            getStudio(studioId);

          return (
            <span
              key={studioId}
              className="collection-studio-tag"
              title={studio.name}
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
  );
}

/* ========================================
   PERSONAL COLLECTION ACTIONS
======================================== */

function PersonalCollectionActions({
  collection,

  onRename,

  onDelete,
}: {
  collection: CatalogueCollection;

  onRename?: (
    collection: CatalogueCollection
  ) => void;

  onDelete?: (
    collection: CatalogueCollection
  ) => void;
}) {
  if (
    !onRename &&
    !onDelete
  ) {
    return null;
  }

  return (
    <div className="collection-personal-actions">

      {onRename && (
        <button
          type="button"
          className="icon-button collection-rename-button"
          aria-label={`Rename ${collection.name}`}
          title="Rename collection"
          onClick={() =>
            onRename(collection)
          }
        >
          <Pencil
            size={17}
            aria-hidden="true"
          />
        </button>
      )}

      {onDelete && (
        <button
          type="button"
          className="icon-button collection-delete-button"
          aria-label={`Delete ${collection.name}`}
          title="Delete collection"
          onClick={() => {
            const confirmed =
              window.confirm(
                `Delete "${collection.name}"? This removes the collection, not its catalogue assets.`
              );

            if (confirmed) {
              onDelete(collection);
            }
          }}
        >
          <Trash2
            size={17}
            aria-hidden="true"
          />
        </button>
      )}

    </div>
  );
}

/* ========================================
   MAIN COLLECTION CARD
======================================== */

export default function CollectionCard({
  collection,

  compact = false,

  personal = false,

  showStudios = true,

  onSelect,

  onRename,

  onDelete,

  className = '',
}: CollectionCardProps) {
  const catalogueAssets =
    useCatalogueStore(
      (state) =>
        state.assets
    );

  const isPersonal =
    personal ||
    collection.type === 'personal';

  const assets =
    useMemo(
      () =>
        resolveCollectionAssets(
          collection,

          catalogueAssets
        ),

      [
        collection,
        catalogueAssets,
      ]
    );

  const colour =
    getCollectionColour(
      collection
    );

  const unavailableCount =
    new Set(
      collection.assetIds
    ).size -
    assets.length;

  const collectionType =
    isPersonal
      ? 'Personal collection'
      : COLLECTION_TYPE_LABELS[
          collection.type
        ];

  return (
    <article
      className={[
        'catalogue-card',

        'collection-card',

        compact
          ? 'collection-card-compact'
          : '',

        isPersonal
          ? 'collection-card-personal'
          : '',

        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        borderTopColor:
          colour,
      }}
      aria-label={
        collection.name
      }
    >
      {onSelect ? (
        <button
          type="button"
          className="collection-preview-button"
          aria-label={`Explore ${collection.name}`}
          onClick={() =>
            onSelect(collection)
          }
        >
          <CollectionPreview
            collection={collection}
            assets={assets}
            personal={isPersonal}
          />
        </button>

      ) : (
        <CollectionPreview
          collection={collection}
          assets={assets}
          personal={isPersonal}
        />
      )}

      <div className="collection-card-content">

        <div
          className="collection-card-type"
          style={{
            color: colour,
          }}
        >
          {collectionType}
        </div>

        <h3 className="collection-card-title">

          {onSelect ? (
            <button
              type="button"
              className="collection-title-button"
              onClick={() =>
                onSelect(collection)
              }
            >
              {collection.name}
            </button>

          ) : (
            collection.name
          )}

        </h3>

        {!compact && (
          <p className="collection-card-description">

            {collection.description ||
              (
                isPersonal
                  ? 'Your own collection of design inspiration.'
                  : 'Explore this collection of catalogue assets.'
              )}

          </p>
        )}

        {showStudios && (
          <CollectionStudios
            collection={collection}
          />
        )}

        {isPersonal &&
          unavailableCount > 0 && (
            <p className="collection-unavailable-note">

              {unavailableCount}

              {' '}

              {unavailableCount === 1
                ? 'saved asset is'
                : 'saved assets are'}

              {' currently unavailable.'}

            </p>
          )}

        <div className="collection-card-footer">

          {onSelect && (
            <button
              type="button"
              className="button button-secondary collection-open-button"
              aria-label={`Open ${collection.name}`}
              onClick={() =>
                onSelect(collection)
              }
            >
              {isPersonal
                ? 'Open collection'
                : 'Explore collection'}

              <ArrowRight
                size={16}
                aria-hidden="true"
              />
            </button>
          )}

          {isPersonal && (
            <PersonalCollectionActions
              collection={collection}
              onRename={onRename}
              onDelete={onDelete}
            />
          )}

        </div>

      </div>
    </article>
  );
}

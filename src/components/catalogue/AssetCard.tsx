
import {
  Heart,
  ArrowUpRight,
  Plus,
  Check,
  Ruler,
  ShieldCheck,
  Leaf,
  Hammer,
  Accessibility,
} from 'lucide-react';

import type {
  CatalogueAsset,
  CatalogueView,
} from '../../types/catalogue';

import {
  useCatalogueStore,
} from '../../store/catalogueStore';

import AssetPreview from './AssetPreview';

/* ========================================
   NO BEIGE STUDIO
   Universal Catalogue Asset Card

   Shared asset presentation.
   Favourites and selection.
   Grid, list and compact layouts.
======================================== */

interface AssetCardProps {
  asset: CatalogueAsset;

  view?: CatalogueView;

  selected?: boolean;

  showFavourite?: boolean;

  showDescription?: boolean;

  showDimensions?: boolean;

  showAddButton?: boolean;

  onSelect?: (
    asset: CatalogueAsset
  ) => void;

  onAdd?: (
    asset: CatalogueAsset
  ) => void;

  className?: string;
}

/* ========================================
   DISPLAY UTILITIES
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

function formatDimension(
  value: number
): string {
  return new Intl.NumberFormat(
    'en-GB',
    {
      maximumFractionDigits: 2,
    }
  ).format(value);
}

function formatCurrency(
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
   ASSET CAPABILITIES
======================================== */

function isPlaceableAsset(
  asset: CatalogueAsset
): boolean {
  return asset.models.some(
    (model) =>
      Boolean(
        model.url ||
        model.proceduralGeneratorId
      )
  ) ||
    asset.symbols.some(
      (symbol) =>
        Boolean(
          symbol.url ||
          symbol.proceduralGeneratorId
        )
    );
}

function isSurfaceMaterial(
  asset: CatalogueAsset
): boolean {
  return (
    [
      'materials',
      'flooring',
      'wall-coverings',
      'ceiling-finishes',
    ].includes(asset.category) &&
    Boolean(asset.materialProperties) &&
    !asset.physicalProperties?.dimensions
  );
}

/* ========================================
   FAVOURITE BUTTON
======================================== */

function FavouriteButton({
  asset,
}: {
  asset: CatalogueAsset;
}) {
  const favourite =
    useCatalogueStore(
      (state) =>
        state.favourites.some(
          (item) =>
            item.assetId === asset.id
        )
    );

  const toggleFavourite =
    useCatalogueStore(
      (state) =>
        state.toggleFavourite
    );

  return (
    <button
      type="button"
      className={[
        'asset-favourite-button',

        favourite
          ? 'asset-favourite-active'
          : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={
        favourite
          ? `Remove ${asset.name} from favourites`
          : `Add ${asset.name} to favourites`
      }
      aria-pressed={favourite}
      title={
        favourite
          ? 'Remove from favourites'
          : 'Add to favourites'
      }
      onClick={(event) => {
        event.stopPropagation();

        toggleFavourite(asset.id);
      }}
    >
      <Heart
        size={19}
        fill={
          favourite
            ? 'currentColor'
            : 'none'
        }
        aria-hidden="true"
      />
    </button>
  );
}

/* ========================================
   ASSET DIMENSIONS
======================================== */

function AssetDimensions({
  asset,
}: {
  asset: CatalogueAsset;
}) {
  const dimensions =
    asset.physicalProperties?.dimensions;

  if (!dimensions) {
    return null;
  }

  const width =
    formatDimension(
      dimensions.width
    );

  const height =
    formatDimension(
      dimensions.height
    );

  const depth =
    formatDimension(
      dimensions.depth
    );

  const verified =
    asset.physicalProperties
      ?.technicalSpecificationsVerified
      === true;

  return (
    <div
      className="asset-card-dimensions"
      title={
        verified
          ? 'Width × height × depth'
          : 'Illustrative width × height × depth'
      }
    >
      <Ruler
        size={15}
        aria-hidden="true"
      />

      <span>
        {width} × {height} × {depth} m
      </span>

      {!verified && (
        <span className="asset-dimensions-estimate">
          Approx.
        </span>
      )}
    </div>
  );
}

/* ========================================
   ASSET MATERIAL INFORMATION
======================================== */

function AssetMaterials({
  asset,
}: {
  asset: CatalogueAsset;
}) {
  if (
    asset.materialFamilies.length === 0
  ) {
    return null;
  }

  const materials =
    asset.materialFamilies.slice(
      0,
      3
    );

  const remaining =
    asset.materialFamilies.length -
    materials.length;

  return (
    <div className="asset-card-materials">

      {materials.map(
        (material) => (
          <span
            key={material}
            className="asset-material-tag"
          >
            {formatLabel(material)}
          </span>
        )
      )}

      {remaining > 0 && (
        <span className="asset-material-tag">
          +{remaining}
        </span>
      )}

    </div>
  );
}

/* ========================================
   ASSET COLOUR SWATCHES
======================================== */

function AssetColours({
  asset,
}: {
  asset: CatalogueAsset;
}) {
  const colours =
    new Map<
      string,
      {
        name: string;
        hex: string;
      }
    >();

  const primaryColour =
    asset.materialProperties?.colour;

  if (
    primaryColour &&
    /^#[0-9a-fA-F]{6}$/.test(
      primaryColour.hex
    )
  ) {
    colours.set(
      primaryColour.hex.toLowerCase(),

      primaryColour
    );
  }

  for (
    const variant of
      asset.customisation
        ?.availableVariants ?? []
  ) {
    for (
      const colour of
        variant.colours ?? []
    ) {
      if (
        /^#[0-9a-fA-F]{6}$/.test(
          colour.hex
        )
      ) {
        colours.set(
          colour.hex.toLowerCase(),

          colour
        );
      }
    }
  }

  const availableColours =
    Array.from(
      colours.values()
    );

  if (
    availableColours.length === 0
  ) {
    return null;
  }

  const visibleColours =
    availableColours.slice(
      0,
      5
    );

  const remaining =
    availableColours.length -
    visibleColours.length;

  return (
    <div
      className="asset-card-colours"
      aria-label="Available design colours"
    >
      {visibleColours.map(
        (colour) => (
          <span
            key={colour.hex}
            className="asset-colour-swatch"
            style={{
              backgroundColor:
                colour.hex,
            }}
            title={colour.name}
            role="img"
            aria-label={colour.name}
          />
        )
      )}

      {remaining > 0 && (
        <span className="asset-colour-more">
          +{remaining}
        </span>
      )}

    </div>
  );
}

/* ========================================
   ASSET SPECIAL FEATURES
======================================== */

function AssetSpecialFeatures({
  asset,
}: {
  asset: CatalogueAsset;
}) {
  const verifiedLicence =
    asset.licensing.licenceVerified &&
    asset.licensing.commercialUseAllowed;

  const restoration =
    asset.restoration
      ?.restorationPossible === true;

  const accessible =
    Boolean(asset.accessibility);

  const sustainable =
    asset.sustainability?.reclaimed === true ||
    asset.sustainability?.recycled === true ||
    asset.sustainability?.renewableMaterials === true ||
    asset.sustainability?.repairable === true;

  if (
    !verifiedLicence &&
    !restoration &&
    !accessible &&
    !sustainable
  ) {
    return null;
  }

  return (
    <div className="asset-special-features">

      {verifiedLicence && (
        <span
          className="asset-special-feature asset-feature-verified"
          title="Verified commercial-use licence"
        >
          <ShieldCheck
            size={14}
            aria-hidden="true"
          />

          Commercial use
        </span>
      )}

      {restoration && (
        <span
          className="asset-special-feature asset-feature-restoration"
        >
          <Hammer
            size={14}
            aria-hidden="true"
          />

          Restoration
        </span>
      )}

      {accessible && (
        <span
          className="asset-special-feature asset-feature-accessibility"
          title={
            asset.accessibility
              ?.complianceVerified
              ? 'Accessibility compliance verified for the stated standard'
              : 'Inclusive design concept; compliance not verified'
          }
        >
          <Accessibility
            size={14}
            aria-hidden="true"
          />

          Inclusive design
        </span>
      )}

      {sustainable && (
        <span
          className="asset-special-feature asset-feature-sustainability"
          title={
            asset.sustainability
              ?.manufacturerClaimsVerified
              ? 'Verified sustainability information'
              : 'Declared sustainability characteristics'
          }
        >
          <Leaf
            size={14}
            aria-hidden="true"
          />

          Sustainability
        </span>
      )}

    </div>
  );
}

/* ========================================
   ASSET PRICE INFORMATION

   Digital asset prices are separate
   from estimated physical product costs.
======================================== */

function AssetPrice({
  asset,
}: {
  asset: CatalogueAsset;
}) {
  const digitalPrice =
    asset.digitalPurchasePrice;

  const physicalPrice =
    asset.estimatedRealWorldPrice;

  return (
    <div className="asset-card-price">

      {asset.access === 'free' ? (
        <span className="asset-price-free">
          Free asset
        </span>

      ) : digitalPrice ? (
        <span className="asset-price-digital">

          {digitalPrice.estimated
            ? 'Est. '
            : ''}

          {formatCurrency(
            digitalPrice.amount,

            digitalPrice.currency
          )}

          <small>
            Digital asset
          </small>

        </span>

      ) : (
        <span className="asset-price-access">

          {asset.access === 'premium'
            ? 'Premium asset'
            : asset.access === 'private'
              ? 'Private asset'
              : 'Price unavailable'}

        </span>
      )}

      {physicalPrice && (
        <span className="asset-price-physical">

          {physicalPrice.estimated
            ? 'Est. '
            : ''}

          {formatCurrency(
            physicalPrice.amount,

            physicalPrice.currency
          )}

          {' / '}

          {physicalPrice.unit
            .replace(/-/g, ' ')}

          <small>
            Physical item
          </small>

        </span>
      )}

    </div>
  );
}

/* ========================================
   ASSET ACTIONS
======================================== */

function AssetActions({
  asset,

  selected,

  showAddButton,

  onSelect,

  onAdd,
}: {
  asset: CatalogueAsset;

  selected: boolean;

  showAddButton: boolean;

  onSelect?: (
    asset: CatalogueAsset
  ) => void;

  onAdd?: (
    asset: CatalogueAsset
  ) => void;
}) {
  const canPlace =
    isPlaceableAsset(asset);

  const material =
    isSurfaceMaterial(asset);

  const available =
    asset.access === 'free' &&
    asset.published &&
    (canPlace || material);

  const canAdd =
    available &&
    Boolean(onAdd);

  if (
    !onSelect &&
    !showAddButton
  ) {
    return null;
  }

  return (
    <div className="asset-card-actions">

      {onSelect && (
        <button
          type="button"
          className="button button-secondary asset-details-button"
          aria-label={`View details for ${asset.name}`}
          onClick={() =>
            onSelect(asset)
          }
        >
          View details

          <ArrowUpRight
            size={15}
            aria-hidden="true"
          />
        </button>
      )}

      {showAddButton && (
        <button
          type="button"
          className={[
            'button',

            selected
              ? 'button-secondary'
              : 'button-primary',

            'asset-add-button',
          ].join(' ')}
          disabled={
            !canAdd || selected
          }
          title={
            selected
              ? 'Asset already selected'
              : !asset.published
                ? 'Asset is not published'
                : asset.access !== 'free'
                  ? 'Asset access required'
                  : !available
                    ? 'Model or symbol not yet available'
                    : !onAdd
                      ? 'Open a design workspace to use this asset'
                      : material
                        ? 'Use material'
                        : 'Add to design'
          }
          onClick={() => {
            if (
              canAdd &&
              !selected
            ) {
              onAdd?.(asset);
            }
          }}
        >
          {selected ? (
            <>
              <Check
                size={16}
                aria-hidden="true"
              />

              Selected
            </>

          ) : (
            <>
              <Plus
                size={16}
                aria-hidden="true"
              />

              {!asset.published
                ? 'Unavailable'
                : asset.access !== 'free'
                  ? 'Access required'
                  : !available
                    ? 'Coming soon'
                    : material
                      ? 'Use material'
                      : 'Add to design'}
            </>
          )}
        </button>
      )}

    </div>
  );
}

/* ========================================
   MAIN ASSET CARD
======================================== */

export default function AssetCard({
  asset,

  view = 'grid',

  selected = false,

  showFavourite = true,

  showDescription = true,

  showDimensions = true,

  showAddButton = false,

  onSelect,

  onAdd,

  className = '',
}: AssetCardProps) {
  const recordAssetView =
    useCatalogueStore(
      (state) =>
        state.recordAssetView
    );

  const handleSelect = (
    selectedAsset: CatalogueAsset
  ): void => {
    recordAssetView(
      selectedAsset.id
    );

    onSelect?.(
      selectedAsset
    );
  };

  const compact =
    view === 'compact';

  const period =
    asset.historicalPeriods.find(
      (value) =>
        value !== 'timeless' &&
        value !== 'unknown'
    );

  return (
    <article
      className={[
        'catalogue-card',

        'asset-card',

        `asset-card-${view}`,

        selected
          ? 'asset-card-selected'
          : '',

        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={asset.name}
    >
      <div className="asset-card-visual">

        {onSelect ? (
          <button
            type="button"
            className="asset-preview-button"
            aria-label={`View ${asset.name}`}
            onClick={() =>
              handleSelect(asset)
            }
          >
            <AssetPreview
              asset={asset}
              size={
                compact
                  ? 'small'
                  : 'medium'
              }
            />
          </button>

        ) : (
          <AssetPreview
            asset={asset}
            size={
              compact
                ? 'small'
                : 'medium'
            }
          />
        )}

        {showFavourite && (
          <FavouriteButton
            asset={asset}
          />
        )}

        {selected && (
          <span
            className="asset-selected-indicator"
            aria-label="Selected"
          >
            <Check
              size={15}
              aria-hidden="true"
            />
          </span>
        )}

      </div>

      <div className="asset-card-content">

        <div className="asset-card-category">

          {formatLabel(
            asset.category
          )}

          {period && (
            <>
              <span aria-hidden="true">
                ·
              </span>

              <span>
                {formatLabel(period)}
              </span>
            </>
          )}

        </div>

        <h3 className="asset-card-title">

          {onSelect ? (
            <button
              type="button"
              className="asset-title-button"
              onClick={() =>
                handleSelect(asset)
              }
            >
              {asset.name}
            </button>

          ) : (
            asset.name
          )}

        </h3>

        {!compact &&
          showDescription && (
            <p className="asset-card-description">
              {asset.description}
            </p>
          )}

        {!compact && (
          <AssetMaterials
            asset={asset}
          />
        )}

        {showDimensions && (
          <AssetDimensions
            asset={asset}
          />
        )}

        <AssetColours
          asset={asset}
        />

        {!compact && (
          <AssetSpecialFeatures
            asset={asset}
          />
        )}

        <div className="asset-card-footer">

          <AssetPrice
            asset={asset}
          />

          <AssetActions
            asset={asset}
            selected={selected}
            showAddButton={showAddButton}
            onSelect={
              onSelect
                ? handleSelect
                : undefined
            }
            onAdd={onAdd}
          />

        </div>

      </div>
    </article>
  );
}

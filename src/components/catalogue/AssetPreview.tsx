
import {
  useState,
} from 'react';

import {
  Armchair,
  Bath,
  Blocks,
  Box,
  BrickWall,
  Building2,
  CookingPot,
  DoorOpen,
  Flower2,
  Frame,
  Grid2X2,
  Hammer,
  Image,
  Lamp,
  Layers3,
  Leaf,
  Paintbrush,
  Palette,
  Plug,
  Ruler,
  Sofa,
  Sparkles,
  TreeDeciduous,
  Waves,
  Accessibility,
  Archive,
  Fence,
  WashingMachine,
} from 'lucide-react';

import type {
  LucideIcon,
} from 'lucide-react';

import type {
  CatalogueAsset,
  AssetCategory,
} from '../../types/catalogue';

/* ========================================
   NO BEIGE STUDIO
   Universal Asset Preview

   Shared across catalogue, collections,
   marketplace and all five studios.
======================================== */

interface AssetPreviewProps {
  asset: CatalogueAsset;

  size?: 'small' | 'medium' | 'large';

  showLabels?: boolean;

  className?: string;
}

/* ========================================
   CATEGORY ICONS
======================================== */

const CATEGORY_ICONS:
  Record<AssetCategory, LucideIcon> = {
    architecture: Building2,

    structural: BrickWall,

    furniture: Sofa,

    lighting: Lamp,

    decor: Frame,

    materials: Layers3,

    flooring: Grid2X2,

    'wall-coverings': Paintbrush,

    'ceiling-finishes': Layers3,

    doors: DoorOpen,

    windows: Grid2X2,

    kitchens: CookingPot,

    bathrooms: Bath,

    appliances: WashingMachine,

    textiles: Layers3,

    hardware: Hammer,

    antiques: Archive,

    salvage: Hammer,

    heritage: Building2,

    plants: Flower2,

    trees: TreeDeciduous,

    landscape: Leaf,

    'outdoor-furniture': Armchair,

    'water-features': Waves,

    accessibility: Accessibility,

    utilities: Plug,

    custom: Sparkles,

    other: Box,
  };

/* ========================================
   CATEGORY COLOURS
======================================== */

const CATEGORY_COLOURS:
  Record<AssetCategory, string> = {
    architecture: '#00d5e8',

    structural: '#7893b4',

    furniture: '#ff9b36',

    lighting: '#ffd166',

    decor: '#ff3d8d',

    materials: '#b18aff',

    flooring: '#b78b58',

    'wall-coverings': '#ff719d',

    'ceiling-finishes': '#b2bed1',

    doors: '#b78b58',

    windows: '#70cce8',

    kitchens: '#ff9b36',

    bathrooms: '#00d5e8',

    appliances: '#b2bed1',

    textiles: '#b18aff',

    hardware: '#b29857',

    antiques: '#b29857',

    salvage: '#b18aff',

    heritage: '#c9c2ae',

    plants: '#a9e52c',

    trees: '#70b85a',

    landscape: '#a9e52c',

    'outdoor-furniture': '#9bc878',

    'water-features': '#00d5e8',

    accessibility: '#00d5e8',

    utilities: '#ffd166',

    custom: '#ff3d8d',

    other: '#8b9bb4',
  };

/* ========================================
   MATERIAL PREVIEW CATEGORIES
======================================== */

const MATERIAL_CATEGORIES =
  new Set<AssetCategory>([
    'materials',
    'flooring',
    'wall-coverings',
    'ceiling-finishes',
  ]);

/* ========================================
   PREVIEW UTILITIES
======================================== */

function isMaterialAsset(
  asset: CatalogueAsset
): boolean {
  return (
    MATERIAL_CATEGORIES.has(
      asset.category
    ) &&
    Boolean(asset.materialProperties) &&
    !asset.physicalProperties?.dimensions
  );
}

function getPreviewColour(
  asset: CatalogueAsset
): string {
  const colour =
    asset.materialProperties?.colour.hex;

  if (
    colour &&
    /^#[0-9a-fA-F]{6}$/.test(colour)
  ) {
    return colour;
  }

  return CATEGORY_COLOURS[
    asset.category
  ] ?? '#8b9bb4';
}

function getContrastColour(
  hex: string
): string {
  const red =
    parseInt(hex.slice(1, 3), 16);

  const green =
    parseInt(hex.slice(3, 5), 16);

  const blue =
    parseInt(hex.slice(5, 7), 16);

  const linearise = (
    value: number
  ): number => {
    const channel = value / 255;

    return channel <= 0.04045
      ? channel / 12.92
      : Math.pow(
          (channel + 0.055) / 1.055,
          2.4
        );
  };

  const luminance =
    0.2126 * linearise(red) +
    0.7152 * linearise(green) +
    0.0722 * linearise(blue);

  return luminance > 0.179
    ? '#101827'
    : '#ffffff';
}

/* ========================================
   SAFE MEDIA URL RESOLUTION

   Supports local assets and HTTPS media.
   Rejects unsupported URL protocols.
======================================== */

function resolveMediaUrl(
  value?: string
): string | null {
  if (!value?.trim()) {
    return null;
  }

  try {
    const base = new URL(
      import.meta.env.BASE_URL,
      document.baseURI
    );

    const url = new URL(
      value.trim(),
      base
    );

    if (
      url.protocol === 'https:'
    ) {
      return url.href;
    }

    if (
      url.protocol === 'http:' &&
      url.origin === window.location.origin
    ) {
      return url.href;
    }

    return null;

  } catch {
    return null;
  }
}

/* ========================================
   IMAGE CANDIDATES
======================================== */

interface PreviewImage {
  url: string;

  altText: string;
}

function getPreviewImages(
  asset: CatalogueAsset
): PreviewImage[] {
  const candidates: PreviewImage[] = [];

  const usedUrls = new Set<string>();

  function addImage(
    value: string | undefined,
    altText: string
  ): void {
    const url =
      resolveMediaUrl(value);

    if (
      !url ||
      usedUrls.has(url)
    ) {
      return;
    }

    usedUrls.add(url);

    candidates.push({
      url,

      altText:
        altText.trim() || asset.name,
    });
  }

  addImage(
    asset.thumbnailUrl,
    asset.name
  );

  for (const media of asset.media) {
    if (media.type === 'thumbnail') {
      addImage(
        media.url,
        media.altText
      );
    }
  }

  for (const media of asset.media) {
    if (media.type === 'image') {
      addImage(
        media.url,
        media.altText
      );
    }
  }

  if (isMaterialAsset(asset)) {
    addImage(
      asset.materialProperties
        ?.textures
        ?.baseColour
        ?.url,

      `${asset.name} surface texture`
    );
  }

  return candidates;
}

/* ========================================
   MODEL AVAILABILITY
======================================== */

function has3DModel(
  asset: CatalogueAsset
): boolean {
  return asset.models.some(
    (model) =>
      Boolean(
        model.url ||
        model.proceduralGeneratorId
      )
  );
}

function has2DSymbol(
  asset: CatalogueAsset
): boolean {
  return asset.symbols.some(
    (symbol) =>
      Boolean(
        symbol.url ||
        symbol.proceduralGeneratorId
      )
  );
}

/* ========================================
   CATEGORY ICON COMPONENT
======================================== */

export function AssetCategoryIcon({
  category,

  size = 24,

  className,
}: {
  category: AssetCategory;

  size?: number;

  className?: string;
}) {
  const CategoryIcon =
    CATEGORY_ICONS[category] ?? Box;

  return (
    <CategoryIcon
      size={size}
      className={className}
      aria-hidden="true"
      strokeWidth={1.5}
    />
  );
}

/* ========================================
   MATERIAL SWATCH
======================================== */

function MaterialSwatch({
  asset,
}: {
  asset: CatalogueAsset;
}) {
  const colour =
    getPreviewColour(asset);

  const contrast =
    getContrastColour(colour);

  const material =
    asset.materialProperties;

  const metallic =
    material?.metallic ?? 0;

  const roughness =
    material?.roughness ?? 0.65;

  const opacity =
    material?.opacity ?? 1;

  const reflective =
    metallic > 0.5 ||
    roughness < 0.35;

  return (
    <div
      className={[
        'asset-material-swatch',

        reflective
          ? 'asset-material-reflective'
          : '',

        opacity < 1
          ? 'asset-material-transparent'
          : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        backgroundColor: colour,

        color: contrast,
      }}
    >
      <div
        className="asset-material-swatch-surface"
        aria-hidden="true"
        style={{
          background: reflective
            ? `linear-gradient(
                135deg,
                #ffffff40,
                ${colour} 45%,
                #00000025
              )`
            : colour,

          opacity,
        }}
      />

      <div className="asset-material-swatch-content">

        <Palette
          size={22}
          aria-hidden="true"
          strokeWidth={1.5}
        />

        <span className="asset-material-colour-name">
          {material?.colour.name ??
            asset.name}
        </span>

        <span className="asset-material-colour-code">
          {colour.toUpperCase()}
        </span>

      </div>
    </div>
  );
}

/* ========================================
   CATEGORY PLACEHOLDER

   Clearly identified as a placeholder.
   Does not pretend to be a finished model.
======================================== */

function AssetPlaceholder({
  asset,
}: {
  asset: CatalogueAsset;
}) {
  const colour =
    getPreviewColour(asset);

  const categoryColour =
    CATEGORY_COLOURS[
      asset.category
    ] ?? '#8b9bb4';

  return (
    <div
      className="asset-preview-placeholder"
      style={{
        background: `
          radial-gradient(
            circle at 50% 40%,
            ${categoryColour}25,
            transparent 75%
          ),
          #101827
        `,
      }}
    >
      <div
        className="asset-preview-placeholder-grid"
        aria-hidden="true"
      />

      <div
        className="asset-preview-placeholder-icon"
        style={{
          color: categoryColour,

          backgroundColor:
            `${categoryColour}12`,

          borderColor:
            `${categoryColour}30`,
        }}
      >
        <AssetCategoryIcon
          category={asset.category}
          size={48}
        />
      </div>

      <div className="asset-preview-placeholder-details">

        <span
          className="asset-preview-colour-dot"
          style={{
            backgroundColor: colour,
          }}
          aria-hidden="true"
        />

        <span>
          Design concept
        </span>

      </div>
    </div>
  );
}

/* ========================================
   ASSET IMAGE

   Failed image URLs are remembered for
   the current mounted preview.
======================================== */

function AssetImage({
  asset,
}: {
  asset: CatalogueAsset;
}) {
  const [failedUrls, setFailedUrls] =
    useState<Set<string>>(
      () => new Set()
    );

  const images =
    getPreviewImages(asset);

  const image =
    images.find(
      (candidate) =>
        !failedUrls.has(
          candidate.url
        )
    );

  if (!image) {
    if (isMaterialAsset(asset)) {
      return (
        <MaterialSwatch
          asset={asset}
        />
      );
    }

    return (
      <AssetPlaceholder
        asset={asset}
      />
    );
  }

  return (
    <img
      key={image.url}
      className="asset-preview-image"
      src={image.url}
      alt={image.altText}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      draggable={false}
      onError={() => {
        setFailedUrls(
          (previous) => {
            const next =
              new Set(previous);

            next.add(image.url);

            return next;
          }
        );
      }}
    />
  );
}

/* ========================================
   ASSET CAPABILITY LABELS
======================================== */

function AssetCapabilityLabels({
  asset,
}: {
  asset: CatalogueAsset;
}) {
  const modelAvailable =
    has3DModel(asset);

  const symbolAvailable =
    has2DSymbol(asset);

  const material =
    isMaterialAsset(asset);

  return (
    <div className="asset-preview-capabilities">

      {modelAvailable && (
        <span
          className="asset-capability-label"
          title="3D model definition available"
        >
          <Box
            size={12}
            aria-hidden="true"
          />

          3D
        </span>
      )}

      {symbolAvailable && (
        <span
          className="asset-capability-label"
          title="2D symbol definition available"
        >
          <Ruler
            size={12}
            aria-hidden="true"
          />

          2D
        </span>
      )}

      {material && (
        <span
          className="asset-capability-label"
        >
          <Layers3
            size={12}
            aria-hidden="true"
          />

          Material
        </span>
      )}

      {!modelAvailable &&
        !symbolAvailable &&
        !material && (
          <span
            className="asset-capability-label"
          >
            <Image
              size={12}
              aria-hidden="true"
            />

            Concept
          </span>
        )}

    </div>
  );
}

/* ========================================
   ASSET ACCESS LABEL
======================================== */

function AssetAccessLabel({
  asset,
}: {
  asset: CatalogueAsset;
}) {
  const labels = {
    free: 'Free',

    premium: 'Premium',

    marketplace: 'Marketplace',

    private: 'Private',
  };

  return (
    <span
      className={[
        'asset-access-label',

        `asset-access-${asset.access}`,
      ].join(' ')}
    >
      {labels[asset.access]}
    </span>
  );
}

/* ========================================
   MAIN ASSET PREVIEW
======================================== */

export default function AssetPreview({
  asset,

  size = 'medium',

  showLabels = true,

  className = '',
}: AssetPreviewProps) {
  return (
    <div
      className={[
        'asset-preview',

        `asset-preview-${size}`,

        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <AssetImage
        key={asset.id}
        asset={asset}
      />

      {showLabels && (
        <>
          <div className="asset-preview-top-labels">

            <AssetAccessLabel
              asset={asset}
            />

            {asset.featured && (
              <span
                className="asset-featured-label"
                title="Featured asset"
              >
                <Sparkles
                  size={13}
                  aria-hidden="true"
                />

                Featured
              </span>
            )}

          </div>

          <AssetCapabilityLabels
            asset={asset}
          />
        </>
      )}
    </div>
  );
}

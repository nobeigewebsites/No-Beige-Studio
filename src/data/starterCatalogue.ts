
import type {
  CatalogueAsset,
  AssetCategory,
  AssetColour,
  AssetLicensing,
  MaterialFamily,
  HistoricalPeriod,
  DesignStyle,
  SurfaceFinish,
  PlacementSurface,
  AssetRestorationInformation,
  AssetPlantInformation,
  AssetAccessibilityInformation,
  AssetSustainabilityInformation,
  MaterialProperties,
} from '../types/catalogue';

import {
  CATALOGUE_SCHEMA_VERSION,
} from '../types/catalogue';

import type {
  StudioId,
  Dimensions3D,
} from '../types/studio';

/* ========================================
   NO BEIGE STUDIO
   Original Starter Catalogue

   Stable asset identifiers.
   Original generic design definitions.
   No third-party model dependencies.
======================================== */

const CREATED_AT =
  '2026-11-24T00:00:00.000Z';

const ALL_STUDIOS: StudioId[] = [
  'architecture',
  'interior',
  'restoration',
  'landscape',
  'creator',
];

const BUILDING_STUDIOS: StudioId[] = [
  'architecture',
  'interior',
  'restoration',
  'creator',
];

const OUTDOOR_STUDIOS: StudioId[] = [
  'landscape',
  'architecture',
  'creator',
];

/* ========================================
   ORIGINAL ASSET LICENSING

   Proposed platform licence.
   Formal publication terms must be
   established before commercial launch.
======================================== */

const ORIGINAL_LICENCE: AssetLicensing = {
  licence: 'studio-standard',

  copyrightHolder: 'NO BEIGE STUDIO',

  personalUseAllowed: true,
  commercialUseAllowed: true,

  modificationAllowed: true,

  redistributionAllowed: false,
  resaleAllowed: false,

  attributionRequired: false,

  licenceVerified: false,

  restrictions: [
    'Proposed permission for use within personal and commercial design projects.',
    'Standalone redistribution and resale are not permitted under the proposed standard licence.',
    'Final platform licensing terms are pending.',
  ],
};

/* ========================================
   COLOUR DEFINITIONS
======================================== */

const COLOURS = {
  oak: {
    name: 'Natural Oak',
    hex: '#b78b58',
    family: 'natural',
  },

  walnut: {
    name: 'Dark Walnut',
    hex: '#594033',
    family: 'brown',
  },

  black: {
    name: 'Midnight Black',
    hex: '#191c22',
    family: 'black',
  },

  white: {
    name: 'Soft White',
    hex: '#f4f1e9',
    family: 'white',
  },

  cream: {
    name: 'Warm Ivory',
    hex: '#e9dfca',
    family: 'cream',
  },

  grey: {
    name: 'Stone Grey',
    hex: '#92969b',
    family: 'grey',
  },

  green: {
    name: 'Forest Green',
    hex: '#345b43',
    family: 'green',
  },

  emerald: {
    name: 'Emerald Velvet',
    hex: '#146b50',
    family: 'green',
  },

  blue: {
    name: 'Midnight Blue',
    hex: '#243c65',
    family: 'blue',
  },

  pink: {
    name: 'Rebel Pink',
    hex: '#ff3d8d',
    family: 'pink',
  },

  purple: {
    name: 'Deep Plum',
    hex: '#653d72',
    family: 'purple',
  },

  brass: {
    name: 'Antique Brass',
    hex: '#b29857',
    family: 'gold',
  },

  copper: {
    name: 'Aged Copper',
    hex: '#b87333',
    family: 'copper',
  },

  silver: {
    name: 'Brushed Silver',
    hex: '#b9c0c7',
    family: 'silver',
  },

  terracotta: {
    name: 'Terracotta',
    hex: '#b96746',
    family: 'orange',
  },

  brick: {
    name: 'Traditional Brick Red',
    hex: '#984f40',
    family: 'red',
  },

  limestone: {
    name: 'Natural Limestone',
    hex: '#c9c2ae',
    family: 'natural',
  },

  slate: {
    name: 'Dark Slate',
    hex: '#444c56',
    family: 'grey',
  },

  glass: {
    name: 'Clear Glass',
    hex: '#d7edf1',
    family: 'transparent',
  },

  water: {
    name: 'Deep Water Blue',
    hex: '#397f99',
    family: 'blue',
  },
} satisfies Record<string, AssetColour>;

/* ========================================
   STARTER ASSET INPUT
======================================== */

interface StarterAssetInput {
  id: string;

  name: string;
  description: string;

  category: AssetCategory;
  subcategory: string;

  studios?: StudioId[];

  styles?: DesignStyle[];
  periods?: HistoricalPeriod[];

  materials: MaterialFamily[];

  colour: AssetColour;

  additionalColours?: AssetColour[];

  finish?: SurfaceFinish;

  dimensions?: Dimensions3D;

  tags?: string[];

  surface?: PlacementSurface;

  adjustable?: boolean;

  featured?: boolean;

  restoration?: AssetRestorationInformation;

  plant?: AssetPlantInformation;

  accessibility?: AssetAccessibilityInformation;

  sustainability?: AssetSustainabilityInformation;
}

/* ========================================
   MATERIAL ASSET INPUT
======================================== */

interface StarterMaterialInput {
  id: string;

  name: string;
  description: string;

  category?: AssetCategory;
  subcategory: string;

  family: MaterialFamily;

  colour: AssetColour;

  finish: SurfaceFinish;

  roughness: number;
  metallic?: number;
  opacity?: number;

  styles?: DesignStyle[];
  periods?: HistoricalPeriod[];

  tags?: string[];

  featured?: boolean;

  physicalWidthMetres?: number;
  physicalHeightMetres?: number;
}

/* ========================================
   ASSET FACTORY
======================================== */

function createStarterAsset(
  input: StarterAssetInput
): CatalogueAsset {
  const surface =
    input.surface ?? 'floor';

  const adjustable =
    input.adjustable ?? true;

  const colours = [
    input.colour,
    ...(input.additionalColours ?? []),
  ];

  return {
    id: input.id,

    slug: input.id,

    name: input.name,

    description: input.description,

    category: input.category,

    subcategory: input.subcategory,

    compatibleStudios: [
      ...(input.studios ?? ALL_STUDIOS),
    ],

    styles:
      input.styles ?? ['contemporary'],

    historicalPeriods:
      input.periods ?? ['timeless'],

    materialFamilies: [
      ...input.materials,
    ],

    colourFamilies: [
      ...new Set(
        colours.map(
          (colour) => colour.family
        )
      ),
    ],

    tags: [
      ...(input.tags ?? []),
      input.subcategory.toLowerCase(),
      'starter catalogue',
      'original design',
    ],

    source: 'studio-original',

    access: 'free',

    licensing: {
      ...ORIGINAL_LICENCE,
    },

    creatorName: 'NO BEIGE STUDIO',

    media: [],

    /*
      Model and symbol records will be
      added when their actual generators
      have been implemented.
    */

    models: [],

    symbols: [],

    materialProperties: {
      family:
        input.materials[0] ?? 'mixed',

      colour: {
        ...input.colour,
      },

      finish:
        input.finish ?? 'matte',

      roughness: 0.65,

      metallic: 0,

      opacity: 1,
    },

    physicalProperties: {
      dimensions:
        input.dimensions,

      adjustableDimensions:
        adjustable,

      resizableWidth:
        adjustable,

      resizableHeight:
        adjustable,

      resizableDepth:
        adjustable,

      rotationAllowed: true,

      technicalSpecificationsVerified:
        false,
    },

    placement: {
      allowedSurfaces: [
        surface,
      ],

      defaultSurface: surface,

      snapToGrid: true,

      snapToWall:
        surface === 'wall',

      snapToSurface: true,

      allowOverlap: false,

      allowFreeRotation: true,

      defaultRotationDegrees: 0,

      defaultElevationMetres: 0,

      requiredSupport:
        surface !== 'free-placement',

      collisionEnabled: true,
    },

    customisation: {
      colourEditable: true,

      materialEditable: true,

      finishEditable: true,

      dimensionsEditable:
        adjustable,

      textureEditable: true,

      geometryEditable: false,

      availableVariants:
        colours.map(
          (colour, index) => ({
            id:
              `${input.id}-variant-${index + 1}`,

            name: colour.name,

            colours: [
              { ...colour },
            ],

            materials: [
              ...input.materials,
            ],

            finish:
              input.finish ?? 'matte',

            dimensions:
              input.dimensions,
          })
        ),
    },

    restoration:
      input.restoration,

    plant:
      input.plant,

    accessibility:
      input.accessibility,

    sustainability:
      input.sustainability,

    featured:
      input.featured ?? false,

    published: true,

    verified: false,

    createdAt: CREATED_AT,

    updatedAt: CREATED_AT,

    schemaVersion:
      CATALOGUE_SCHEMA_VERSION,
  };
}

/* ========================================
   MATERIAL FACTORY
======================================== */

function createStarterMaterial(
  input: StarterMaterialInput
): CatalogueAsset {
  const materialProperties:
    MaterialProperties = {
      family: input.family,

      colour: {
        ...input.colour,
      },

      finish: input.finish,

      roughness: input.roughness,

      metallic:
        input.metallic ?? 0,

      opacity:
        input.opacity ?? 1,

      textureScaleX: 1,
      textureScaleY: 1,

      textureRotation: 0,

      physicalWidthMetres:
        input.physicalWidthMetres,

      physicalHeightMetres:
        input.physicalHeightMetres,
    };

  return {
    id: input.id,

    slug: input.id,

    name: input.name,

    description: input.description,

    category:
      input.category ?? 'materials',

    subcategory: input.subcategory,

    compatibleStudios: [
      ...ALL_STUDIOS,
    ],

    styles:
      input.styles ?? ['contemporary'],

    historicalPeriods:
      input.periods ?? ['timeless'],

    materialFamilies: [
      input.family,
    ],

    colourFamilies: [
      input.colour.family,
    ],

    tags: [
      ...(input.tags ?? []),
      'surface material',
      'original design',
      'starter catalogue',
    ],

    source: 'studio-original',

    access: 'free',

    licensing: {
      ...ORIGINAL_LICENCE,
    },

    creatorName: 'NO BEIGE STUDIO',

    media: [],

    models: [],

    symbols: [],

    materialProperties,

    customisation: {
      colourEditable: true,

      materialEditable: true,

      finishEditable: true,

      dimensionsEditable: false,

      textureEditable: true,

      geometryEditable: false,
    },

    featured:
      input.featured ?? false,

    published: true,

    verified: false,

    createdAt: CREATED_AT,

    updatedAt: CREATED_AT,

    schemaVersion:
      CATALOGUE_SCHEMA_VERSION,
  };
}

/* ========================================
   ARCHITECTURAL ELEMENTS
======================================== */

const ARCHITECTURAL_ASSETS =
  [
    createStarterAsset({
      id: 'architecture-classical-column',

      name: 'Classical Stone Column',

      description:
        'A classical-inspired cylindrical column with a decorative base and capital.',

      category: 'architecture',

      subcategory: 'Columns',

      studios: BUILDING_STUDIOS,

      styles: [
        'classical',
        'traditional',
      ],

      periods: [
        'ancient-greek',
        'ancient-roman',
        'renaissance',
      ],

      materials: ['stone'],

      colour: COLOURS.limestone,

      dimensions: {
        width: 0.45,
        height: 2.8,
        depth: 0.45,
      },

      featured: true,
    }),

    createStarterAsset({
      id: 'architecture-rounded-arch',

      name: 'Rounded Stone Archway',

      description:
        'A rounded architectural opening inspired by traditional masonry buildings.',

      category: 'architecture',

      subcategory: 'Archways',

      studios: BUILDING_STUDIOS,

      styles: [
        'classical',
        'mediterranean',
        'rustic',
      ],

      periods: [
        'ancient-roman',
        'medieval',
        'renaissance',
      ],

      materials: ['stone'],

      colour: COLOURS.limestone,

      dimensions: {
        width: 1.6,
        height: 2.5,
        depth: 0.3,
      },

      featured: true,
    }),

    createStarterAsset({
      id: 'architecture-gothic-arch',

      name: 'Gothic Pointed Arch',

      description:
        'A pointed arch design inspired by Gothic architectural proportions.',

      category: 'architecture',

      subcategory: 'Arches',

      studios: BUILDING_STUDIOS,

      styles: ['gothic'],

      periods: [
        'medieval',
        'gothic',
        'victorian',
      ],

      materials: ['stone'],

      colour: COLOURS.grey,

      dimensions: {
        width: 1.4,
        height: 3,
        depth: 0.35,
      },
    }),

    createStarterAsset({
      id: 'architecture-timber-beam',

      name: 'Traditional Exposed Timber Beam',

      description:
        'A substantial rectangular timber beam for historical and rustic visual designs.',

      category: 'structural',

      subcategory: 'Beams',

      studios: BUILDING_STUDIOS,

      styles: [
        'rustic',
        'country',
        'farmhouse',
      ],

      periods: [
        'medieval',
        'tudor',
        'jacobean',
      ],

      materials: ['wood'],

      colour: COLOURS.walnut,

      finish: 'aged',

      surface: 'ceiling',

      dimensions: {
        width: 3,
        height: 0.25,
        depth: 0.2,
      },
    }),

    createStarterAsset({
      id: 'architecture-marble-fireplace',

      name: 'Classical Marble Fireplace',

      description:
        'An elegant fireplace surround with classical decorative proportions.',

      category: 'architecture',

      subcategory: 'Fireplaces',

      studios: BUILDING_STUDIOS,

      styles: [
        'classical',
        'luxury',
        'traditional',
      ],

      periods: [
        'georgian',
        'regency',
        'victorian',
      ],

      materials: ['marble'],

      colour: COLOURS.cream,

      finish: 'polished',

      dimensions: {
        width: 1.5,
        height: 1.2,
        depth: 0.35,
      },

      featured: true,
    }),

    createStarterAsset({
      id: 'architecture-ceiling-rose',

      name: 'Decorative Plaster Ceiling Rose',

      description:
        'A circular ornamental plaster ceiling feature inspired by period interiors.',

      category: 'architecture',

      subcategory: 'Ceiling Roses',

      studios: BUILDING_STUDIOS,

      styles: [
        'victorian',
        'traditional',
      ],

      periods: [
        'victorian',
        'edwardian',
      ],

      materials: ['plaster'],

      colour: COLOURS.white,

      surface: 'ceiling',

      dimensions: {
        width: 0.65,
        height: 0.06,
        depth: 0.65,
      },
    }),
  ];

/* ========================================
   FURNITURE
======================================== */

const FURNITURE_ASSETS =
  [
    createStarterAsset({
      id: 'furniture-velvet-sofa',

      name: 'Emerald Velvet Sofa',

      description:
        'A luxurious three-seat sofa with deep green upholstery and contrasting legs.',

      category: 'furniture',

      subcategory: 'Sofas',

      studios: BUILDING_STUDIOS,

      styles: [
        'luxury',
        'maximalist',
        'art-deco',
      ],

      periods: [
        'art-deco',
        'contemporary',
      ],

      materials: [
        'velvet',
        'wood',
      ],

      colour: COLOURS.emerald,

      additionalColours: [
        COLOURS.purple,
        COLOURS.blue,
        COLOURS.pink,
      ],

      dimensions: {
        width: 2.2,
        height: 0.85,
        depth: 0.95,
      },

      featured: true,
    }),

    createStarterAsset({
      id: 'furniture-chesterfield-sofa',

      name: 'Traditional Chesterfield Sofa',

      description:
        'A classic rolled-arm sofa design with deep-button-inspired upholstery.',

      category: 'furniture',

      subcategory: 'Sofas',

      studios: BUILDING_STUDIOS,

      styles: [
        'traditional',
        'victorian',
        'luxury',
      ],

      periods: [
        'victorian',
        'timeless',
      ],

      materials: [
        'leather',
        'wood',
      ],

      colour: COLOURS.walnut,

      additionalColours: [
        COLOURS.black,
        COLOURS.green,
      ],

      dimensions: {
        width: 2.3,
        height: 0.8,
        depth: 1,
      },

      featured: true,
    }),

    createStarterAsset({
      id: 'furniture-modern-modular-sofa',

      name: 'Contemporary Modular Sofa',

      description:
        'A flexible contemporary seating concept with generous modular proportions.',

      category: 'furniture',

      subcategory: 'Modular Sofas',

      studios: BUILDING_STUDIOS,

      styles: [
        'modern',
        'contemporary',
        'minimalist',
      ],

      materials: [
        'fabric',
        'wood',
      ],

      colour: COLOURS.grey,

      additionalColours: [
        COLOURS.blue,
        COLOURS.cream,
        COLOURS.pink,
      ],

      dimensions: {
        width: 2.8,
        height: 0.8,
        depth: 1.6,
      },
    }),

    createStarterAsset({
      id: 'furniture-wingback-chair',

      name: 'Classic Wingback Armchair',

      description:
        'A traditional high-backed armchair with enveloping sides.',

      category: 'furniture',

      subcategory: 'Armchairs',

      studios: BUILDING_STUDIOS,

      styles: [
        'traditional',
        'victorian',
        'country',
      ],

      periods: [
        'georgian',
        'victorian',
      ],

      materials: [
        'fabric',
        'wood',
      ],

      colour: COLOURS.blue,

      additionalColours: [
        COLOURS.emerald,
        COLOURS.purple,
      ],

      dimensions: {
        width: 0.85,
        height: 1.15,
        depth: 0.85,
      },
    }),

    createStarterAsset({
      id: 'furniture-oak-dining-table',

      name: 'Solid Oak Dining Table',

      description:
        'A generous rectangular dining table inspired by traditional solid timber furniture.',

      category: 'furniture',

      subcategory: 'Dining Tables',

      studios: BUILDING_STUDIOS,

      styles: [
        'farmhouse',
        'rustic',
        'country',
        'traditional',
      ],

      materials: ['wood'],

      colour: COLOURS.oak,

      finish: 'oiled',

      dimensions: {
        width: 1.8,
        height: 0.76,
        depth: 0.9,
      },

      featured: true,
    }),

    createStarterAsset({
      id: 'furniture-dining-chair',

      name: 'Traditional Timber Dining Chair',

      description:
        'A simple timber dining chair with a conventional upright back.',

      category: 'furniture',

      subcategory: 'Dining Chairs',

      studios: BUILDING_STUDIOS,

      styles: [
        'traditional',
        'farmhouse',
        'country',
      ],

      materials: ['wood'],

      colour: COLOURS.oak,

      dimensions: {
        width: 0.48,
        height: 0.95,
        depth: 0.52,
      },
    }),

    createStarterAsset({
      id: 'furniture-art-deco-sideboard',

      name: 'Art Deco Sideboard',

      description:
        'A geometric sideboard concept with dark timber and brass-inspired detailing.',

      category: 'furniture',

      subcategory: 'Sideboards',

      studios: BUILDING_STUDIOS,

      styles: [
        'art-deco',
        'luxury',
        'vintage',
      ],

      periods: [
        'art-deco',
        '1920s',
        '1930s',
      ],

      materials: [
        'wood',
        'brass',
      ],

      colour: COLOURS.walnut,

      finish: 'polished',

      dimensions: {
        width: 1.6,
        height: 0.85,
        depth: 0.45,
      },

      featured: true,
    }),

    createStarterAsset({
      id: 'furniture-four-poster-bed',

      name: 'Traditional Four-Poster Bed',

      description:
        'A tall four-poster bed frame inspired by historical timber furniture.',

      category: 'furniture',

      subcategory: 'Beds',

      studios: BUILDING_STUDIOS,

      styles: [
        'traditional',
        'gothic',
        'luxury',
      ],

      periods: [
        'tudor',
        'jacobean',
        'georgian',
      ],

      materials: ['wood'],

      colour: COLOURS.walnut,

      dimensions: {
        width: 1.65,
        height: 2.2,
        depth: 2.15,
      },

      featured: true,
    }),

    createStarterAsset({
      id: 'furniture-modern-double-bed',

      name: 'Contemporary Upholstered Bed',

      description:
        'A simple upholstered double-bed concept with a broad headboard.',

      category: 'furniture',

      subcategory: 'Beds',

      studios: BUILDING_STUDIOS,

      styles: [
        'modern',
        'contemporary',
        'minimalist',
      ],

      materials: [
        'fabric',
        'wood',
      ],

      colour: COLOURS.grey,

      additionalColours: [
        COLOURS.blue,
        COLOURS.emerald,
      ],

      dimensions: {
        width: 1.5,
        height: 1.1,
        depth: 2.05,
      },
    }),

    createStarterAsset({
      id: 'furniture-industrial-bookcase',

      name: 'Industrial Open Bookcase',

      description:
        'An open shelving design combining dark metal framing with timber shelves.',

      category: 'furniture',

      subcategory: 'Bookcases',

      studios: BUILDING_STUDIOS,

      styles: [
        'industrial',
        'modern',
        'eclectic',
      ],

      materials: [
        'steel',
        'wood',
      ],

      colour: COLOURS.black,

      dimensions: {
        width: 1.1,
        height: 1.9,
        depth: 0.35,
      },
    }),

    createStarterAsset({
      id: 'furniture-vintage-writing-desk',

      name: 'Vintage Writing Desk',

      description:
        'A traditional writing desk with a generous work surface and drawer storage.',

      category: 'furniture',

      subcategory: 'Writing Desks',

      studios: BUILDING_STUDIOS,

      styles: [
        'vintage',
        'traditional',
        'classical',
      ],

      periods: [
        'victorian',
        'edwardian',
      ],

      materials: ['wood'],

      colour: COLOURS.walnut,

      dimensions: {
        width: 1.25,
        height: 0.78,
        depth: 0.65,
      },
    }),

    createStarterAsset({
      id: 'furniture-rebel-accent-chair',

      name: 'Rebel Pink Accent Chair',

      description:
        'A bold statement chair for colourful, unconventional interiors.',

      category: 'furniture',

      subcategory: 'Accent Chairs',

      studios: BUILDING_STUDIOS,

      styles: [
        'maximalist',
        'eclectic',
        'experimental',
      ],

      materials: [
        'velvet',
        'metal',
      ],

      colour: COLOURS.pink,

      additionalColours: [
        COLOURS.emerald,
        COLOURS.purple,
      ],

      dimensions: {
        width: 0.75,
        height: 0.9,
        depth: 0.8,
      },

      featured: true,
    }),
  ];

/* ========================================
   LIGHTING AND DECORATION
======================================== */

const DECORATIVE_ASSETS =
  [
    createStarterAsset({
      id: 'lighting-classical-chandelier',

      name: 'Classical Brass Chandelier',

      description:
        'A decorative multi-arm chandelier inspired by traditional interiors.',

      category: 'lighting',

      subcategory: 'Chandeliers',

      styles: [
        'classical',
        'luxury',
        'traditional',
      ],

      periods: [
        'georgian',
        'victorian',
      ],

      materials: [
        'brass',
        'glass',
      ],

      colour: COLOURS.brass,

      surface: 'ceiling',

      dimensions: {
        width: 0.8,
        height: 0.7,
        depth: 0.8,
      },

      featured: true,
    }),

    createStarterAsset({
      id: 'lighting-industrial-pendant',

      name: 'Industrial Pendant Light',

      description:
        'A suspended metal pendant with a simple industrial-inspired shade.',

      category: 'lighting',

      subcategory: 'Pendant Lights',

      styles: [
        'industrial',
        'modern',
      ],

      materials: ['metal'],

      colour: COLOURS.black,

      surface: 'ceiling',

      dimensions: {
        width: 0.35,
        height: 0.4,
        depth: 0.35,
      },
    }),

    createStarterAsset({
      id: 'lighting-art-deco-table-lamp',

      name: 'Art Deco Table Lamp',

      description:
        'A geometric decorative lamp with brass-inspired accents.',

      category: 'lighting',

      subcategory: 'Table Lamps',

      styles: [
        'art-deco',
        'luxury',
      ],

      periods: [
        'art-deco',
        '1920s',
      ],

      materials: [
        'brass',
        'glass',
      ],

      colour: COLOURS.brass,

      surface: 'tabletop',

      dimensions: {
        width: 0.28,
        height: 0.55,
        depth: 0.28,
      },
    }),

    createStarterAsset({
      id: 'decor-ornate-gold-mirror',

      name: 'Ornate Gold Wall Mirror',

      description:
        'A decorative wall mirror inspired by elaborate historical gilded frames.',

      category: 'decor',

      subcategory: 'Mirrors',

      styles: [
        'classical',
        'maximalist',
        'luxury',
      ],

      periods: [
        'baroque',
        'rococo',
        'victorian',
      ],

      materials: [
        'wood',
        'glass',
      ],

      colour: COLOURS.brass,

      surface: 'wall',

      dimensions: {
        width: 0.8,
        height: 1.1,
        depth: 0.06,
      },

      featured: true,
    }),

    createStarterAsset({
      id: 'decor-terracotta-vase',

      name: 'Handcrafted Terracotta Vase',

      description:
        'A simple decorative vessel inspired by traditional terracotta pottery.',

      category: 'decor',

      subcategory: 'Vases',

      styles: [
        'mediterranean',
        'rustic',
        'organic',
      ],

      materials: ['clay'],

      colour: COLOURS.terracotta,

      surface: 'tabletop',

      dimensions: {
        width: 0.28,
        height: 0.45,
        depth: 0.28,
      },
    }),

    createStarterAsset({
      id: 'decor-vintage-wall-clock',

      name: 'Vintage Wall Clock',

      description:
        'A circular decorative clock with traditional dark timber styling.',

      category: 'decor',

      subcategory: 'Clocks',

      styles: [
        'vintage',
        'traditional',
      ],

      materials: [
        'wood',
        'metal',
      ],

      colour: COLOURS.walnut,

      surface: 'wall',

      dimensions: {
        width: 0.4,
        height: 0.4,
        depth: 0.07,
      },
    }),
  ];

/* ========================================
   DOORS AND WINDOWS
======================================== */

const OPENING_ASSETS =
  [
    createStarterAsset({
      id: 'door-traditional-panelled',

      name: 'Traditional Panelled Door',

      description:
        'A classic timber internal door with decorative recessed panels.',

      category: 'doors',

      subcategory: 'Panelled Doors',

      studios: BUILDING_STUDIOS,

      styles: [
        'traditional',
        'georgian',
        'victorian',
      ],

      materials: ['wood'],

      colour: COLOURS.white,

      additionalColours: [
        COLOURS.black,
        COLOURS.oak,
        COLOURS.green,
      ],

      surface: 'wall',

      dimensions: {
        width: 0.826,
        height: 2.04,
        depth: 0.044,
      },
    }),

    createStarterAsset({
      id: 'door-rustic-stable',

      name: 'Rustic Stable Door',

      description:
        'A split timber door concept inspired by traditional country cottages.',

      category: 'doors',

      subcategory: 'Stable Doors',

      studios: BUILDING_STUDIOS,

      styles: [
        'country',
        'rustic',
        'cottagecore',
      ],

      materials: ['wood'],

      colour: COLOURS.green,

      surface: 'wall',

      dimensions: {
        width: 0.9,
        height: 2.05,
        depth: 0.05,
      },

      featured: true,
    }),

    createStarterAsset({
      id: 'window-georgian-sash',

      name: 'Georgian Sash Window',

      description:
        'A traditional sash-window concept with symmetrical glazing divisions.',

      category: 'windows',

      subcategory: 'Sash Windows',

      studios: BUILDING_STUDIOS,

      styles: [
        'georgian',
        'classical',
        'traditional',
      ],

      periods: [
        'georgian',
        'regency',
      ],

      materials: [
        'wood',
        'glass',
      ],

      colour: COLOURS.white,

      surface: 'wall',

      dimensions: {
        width: 1.1,
        height: 1.6,
        depth: 0.15,
      },

      featured: true,
    }),

    createStarterAsset({
      id: 'window-modern-picture',

      name: 'Modern Picture Window',

      description:
        'A large fixed-glazing concept with a slim contemporary frame.',

      category: 'windows',

      subcategory: 'Picture Windows',

      studios: BUILDING_STUDIOS,

      styles: [
        'modern',
        'minimalist',
      ],

      materials: [
        'aluminium',
        'glass',
      ],

      colour: COLOURS.black,

      surface: 'wall',

      dimensions: {
        width: 2.4,
        height: 1.8,
        depth: 0.12,
      },
    }),
  ];

/* ========================================
   KITCHENS AND BATHROOMS
======================================== */

const FIXTURE_ASSETS =
  [
    createStarterAsset({
      id: 'kitchen-shaker-base-unit',

      name: 'Shaker Kitchen Base Unit',

      description:
        'A traditional framed-door kitchen cabinet concept.',

      category: 'kitchens',

      subcategory: 'Base Units',

      studios: BUILDING_STUDIOS,

      styles: [
        'traditional',
        'country',
        'farmhouse',
      ],

      materials: [
        'wood',
        'engineered-wood',
      ],

      colour: COLOURS.blue,

      additionalColours: [
        COLOURS.green,
        COLOURS.white,
        COLOURS.black,
      ],

      dimensions: {
        width: 0.6,
        height: 0.9,
        depth: 0.6,
      },

      featured: true,
    }),

    createStarterAsset({
      id: 'kitchen-central-island',

      name: 'Freestanding Kitchen Island',

      description:
        'A central kitchen island concept with storage and a generous work surface.',

      category: 'kitchens',

      subcategory: 'Kitchen Islands',

      studios: BUILDING_STUDIOS,

      styles: [
        'contemporary',
        'farmhouse',
      ],

      materials: [
        'wood',
        'stone',
      ],

      colour: COLOURS.green,

      dimensions: {
        width: 1.8,
        height: 0.92,
        depth: 0.95,
      },
    }),

    createStarterAsset({
      id: 'kitchen-belfast-sink',

      name: 'Traditional Belfast Sink',

      description:
        'A deep ceramic sink concept with an exposed front apron.',

      category: 'kitchens',

      subcategory: 'Kitchen Sinks',

      studios: BUILDING_STUDIOS,

      styles: [
        'country',
        'farmhouse',
        'traditional',
      ],

      materials: ['ceramic'],

      colour: COLOURS.white,

      finish: 'glazed',

      surface: 'tabletop',

      dimensions: {
        width: 0.6,
        height: 0.25,
        depth: 0.45,
      },
    }),

    createStarterAsset({
      id: 'bathroom-clawfoot-bath',

      name: 'Victorian Clawfoot Bath',

      description:
        'A freestanding roll-top bath concept with decorative feet.',

      category: 'bathrooms',

      subcategory: 'Clawfoot Baths',

      studios: BUILDING_STUDIOS,

      styles: [
        'victorian',
        'traditional',
        'luxury',
      ],

      periods: [
        'victorian',
        'edwardian',
      ],

      materials: [
        'iron',
        'metal',
      ],

      colour: COLOURS.white,

      additionalColours: [
        COLOURS.black,
        COLOURS.blue,
        COLOURS.pink,
      ],

      dimensions: {
        width: 1.7,
        height: 0.65,
        depth: 0.75,
      },

      featured: true,
    }),

    createStarterAsset({
      id: 'bathroom-modern-vanity',

      name: 'Contemporary Vanity Unit',

      description:
        'A compact bathroom storage and basin-unit concept.',

      category: 'bathrooms',

      subcategory: 'Vanity Units',

      studios: BUILDING_STUDIOS,

      styles: [
        'modern',
        'contemporary',
      ],

      materials: [
        'wood',
        'ceramic',
      ],

      colour: COLOURS.black,

      dimensions: {
        width: 0.8,
        height: 0.85,
        depth: 0.45,
      },
    }),

    createStarterAsset({
      id: 'bathroom-standard-toilet',

      name: 'Close-Coupled Toilet',

      description:
        'A generic close-coupled toilet representation for bathroom layout planning.',

      category: 'bathrooms',

      subcategory: 'Toilets',

      studios: BUILDING_STUDIOS,

      materials: ['ceramic'],

      colour: COLOURS.white,

      finish: 'glazed',

      dimensions: {
        width: 0.38,
        height: 0.8,
        depth: 0.65,
      },
    }),
  ];

/* ========================================
   ANTIQUES AND SALVAGE
======================================== */

const RESTORATION_ASSETS =
  [
    createStarterAsset({
      id: 'salvage-vintage-dresser',

      name: 'Salvaged Vintage Dresser',

      description:
        'A fictional worn timber dresser suitable for exploring restoration and refinishing concepts.',

      category: 'salvage',

      subcategory: 'Salvaged Furniture',

      styles: [
        'vintage',
        'shabby-chic',
        'traditional',
      ],

      periods: [
        'victorian',
        'edwardian',
      ],

      materials: [
        'wood',
        'reclaimed',
      ],

      colour: COLOURS.oak,

      finish: 'weathered',

      dimensions: {
        width: 1.2,
        height: 1.8,
        depth: 0.45,
      },

      restoration: {
        condition: 'worn',

        conditionDescription:
          'Illustrative surface wear and an aged finish.',

        salvageable: true,

        restorationPossible: true,

        restorationDifficulty:
          'intermediate',
      },

      featured: true,
    }),

    createStarterAsset({
      id: 'salvage-reclaimed-door',

      name: 'Reclaimed Timber Door',

      description:
        'A weathered door concept for historical restoration and adaptive reuse designs.',

      category: 'salvage',

      subcategory: 'Reclaimed Doors',

      styles: [
        'rustic',
        'country',
        'traditional',
      ],

      materials: [
        'wood',
        'reclaimed',
      ],

      colour: COLOURS.walnut,

      finish: 'aged',

      surface: 'wall',

      dimensions: {
        width: 0.85,
        height: 2.05,
        depth: 0.045,
      },

      restoration: {
        condition: 'reclaimed',

        salvageable: true,

        restorationPossible: true,

        restorationDifficulty:
          'intermediate',
      },
    }),

    createStarterAsset({
      id: 'salvage-antique-chair',

      name: 'Worn Antique-Style Chair',

      description:
        'A fictional antique-inspired chair with an aged timber frame and worn upholstery.',

      category: 'antiques',

      subcategory: 'Antique Chairs',

      styles: [
        'victorian',
        'vintage',
      ],

      periods: [
        'victorian',
      ],

      materials: [
        'wood',
        'fabric',
      ],

      colour: COLOURS.walnut,

      finish: 'distressed',

      dimensions: {
        width: 0.55,
        height: 1,
        depth: 0.6,
      },

      restoration: {
        condition:
          'requires-restoration',

        salvageable: true,

        restorationPossible: true,

        restorationDifficulty:
          'advanced',
      },

      featured: true,
    }),

    createStarterAsset({
      id: 'antique-grandfather-clock',

      name: 'Grandfather Clock',

      description:
        'A tall historical clock representation inspired by traditional longcase designs.',

      category: 'antiques',

      subcategory: 'Antique Clocks',

      styles: [
        'traditional',
        'classical',
        'vintage',
      ],

      periods: [
        'georgian',
        'victorian',
      ],

      materials: [
        'wood',
        'brass',
        'glass',
      ],

      colour: COLOURS.walnut,

      dimensions: {
        width: 0.48,
        height: 2.1,
        depth: 0.28,
      },
    }),
  ];

/* ========================================
   LANDSCAPE AND GARDEN
======================================== */

const LANDSCAPE_ASSETS =
  [
    createStarterAsset({
      id: 'landscape-timber-pergola',

      name: 'Traditional Timber Pergola',

      description:
        'An open timber garden structure for outdoor seating and planting concepts.',

      category: 'landscape',

      subcategory: 'Pergolas',

      studios: OUTDOOR_STUDIOS,

      styles: [
        'country',
        'mediterranean',
        'rustic',
      ],

      materials: ['wood'],

      colour: COLOURS.oak,

      surface: 'ground',

      dimensions: {
        width: 3,
        height: 2.5,
        depth: 3,
      },

      featured: true,
    }),

    createStarterAsset({
      id: 'landscape-raised-planter',

      name: 'Timber Raised Planting Bed',

      description:
        'A rectangular raised planting-bed concept for gardens and vegetable growing.',

      category: 'landscape',

      subcategory: 'Raised Beds',

      studios: OUTDOOR_STUDIOS,

      materials: ['wood'],

      colour: COLOURS.oak,

      surface: 'ground',

      dimensions: {
        width: 1.8,
        height: 0.45,
        depth: 0.9,
      },
    }),

    createStarterAsset({
      id: 'landscape-terracotta-planter',

      name: 'Large Terracotta Planter',

      description:
        'A rounded terracotta planting container for courtyard and garden designs.',

      category: 'landscape',

      subcategory: 'Plant Pots',

      styles: [
        'mediterranean',
        'tuscan',
        'rustic',
      ],

      materials: ['clay'],

      colour: COLOURS.terracotta,

      surface: 'ground',

      dimensions: {
        width: 0.65,
        height: 0.55,
        depth: 0.65,
      },
    }),

    createStarterAsset({
      id: 'outdoor-traditional-bench',

      name: 'Traditional Garden Bench',

      description:
        'A timber garden bench concept for paths, patios and quiet outdoor spaces.',

      category: 'outdoor-furniture',

      subcategory: 'Garden Benches',

      studios: OUTDOOR_STUDIOS,

      styles: [
        'traditional',
        'country',
      ],

      materials: ['wood'],

      colour: COLOURS.oak,

      surface: 'ground',

      dimensions: {
        width: 1.5,
        height: 0.9,
        depth: 0.6,
      },
    }),

    createStarterAsset({
      id: 'outdoor-rattan-sofa',

      name: 'Contemporary Rattan Garden Sofa',

      description:
        'An outdoor seating concept inspired by woven rattan furniture.',

      category: 'outdoor-furniture',

      subcategory: 'Outdoor Sofas',

      studios: OUTDOOR_STUDIOS,

      styles: [
        'contemporary',
        'bohemian',
        'mediterranean',
      ],

      materials: [
        'rattan',
        'fabric',
      ],

      colour: COLOURS.cream,

      surface: 'ground',

      dimensions: {
        width: 2,
        height: 0.8,
        depth: 0.85,
      },
    }),

    createStarterAsset({
      id: 'water-classical-fountain',

      name: 'Classical Tiered Fountain',

      description:
        'A decorative tiered fountain concept inspired by traditional courtyard gardens.',

      category: 'water-features',

      subcategory: 'Fountains',

      studios: OUTDOOR_STUDIOS,

      styles: [
        'classical',
        'mediterranean',
        'traditional',
      ],

      materials: ['stone'],

      colour: COLOURS.limestone,

      surface: 'ground',

      dimensions: {
        width: 1.5,
        height: 1.8,
        depth: 1.5,
      },

      featured: true,
    }),

    createStarterAsset({
      id: 'water-natural-garden-pond',

      name: 'Natural Garden Pond',

      description:
        'An illustrative garden pond footprint for landscape composition.',

      category: 'water-features',

      subcategory: 'Garden Ponds',

      studios: OUTDOOR_STUDIOS,

      styles: [
        'organic',
        'biophilic',
        'country',
      ],

      materials: [
        'stone',
        'organic',
      ],

      colour: COLOURS.water,

      surface: 'ground',

      dimensions: {
        width: 3,
        height: 0.6,
        depth: 2,
      },
    }),
  ];

/* ========================================
   GENERIC PLANT REPRESENTATIONS

   These are visual placeholders rather
   than verified horticultural records.
======================================== */

const PLANT_ASSETS =
  [
    createStarterAsset({
      id: 'plant-lavender-concept',

      name: 'Lavender Planting Concept',

      description:
        'A purple-flowering planting representation inspired by lavender.',

      category: 'plants',

      subcategory: 'Mediterranean Plants',

      studios: OUTDOOR_STUDIOS,

      styles: [
        'mediterranean',
        'cottagecore',
        'country',
      ],

      materials: ['organic'],

      colour: COLOURS.purple,

      surface: 'ground',

      dimensions: {
        width: 0.6,
        height: 0.6,
        depth: 0.6,
      },

      plant: {
        commonName: 'Lavender',

        sunlight: [],

        toxicityInformationVerified:
          false,
      },
    }),

    createStarterAsset({
      id: 'plant-ornamental-grass',

      name: 'Ornamental Grass Concept',

      description:
        'A generic ornamental grass representation for landscape composition.',

      category: 'plants',

      subcategory: 'Ornamental Grasses',

      studios: OUTDOOR_STUDIOS,

      styles: [
        'organic',
        'modern',
        'biophilic',
      ],

      materials: ['organic'],

      colour: COLOURS.green,

      surface: 'ground',

      dimensions: {
        width: 0.65,
        height: 0.9,
        depth: 0.65,
      },

      plant: {
        commonName:
          'Generic Ornamental Grass',

        sunlight: [],

        toxicityInformationVerified:
          false,
      },
    }),

    createStarterAsset({
      id: 'plant-indoor-foliage',

      name: 'Indoor Foliage Plant',

      description:
        'A generic decorative foliage plant with a simple planting container.',

      category: 'plants',

      subcategory: 'Indoor Plants',

      styles: [
        'biophilic',
        'organic',
        'contemporary',
      ],

      materials: [
        'organic',
        'ceramic',
      ],

      colour: COLOURS.green,

      dimensions: {
        width: 0.65,
        height: 1.3,
        depth: 0.65,
      },

      plant: {
        commonName:
          'Generic Indoor Foliage',

        sunlight: [],

        toxicityInformationVerified:
          false,
      },
    }),

    createStarterAsset({
      id: 'tree-olive-concept',

      name: 'Mediterranean Olive Tree Concept',

      description:
        'An olive-tree-inspired representation for Mediterranean garden layouts.',

      category: 'trees',

      subcategory: 'Mediterranean Trees',

      studios: OUTDOOR_STUDIOS,

      styles: [
        'mediterranean',
        'tuscan',
        'organic',
      ],

      materials: ['organic'],

      colour: COLOURS.green,

      surface: 'ground',

      dimensions: {
        width: 2.5,
        height: 3.5,
        depth: 2.5,
      },

      plant: {
        commonName: 'Olive Tree',

        scientificName: 'Olea europaea',

        sunlight: [],

        toxicityInformationVerified:
          false,
      },

      featured: true,
    }),

    createStarterAsset({
      id: 'tree-deciduous-concept',

      name: 'Broadleaf Garden Tree',

      description:
        'A generic broadleaf tree representation for garden and landscape scale planning.',

      category: 'trees',

      subcategory: 'Deciduous Trees',

      studios: OUTDOOR_STUDIOS,

      materials: ['organic'],

      colour: COLOURS.green,

      surface: 'ground',

      dimensions: {
        width: 4,
        height: 6,
        depth: 4,
      },

      plant: {
        commonName:
          'Generic Broadleaf Tree',

        sunlight: [],

        toxicityInformationVerified:
          false,
      },
    }),
  ];

/* ========================================
   ACCESSIBLE LIVING CONCEPTS

   Dimensions are illustrative.
   No regulatory compliance is claimed.
======================================== */

const ACCESSIBILITY_ASSETS =
  [
    createStarterAsset({
      id: 'accessibility-wheelchair-ramp',

      name: 'Entrance Ramp Concept',

      description:
        'An adjustable ramp representation for exploring step-free entrance layouts. Gradient and compliance must be assessed separately.',

      category: 'accessibility',

      subcategory: 'Wheelchair Ramps',

      materials: [
        'metal',
        'concrete',
      ],

      colour: COLOURS.grey,

      surface: 'ground',

      dimensions: {
        width: 1.2,
        height: 0.15,
        depth: 1.8,
      },

      accessibility: {
        complianceVerified: false,

        accessibilityNotes: [
          'Illustrative dimensions only.',
          'Ramp gradient, landings and clearances require project-specific assessment.',
        ],
      },

      featured: true,
    }),

    createStarterAsset({
      id: 'accessibility-wall-grab-rail',

      name: 'Wall-Mounted Grab Rail',

      description:
        'A grab-rail representation for accessible bathroom and circulation planning.',

      category: 'accessibility',

      subcategory: 'Grab Rails',

      materials: ['steel'],

      colour: COLOURS.silver,

      surface: 'wall',

      dimensions: {
        width: 0.6,
        height: 0.08,
        depth: 0.08,
      },

      accessibility: {
        complianceVerified: false,

        accessibilityNotes: [
          'Fixings, load capacity and positioning are not verified.',
        ],
      },
    }),

    createStarterAsset({
      id: 'accessibility-adjustable-worktop',

      name: 'Adjustable Worktop Concept',

      description:
        'A work-surface representation for exploring different working heights and access requirements.',

      category: 'accessibility',

      subcategory: 'Adjustable Worktops',

      materials: [
        'wood',
        'metal',
      ],

      colour: COLOURS.white,

      dimensions: {
        width: 1.2,
        height: 0.8,
        depth: 0.6,
      },

      accessibility: {
        adjustableHeight: true,

        complianceVerified: false,
      },

      featured: true,
    }),

    createStarterAsset({
      id: 'accessibility-shower-seat',

      name: 'Shower Seat Concept',

      description:
        'A seating representation for accessible shower-layout exploration.',

      category: 'accessibility',

      subcategory: 'Shower Seats',

      materials: [
        'plastic',
        'steel',
      ],

      colour: COLOURS.white,

      dimensions: {
        width: 0.48,
        height: 0.48,
        depth: 0.45,
      },

      accessibility: {
        complianceVerified: false,

        accessibilityNotes: [
          'Load capacity and suitability require verification.',
        ],
      },
    }),
  ];

/* ========================================
   ORIGINAL MATERIAL DEFINITIONS
======================================== */

const MATERIAL_ASSETS =
  [
    createStarterMaterial({
      id: 'material-natural-oak',

      name: 'Natural Oak',

      description:
        'A warm oak-coloured surface material for furniture and architectural elements.',

      subcategory: 'Solid Wood',

      family: 'wood',

      colour: COLOURS.oak,

      finish: 'oiled',

      roughness: 0.55,

      styles: [
        'country',
        'traditional',
        'scandinavian',
      ],

      featured: true,
    }),

    createStarterMaterial({
      id: 'material-dark-walnut',

      name: 'Dark Walnut',

      description:
        'A rich dark timber colour inspired by traditional walnut furniture.',

      subcategory: 'Solid Wood',

      family: 'wood',

      colour: COLOURS.walnut,

      finish: 'polished',

      roughness: 0.35,

      styles: [
        'traditional',
        'luxury',
        'art-deco',
      ],
    }),

    createStarterMaterial({
      id: 'material-white-marble',

      name: 'Ivory Marble Base',

      description:
        'An ivory marble-inspired base material. Veining textures will be added separately.',

      subcategory: 'Marble',

      family: 'marble',

      colour: COLOURS.cream,

      finish: 'polished',

      roughness: 0.18,

      styles: [
        'classical',
        'luxury',
      ],

      featured: true,
    }),

    createStarterMaterial({
      id: 'material-natural-limestone',

      name: 'Natural Limestone Base',

      description:
        'A muted natural limestone colour for historical and contemporary surfaces.',

      subcategory: 'Limestone',

      family: 'stone',

      colour: COLOURS.limestone,

      finish: 'natural',

      roughness: 0.85,

      styles: [
        'rustic',
        'mediterranean',
        'traditional',
      ],
    }),

    createStarterMaterial({
      id: 'material-dark-slate',

      name: 'Dark Slate Base',

      description:
        'A dark slate-coloured material suitable for visual surface studies.',

      subcategory: 'Slate',

      family: 'slate',

      colour: COLOURS.slate,

      finish: 'natural',

      roughness: 0.75,
    }),

    createStarterMaterial({
      id: 'material-traditional-brick',

      name: 'Traditional Red Brick Base',

      description:
        'A warm red masonry base colour. Brick pattern and mortar textures are pending.',

      subcategory: 'Brick',

      family: 'brick',

      colour: COLOURS.brick,

      finish: 'natural',

      roughness: 0.9,

      styles: [
        'industrial',
        'traditional',
        'rustic',
      ],
    }),

    createStarterMaterial({
      id: 'material-polished-concrete',

      name: 'Polished Concrete',

      description:
        'A smooth grey concrete-inspired material for modern surface concepts.',

      subcategory: 'Concrete',

      family: 'concrete',

      colour: COLOURS.grey,

      finish: 'polished',

      roughness: 0.25,

      styles: [
        'industrial',
        'brutalist',
        'modern',
      ],
    }),

    createStarterMaterial({
      id: 'material-antique-brass',

      name: 'Antique Brass',

      description:
        'A warm metallic brass-inspired surface for hardware and decorative details.',

      subcategory: 'Brass',

      family: 'brass',

      colour: COLOURS.brass,

      finish: 'patinated',

      roughness: 0.45,

      metallic: 1,

      featured: true,
    }),

    createStarterMaterial({
      id: 'material-aged-copper',

      name: 'Aged Copper',

      description:
        'A rich copper-coloured metallic surface.',

      subcategory: 'Copper',

      family: 'copper',

      colour: COLOURS.copper,

      finish: 'aged',

      roughness: 0.55,

      metallic: 1,
    }),

    createStarterMaterial({
      id: 'material-brushed-steel',

      name: 'Brushed Steel',

      description:
        'A neutral silver metallic surface for contemporary fittings and furniture.',

      subcategory: 'Steel',

      family: 'steel',

      colour: COLOURS.silver,

      finish: 'brushed',

      roughness: 0.4,

      metallic: 1,
    }),

    createStarterMaterial({
      id: 'material-clear-glass',

      name: 'Clear Glass',

      description:
        'A translucent material definition for glazing and decorative glass concepts.',

      subcategory: 'Glass',

      family: 'glass',

      colour: COLOURS.glass,

      finish: 'polished',

      roughness: 0.05,

      opacity: 0.2,
    }),

    createStarterMaterial({
      id: 'material-emerald-velvet',

      name: 'Emerald Velvet',

      description:
        'A deep green upholstery base material for luxurious and maximalist designs.',

      subcategory: 'Fabrics',

      family: 'velvet',

      colour: COLOURS.emerald,

      finish: 'matte',

      roughness: 0.85,

      styles: [
        'luxury',
        'maximalist',
        'art-deco',
      ],

      featured: true,
    }),

    createStarterMaterial({
      id: 'material-midnight-blue-paint',

      name: 'Midnight Blue Paint',

      description:
        'A rich dark blue paint colour for dramatic interior surfaces.',

      category: 'wall-coverings',

      subcategory: 'Matte Paint',

      family: 'paint',

      colour: COLOURS.blue,

      finish: 'matte',

      roughness: 0.9,

      featured: true,
    }),

    createStarterMaterial({
      id: 'material-rebel-pink-paint',

      name: 'Rebel Pink Paint',

      description:
        'A vibrant signature pink for bold creative spaces.',

      category: 'wall-coverings',

      subcategory: 'Matte Paint',

      family: 'paint',

      colour: COLOURS.pink,

      finish: 'matte',

      roughness: 0.9,

      styles: [
        'maximalist',
        'eclectic',
        'experimental',
      ],

      featured: true,
    }),

    createStarterMaterial({
      id: 'material-forest-green-paint',

      name: 'Forest Green Paint',

      description:
        'A rich natural green for cabinetry, furniture and interior walls.',

      category: 'wall-coverings',

      subcategory: 'Matte Paint',

      family: 'paint',

      colour: COLOURS.green,

      finish: 'matte',

      roughness: 0.9,
    }),

    createStarterMaterial({
      id: 'material-soft-white-paint',

      name: 'Soft White Paint',

      description:
        'A warm white base colour for walls, ceilings and furniture.',

      category: 'wall-coverings',

      subcategory: 'Matte Paint',

      family: 'paint',

      colour: COLOURS.white,

      finish: 'matte',

      roughness: 0.9,
    }),

    createStarterMaterial({
      id: 'material-midnight-black-paint',

      name: 'Midnight Black Paint',

      description:
        'A deep black paint colour for architectural details and dramatic interiors.',

      category: 'wall-coverings',

      subcategory: 'Satin Paint',

      family: 'paint',

      colour: COLOURS.black,

      finish: 'satin',

      roughness: 0.5,

      featured: true,
    }),

    createStarterMaterial({
      id: 'material-terracotta-flooring',

      name: 'Traditional Terracotta Flooring',

      description:
        'A warm terracotta flooring base material inspired by Mediterranean interiors.',

      category: 'flooring',

      subcategory: 'Terracotta Tiles',

      family: 'clay',

      colour: COLOURS.terracotta,

      finish: 'natural',

      roughness: 0.85,

      physicalWidthMetres: 0.3,

      physicalHeightMetres: 0.3,

      styles: [
        'mediterranean',
        'tuscan',
        'rustic',
      ],
    }),

    createStarterMaterial({
      id: 'material-oak-flooring',

      name: 'Natural Oak Flooring',

      description:
        'A warm timber flooring base material. Board patterns will be generated separately.',

      category: 'flooring',

      subcategory: 'Solid Hardwood',

      family: 'wood',

      colour: COLOURS.oak,

      finish: 'oiled',

      roughness: 0.55,

      physicalWidthMetres: 0.18,

      physicalHeightMetres: 1.2,

      featured: true,
    }),
  ];

/* ========================================
   COMPLETE STARTER CATALOGUE
======================================== */

export const STARTER_CATALOGUE:
  CatalogueAsset[] = [
    ...ARCHITECTURAL_ASSETS,

    ...FURNITURE_ASSETS,

    ...DECORATIVE_ASSETS,

    ...OPENING_ASSETS,

    ...FIXTURE_ASSETS,

    ...RESTORATION_ASSETS,

    ...LANDSCAPE_ASSETS,

    ...PLANT_ASSETS,

    ...ACCESSIBILITY_ASSETS,

    ...MATERIAL_ASSETS,
  ];

/* ========================================
   ASSET LOOKUP
======================================== */

export const STARTER_CATALOGUE_MAP =
  new Map<string, CatalogueAsset>(
    STARTER_CATALOGUE.map(
      (asset) => [
        asset.id,
        asset,
      ]
    )
  );

export function getStarterAsset(
  assetId: string
): CatalogueAsset | undefined {
  return STARTER_CATALOGUE_MAP.get(
    assetId
  );
}

/* ========================================
   STARTER CATALOGUE STATISTICS
======================================== */

export const STARTER_CATALOGUE_STATS = {
  totalAssets:
    STARTER_CATALOGUE.length,

  freeAssets:
    STARTER_CATALOGUE.filter(
      (asset) =>
        asset.access === 'free'
    ).length,

  featuredAssets:
    STARTER_CATALOGUE.filter(
      (asset) =>
        asset.featured
    ).length,

  categoriesRepresented:
    new Set(
      STARTER_CATALOGUE.map(
        (asset) => asset.category
      )
    ).size,

  materialAssets:
    MATERIAL_ASSETS.length,

  architecturalAssets:
    ARCHITECTURAL_ASSETS.length,

  furnitureAssets:
    FURNITURE_ASSETS.length,

  decorativeAssets:
    DECORATIVE_ASSETS.length,

  openingAssets:
    OPENING_ASSETS.length,

  fixtureAssets:
    FIXTURE_ASSETS.length,

  restorationAssets:
    RESTORATION_ASSETS.length,

  landscapeAssets:
    LANDSCAPE_ASSETS.length,

  plantAssets:
    PLANT_ASSETS.length,

  accessibilityAssets:
    ACCESSIBILITY_ASSETS.length,
};

/* ========================================
   BASIC CATALOGUE INTEGRITY CHECK
======================================== */

export function validateStarterCatalogue():
  string[] {
  const errors: string[] = [];

  const ids = new Set<string>();

  for (const asset of STARTER_CATALOGUE) {
    if (ids.has(asset.id)) {
      errors.push(
        `Duplicate asset ID: ${asset.id}`
      );
    }

    ids.add(asset.id);

    if (!asset.name.trim()) {
      errors.push(
        `Missing asset name: ${asset.id}`
      );
    }

    if (
      asset.compatibleStudios.length === 0
    ) {
      errors.push(
        `No compatible studios: ${asset.id}`
      );
    }

    const dimensions =
      asset.physicalProperties?.dimensions;

    if (dimensions) {
      const values = [
        dimensions.width,
        dimensions.height,
        dimensions.depth,
      ];

      if (
        values.some(
          (value) =>
            !Number.isFinite(value) ||
            value <= 0
        )
      ) {
        errors.push(
          `Invalid dimensions: ${asset.id}`
        );
      }
    }

    const material =
      asset.materialProperties;

    if (material) {
      const values = [
        material.roughness,
        material.metallic,
        material.opacity,
      ];

      if (
        values.some(
          (value) =>
            !Number.isFinite(value) ||
            value < 0 ||
            value > 1
        )
      ) {
        errors.push(
          `Invalid material properties: ${asset.id}`
        );
      }
    }
  }

  return errors;
}

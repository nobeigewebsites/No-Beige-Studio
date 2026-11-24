
import type {
  CatalogueCollection,
  CatalogueAsset,
} from '../types/catalogue';

import type {
  StudioId,
} from '../types/studio';

import {
  STARTER_CATALOGUE,
  STARTER_CATALOGUE_MAP,
} from './starterCatalogue';

/* ========================================
   NO BEIGE STUDIO
   Curated Catalogue Collections
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

const INTERIOR_STUDIOS: StudioId[] = [
  'architecture',
  'interior',
  'restoration',
  'creator',
];

const LANDSCAPE_STUDIOS: StudioId[] = [
  'architecture',
  'landscape',
  'restoration',
  'creator',
];

/* ========================================
   COLLECTION FACTORY
======================================== */

interface StarterCollectionInput {
  id: string;

  name: string;

  description: string;

  assetIds: string[];

  studios?: StudioId[];

  featured?: boolean;
}

function createCollection(
  input: StarterCollectionInput
): CatalogueCollection {
  return {
    id: input.id,

    slug: input.id,

    name: input.name,

    description: input.description,

    type: 'curated',

    assetIds: [
      ...new Set(input.assetIds),
    ],

    compatibleStudios: [
      ...(input.studios ?? ALL_STUDIOS),
    ],

    featured:
      input.featured ?? false,

    published: true,

    createdAt: CREATED_AT,

    updatedAt: CREATED_AT,
  };
}

/* ========================================
   HISTORICAL COLLECTIONS
======================================== */

const HISTORICAL_COLLECTIONS = [
  createCollection({
    id: 'collection-ancient-classical',

    name: 'Echoes of Antiquity',

    description:
      'Classical architectural forms, natural stone and decorative elements inspired by ancient civilisations.',

    studios: ALL_STUDIOS,

    featured: true,

    assetIds: [
      'architecture-classical-column',
      'architecture-rounded-arch',
      'material-natural-limestone',
      'material-white-marble',
      'decor-terracotta-vase',
      'water-classical-fountain',
      'landscape-terracotta-planter',
    ],
  }),

  createCollection({
    id: 'collection-medieval-gothic',

    name: 'Medieval and Gothic',

    description:
      'Dramatic architectural forms, exposed timber, dark finishes and historical furniture concepts.',

    studios: INTERIOR_STUDIOS,

    featured: true,

    assetIds: [
      'architecture-gothic-arch',
      'architecture-rounded-arch',
      'architecture-timber-beam',
      'furniture-four-poster-bed',
      'material-dark-walnut',
      'material-dark-slate',
      'material-natural-limestone',
      'material-midnight-black-paint',
      'salvage-reclaimed-door',
    ],
  }),

  createCollection({
    id: 'collection-renaissance',

    name: 'Renaissance Revival',

    description:
      'Classical proportions, decorative stonework, rich timber and Italian-inspired courtyard elements.',

    featured: true,

    assetIds: [
      'architecture-classical-column',
      'architecture-rounded-arch',
      'architecture-marble-fireplace',
      'decor-ornate-gold-mirror',
      'decor-terracotta-vase',
      'material-white-marble',
      'material-dark-walnut',
      'water-classical-fountain',
      'tree-olive-concept',
    ],
  }),

  createCollection({
    id: 'collection-tudor-jacobean',

    name: 'Tudor and Jacobean',

    description:
      'Heavy timber, traditional craftsmanship and historical design concepts inspired by early English interiors.',

    studios: INTERIOR_STUDIOS,

    assetIds: [
      'architecture-timber-beam',
      'furniture-four-poster-bed',
      'furniture-oak-dining-table',
      'furniture-dining-chair',
      'salvage-reclaimed-door',
      'material-dark-walnut',
      'material-natural-oak',
      'material-dark-slate',
      'material-natural-limestone',
    ],
  }),

  createCollection({
    id: 'collection-georgian-regency',

    name: 'Georgian Elegance',

    description:
      'Balanced proportions, classical details and refined furniture inspired by Georgian and Regency design.',

    studios: INTERIOR_STUDIOS,

    featured: true,

    assetIds: [
      'window-georgian-sash',
      'door-traditional-panelled',
      'architecture-marble-fireplace',
      'architecture-classical-column',
      'furniture-wingback-chair',
      'furniture-four-poster-bed',
      'lighting-classical-chandelier',
      'antique-grandfather-clock',
      'material-white-marble',
      'material-antique-brass',
      'material-soft-white-paint',
    ],
  }),

  createCollection({
    id: 'collection-victorian',

    name: 'Victorian Grandeur',

    description:
      'Rich colours, decorative architectural features, traditional furniture and period-inspired fittings.',

    studios: INTERIOR_STUDIOS,

    featured: true,

    assetIds: [
      'architecture-ceiling-rose',
      'architecture-marble-fireplace',
      'architecture-gothic-arch',
      'furniture-chesterfield-sofa',
      'furniture-wingback-chair',
      'furniture-vintage-writing-desk',
      'lighting-classical-chandelier',
      'decor-ornate-gold-mirror',
      'bathroom-clawfoot-bath',
      'antique-grandfather-clock',
      'salvage-antique-chair',
      'material-emerald-velvet',
      'material-dark-walnut',
      'material-antique-brass',
      'material-forest-green-paint',
    ],
  }),

  createCollection({
    id: 'collection-edwardian',

    name: 'Edwardian Charm',

    description:
      'Traditional craftsmanship, decorative details and lighter finishes inspired by early twentieth-century interiors.',

    studios: INTERIOR_STUDIOS,

    assetIds: [
      'architecture-ceiling-rose',
      'door-traditional-panelled',
      'furniture-vintage-writing-desk',
      'bathroom-clawfoot-bath',
      'salvage-vintage-dresser',
      'decor-vintage-wall-clock',
      'material-natural-oak',
      'material-soft-white-paint',
      'material-antique-brass',
    ],
  }),

  createCollection({
    id: 'collection-art-deco',

    name: 'The Art Deco Revival',

    description:
      'Geometric furniture, dramatic colours, luxurious materials and metallic finishes inspired by Art Deco design.',

    studios: INTERIOR_STUDIOS,

    featured: true,

    assetIds: [
      'furniture-art-deco-sideboard',
      'furniture-velvet-sofa',
      'lighting-art-deco-table-lamp',
      'decor-ornate-gold-mirror',
      'material-emerald-velvet',
      'material-antique-brass',
      'material-dark-walnut',
      'material-white-marble',
      'material-midnight-black-paint',
      'material-midnight-blue-paint',
    ],
  }),
];

/* ========================================
   INTERIOR DESIGN COLLECTIONS
======================================== */

const INTERIOR_COLLECTIONS = [
  createCollection({
    id: 'collection-maximalist',

    name: 'More Is More',

    description:
      'Bold colours, dramatic textures and unapologetic statement pieces for maximalist interiors.',

    studios: INTERIOR_STUDIOS,

    featured: true,

    assetIds: [
      'furniture-velvet-sofa',
      'furniture-rebel-accent-chair',
      'furniture-art-deco-sideboard',
      'decor-ornate-gold-mirror',
      'lighting-classical-chandelier',
      'lighting-art-deco-table-lamp',
      'material-emerald-velvet',
      'material-rebel-pink-paint',
      'material-midnight-blue-paint',
      'material-antique-brass',
      'material-midnight-black-paint',
    ],
  }),

  createCollection({
    id: 'collection-modern-minimalist',

    name: 'Modern Simplicity',

    description:
      'Clean lines, practical forms and understated materials for contemporary living.',

    studios: INTERIOR_STUDIOS,

    assetIds: [
      'furniture-modern-modular-sofa',
      'furniture-modern-double-bed',
      'window-modern-picture',
      'bathroom-modern-vanity',
      'lighting-industrial-pendant',
      'material-polished-concrete',
      'material-soft-white-paint',
      'material-clear-glass',
      'material-brushed-steel',
      'material-natural-oak',
    ],
  }),

  createCollection({
    id: 'collection-industrial',

    name: 'Industrial Edge',

    description:
      'Exposed materials, dark metalwork, concrete and practical furniture inspired by converted industrial spaces.',

    studios: INTERIOR_STUDIOS,

    featured: true,

    assetIds: [
      'furniture-industrial-bookcase',
      'lighting-industrial-pendant',
      'window-modern-picture',
      'furniture-modern-modular-sofa',
      'material-traditional-brick',
      'material-polished-concrete',
      'material-brushed-steel',
      'material-aged-copper',
      'material-midnight-black-paint',
      'material-dark-slate',
    ],
  }),

  createCollection({
    id: 'collection-country-cottage',

    name: 'Country Cottage',

    description:
      'Traditional timber, cottage-inspired furnishings, warm finishes and characterful architectural details.',

    featured: true,

    assetIds: [
      'architecture-timber-beam',
      'door-rustic-stable',
      'furniture-oak-dining-table',
      'furniture-dining-chair',
      'furniture-wingback-chair',
      'kitchen-shaker-base-unit',
      'kitchen-belfast-sink',
      'salvage-vintage-dresser',
      'material-natural-oak',
      'material-oak-flooring',
      'material-forest-green-paint',
      'material-soft-white-paint',
      'plant-lavender-concept',
    ],
  }),

  createCollection({
    id: 'collection-farmhouse',

    name: 'Farmhouse Living',

    description:
      'Practical furniture, traditional kitchen features and natural materials for relaxed rural interiors.',

    studios: INTERIOR_STUDIOS,

    assetIds: [
      'furniture-oak-dining-table',
      'furniture-dining-chair',
      'kitchen-shaker-base-unit',
      'kitchen-central-island',
      'kitchen-belfast-sink',
      'architecture-timber-beam',
      'salvage-vintage-dresser',
      'material-natural-oak',
      'material-oak-flooring',
      'material-soft-white-paint',
    ],
  }),

  createCollection({
    id: 'collection-mediterranean',

    name: 'Mediterranean Escape',

    description:
      'Sun-warmed colours, natural stone, terracotta and relaxed indoor-outdoor design inspired by Mediterranean spaces.',

    featured: true,

    assetIds: [
      'architecture-rounded-arch',
      'architecture-classical-column',
      'decor-terracotta-vase',
      'landscape-terracotta-planter',
      'landscape-timber-pergola',
      'outdoor-rattan-sofa',
      'water-classical-fountain',
      'tree-olive-concept',
      'plant-lavender-concept',
      'material-terracotta-flooring',
      'material-natural-limestone',
      'material-soft-white-paint',
    ],
  }),

  createCollection({
    id: 'collection-dark-luxury',

    name: 'Midnight Luxury',

    description:
      'Deep colours, luxurious upholstery, rich timber and dramatic metallic accents.',

    studios: INTERIOR_STUDIOS,

    featured: true,

    assetIds: [
      'furniture-velvet-sofa',
      'furniture-chesterfield-sofa',
      'furniture-four-poster-bed',
      'furniture-art-deco-sideboard',
      'decor-ornate-gold-mirror',
      'lighting-classical-chandelier',
      'material-midnight-blue-paint',
      'material-midnight-black-paint',
      'material-dark-walnut',
      'material-antique-brass',
      'material-emerald-velvet',
    ],
  }),

  createCollection({
    id: 'collection-natural-living',

    name: 'Natural Living',

    description:
      'Organic materials, natural colours and greenery for calm, nature-inspired spaces.',

    assetIds: [
      'furniture-oak-dining-table',
      'furniture-dining-chair',
      'decor-terracotta-vase',
      'plant-indoor-foliage',
      'outdoor-rattan-sofa',
      'material-natural-oak',
      'material-natural-limestone',
      'material-oak-flooring',
      'material-forest-green-paint',
      'material-terracotta-flooring',
    ],
  }),
];

/* ========================================
   RESTORATION COLLECTIONS
======================================== */

const RESTORATION_COLLECTIONS = [
  createCollection({
    id: 'collection-salvage-yard',

    name: 'The Salvage Yard',

    description:
      'Reclaimed and worn design concepts for exploring restoration, repair and creative reuse.',

    featured: true,

    assetIds: [
      'salvage-vintage-dresser',
      'salvage-reclaimed-door',
      'salvage-antique-chair',
      'architecture-timber-beam',
      'material-natural-oak',
      'material-dark-walnut',
      'material-aged-copper',
      'material-antique-brass',
    ],
  }),

  createCollection({
    id: 'collection-antique-treasures',

    name: 'Antique Treasures',

    description:
      'Historical furniture and decorative concepts inspired by treasured objects from earlier generations.',

    studios: INTERIOR_STUDIOS,

    featured: true,

    assetIds: [
      'antique-grandfather-clock',
      'salvage-antique-chair',
      'salvage-vintage-dresser',
      'furniture-vintage-writing-desk',
      'furniture-four-poster-bed',
      'decor-ornate-gold-mirror',
      'decor-vintage-wall-clock',
      'lighting-classical-chandelier',
    ],
  }),

  createCollection({
    id: 'collection-heritage-restoration',

    name: 'Preserving the Past',

    description:
      'Traditional architectural details, historical finishes and period-inspired elements for heritage restoration concepts.',

    studios: INTERIOR_STUDIOS,

    featured: true,

    assetIds: [
      'architecture-timber-beam',
      'architecture-rounded-arch',
      'architecture-gothic-arch',
      'architecture-ceiling-rose',
      'architecture-marble-fireplace',
      'window-georgian-sash',
      'door-traditional-panelled',
      'salvage-reclaimed-door',
      'material-natural-limestone',
      'material-traditional-brick',
      'material-dark-slate',
      'material-oak-flooring',
    ],
  }),

  createCollection({
    id: 'collection-upcycling',

    name: 'Reinvent and Reuse',

    description:
      'Combine existing furniture concepts with unexpected colours and finishes to explore creative transformations.',

    featured: true,

    assetIds: [
      'salvage-vintage-dresser',
      'salvage-antique-chair',
      'salvage-reclaimed-door',
      'furniture-vintage-writing-desk',
      'material-rebel-pink-paint',
      'material-forest-green-paint',
      'material-midnight-blue-paint',
      'material-midnight-black-paint',
      'material-antique-brass',
      'material-emerald-velvet',
    ],
  }),
];

/* ========================================
   LANDSCAPE COLLECTIONS
======================================== */

const LANDSCAPE_COLLECTIONS = [
  createCollection({
    id: 'collection-english-country-garden',

    name: 'English Country Garden',

    description:
      'Traditional garden structures, planting concepts and relaxed outdoor seating inspired by English country gardens.',

    studios: LANDSCAPE_STUDIOS,

    featured: true,

    assetIds: [
      'landscape-timber-pergola',
      'landscape-raised-planter',
      'outdoor-traditional-bench',
      'plant-lavender-concept',
      'plant-ornamental-grass',
      'tree-deciduous-concept',
      'water-natural-garden-pond',
      'material-natural-limestone',
      'material-natural-oak',
    ],
  }),

  createCollection({
    id: 'collection-italian-courtyard',

    name: 'Italian Courtyard',

    description:
      'Stone archways, terracotta planters, olive trees and classical water features inspired by Italian courtyards.',

    studios: LANDSCAPE_STUDIOS,

    featured: true,

    assetIds: [
      'architecture-rounded-arch',
      'architecture-classical-column',
      'landscape-timber-pergola',
      'landscape-terracotta-planter',
      'tree-olive-concept',
      'plant-lavender-concept',
      'water-classical-fountain',
      'outdoor-rattan-sofa',
      'material-terracotta-flooring',
      'material-natural-limestone',
    ],
  }),

  createCollection({
    id: 'collection-modern-outdoor',

    name: 'Contemporary Outdoor Living',

    description:
      'Modern outdoor seating, architectural planting and simple materials for contemporary exterior spaces.',

    studios: LANDSCAPE_STUDIOS,

    assetIds: [
      'outdoor-rattan-sofa',
      'landscape-timber-pergola',
      'landscape-raised-planter',
      'plant-ornamental-grass',
      'tree-deciduous-concept',
      'material-polished-concrete',
      'material-dark-slate',
      'material-midnight-black-paint',
    ],
  }),

  createCollection({
    id: 'collection-nature-inspired-garden',

    name: 'Closer to Nature',

    description:
      'Naturalistic garden concepts combining water, trees, planting and places to sit and enjoy the outdoors.',

    studios: LANDSCAPE_STUDIOS,

    featured: true,

    assetIds: [
      'water-natural-garden-pond',
      'tree-deciduous-concept',
      'plant-ornamental-grass',
      'plant-lavender-concept',
      'outdoor-traditional-bench',
      'landscape-raised-planter',
      'material-natural-limestone',
      'material-natural-oak',
    ],
  }),

  createCollection({
    id: 'collection-grow-your-own',

    name: 'Grow Your Own',

    description:
      'Starter garden elements for planning planting beds, growing spaces and practical outdoor layouts.',

    studios: LANDSCAPE_STUDIOS,

    assetIds: [
      'landscape-raised-planter',
      'landscape-terracotta-planter',
      'landscape-timber-pergola',
      'outdoor-traditional-bench',
      'plant-lavender-concept',
      'material-natural-oak',
    ],
  }),
];

/* ========================================
   PRACTICAL DESIGN COLLECTIONS
======================================== */

const PRACTICAL_COLLECTIONS = [
  createCollection({
    id: 'collection-kitchen-design',

    name: 'Kitchen Design Essentials',

    description:
      'Kitchen cabinets, work surfaces, sinks, furniture and finishes for exploring kitchen layouts.',

    studios: INTERIOR_STUDIOS,

    featured: true,

    assetIds: [
      'kitchen-shaker-base-unit',
      'kitchen-central-island',
      'kitchen-belfast-sink',
      'furniture-oak-dining-table',
      'furniture-dining-chair',
      'accessibility-adjustable-worktop',
      'lighting-industrial-pendant',
      'material-white-marble',
      'material-natural-oak',
      'material-forest-green-paint',
      'material-midnight-blue-paint',
      'material-brushed-steel',
    ],
  }),

  createCollection({
    id: 'collection-bathroom-design',

    name: 'Bathroom Design Essentials',

    description:
      'Traditional and contemporary bathroom fixtures, finishes and inclusive layout concepts.',

    studios: INTERIOR_STUDIOS,

    assetIds: [
      'bathroom-clawfoot-bath',
      'bathroom-modern-vanity',
      'bathroom-standard-toilet',
      'accessibility-wall-grab-rail',
      'accessibility-shower-seat',
      'decor-ornate-gold-mirror',
      'material-white-marble',
      'material-clear-glass',
      'material-brushed-steel',
      'material-dark-slate',
      'material-soft-white-paint',
    ],
  }),

  createCollection({
    id: 'collection-bedroom-design',

    name: 'Bedroom Retreats',

    description:
      'Furniture, lighting and materials for creating traditional, contemporary and dramatic bedroom concepts.',

    studios: INTERIOR_STUDIOS,

    assetIds: [
      'furniture-four-poster-bed',
      'furniture-modern-double-bed',
      'furniture-wingback-chair',
      'furniture-rebel-accent-chair',
      'lighting-art-deco-table-lamp',
      'decor-ornate-gold-mirror',
      'material-emerald-velvet',
      'material-midnight-blue-paint',
      'material-soft-white-paint',
      'material-oak-flooring',
    ],
  }),

  createCollection({
    id: 'collection-living-room',

    name: 'Living Room Essentials',

    description:
      'Seating, storage, lighting and decorative elements for exploring different living-room layouts.',

    studios: INTERIOR_STUDIOS,

    featured: true,

    assetIds: [
      'furniture-velvet-sofa',
      'furniture-chesterfield-sofa',
      'furniture-modern-modular-sofa',
      'furniture-wingback-chair',
      'furniture-rebel-accent-chair',
      'furniture-industrial-bookcase',
      'furniture-art-deco-sideboard',
      'architecture-marble-fireplace',
      'lighting-classical-chandelier',
      'decor-ornate-gold-mirror',
      'plant-indoor-foliage',
    ],
  }),

  createCollection({
    id: 'collection-accessible-living',

    name: 'Design for Everyone',

    description:
      'Inclusive design concepts for exploring step-free access, adjustable surfaces and supportive bathroom layouts. Regulatory compliance is not implied.',

    featured: true,

    assetIds: [
      'accessibility-wheelchair-ramp',
      'accessibility-wall-grab-rail',
      'accessibility-adjustable-worktop',
      'accessibility-shower-seat',
    ],
  }),

  createCollection({
    id: 'collection-architectural-essentials',

    name: 'Architectural Essentials',

    description:
      'Architectural elements, openings and surface materials for early building design and visual planning.',

    studios: INTERIOR_STUDIOS,

    featured: true,

    assetIds: [
      'architecture-classical-column',
      'architecture-rounded-arch',
      'architecture-gothic-arch',
      'architecture-timber-beam',
      'architecture-ceiling-rose',
      'door-traditional-panelled',
      'door-rustic-stable',
      'window-georgian-sash',
      'window-modern-picture',
      'material-traditional-brick',
      'material-natural-limestone',
      'material-polished-concrete',
      'material-clear-glass',
    ],
  }),
];

/* ========================================
   MATERIAL COLLECTIONS
======================================== */

const MATERIAL_COLLECTIONS = [
  createCollection({
    id: 'collection-natural-materials',

    name: 'Natural Material Palette',

    description:
      'Timber, stone and earth-inspired surface definitions for natural and traditional designs.',

    featured: true,

    assetIds: [
      'material-natural-oak',
      'material-dark-walnut',
      'material-natural-limestone',
      'material-white-marble',
      'material-dark-slate',
      'material-traditional-brick',
      'material-terracotta-flooring',
      'material-oak-flooring',
    ],
  }),

  createCollection({
    id: 'collection-metallic-finishes',

    name: 'Metallic Finishes',

    description:
      'Warm and cool metallic surface definitions for furniture, fittings and decorative details.',

    assetIds: [
      'material-antique-brass',
      'material-aged-copper',
      'material-brushed-steel',
    ],
  }),

  createCollection({
    id: 'collection-colour-library',

    name: 'Colour Without Apology',

    description:
      'Original paint colours ranging from dramatic dark shades to expressive statement colours and versatile neutrals.',

    featured: true,

    assetIds: [
      'material-midnight-blue-paint',
      'material-rebel-pink-paint',
      'material-forest-green-paint',
      'material-midnight-black-paint',
      'material-soft-white-paint',
    ],
  }),

  createCollection({
    id: 'collection-luxury-materials',

    name: 'Luxury Material Palette',

    description:
      'Rich timber, velvet, marble and metallic finishes for sophisticated and dramatic designs.',

    featured: true,

    assetIds: [
      'material-white-marble',
      'material-dark-walnut',
      'material-emerald-velvet',
      'material-antique-brass',
      'material-aged-copper',
      'material-clear-glass',
      'material-midnight-black-paint',
    ],
  }),
];

/* ========================================
   CREATIVE COLLECTIONS
======================================== */

const CREATIVE_COLLECTIONS = [
  createCollection({
    id: 'collection-no-beige-signature',

    name: 'The NO BEIGE Signature',

    description:
      'Expressive colours, dramatic furniture and unexpected combinations for designs that refuse to blend in.',

    featured: true,

    assetIds: [
      'furniture-rebel-accent-chair',
      'furniture-velvet-sofa',
      'furniture-art-deco-sideboard',
      'furniture-four-poster-bed',
      'decor-ornate-gold-mirror',
      'lighting-classical-chandelier',
      'material-rebel-pink-paint',
      'material-midnight-blue-paint',
      'material-midnight-black-paint',
      'material-emerald-velvet',
      'material-antique-brass',
    ],
  }),

  createCollection({
    id: 'collection-creative-experimentation',

    name: 'Break the Rules',

    description:
      'Mix historical architecture, modern furniture, reclaimed objects and unexpected materials to create something entirely your own.',

    featured: true,

    assetIds: [
      'architecture-gothic-arch',
      'architecture-classical-column',
      'furniture-modern-modular-sofa',
      'furniture-rebel-accent-chair',
      'furniture-industrial-bookcase',
      'salvage-antique-chair',
      'salvage-vintage-dresser',
      'decor-ornate-gold-mirror',
      'material-rebel-pink-paint',
      'material-polished-concrete',
      'material-aged-copper',
      'material-emerald-velvet',
    ],
  }),

  createCollection({
    id: 'collection-creator-workshop',

    name: 'The Creator Workshop',

    description:
      'Furniture concepts and material definitions for exploring custom colours, finishes, proportions and original design combinations.',

    studios: ALL_STUDIOS,

    featured: true,

    assetIds: [
      'furniture-dining-chair',
      'furniture-oak-dining-table',
      'furniture-rebel-accent-chair',
      'furniture-art-deco-sideboard',
      'furniture-vintage-writing-desk',
      'material-natural-oak',
      'material-dark-walnut',
      'material-emerald-velvet',
      'material-antique-brass',
      'material-aged-copper',
      'material-brushed-steel',
      'material-rebel-pink-paint',
      'material-forest-green-paint',
      'material-midnight-blue-paint',
    ],
  }),
];

/* ========================================
   COMPLETE COLLECTION REGISTRY
======================================== */

export const STARTER_COLLECTIONS:
  CatalogueCollection[] = [
    ...HISTORICAL_COLLECTIONS,

    ...INTERIOR_COLLECTIONS,

    ...RESTORATION_COLLECTIONS,

    ...LANDSCAPE_COLLECTIONS,

    ...PRACTICAL_COLLECTIONS,

    ...MATERIAL_COLLECTIONS,

    ...CREATIVE_COLLECTIONS,
  ];

/* ========================================
   COLLECTION GROUPS
======================================== */

export interface StarterCollectionGroup {
  id: string;

  name: string;

  description: string;

  colour: string;

  collectionIds: string[];
}

export const STARTER_COLLECTION_GROUPS:
  StarterCollectionGroup[] = [
    {
      id: 'historical',

      name: 'Through the Ages',

      description:
        'Explore historical influences and design traditions.',

      colour: '#b18aff',

      collectionIds:
        HISTORICAL_COLLECTIONS.map(
          (collection) => collection.id
        ),
    },

    {
      id: 'interiors',

      name: 'Find Your Style',

      description:
        'Discover different interior design personalities.',

      colour: '#ff9b36',

      collectionIds:
        INTERIOR_COLLECTIONS.map(
          (collection) => collection.id
        ),
    },

    {
      id: 'restoration',

      name: 'Restore and Reinvent',

      description:
        'Give historical and reclaimed design concepts a new life.',

      colour: '#b18aff',

      collectionIds:
        RESTORATION_COLLECTIONS.map(
          (collection) => collection.id
        ),
    },

    {
      id: 'landscape',

      name: 'Beyond the Walls',

      description:
        'Explore gardens, landscapes and outdoor living.',

      colour: '#a9e52c',

      collectionIds:
        LANDSCAPE_COLLECTIONS.map(
          (collection) => collection.id
        ),
    },

    {
      id: 'practical',

      name: 'Design Essentials',

      description:
        'Find practical starting points for everyday design projects.',

      colour: '#00d5e8',

      collectionIds:
        PRACTICAL_COLLECTIONS.map(
          (collection) => collection.id
        ),
    },

    {
      id: 'materials',

      name: 'Materials and Colour',

      description:
        'Explore surfaces, finishes and colour combinations.',

      colour: '#ff9b36',

      collectionIds:
        MATERIAL_COLLECTIONS.map(
          (collection) => collection.id
        ),
    },

    {
      id: 'creative',

      name: 'Creative Rebellion',

      description:
        'Experiment, personalise and create without conventional style boundaries.',

      colour: '#ff3d8d',

      collectionIds:
        CREATIVE_COLLECTIONS.map(
          (collection) => collection.id
        ),
    },
  ];

/* ========================================
   COLLECTION LOOKUP
======================================== */

export const STARTER_COLLECTION_MAP =
  new Map<string, CatalogueCollection>(
    STARTER_COLLECTIONS.map(
      (collection) => [
        collection.id,
        collection,
      ]
    )
  );

export function getStarterCollection(
  collectionId: string
): CatalogueCollection | undefined {
  return STARTER_COLLECTION_MAP.get(
    collectionId
  );
}

/* ========================================
   COLLECTION ASSETS
======================================== */

export function getStarterCollectionAssets(
  collectionId: string
): CatalogueAsset[] {
  const collection =
    getStarterCollection(collectionId);

  if (
    !collection ||
    !collection.published
  ) {
    return [];
  }

  return collection.assetIds
    .map(
      (assetId) =>
        STARTER_CATALOGUE_MAP.get(
          assetId
        )
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
   FEATURED COLLECTIONS
======================================== */

export function getFeaturedStarterCollections(
  limit?: number
): CatalogueCollection[] {
  const collections =
    STARTER_COLLECTIONS.filter(
      (collection) =>
        collection.featured &&
        collection.published
    );

  if (limit === undefined) {
    return collections;
  }

  return collections.slice(
    0,
    Math.max(
      0,
      Math.floor(limit)
    )
  );
}

/* ========================================
   STUDIO COLLECTIONS
======================================== */

export function getStarterStudioCollections(
  studioId: StudioId
): CatalogueCollection[] {
  return STARTER_COLLECTIONS.filter(
    (collection) =>
      collection.published &&
      collection.compatibleStudios.includes(
        studioId
      )
  );
}

export function getStarterCollectionStudioAssets(
  collectionId: string,
  studioId: StudioId
): CatalogueAsset[] {
  return getStarterCollectionAssets(
    collectionId
  ).filter(
    (asset) =>
      asset.compatibleStudios.includes(
        studioId
      )
  );
}

/* ========================================
   COLLECTION GROUP LOOKUP
======================================== */

export function getStarterCollectionGroup(
  groupId: string
): StarterCollectionGroup | undefined {
  return STARTER_COLLECTION_GROUPS.find(
    (group) =>
      group.id === groupId
  );
}

export function getStarterGroupCollections(
  groupId: string
): CatalogueCollection[] {
  const group =
    getStarterCollectionGroup(groupId);

  if (!group) {
    return [];
  }

  return group.collectionIds
    .map(
      (collectionId) =>
        STARTER_COLLECTION_MAP.get(
          collectionId
        )
    )
    .filter(
      (
        collection
      ): collection is CatalogueCollection =>
        collection !== undefined &&
        collection.published
    );
}

/* ========================================
   RELATED COLLECTIONS
======================================== */

export function getRelatedStarterCollections(
  collectionId: string,
  limit = 6
): CatalogueCollection[] {
  const collection =
    getStarterCollection(collectionId);

  if (!collection) {
    return [];
  }

  const assetIds =
    new Set(collection.assetIds);

  return STARTER_COLLECTIONS
    .filter(
      (candidate) =>
        candidate.id !== collectionId &&
        candidate.published
    )
    .map((candidate) => {
      const sharedAssets =
        candidate.assetIds.filter(
          (assetId) =>
            assetIds.has(assetId)
        ).length;

      const combinedAssets =
        new Set([
          ...collection.assetIds,
          ...candidate.assetIds,
        ]).size;

      const score =
        combinedAssets > 0
          ? sharedAssets / combinedAssets
          : 0;

      return {
        collection: candidate,
        score,
      };
    })
    .filter(
      (candidate) =>
        candidate.score > 0
    )
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.collection.name.localeCompare(
          b.collection.name
        )
    )
    .slice(
      0,
      Math.max(
        0,
        Math.floor(limit)
      )
    )
    .map(
      (candidate) =>
        candidate.collection
    );
}

/* ========================================
   COLLECTIONS CONTAINING AN ASSET
======================================== */

export function getCollectionsContainingAsset(
  assetId: string
): CatalogueCollection[] {
  return STARTER_COLLECTIONS.filter(
    (collection) =>
      collection.published &&
      collection.assetIds.includes(
        assetId
      )
  );
}

/* ========================================
   COLLECTION STATISTICS
======================================== */

const COLLECTION_ASSET_IDS =
  new Set(
    STARTER_COLLECTIONS.flatMap(
      (collection) =>
        collection.assetIds
    )
  );

export const STARTER_COLLECTION_STATS = {
  totalCollections:
    STARTER_COLLECTIONS.length,

  featuredCollections:
    STARTER_COLLECTIONS.filter(
      (collection) =>
        collection.featured
    ).length,

  historicalCollections:
    HISTORICAL_COLLECTIONS.length,

  interiorCollections:
    INTERIOR_COLLECTIONS.length,

  restorationCollections:
    RESTORATION_COLLECTIONS.length,

  landscapeCollections:
    LANDSCAPE_COLLECTIONS.length,

  practicalCollections:
    PRACTICAL_COLLECTIONS.length,

  materialCollections:
    MATERIAL_COLLECTIONS.length,

  creativeCollections:
    CREATIVE_COLLECTIONS.length,

  collectionGroups:
    STARTER_COLLECTION_GROUPS.length,

  totalAssetReferences:
    STARTER_COLLECTIONS.reduce(
      (total, collection) =>
        total + collection.assetIds.length,
      0
    ),

  uniqueReferencedAssets:
    COLLECTION_ASSET_IDS.size,

  unassignedAssets:
    STARTER_CATALOGUE.filter(
      (asset) =>
        !COLLECTION_ASSET_IDS.has(
          asset.id
        )
    ).length,
};

/* ========================================
   COLLECTION INTEGRITY VALIDATION
======================================== */

export function validateStarterCollections():
  string[] {
  const errors: string[] = [];

  const collectionIds =
    new Set<string>();

  const collectionSlugs =
    new Set<string>();

  const groupIds =
    new Set<string>();

  const groupedCollectionIds =
    new Set<string>();

  for (
    const collection of STARTER_COLLECTIONS
  ) {
    if (
      collectionIds.has(collection.id)
    ) {
      errors.push(
        `Duplicate collection ID: ${collection.id}`
      );
    }

    collectionIds.add(
      collection.id
    );

    if (
      collectionSlugs.has(
        collection.slug
      )
    ) {
      errors.push(
        `Duplicate collection slug: ${collection.slug}`
      );
    }

    collectionSlugs.add(
      collection.slug
    );

    if (
      !collection.name.trim()
    ) {
      errors.push(
        `Missing collection name: ${collection.id}`
      );
    }

    if (
      !collection.description.trim()
    ) {
      errors.push(
        `Missing collection description: ${collection.id}`
      );
    }

    if (
      collection.assetIds.length === 0
    ) {
      errors.push(
        `Empty collection: ${collection.id}`
      );
    }

    if (
      collection.compatibleStudios.length === 0
    ) {
      errors.push(
        `Collection has no compatible studios: ${collection.id}`
      );
    }

    const seenAssetIds =
      new Set<string>();

    for (
      const assetId of collection.assetIds
    ) {
      if (
        seenAssetIds.has(assetId)
      ) {
        errors.push(
          `Duplicate asset reference ${assetId} in ${collection.id}`
        );
      }

      seenAssetIds.add(assetId);

      const asset =
        STARTER_CATALOGUE_MAP.get(
          assetId
        );

      if (!asset) {
        errors.push(
          `Missing asset ${assetId} in ${collection.id}`
        );

        continue;
      }

      if (
        collection.published &&
        (
          !asset.published ||
          asset.access === 'private'
        )
      ) {
        errors.push(
          `Unavailable asset ${assetId} in published collection ${collection.id}`
        );
      }

      const compatible =
        collection.compatibleStudios.some(
          (studioId) =>
            asset.compatibleStudios.includes(
              studioId
            )
        );

      if (!compatible) {
        errors.push(
          `Incompatible asset ${assetId} in ${collection.id}`
        );
      }
    }
  }

  for (
    const group of STARTER_COLLECTION_GROUPS
  ) {
    if (
      groupIds.has(group.id)
    ) {
      errors.push(
        `Duplicate collection group: ${group.id}`
      );
    }

    groupIds.add(group.id);

    if (
      group.collectionIds.length === 0
    ) {
      errors.push(
        `Empty collection group: ${group.id}`
      );
    }

    for (
      const collectionId of group.collectionIds
    ) {
      if (
        !collectionIds.has(collectionId)
      ) {
        errors.push(
          `Unknown collection ${collectionId} in group ${group.id}`
        );
      }

      if (
        groupedCollectionIds.has(
          collectionId
        )
      ) {
        errors.push(
          `Collection assigned to multiple starter groups: ${collectionId}`
        );
      }

      groupedCollectionIds.add(
        collectionId
      );
    }
  }

  for (
    const collection of STARTER_COLLECTIONS
  ) {
    if (
      !groupedCollectionIds.has(
        collection.id
      )
    ) {
      errors.push(
        `Collection not assigned to a group: ${collection.id}`
      );
    }
  }

  return errors;
}


import type {
  StudioDefinition,
  StudioId,
} from '../types/studio';

/* ========================================
   NO BEIGE STUDIO
   Central Studio Registry
======================================== */

export const STUDIOS: StudioDefinition[] = [
  {
    id: 'architecture',
    name: 'Architecture Studio',
    shortName: 'Architecture',

    description:
      'Design buildings, explore layouts and transform architectural ideas into immersive spaces.',

    tagline:
      'From the first line to the final structure.',

    route: '/studio/architecture',
    colour: '#00D5E8',

    gradient:
      'linear-gradient(135deg, #063B49, #101827)',

    image: 'images/studios/architecture.webp',

    freeFeatures: [
      '2D floor plan design',
      'Interactive 3D visualisation',
      'Walls, doors and windows',
      'Room creation and editing',
      'Basic dimensions and measurements',
      'Multi-storey project design',
      'Core architectural catalogue',
      'Basic accessibility planning',
      'Project saving',
      'Basic image and plan exports',
    ],

    advancedFeatures: [
      'Advanced technical drawings',
      'Professional CAD exports',
      'Advanced roof design',
      'Structural modelling tools',
      'Building information modelling',
      'Advanced accessibility analysis',
      'Energy performance modelling',
      'Professional documentation',
      'Advanced rendering',
    ],
  },

  {
    id: 'interior',
    name: 'Interior Design Studio',
    shortName: 'Interior Design',

    description:
      'Create extraordinary interiors with furniture, colours, textures, lighting and materials from across the ages.',

    tagline:
      'Your space. Your rules. Absolutely no beige required.',

    route: '/studio/interior',
    colour: '#FF9B36',

    gradient:
      'linear-gradient(135deg, #503019, #101827)',

    image: 'images/studios/interior.webp',

    freeFeatures: [
      '2D room layouts',
      'Interactive 3D room design',
      'Furniture placement',
      'Wall and floor finishes',
      'Colour customisation',
      'Core furniture catalogue',
      'Basic lighting controls',
      'Mood boards',
      'Basic project budgeting',
      'Project saving and basic exports',
    ],

    advancedFeatures: [
      'Photorealistic rendering',
      'Advanced lighting simulation',
      'Custom material creation',
      'Advanced fabric simulation',
      'Professional specification sheets',
      'Detailed purchasing schedules',
      'Advanced cost estimation',
      'Expanded premium collections',
    ],
  },

  {
    id: 'restoration',
    name: 'Restoration Studio',
    shortName: 'Restoration',

    description:
      'Preserve architectural character, restore historic properties and breathe new life into forgotten treasures.',

    tagline:
      'The past deserves a future.',

    route: '/studio/restoration',
    colour: '#B18AFF',

    gradient:
      'linear-gradient(135deg, #39275D, #101827)',

    image: 'images/studios/restoration.webp',

    freeFeatures: [
      'Historic property design',
      'Before and after visualisation',
      'Period furniture catalogue',
      'Traditional materials catalogue',
      'Restoration project planning',
      'Basic condition recording',
      'Salvaged item placement',
      'Historical design references',
      'Basic restoration budgeting',
      'Project saving and basic exports',
    ],

    advancedFeatures: [
      'Detailed conservation records',
      'Advanced condition mapping',
      'Historical reconstruction tools',
      'Restoration phase management',
      'Material deterioration modelling',
      'Professional conservation reports',
      'Advanced salvage inventory',
      'Specialist heritage collections',
    ],
  },

  {
    id: 'landscape',
    name: 'Landscape Studio',
    shortName: 'Landscape',

    description:
      'Design gardens, landscapes and outdoor environments that work beautifully with nature and architecture.',

    tagline:
      'Creativity grows beyond four walls.',

    route: '/studio/landscape',
    colour: '#A9E52C',

    gradient:
      'linear-gradient(135deg, #304B1C, #101827)',

    image: 'images/studios/landscape.webp',

    freeFeatures: [
      '2D garden planning',
      'Interactive 3D landscapes',
      'Plant and tree placement',
      'Paths and patios',
      'Outdoor furniture',
      'Basic terrain editing',
      'Garden structures',
      'Core planting catalogue',
      'Basic landscape budgeting',
      'Project saving and basic exports',
    ],

    advancedFeatures: [
      'Advanced terrain modelling',
      'Seasonal planting simulation',
      'Plant growth visualisation',
      'Sunlight and shade analysis',
      'Irrigation planning',
      'Drainage planning',
      'Advanced planting schedules',
      'Professional landscape documentation',
    ],
  },

  {
    id: 'creator',
    name: 'Creator Studio',
    shortName: 'Creator Studio',

    description:
      'Design original furniture, decorative objects, materials and architectural elements for your own projects or the marketplace.',

    tagline:
      'If it does not exist, create it.',

    route: '/studio/creator',
    colour: '#FF3D8D',

    gradient:
      'linear-gradient(135deg, #592344, #101827)',

    image: 'images/studios/creator.webp',

    freeFeatures: [
      'Basic 3D object creation',
      'Furniture design',
      'Decorative object design',
      'Shape editing',
      'Colour and material editing',
      'Basic texture uploads',
      'Personal asset library',
      'Use creations across all studios',
      'Share original creations',
      'Basic model exports',
    ],

    advancedFeatures: [
      'Advanced mesh editing',
      'Parametric furniture design',
      'Advanced texture mapping',
      'Procedural material creation',
      'Advanced model imports and exports',
      'Professional manufacturing drawings',
      'Detailed component specifications',
      'Advanced rendering tools',
    ],
  },
];

/* ========================================
   STUDIO LOOKUP
======================================== */

export const STUDIO_MAP = Object.fromEntries(
  STUDIOS.map((studio) => [studio.id, studio])
) as Record<StudioId, StudioDefinition>;

export function getStudio(
  studioId: StudioId
): StudioDefinition {
  return STUDIO_MAP[studioId];
}

export function isStudioId(
  value: unknown
): value is StudioId {
  return (
    typeof value === 'string' &&
    Object.prototype.hasOwnProperty.call(
      STUDIO_MAP,
      value
    )
  );
}

/* ========================================
   PLATFORM PRINCIPLES
======================================== */

export const PLATFORM_PRINCIPLES = {
  name: 'NO BEIGE STUDIO',

  tagline: 'Design Without Limits',

  pricingMotto:
    'Pay for what you need. Not what you don’t.',

  freeForever: true,
  modularUpgrades: true,
  basicSavingIncluded: true,
  basicExportsIncluded: true,
  connectedStudios: true,
  accessibleByDesign: true,
  browserFirst: true,
  deviceIndependent: true,
  noForcedBundles: true,
  noProjectLockIn: true,
} as const;

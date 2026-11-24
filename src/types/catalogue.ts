
import type {
  StudioId,
  Dimensions3D,
  CurrencyCode,
} from './studio';

/* ========================================
   NO BEIGE STUDIO
   Universal Catalogue Type System
======================================== */

/* ========================================
   PRIMARY ASSET CATEGORIES
======================================== */

export type AssetCategory =
  | 'architecture'
  | 'structural'
  | 'furniture'
  | 'lighting'
  | 'decor'
  | 'materials'
  | 'flooring'
  | 'wall-coverings'
  | 'ceiling-finishes'
  | 'doors'
  | 'windows'
  | 'kitchens'
  | 'bathrooms'
  | 'appliances'
  | 'textiles'
  | 'hardware'
  | 'antiques'
  | 'salvage'
  | 'heritage'
  | 'plants'
  | 'trees'
  | 'landscape'
  | 'outdoor-furniture'
  | 'water-features'
  | 'accessibility'
  | 'utilities'
  | 'custom'
  | 'other';

/* ========================================
   HISTORICAL PERIODS
======================================== */

export type HistoricalPeriod =
  | 'prehistoric'
  | 'ancient-egyptian'
  | 'ancient-greek'
  | 'ancient-roman'
  | 'ancient-asian'
  | 'byzantine'
  | 'medieval'
  | 'gothic'
  | 'renaissance'
  | 'tudor'
  | 'elizabethan'
  | 'jacobean'
  | 'baroque'
  | 'rococo'
  | 'georgian'
  | 'regency'
  | 'victorian'
  | 'edwardian'
  | 'arts-and-crafts'
  | 'art-nouveau'
  | 'art-deco'
  | 'bauhaus'
  | 'mid-century'
  | '1920s'
  | '1930s'
  | '1940s'
  | '1950s'
  | '1960s'
  | '1970s'
  | '1980s'
  | '1990s'
  | '2000s'
  | '2010s'
  | '2020s'
  | 'contemporary'
  | 'futuristic'
  | 'timeless'
  | 'unknown';

/* ========================================
   DESIGN STYLES
======================================== */

export type DesignStyle =
  | 'traditional'
  | 'classical'
  | 'modern'
  | 'contemporary'
  | 'minimalist'
  | 'maximalist'
  | 'industrial'
  | 'rustic'
  | 'country'
  | 'cottagecore'
  | 'farmhouse'
  | 'bohemian'
  | 'eclectic'
  | 'scandinavian'
  | 'japandi'
  | 'mediterranean'
  | 'tuscan'
  | 'moroccan'
  | 'african-inspired'
  | 'asian-inspired'
  | 'coastal'
  | 'tropical'
  | 'gothic'
  | 'victorian'
  | 'georgian'
  | 'art-deco'
  | 'art-nouveau'
  | 'mid-century-modern'
  | 'retro'
  | 'vintage'
  | 'shabby-chic'
  | 'brutalist'
  | 'organic'
  | 'biophilic'
  | 'luxury'
  | 'steampunk'
  | 'cyberpunk'
  | 'futuristic'
  | 'fantasy'
  | 'experimental'
  | 'custom';

/* ========================================
   MATERIAL CLASSIFICATIONS
======================================== */

export type MaterialFamily =
  | 'wood'
  | 'engineered-wood'
  | 'stone'
  | 'marble'
  | 'granite'
  | 'slate'
  | 'brick'
  | 'concrete'
  | 'cement'
  | 'plaster'
  | 'lime'
  | 'clay'
  | 'ceramic'
  | 'porcelain'
  | 'glass'
  | 'metal'
  | 'steel'
  | 'iron'
  | 'copper'
  | 'brass'
  | 'bronze'
  | 'aluminium'
  | 'fabric'
  | 'leather'
  | 'wool'
  | 'cotton'
  | 'linen'
  | 'silk'
  | 'velvet'
  | 'bamboo'
  | 'rattan'
  | 'cork'
  | 'rubber'
  | 'plastic'
  | 'resin'
  | 'composite'
  | 'paper'
  | 'paint'
  | 'wallpaper'
  | 'soil'
  | 'sand'
  | 'gravel'
  | 'organic'
  | 'recycled'
  | 'reclaimed'
  | 'mixed'
  | 'custom';

/* ========================================
   COLOUR CLASSIFICATIONS
======================================== */

export type ColourFamily =
  | 'black'
  | 'white'
  | 'grey'
  | 'cream'
  | 'beige'
  | 'brown'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'cyan'
  | 'purple'
  | 'pink'
  | 'gold'
  | 'silver'
  | 'copper'
  | 'multicolour'
  | 'transparent'
  | 'natural'
  | 'custom';

export interface AssetColour {
  name: string;
  hex: string;
  family: ColourFamily;
  manufacturerCode?: string;
}

/* ========================================
   SURFACE FINISHES
======================================== */

export type SurfaceFinish =
  | 'natural'
  | 'unfinished'
  | 'matte'
  | 'satin'
  | 'silk'
  | 'gloss'
  | 'high-gloss'
  | 'polished'
  | 'brushed'
  | 'hammered'
  | 'textured'
  | 'distressed'
  | 'weathered'
  | 'aged'
  | 'patinated'
  | 'painted'
  | 'stained'
  | 'oiled'
  | 'waxed'
  | 'varnished'
  | 'lacquered'
  | 'glazed'
  | 'unsealed'
  | 'sealed'
  | 'custom';

/* ========================================
   ASSET CONDITION
======================================== */

export type AssetCondition =
  | 'new'
  | 'like-new'
  | 'excellent'
  | 'good'
  | 'fair'
  | 'worn'
  | 'damaged'
  | 'salvaged'
  | 'reclaimed'
  | 'requires-restoration'
  | 'partially-restored'
  | 'fully-restored'
  | 'unknown';

/* ========================================
   ASSET ORIGIN
======================================== */

export type AssetSource =
  | 'studio-original'
  | 'licensed-library'
  | 'manufacturer'
  | 'community'
  | 'user-upload'
  | 'creator-marketplace'
  | 'public-domain'
  | 'open-source'
  | 'procedural';

/* ========================================
   LICENSING AND OWNERSHIP
======================================== */

export type AssetLicence =
  | 'studio-standard'
  | 'studio-commercial'
  | 'public-domain'
  | 'cc0'
  | 'cc-by'
  | 'cc-by-sa'
  | 'cc-by-nc'
  | 'cc-by-nc-sa'
  | 'cc-by-nd'
  | 'cc-by-nc-nd'
  | 'manufacturer-specific'
  | 'creator-specific'
  | 'personal-use'
  | 'commercial-use'
  | 'custom'
  | 'unknown';

export interface AssetLicensing {
  licence: AssetLicence;

  copyrightHolder?: string;
  creatorName?: string;
  attributionText?: string;

  sourceUrl?: string;
  licenceUrl?: string;

  personalUseAllowed: boolean;
  commercialUseAllowed: boolean;
  modificationAllowed: boolean;
  redistributionAllowed: boolean;
  resaleAllowed: boolean;

  attributionRequired: boolean;
  shareAlikeRequired?: boolean;

  licenceVerified: boolean;
  verifiedAt?: string;

  restrictions?: string[];
}

/* ========================================
   ASSET ACCESS AND PRICING
======================================== */

export type AssetAccess =
  | 'free'
  | 'premium'
  | 'marketplace'
  | 'private';

export type AssetPriceUnit =
  | 'item'
  | 'set'
  | 'pack'
  | 'roll'
  | 'sheet'
  | 'tile'
  | 'linear-metre'
  | 'square-metre'
  | 'cubic-metre'
  | 'kilogram'
  | 'litre'
  | 'custom';

export interface AssetPrice {
  amount: number;
  currency: CurrencyCode;
  unit: AssetPriceUnit;

  estimated: boolean;

  minimumAmount?: number;
  maximumAmount?: number;

  supplierName?: string;
  supplierUrl?: string;

  updatedAt?: string;
}

/* ========================================
   MEDIA AND PREVIEW FILES
======================================== */

export type AssetMediaType =
  | 'thumbnail'
  | 'image'
  | 'reference'
  | 'floor-plan'
  | 'technical-drawing'
  | 'texture'
  | 'model'
  | 'video';

export interface AssetMedia {
  id: string;
  type: AssetMediaType;

  url: string;
  altText: string;

  width?: number;
  height?: number;

  mimeType?: string;
  fileSizeBytes?: number;

  attribution?: string;
}

/* ========================================
   3D MODEL FORMATS
======================================== */

export type ModelFormat =
  | 'glb'
  | 'gltf'
  | 'obj'
  | 'fbx'
  | 'stl'
  | 'dae'
  | 'babylon'
  | 'usdz'
  | 'ply'
  | 'ifc'
  | 'procedural';

export type ModelQuality =
  | 'preview'
  | 'lightweight'
  | 'standard'
  | 'high-quality'
  | 'professional';

export interface AssetModel {
  id: string;

  format: ModelFormat;
  quality: ModelQuality;

  url?: string;

  proceduralGeneratorId?: string;

  polygonCount?: number;
  vertexCount?: number;
  fileSizeBytes?: number;

  textureResolution?: number;

  dimensions?: Dimensions3D;

  hasAnimations?: boolean;
  hasMaterials?: boolean;
  hasCollisionGeometry?: boolean;

  recommendedForMobile: boolean;
  recommendedForLightweightMode: boolean;
}

/* ========================================
   2D REPRESENTATIONS
======================================== */

export type AssetSymbolFormat =
  | 'svg'
  | 'png'
  | 'webp'
  | 'dxf'
  | 'procedural';

export type AssetSymbolView =
  | 'top'
  | 'front'
  | 'rear'
  | 'left'
  | 'right'
  | 'section';

export interface AssetSymbol {
  id: string;

  format: AssetSymbolFormat;
  view: AssetSymbolView;

  url?: string;
  proceduralGeneratorId?: string;

  widthMetres?: number;
  heightMetres?: number;

  scalable: boolean;
}

/* ========================================
   PHYSICALLY BASED MATERIALS
======================================== */

export interface TextureMap {
  url: string;

  resolution?: number;
  fileSizeBytes?: number;

  seamless?: boolean;
}

export interface MaterialTextureSet {
  baseColour?: TextureMap;
  normal?: TextureMap;
  roughness?: TextureMap;
  metallic?: TextureMap;
  ambientOcclusion?: TextureMap;
  displacement?: TextureMap;
  opacity?: TextureMap;
  emissive?: TextureMap;
}

export interface MaterialProperties {
  family: MaterialFamily;

  colour: AssetColour;
  finish: SurfaceFinish;

  roughness: number;
  metallic: number;
  opacity: number;

  emissiveColour?: string;
  emissiveIntensity?: number;

  normalStrength?: number;
  displacementStrength?: number;

  reflectivity?: number;
  indexOfRefraction?: number;

  textureScaleX?: number;
  textureScaleY?: number;

  textureRotation?: number;

  physicalWidthMetres?: number;
  physicalHeightMetres?: number;

  doubleSided?: boolean;

  textures?: MaterialTextureSet;
}

/* ========================================
   PHYSICAL ASSET PROPERTIES
======================================== */

export interface AssetPhysicalProperties {
  dimensions?: Dimensions3D;

  minimumDimensions?: Dimensions3D;
  maximumDimensions?: Dimensions3D;

  weightKg?: number;
  densityKgPerCubicMetre?: number;

  loadCapacityKg?: number;

  thicknessMetres?: number;

  adjustableDimensions: boolean;

  resizableWidth: boolean;
  resizableHeight: boolean;
  resizableDepth: boolean;

  rotationAllowed: boolean;

  indoorSuitable?: boolean;
  outdoorSuitable?: boolean;

  weatherResistant?: boolean;
  waterResistant?: boolean;
  heatResistant?: boolean;

  fireRating?: string;

  structuralUse?: boolean;

  technicalSpecificationsVerified?: boolean;
  technicalSourceUrl?: string;
}

/* ========================================
   ASSET PLACEMENT RULES
======================================== */

export type PlacementSurface =
  | 'floor'
  | 'wall'
  | 'ceiling'
  | 'roof'
  | 'ground'
  | 'water'
  | 'tabletop'
  | 'shelf'
  | 'inside-object'
  | 'free-placement';

export interface AssetPlacement {
  allowedSurfaces: PlacementSurface[];

  defaultSurface: PlacementSurface;

  snapToGrid: boolean;
  snapToWall: boolean;
  snapToSurface: boolean;

  allowOverlap: boolean;
  allowFreeRotation: boolean;

  defaultRotationDegrees?: number;
  defaultElevationMetres?: number;

  minimumClearanceMetres?: number;

  requiredSupport?: boolean;

  collisionEnabled: boolean;
}

/* ========================================
   HISTORICAL AND CULTURAL INFORMATION
======================================== */

export interface AssetHeritageInformation {
  periods: HistoricalPeriod[];

  estimatedYearFrom?: number;
  estimatedYearTo?: number;

  region?: string;
  countryOfOrigin?: string;

  culturalTradition?: string;

  historicalDescription?: string;
  historicalSignificance?: string;

  originalMaterials?: MaterialFamily[];

  reproduction: boolean;
  originalAntique: boolean;

  provenanceVerified: boolean;

  provenanceNotes?: string;

  referenceUrls?: string[];

  conservationConsiderations?: string[];
}

/* ========================================
   RESTORATION AND SALVAGE
======================================== */

export type RestorationProcess =
  | 'cleaning'
  | 'stripping'
  | 'sanding'
  | 'repairing'
  | 'rebuilding'
  | 'reupholstering'
  | 'repainting'
  | 'staining'
  | 'polishing'
  | 'waxing'
  | 'oiling'
  | 'varnishing'
  | 'reglazing'
  | 'repointing'
  | 'conservation'
  | 'replacement'
  | 'custom';

export interface RestorationStep {
  id: string;

  name: string;
  description: string;

  process: RestorationProcess;

  estimatedHours?: number;

  requiredMaterials?: string[];
  requiredTools?: string[];

  estimatedCost?: AssetPrice;

  specialistRecommended?: boolean;

  safetyNotes?: string[];
}

export interface AssetRestorationInformation {
  condition: AssetCondition;

  conditionDescription?: string;

  salvageable: boolean;
  restorationPossible: boolean;

  restorationDifficulty?:
    | 'beginner'
    | 'intermediate'
    | 'advanced'
    | 'specialist';

  restorationSteps?: RestorationStep[];

  originalValue?: AssetPrice;
  currentValue?: AssetPrice;
  estimatedRestoredValue?: AssetPrice;

  estimatedRestorationCost?: AssetPrice;

  originalAssetId?: string;
  restoredVariantIds?: string[];
}

/* ========================================
   PLANT AND LANDSCAPE INFORMATION
======================================== */

export type PlantLifecycle =
  | 'annual'
  | 'biennial'
  | 'perennial'
  | 'evergreen'
  | 'deciduous';

export type PlantSunlight =
  | 'full-sun'
  | 'partial-sun'
  | 'partial-shade'
  | 'full-shade';

export type PlantWaterRequirement =
  | 'very-low'
  | 'low'
  | 'moderate'
  | 'high'
  | 'aquatic';

export type PlantSeason =
  | 'spring'
  | 'summer'
  | 'autumn'
  | 'winter';

export interface AssetPlantInformation {
  commonName: string;

  scientificName?: string;
  cultivar?: string;

  lifecycle?: PlantLifecycle;

  sunlight: PlantSunlight[];

  waterRequirement?: PlantWaterRequirement;

  suitableSoilTypes?: string[];

  minimumSoilPh?: number;
  maximumSoilPh?: number;

  matureHeightMetres?: number;
  matureSpreadMetres?: number;

  recommendedSpacingMetres?: number;

  growthRate?:
    | 'slow'
    | 'moderate'
    | 'fast';

  floweringSeasons?: PlantSeason[];
  floweringColours?: ColourFamily[];

  plantingSeasons?: PlantSeason[];

  hardinessRating?: string;
  climateZones?: string[];

  nativeRegions?: string[];

  evergreen?: boolean;
  droughtTolerant?: boolean;

  wildlifeFriendly?: boolean;
  pollinatorFriendly?: boolean;

  edible?: boolean;

  potentiallyToxicToHumans?: boolean;
  potentiallyToxicToCats?: boolean;
  potentiallyToxicToDogs?: boolean;

  toxicityInformationVerified?: boolean;

  invasiveRegions?: string[];

  careInstructions?: string[];

  referenceUrls?: string[];
}

/* ========================================
   ACCESSIBLE DESIGN INFORMATION
======================================== */

export interface AssetAccessibilityInformation {
  wheelchairCompatible?: boolean;

  adjustableHeight?: boolean;

  accessibleControls?: boolean;
  lowReachControls?: boolean;

  slipResistant?: boolean;

  highContrastAvailable?: boolean;

  tactileFeatures?: boolean;

  suitableForLimitedMobility?: boolean;

  clearOpeningWidthMetres?: number;
  clearOpeningHeightMetres?: number;

  requiredApproachWidthMetres?: number;
  requiredApproachDepthMetres?: number;

  minimumTurningSpaceMetres?: number;

  transferSpaceRequired?: boolean;

  applicableStandards?: string[];

  complianceVerified?: boolean;

  verificationRegion?: string;
  verificationSourceUrl?: string;

  accessibilityNotes?: string[];
}

/* ========================================
   SUSTAINABILITY INFORMATION
======================================== */

export interface AssetSustainabilityInformation {
  reclaimed?: boolean;
  recycled?: boolean;
  recyclable?: boolean;

  renewableMaterials?: boolean;

  locallySourced?: boolean;
  biodegradable?: boolean;

  repairable?: boolean;

  recycledContentPercentage?: number;

  embodiedCarbonKgCO2e?: number;

  expectedLifespanYears?: number;

  certifications?: string[];

  manufacturerClaimsVerified?: boolean;

  environmentalNotes?: string[];
}

/* ========================================
   CUSTOMISATION OPTIONS
======================================== */

export interface AssetVariant {
  id: string;

  name: string;
  description?: string;

  colours?: AssetColour[];

  materials?: MaterialFamily[];

  finish?: SurfaceFinish;

  dimensions?: Dimensions3D;

  thumbnailUrl?: string;

  modelId?: string;

  price?: AssetPrice;
}

export interface AssetCustomisation {
  colourEditable: boolean;
  materialEditable: boolean;
  finishEditable: boolean;

  dimensionsEditable: boolean;

  textureEditable: boolean;
  geometryEditable: boolean;

  upholsteryEditable?: boolean;

  hardwareEditable?: boolean;

  availableVariants?: AssetVariant[];
}

/* ========================================
   MAIN UNIVERSAL CATALOGUE ASSET
======================================== */

export interface CatalogueAsset {
  id: string;

  slug: string;

  name: string;
  description: string;

  category: AssetCategory;

  subcategory: string;

  compatibleStudios: StudioId[];

  styles: DesignStyle[];

  historicalPeriods: HistoricalPeriod[];

  materialFamilies: MaterialFamily[];

  colourFamilies: ColourFamily[];

  tags: string[];

  source: AssetSource;

  access: AssetAccess;

  licensing: AssetLicensing;

  creatorId?: string;
  creatorName?: string;

  manufacturerName?: string;
  manufacturerProductCode?: string;

  collectionIds?: string[];

  thumbnailUrl?: string;

  media: AssetMedia[];

  models: AssetModel[];

  symbols: AssetSymbol[];

  materialProperties?: MaterialProperties;

  physicalProperties?: AssetPhysicalProperties;

  placement?: AssetPlacement;

  heritage?: AssetHeritageInformation;

  restoration?: AssetRestorationInformation;

  plant?: AssetPlantInformation;

  accessibility?: AssetAccessibilityInformation;

  sustainability?: AssetSustainabilityInformation;

  customisation?: AssetCustomisation;

  estimatedRealWorldPrice?: AssetPrice;

  digitalPurchasePrice?: AssetPrice;

  featured: boolean;

  published: boolean;

  verified: boolean;

  createdAt: string;
  updatedAt: string;

  schemaVersion: number;
}

/* ========================================
   CATALOGUE COLLECTIONS
======================================== */

export type CollectionType =
  | 'historical-period'
  | 'design-style'
  | 'material'
  | 'colour'
  | 'room'
  | 'architecture'
  | 'landscape'
  | 'restoration'
  | 'accessibility'
  | 'sustainability'
  | 'creator'
  | 'manufacturer'
  | 'curated'
  | 'personal';

export interface CatalogueCollection {
  id: string;

  slug: string;

  name: string;
  description: string;

  type: CollectionType;

  thumbnailUrl?: string;

  assetIds: string[];

  compatibleStudios: StudioId[];

  creatorId?: string;

  featured: boolean;
  published: boolean;

  createdAt: string;
  updatedAt: string;
}

/* ========================================
   CATALOGUE CATEGORY DEFINITIONS
======================================== */

export interface CatalogueCategoryDefinition {
  id: AssetCategory;

  name: string;
  description: string;

  icon: string;
  colour: string;

  subcategories: string[];

  compatibleStudios: StudioId[];

  sortOrder: number;
}

/* ========================================
   CATALOGUE FILTERS
======================================== */

export interface CatalogueFilters {
  search: string;

  categories: AssetCategory[];

  subcategories: string[];

  studios: StudioId[];

  styles: DesignStyle[];

  periods: HistoricalPeriod[];

  materials: MaterialFamily[];

  colours: ColourFamily[];

  finishes: SurfaceFinish[];

  conditions: AssetCondition[];

  sources: AssetSource[];

  access: AssetAccess[];

  minimumPrice: number | null;
  maximumPrice: number | null;

  priceCurrency: CurrencyCode;

  freeOnly: boolean;

  favouritesOnly: boolean;

  verifiedOnly: boolean;

  accessibleOnly: boolean;

  sustainableOnly: boolean;

  restorationOnly: boolean;

  lightweightOnly: boolean;

  commercialUseOnly: boolean;

  has3DModel: boolean;

  has2DSymbol: boolean;
}

/* ========================================
   CATALOGUE SORTING
======================================== */

export type CatalogueSort =
  | 'relevance'
  | 'featured'
  | 'newest'
  | 'oldest'
  | 'name-asc'
  | 'name-desc'
  | 'price-low-high'
  | 'price-high-low';

/* ========================================
   CATALOGUE DISPLAY
======================================== */

export type CatalogueView =
  | 'grid'
  | 'list'
  | 'compact';

/* ========================================
   CATALOGUE SEARCH RESULTS
======================================== */

export interface CatalogueSearchResult {
  assets: CatalogueAsset[];

  totalResults: number;

  page: number;
  pageSize: number;

  totalPages: number;

  hasMore: boolean;
}

/* ========================================
   USER FAVOURITES
======================================== */

export interface CatalogueFavourite {
  assetId: string;

  addedAt: string;

  collectionId?: string;
}

/* ========================================
   USER UPLOADS
======================================== */

export type AssetUploadStatus =
  | 'draft'
  | 'uploading'
  | 'processing'
  | 'validation-required'
  | 'ready'
  | 'rejected'
  | 'failed';

export interface AssetUpload {
  id: string;

  assetId?: string;

  originalFilename: string;

  mimeType: string;

  fileSizeBytes: number;

  status: AssetUploadStatus;

  progress: number;

  uploadedAt?: string;

  errorMessage?: string;

  validationWarnings?: string[];

  ownershipConfirmed: boolean;

  licenceConfirmed: boolean;
}

/* ========================================
   DEFAULT CATALOGUE FILTERS
======================================== */

export const DEFAULT_CATALOGUE_FILTERS:
  CatalogueFilters = {
    search: '',

    categories: [],
    subcategories: [],

    studios: [],
    styles: [],
    periods: [],

    materials: [],
    colours: [],
    finishes: [],

    conditions: [],
    sources: [],
    access: [],

    minimumPrice: null,
    maximumPrice: null,

    priceCurrency: 'GBP',

    freeOnly: false,

    favouritesOnly: false,

    verifiedOnly: false,

    accessibleOnly: false,

    sustainableOnly: false,

    restorationOnly: false,

    lightweightOnly: false,

    commercialUseOnly: false,

    has3DModel: false,

    has2DSymbol: false,
  };

/* ========================================
   CATALOGUE SCHEMA CONFIGURATION
======================================== */

export const CATALOGUE_SCHEMA_VERSION = 1;

export const DEFAULT_CATALOGUE_PAGE_SIZE = 24;

export const CATALOGUE_PAGE_SIZE_OPTIONS = [
  12,
  24,
  48,
  96,
] as const;

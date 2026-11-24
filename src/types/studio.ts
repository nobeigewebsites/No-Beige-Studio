
/* ========================================
   NO BEIGE STUDIO
   Shared Studio Types
======================================== */

export type StudioId =
  | 'architecture'
  | 'interior'
  | 'restoration'
  | 'landscape'
  | 'creator';

export type DesignMode =
  | 'reality'
  | 'rebel';

export type ViewMode =
  | '2d'
  | '3d'
  | 'split';

export type ThemeMode =
  | 'dark'
  | 'light'
  | 'contrast'
  | 'system';

export type MeasurementUnit =
  | 'mm'
  | 'cm'
  | 'm'
  | 'in'
  | 'ft';

export type PerformanceMode =
  | 'automatic'
  | 'lightweight'
  | 'balanced'
  | 'high-quality';

export type ProjectStatus =
  | 'draft'
  | 'in-progress'
  | 'completed'
  | 'archived';

export type ProjectCategory =
  | 'residential'
  | 'commercial'
  | 'historical'
  | 'outdoor'
  | 'furniture'
  | 'concept'
  | 'other';

export type AccessLevel =
  | 'free'
  | 'addon'
  | 'bundle';

export type CurrencyCode = string;

/* ========================================
   STUDIO DEFINITIONS
======================================== */

export interface StudioDefinition {
  id: StudioId;
  name: string;
  shortName: string;
  description: string;
  tagline: string;
  route: string;
  colour: string;
  gradient: string;
  image: string;
  freeFeatures: string[];
  advancedFeatures: string[];
}

/* ========================================
   SHARED PROJECT MODEL
======================================== */

export interface Project {
  id: string;
  name: string;
  description: string;

  primaryStudio: StudioId;
  enabledStudios: StudioId[];

  category: ProjectCategory;
  designMode: DesignMode;
  status: ProjectStatus;

  thumbnail: string | null;

  measurementUnit: MeasurementUnit;
  currency: CurrencyCode;

  budget: number | null;

  createdAt: string;
  updatedAt: string;
  lastOpenedAt: string;

  schemaVersion: number;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  primaryStudio: StudioId;
  category: ProjectCategory;
  designMode: DesignMode;
  measurementUnit?: MeasurementUnit;
  currency?: CurrencyCode;
  budget?: number | null;
}

/* ========================================
   DESIGN ENGINE FOUNDATIONS

   Internal measurements use millimetres.
   Display units are converted separately.
======================================== */

export interface Point2D {
  x: number;
  y: number;
}

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface Dimensions2D {
  width: number;
  height: number;
}

export interface Dimensions3D {
  width: number;
  height: number;
  depth: number;
}

export interface Transform2D {
  position: Point2D;
  rotation: number;
  scale: Point2D;
}

export interface Transform3D {
  position: Point3D;
  rotation: Point3D;
  scale: Point3D;
}

export interface DesignEntity {
  id: string;
  name: string;
  type: string;

  visible: boolean;
  locked: boolean;

  layerId: string;
  catalogueAssetId?: string;

  createdAt: string;
  updatedAt: string;
}

export interface DesignLayer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  order: number;
}

/* ========================================
   USER PREFERENCES
======================================== */

export interface StudioPreferences {
  theme: ThemeMode;
  reducedMotion: boolean;
  largeText: boolean;
  measurementUnit: MeasurementUnit;
  currency: CurrencyCode;
  performanceMode: PerformanceMode;

  autosave: boolean;
  showGrid: boolean;
  snapToGrid: boolean;
  showMeasurements: boolean;

  defaultView: ViewMode;
  defaultDesignMode: DesignMode;
}

/* ========================================
   FEATURE ENTITLEMENTS
======================================== */

export interface FeatureDefinition {
  id: string;
  name: string;
  description: string;
  studio: StudioId | 'shared';
  accessLevel: AccessLevel;
  enabled: boolean;
}

export interface FeatureEntitlement {
  featureId: string;
  granted: boolean;
  source: AccessLevel;
  expiresAt: string | null;
}

/* ========================================
   DEFAULT PREFERENCES
======================================== */

export const DEFAULT_PREFERENCES: StudioPreferences = {
  theme: 'dark',
  reducedMotion: false,
  largeText: false,

  measurementUnit: 'cm',
  currency: 'GBP',

  performanceMode: 'automatic',

  autosave: true,
  showGrid: true,
  snapToGrid: true,
  showMeasurements: true,

  defaultView: '2d',
  defaultDesignMode: 'reality',
};

/* ========================================
   PROJECT SCHEMA VERSION
======================================== */

export const PROJECT_SCHEMA_VERSION = 1;


import type {
  CatalogueAsset,
  CatalogueCollection,
  CatalogueFilters,
  CatalogueSort,
  CatalogueSearchResult,
} from '../types/catalogue';

import {
  DEFAULT_CATALOGUE_FILTERS,
  DEFAULT_CATALOGUE_PAGE_SIZE,
} from '../types/catalogue';

import type {
  StudioId,
} from '../types/studio';

import {
  STARTER_CATALOGUE,
  validateStarterCatalogue,
} from '../data/starterCatalogue';

import {
  STARTER_COLLECTIONS,
  STARTER_COLLECTION_GROUPS,
  validateStarterCollections,
} from '../data/starterCollections';

import {
  useCatalogueStore,
  filterCatalogueAssets,
  sortCatalogueAssets,
  paginateCatalogueAssets,
} from '../store/catalogueStore';

/* ========================================
   NO BEIGE STUDIO
   Universal Catalogue Service

   Central catalogue access layer.

   Local data provider initially.
   Database integration ready.
======================================== */

/* ========================================
   SERVICE TYPES
======================================== */

export type CatalogueServiceStatus =
  | 'idle'
  | 'loading'
  | 'ready'
  | 'error';

export interface CatalogueDataset {
  assets: CatalogueAsset[];

  collections: CatalogueCollection[];

  source: string;

  loadedAt: string;
}

export interface CatalogueDataProvider {
  name: string;

  loadCatalogue: (
    signal?: AbortSignal
  ) => Promise<CatalogueDataset>;
}

export interface CatalogueServiceState {
  status: CatalogueServiceStatus;

  provider: string;

  loadedAt: string | null;

  assetCount: number;

  collectionCount: number;

  error: string | null;
}

export interface CatalogueSearchOptions {
  filters?: Partial<CatalogueFilters>;

  sort?: CatalogueSort;

  page?: number;

  pageSize?: number;

  studioId?: StudioId;
}

export interface CatalogueValidationResult {
  valid: boolean;

  errors: string[];

  warnings: string[];

  assetCount: number;

  collectionCount: number;
}

export interface CatalogueServiceStatistics {
  totalAssets: number;

  publishedAssets: number;

  freeAssets: number;

  featuredAssets: number;

  verifiedAssets: number;

  assetsWith3DModels: number;

  assetsWith2DSymbols: number;

  assetsWithMedia: number;

  lightweightAssets: number;

  commerciallyLicensedAssets: number;

  totalCollections: number;

  personalCollections: number;

  favourites: number;

  categories: number;

  studioAssetCounts: Record<
    StudioId,
    number
  >;
}

/* ========================================
   CONFIGURATION
======================================== */

const MAX_SEARCH_PAGE_SIZE = 120;

const STUDIO_IDS: StudioId[] = [
  'architecture',
  'interior',
  'restoration',
  'landscape',
  'creator',
];

/* ========================================
   ABORT UTILITIES
======================================== */

function throwIfAborted(
  signal?: AbortSignal
): void {
  if (signal?.aborted) {
    throw new DOMException(
      'Catalogue request cancelled.',
      'AbortError'
    );
  }
}

function isAbortError(
  error: unknown
): boolean {
  return (
    error instanceof Error &&
    error.name === 'AbortError'
  );
}

/* ========================================
   ERROR UTILITIES
======================================== */

function getErrorMessage(
  error: unknown
): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected catalogue error occurred.';
}

/* ========================================
   ASSET VISIBILITY
======================================== */

function isPublicAsset(
  asset: CatalogueAsset
): boolean {
  return (
    asset.published &&
    asset.access !== 'private'
  );
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

function hasLightweightModel(
  asset: CatalogueAsset
): boolean {
  return asset.models.some(
    (model) =>
      model.recommendedForLightweightMode &&
      Boolean(
        model.url ||
        model.proceduralGeneratorId
      )
  );
}

/* ========================================
   LOCAL DATA PROVIDER

   Clone definitions to prevent runtime
   changes mutating the source catalogue.
======================================== */

export const localCatalogueProvider:
  CatalogueDataProvider = {
    name: 'studio-local',

    async loadCatalogue(
      signal?: AbortSignal
    ): Promise<CatalogueDataset> {
      throwIfAborted(signal);

      const errors = [
        ...validateStarterCatalogue(),

        ...validateStarterCollections(),
      ];

      if (errors.length > 0) {
        throw new Error(
          `Starter catalogue validation failed: ${errors.join('; ')}`
        );
      }

      const assets =
        structuredClone(
          STARTER_CATALOGUE
        );

      const collections =
        structuredClone(
          STARTER_COLLECTIONS
        );

      throwIfAborted(signal);

      return {
        assets,

        collections,

        source: 'studio-local',

        loadedAt:
          new Date().toISOString(),
      };
    },
  };

/* ========================================
   DATASET VALIDATION
======================================== */

export function validateCatalogueDataset(
  dataset: CatalogueDataset
): CatalogueValidationResult {
  const errors: string[] = [];

  const warnings: string[] = [];

  const assetIds =
    new Set<string>();

  const assetSlugs =
    new Set<string>();

  const collectionIds =
    new Set<string>();

  const collectionSlugs =
    new Set<string>();

  const assetMap =
    new Map<string, CatalogueAsset>();

  /* Validate assets */

  for (const asset of dataset.assets) {
    if (!asset.id.trim()) {
      errors.push(
        'Catalogue asset has no identifier.'
      );
    }

    if (assetIds.has(asset.id)) {
      errors.push(
        `Duplicate asset ID: ${asset.id}`
      );
    }

    assetIds.add(asset.id);

    assetMap.set(
      asset.id,
      asset
    );

    if (!asset.slug.trim()) {
      errors.push(
        `Missing asset slug: ${asset.id}`
      );
    }

    if (
      assetSlugs.has(asset.slug)
    ) {
      errors.push(
        `Duplicate asset slug: ${asset.slug}`
      );
    }

    assetSlugs.add(asset.slug);

    if (!asset.name.trim()) {
      errors.push(
        `Missing asset name: ${asset.id}`
      );
    }

    if (!asset.description.trim()) {
      warnings.push(
        `Missing asset description: ${asset.id}`
      );
    }

    if (
      asset.compatibleStudios.length === 0
    ) {
      errors.push(
        `No compatible studios: ${asset.id}`
      );
    }

    for (
      const studioId of asset.compatibleStudios
    ) {
      if (
        !STUDIO_IDS.includes(studioId)
      ) {
        errors.push(
          `Unknown studio ${studioId} on asset ${asset.id}`
        );
      }
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
          `Invalid physical dimensions: ${asset.id}`
        );
      }
    }

    const material =
      asset.materialProperties;

    if (material) {
      const properties = [
        material.roughness,
        material.metallic,
        material.opacity,
      ];

      if (
        properties.some(
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

      if (
        !/^#[0-9a-fA-F]{6}$/.test(
          material.colour.hex
        )
      ) {
        errors.push(
          `Invalid material colour: ${asset.id}`
        );
      }
    }

    const price =
      asset.estimatedRealWorldPrice;

    if (price) {
      if (
        !Number.isFinite(price.amount) ||
        price.amount < 0
      ) {
        errors.push(
          `Invalid estimated price: ${asset.id}`
        );
      }

      if (
        !/^[A-Z]{3}$/.test(
          price.currency
        )
      ) {
        errors.push(
          `Invalid price currency: ${asset.id}`
        );
      }
    }

    if (
      asset.published &&
      !asset.licensing.licenceVerified
    ) {
      warnings.push(
        `Licence verification pending: ${asset.id}`
      );
    }
  }

  /* Validate collections */

  for (
    const collection of dataset.collections
  ) {
    if (!collection.id.trim()) {
      errors.push(
        'Catalogue collection has no identifier.'
      );
    }

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
      !collection.slug.trim()
    ) {
      errors.push(
        `Missing collection slug: ${collection.id}`
      );
    }

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
      collection.compatibleStudios.length === 0
    ) {
      errors.push(
        `No compatible studios: ${collection.id}`
      );
    }

    for (
      const studioId of collection.compatibleStudios
    ) {
      if (
        !STUDIO_IDS.includes(studioId)
      ) {
        errors.push(
          `Unknown studio ${studioId} on collection ${collection.id}`
        );
      }
    }

    const referencedIds =
      new Set<string>();

    for (
      const assetId of collection.assetIds
    ) {
      if (
        referencedIds.has(assetId)
      ) {
        errors.push(
          `Duplicate asset reference ${assetId} in ${collection.id}`
        );
      }

      referencedIds.add(assetId);

      const asset =
        assetMap.get(assetId);

      if (!asset) {
        errors.push(
          `Unknown asset ${assetId} in ${collection.id}`
        );

        continue;
      }

      if (
        collection.published &&
        !isPublicAsset(asset)
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
          `Incompatible asset ${assetId} in collection ${collection.id}`
        );
      }
    }
  }

  return {
    valid: errors.length === 0,

    errors,

    warnings,

    assetCount:
      dataset.assets.length,

    collectionCount:
      dataset.collections.length,
  };
}

/* ========================================
   CATALOGUE SERVICE
======================================== */

class CatalogueService {
  private provider:
    CatalogueDataProvider =
      localCatalogueProvider;

  private pendingRequest:
    Promise<CatalogueDataset> | null =
      null;

  private controller:
    AbortController | null =
      null;

  private dataset:
    CatalogueDataset | null =
      null;

  private requestVersion = 0;

  private serviceState:
    CatalogueServiceState = {
      status: 'idle',

      provider:
        localCatalogueProvider.name,

      loadedAt: null,

      assetCount: 0,

      collectionCount: 0,

      error: null,
    };

  private listeners =
    new Set<
      (
        state: CatalogueServiceState
      ) => void
    >();

  /* ====================================
     SERVICE STATE
  ==================================== */

  getState():
    CatalogueServiceState {
    return {
      ...this.serviceState,
    };
  }

  private updateState(
    updates: Partial<
      CatalogueServiceState
    >
  ): void {
    this.serviceState = {
      ...this.serviceState,

      ...updates,
    };

    for (
      const listener of this.listeners
    ) {
      try {
        listener(
          this.getState()
        );
      } catch (error) {
        console.error(
          'Catalogue listener error:',
          error
        );
      }
    }
  }

  subscribe(
    listener: (
      state: CatalogueServiceState
    ) => void
  ): () => void {
    this.listeners.add(listener);

    listener(
      this.getState()
    );

    return () => {
      this.listeners.delete(
        listener
      );
    };
  }

  isReady(): boolean {
    return (
      this.serviceState.status ===
      'ready'
    );
  }

  /* ====================================
     DATA PROVIDER MANAGEMENT
  ==================================== */

  setProvider(
    provider: CatalogueDataProvider
  ): void {
    if (
      this.provider === provider
    ) {
      return;
    }

    this.reset();

    this.provider = provider;

    this.updateState({
      provider: provider.name,
    });
  }

  getProviderName(): string {
    return this.provider.name;
  }

  useLocalProvider(): void {
    this.setProvider(
      localCatalogueProvider
    );
  }

  /* ====================================
     CATALOGUE INITIALISATION

     Concurrent requests share one load.
     Cancelled or superseded requests
     cannot overwrite newer catalogue data.
  ==================================== */

  initialise():
    Promise<CatalogueDataset> {
    if (this.pendingRequest) {
      return this.pendingRequest;
    }

    if (
      this.dataset &&
      this.isReady()
    ) {
      return Promise.resolve(
        this.dataset
      );
    }

    const version =
      ++this.requestVersion;

    const controller =
      new AbortController();

    this.controller =
      controller;

    const provider =
      this.provider;

    useCatalogueStore
      .getState()
      .setLoading(true);

    useCatalogueStore
      .getState()
      .setError(null);

    const request = Promise.resolve()
      .then(() =>
        this.loadDataset(
          provider,
          controller.signal,
          version
        )
      )
      .finally(() => {
        if (
          version === this.requestVersion
        ) {
          this.pendingRequest = null;

          this.controller = null;

          useCatalogueStore
            .getState()
            .setLoading(false);
        }
      });

    this.pendingRequest =
      request;

    this.updateState({
      status: 'loading',

      provider: provider.name,

      error: null,
    });

    return request;
  }

  /* ====================================
     LOAD AND VALIDATE DATA
  ==================================== */

  private async loadDataset(
    provider: CatalogueDataProvider,

    signal: AbortSignal,

    version: number
  ): Promise<CatalogueDataset> {
    try {
      throwIfAborted(signal);

      const dataset =
        await provider.loadCatalogue(
          signal
        );

      throwIfAborted(signal);

      if (
        version !== this.requestVersion
      ) {
        throw new DOMException(
          'Catalogue request superseded.',
          'AbortError'
        );
      }

      const validation =
        validateCatalogueDataset(
          dataset
        );

      if (!validation.valid) {
        throw new Error(
          `Catalogue validation failed: ${validation.errors.join('; ')}`
        );
      }

      /*
        Only public records are passed
        into the public catalogue store.

        Future database providers must
        enforce permissions server-side.
      */

      const publicAssets =
        dataset.assets.filter(
          isPublicAsset
        );

      const publicAssetIds =
        new Set(
          publicAssets.map(
            (asset) => asset.id
          )
        );

      const publicCollections =
        dataset.collections
          .filter(
            (collection) =>
              collection.published
          )
          .map(
            (collection) => ({
              ...collection,

              assetIds:
                collection.assetIds.filter(
                  (assetId) =>
                    publicAssetIds.has(
                      assetId
                    )
                ),
            })
          );

      const publicDataset:
        CatalogueDataset = {
          ...dataset,

          assets: publicAssets,

          collections:
            publicCollections,
        };

      this.dataset =
        publicDataset;

      useCatalogueStore.setState({
        assets: publicAssets,

        collections:
          publicCollections,

        selectedAssetId: null,

        page: 1,

        error: null,
      });

      this.updateState({
        status: 'ready',

        provider: provider.name,

        loadedAt:
          dataset.loadedAt,

        assetCount:
          publicAssets.length,

        collectionCount:
          publicCollections.length,

        error: null,
      });

      if (
        import.meta.env.DEV &&
        validation.warnings.length > 0
      ) {
        console.info(
          'Catalogue validation warnings:',
          validation.warnings
        );
      }

      return publicDataset;

    } catch (error) {
      if (
        version !== this.requestVersion
      ) {
        throw error;
      }

      if (isAbortError(error)) {
        this.updateState({
          status:
            this.dataset
              ? 'ready'
              : 'idle',

          error: null,
        });

        throw error;
      }

      const message =
        getErrorMessage(error);

      useCatalogueStore
        .getState()
        .setError(message);

      this.updateState({
        status: 'error',

        error: message,
      });

      throw error;
    }
  }

  /* ====================================
     REFRESH
  ==================================== */

  refresh():
    Promise<CatalogueDataset> {
    this.cancel();

    this.dataset = null;

    return this.initialise();
  }

  /* ====================================
     CANCELLATION
  ==================================== */

  cancel(): void {
    this.requestVersion += 1;

    this.controller?.abort();

    this.controller = null;

    this.pendingRequest = null;

    useCatalogueStore
      .getState()
      .setLoading(false);

    if (
      this.serviceState.status ===
      'loading'
    ) {
      this.updateState({
        status:
          this.dataset
            ? 'ready'
            : 'idle',

        error: null,
      });
    }
  }

  /* ====================================
     RESET

     Personal collections and favourites
     are intentionally preserved.
  ==================================== */

  reset(): void {
    this.cancel();

    this.dataset = null;

    useCatalogueStore.setState({
      assets: [],

      collections: [],

      selectedAssetId: null,

      page: 1,

      isLoading: false,

      error: null,
    });

    this.updateState({
      status: 'idle',

      loadedAt: null,

      assetCount: 0,

      collectionCount: 0,

      error: null,
    });
  }

  /* ====================================
     ASSET RETRIEVAL
  ==================================== */

  getAsset(
    assetId: string
  ): CatalogueAsset | undefined {
    const asset =
      useCatalogueStore
        .getState()
        .getAsset(assetId);

    if (
      !asset ||
      !isPublicAsset(asset)
    ) {
      return undefined;
    }

    return asset;
  }

  getAssetBySlug(
    slug: string
  ): CatalogueAsset | undefined {
    return useCatalogueStore
      .getState()
      .assets.find(
        (asset) =>
          asset.slug === slug &&
          isPublicAsset(asset)
      );
  }

  getAssets(
    assetIds: string[]
  ): CatalogueAsset[] {
    const assetMap =
      new Map(
        useCatalogueStore
          .getState()
          .assets
          .filter(isPublicAsset)
          .map(
            (asset) => [
              asset.id,
              asset,
            ]
          )
      );

    return [
      ...new Set(assetIds),
    ]
      .map(
        (assetId) =>
          assetMap.get(assetId)
      )
      .filter(
        (
          asset
        ): asset is CatalogueAsset =>
          asset !== undefined
      );
  }

  /* ====================================
     INDEPENDENT SEARCH

     Searches without changing the user's
     main catalogue filters or pagination.
  ==================================== */

  search(
    options:
      CatalogueSearchOptions = {}
  ): CatalogueSearchResult {
    const state =
      useCatalogueStore.getState();

    const filters:
      CatalogueFilters = {
        ...DEFAULT_CATALOGUE_FILTERS,

        ...options.filters,
      };

    if (options.studioId) {
      filters.studios = [
        options.studioId,
      ];
    }

    const filtered =
      filterCatalogueAssets(
        state.assets,

        filters,

        state.favourites
      );

    const sorted =
      sortCatalogueAssets(
        filtered,

        options.sort ?? 'relevance',

        filters.search,

        filters.priceCurrency
      );

    const requestedPageSize =
      options.pageSize ??
      DEFAULT_CATALOGUE_PAGE_SIZE;

    const pageSize =
      Number.isFinite(
        requestedPageSize
      )
        ? Math.min(
            MAX_SEARCH_PAGE_SIZE,

            Math.max(
              1,
              Math.floor(
                requestedPageSize
              )
            )
          )
        : DEFAULT_CATALOGUE_PAGE_SIZE;

    return paginateCatalogueAssets(
      sorted,

      options.page ?? 1,

      pageSize
    );
  }

  /* ====================================
     ASYNCHRONOUS SEARCH

     Ensures the catalogue is loaded
     before returning results.
  ==================================== */

  async searchAsync(
    options:
      CatalogueSearchOptions = {}
  ): Promise<CatalogueSearchResult> {
    await this.initialise();

    return this.search(options);
  }

  /* ====================================
     STUDIO ASSETS
  ==================================== */

  getStudioAssets(
    studioId: StudioId
  ): CatalogueAsset[] {
    return useCatalogueStore
      .getState()
      .getStudioAssets(studioId);
  }

  /* ====================================
     FEATURED ASSETS
  ==================================== */

  getFeaturedAssets(
    limit = 12,

    studioId?: StudioId
  ): CatalogueAsset[] {
    const assets =
      useCatalogueStore
        .getState()
        .assets.filter(
          (asset) =>
            isPublicAsset(asset) &&
            asset.featured &&
            (
              !studioId ||
              asset.compatibleStudios.includes(
                studioId
              )
            )
        );

    return assets.slice(
      0,
      Math.max(
        0,
        Math.floor(limit)
      )
    );
  }

  /* ====================================
     COLLECTION RETRIEVAL
  ==================================== */

  getCollections(
    studioId?: StudioId
  ): CatalogueCollection[] {
    return useCatalogueStore
      .getState()
      .collections.filter(
        (collection) =>
          collection.published &&
          (
            !studioId ||
            collection.compatibleStudios.includes(
              studioId
            )
          )
      );
  }

  getCollection(
    collectionId: string
  ): CatalogueCollection | undefined {
    return useCatalogueStore
      .getState()
      .collections.find(
        (collection) =>
          collection.id === collectionId &&
          collection.published
      );
  }

  getCollectionBySlug(
    slug: string
  ): CatalogueCollection | undefined {
    return useCatalogueStore
      .getState()
      .collections.find(
        (collection) =>
          collection.slug === slug &&
          collection.published
      );
  }

  getCollectionAssets(
    collectionId: string,

    studioId?: StudioId
  ): CatalogueAsset[] {
    const collection =
      this.getCollection(
        collectionId
      );

    if (!collection) {
      return [];
    }

    return this.getAssets(
      collection.assetIds
    ).filter(
      (asset) =>
        !studioId ||
        asset.compatibleStudios.includes(
          studioId
        )
    );
  }

  getFeaturedCollections(
    limit = 12,

    studioId?: StudioId
  ): CatalogueCollection[] {
    return this.getCollections(
      studioId
    )
      .filter(
        (collection) =>
          collection.featured
      )
      .slice(
        0,
        Math.max(
          0,
          Math.floor(limit)
        )
      );
  }

  /* ====================================
     COLLECTION GROUPS
  ==================================== */

  getCollectionGroups() {
    const availableIds =
      new Set(
        this.getCollections().map(
          (collection) =>
            collection.id
        )
      );

    return STARTER_COLLECTION_GROUPS
      .map(
        (group) => ({
          ...group,

          collectionIds:
            group.collectionIds.filter(
              (collectionId) =>
                availableIds.has(
                  collectionId
                )
            ),
        })
      )
      .filter(
        (group) =>
          group.collectionIds.length > 0
      );
  }

  /* ====================================
     RELATED ASSETS

     Deterministic recommendations based
     on shared design characteristics.
  ==================================== */

  getRelatedAssets(
    assetId: string,

    limit = 8,

    studioId?: StudioId
  ): CatalogueAsset[] {
    const source =
      this.getAsset(assetId);

    if (!source) {
      return [];
    }

    const sourceStyles =
      new Set(source.styles);

    const sourcePeriods =
      new Set(
        source.historicalPeriods
      );

    const sourceMaterials =
      new Set(
        source.materialFamilies
      );

    const sourceColours =
      new Set(
        source.colourFamilies
      );

    const sourceTags =
      new Set(
        source.tags
          .map(
            (tag) =>
              tag.toLowerCase().trim()
          )
          .filter(
            (tag) =>
              tag !== 'starter catalogue' &&
              tag !== 'original design'
          )
      );

    return useCatalogueStore
      .getState()
      .assets.filter(
        (candidate) =>
          candidate.id !== assetId &&
          isPublicAsset(candidate) &&
          (
            !studioId ||
            candidate.compatibleStudios.includes(
              studioId
            )
          )
      )
      .map((candidate) => {
        let score = 0;

        if (
          candidate.category ===
          source.category
        ) {
          score += 5;
        }

        if (
          candidate.subcategory ===
          source.subcategory
        ) {
          score += 8;
        }

        score +=
          candidate.styles.filter(
            (style) =>
              sourceStyles.has(style)
          ).length * 3;

        score +=
          candidate.historicalPeriods.filter(
            (period) =>
              period !== 'timeless' &&
              sourcePeriods.has(period)
          ).length * 3;

        score +=
          candidate.materialFamilies.filter(
            (material) =>
              sourceMaterials.has(material)
          ).length * 2;

        score +=
          candidate.colourFamilies.filter(
            (colour) =>
              sourceColours.has(colour)
          ).length;

        score +=
          candidate.tags.filter(
            (tag) =>
              sourceTags.has(
                tag.toLowerCase().trim()
              )
          ).length;

        return {
          asset: candidate,
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
          a.asset.name.localeCompare(
            b.asset.name
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
          candidate.asset
      );
  }

  /* ====================================
     RELATED COLLECTIONS
  ==================================== */

  getRelatedCollections(
    collectionId: string,

    limit = 6
  ): CatalogueCollection[] {
    const source =
      this.getCollection(
        collectionId
      );

    if (!source) {
      return [];
    }

    const sourceIds =
      new Set(source.assetIds);

    return this.getCollections()
      .filter(
        (collection) =>
          collection.id !== collectionId
      )
      .map((collection) => {
        const shared =
          collection.assetIds.filter(
            (assetId) =>
              sourceIds.has(assetId)
          ).length;

        const combined =
          new Set([
            ...source.assetIds,

            ...collection.assetIds,
          ]).size;

        return {
          collection,

          score:
            combined > 0
              ? shared / combined
              : 0,
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

  /* ====================================
     FAVOURITES
  ==================================== */

  toggleFavourite(
    assetId: string
  ): boolean {
    if (!this.getAsset(assetId)) {
      return false;
    }

    const store =
      useCatalogueStore.getState();

    store.toggleFavourite(assetId);

    return useCatalogueStore
      .getState()
      .isFavourite(assetId);
  }

  getFavouriteAssets():
    CatalogueAsset[] {
    return useCatalogueStore
      .getState()
      .getFavouriteAssets();
  }

  /* ====================================
     RECENTLY VIEWED
  ==================================== */

  recordAssetView(
    assetId: string
  ): void {
    if (!this.getAsset(assetId)) {
      return;
    }

    useCatalogueStore
      .getState()
      .recordAssetView(assetId);
  }

  getRecentlyViewedAssets():
    CatalogueAsset[] {
    return useCatalogueStore
      .getState()
      .getRecentlyViewedAssets();
  }

  /* ====================================
     PERSONAL COLLECTIONS
  ==================================== */

  createPersonalCollection(
    name: string,

    description = ''
  ): CatalogueCollection {
    return useCatalogueStore
      .getState()
      .createPersonalCollection(
        name,
        description
      );
  }

  getPersonalCollections():
    CatalogueCollection[] {
    return useCatalogueStore
      .getState()
      .personalCollections;
  }

  addAssetToPersonalCollection(
    collectionId: string,

    assetId: string
  ): boolean {
    if (!this.getAsset(assetId)) {
      return false;
    }

    const state =
      useCatalogueStore.getState();

    const collection =
      state.personalCollections.find(
        (candidate) =>
          candidate.id === collectionId
      );

    if (!collection) {
      return false;
    }

    state.addAssetToCollection(
      collectionId,

      assetId
    );

    return true;
  }

  removeAssetFromPersonalCollection(
    collectionId: string,

    assetId: string
  ): void {
    useCatalogueStore
      .getState()
      .removeAssetFromCollection(
        collectionId,

        assetId
      );
  }

  renamePersonalCollection(
    collectionId: string,

    name: string
  ): void {
    useCatalogueStore
      .getState()
      .renamePersonalCollection(
        collectionId,

        name
      );
  }

  deletePersonalCollection(
    collectionId: string
  ): void {
    useCatalogueStore
      .getState()
      .deletePersonalCollection(
        collectionId
      );
  }

  getPersonalCollectionAssets(
    collectionId: string
  ): CatalogueAsset[] {
    const collection =
      useCatalogueStore
        .getState()
        .personalCollections.find(
          (candidate) =>
            candidate.id === collectionId
        );

    if (!collection) {
      return [];
    }

    return this.getAssets(
      collection.assetIds
    );
  }

  /* ====================================
     CATALOGUE STATISTICS

     Report actual available records.
     Never advertise unfinished models
     or unverified commercial licences.
  ==================================== */

  getStatistics():
    CatalogueServiceStatistics {
    const state =
      useCatalogueStore.getState();

    const assets =
      state.assets.filter(
        isPublicAsset
      );

    const studioAssetCounts:
      Record<StudioId, number> = {
        architecture: 0,

        interior: 0,

        restoration: 0,

        landscape: 0,

        creator: 0,
      };

    for (const asset of assets) {
      for (
        const studioId of new Set(
          asset.compatibleStudios
        )
      ) {
        studioAssetCounts[studioId] += 1;
      }
    }

    const publicAssetIds =
      new Set(
        assets.map(
          (asset) => asset.id
        )
      );

    return {
      totalAssets:
        state.assets.length,

      publishedAssets:
        assets.length,

      freeAssets:
        assets.filter(
          (asset) =>
            asset.access === 'free'
        ).length,

      featuredAssets:
        assets.filter(
          (asset) =>
            asset.featured
        ).length,

      verifiedAssets:
        assets.filter(
          (asset) =>
            asset.verified
        ).length,

      assetsWith3DModels:
        assets.filter(
          has3DModel
        ).length,

      assetsWith2DSymbols:
        assets.filter(
          has2DSymbol
        ).length,

      assetsWithMedia:
        assets.filter(
          (asset) =>
            asset.media.length > 0
        ).length,

      lightweightAssets:
        assets.filter(
          hasLightweightModel
        ).length,

      commerciallyLicensedAssets:
        assets.filter(
          (asset) =>
            asset.licensing.licenceVerified &&
            asset.licensing.commercialUseAllowed
        ).length,

      totalCollections:
        state.collections.filter(
          (collection) =>
            collection.published
        ).length,

      personalCollections:
        state.personalCollections.length,

      favourites:
        state.favourites.filter(
          (favourite) =>
            publicAssetIds.has(
              favourite.assetId
            )
        ).length,

      categories:
        new Set(
          assets.map(
            (asset) =>
              asset.category
          )
        ).size,

      studioAssetCounts,
    };
  }

  /* ====================================
     VALIDATE CURRENT CATALOGUE
  ==================================== */

  validate():
    CatalogueValidationResult {
    const state =
      useCatalogueStore.getState();

    return validateCatalogueDataset({
      assets: state.assets,

      collections:
        state.collections,

      source:
        this.provider.name,

      loadedAt:
        this.serviceState.loadedAt ??
        new Date().toISOString(),
    });
  }
}

/* ========================================
   SINGLE SERVICE INSTANCE
======================================== */

export const catalogueService =
  new CatalogueService();

/* ========================================
   APPLICATION INITIALISATION
======================================== */

export async function initialiseCatalogue():
  Promise<CatalogueDataset> {
  return catalogueService.initialise();
}

/* ========================================
   APPLICATION REFRESH
======================================== */

export async function refreshCatalogue():
  Promise<CatalogueDataset> {
  return catalogueService.refresh();
}

/* ========================================
   SERVICE STATE ACCESS
======================================== */

export function getCatalogueServiceState():
  CatalogueServiceState {
  return catalogueService.getState();
}

/* ========================================
   PUBLIC SEARCH API
======================================== */

export async function searchCatalogue(
  options:
    CatalogueSearchOptions = {}
): Promise<CatalogueSearchResult> {
  return catalogueService.searchAsync(
    options
  );
}

/* ========================================
   PUBLIC STATISTICS API
======================================== */

export function getCatalogueStatistics():
  CatalogueServiceStatistics {
  return catalogueService.getStatistics();
}

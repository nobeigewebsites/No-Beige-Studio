
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import type {
  ReactNode,
} from 'react';

import {
  catalogueService,
  initialiseCatalogue,
  refreshCatalogue,
  getCatalogueServiceState,
} from '../services/catalogueService';

import type {
  CatalogueServiceState,
} from '../services/catalogueService';

/* ========================================
   NO BEIGE STUDIO
   Universal Catalogue Provider

   Application-wide catalogue lifecycle.
   Shared loading and error states.
   Compatible with React StrictMode.
======================================== */

/* ========================================
   PROVIDER TYPES
======================================== */

interface CatalogueProviderProps {
  children: ReactNode;
}

interface CatalogueContextValue {
  state: CatalogueServiceState;

  isReady: boolean;

  isLoading: boolean;

  hasError: boolean;

  error: string | null;

  assetCount: number;

  collectionCount: number;

  retry: () => Promise<boolean>;

  refresh: () => Promise<boolean>;
}

/* ========================================
   CATALOGUE CONTEXT
======================================== */

const CatalogueContext =
  createContext<
    CatalogueContextValue | undefined
  >(undefined);

/* ========================================
   ERROR HANDLING
======================================== */

function isCancellation(
  error: unknown
): boolean {
  return (
    error instanceof Error &&
    error.name === 'AbortError'
  );
}

function reportCatalogueError(
  error: unknown
): void {
  if (isCancellation(error)) {
    return;
  }

  if (import.meta.env.DEV) {
    console.error(
      'NO BEIGE STUDIO catalogue error:',
      error
    );
  }
}

/* ========================================
   CATALOGUE PROVIDER
======================================== */

export default function CatalogueProvider({
  children,
}: CatalogueProviderProps) {
  const [state, setState] =
    useState<CatalogueServiceState>(
      getCatalogueServiceState
    );

  /* ====================================
     INITIALISE AND SUBSCRIBE

     The catalogue service owns its
     request lifecycle.

     Unmounting a provider removes its
     subscription without cancelling
     shared catalogue requests.
  ==================================== */

  useEffect(() => {
    let mounted = true;

    const unsubscribe =
      catalogueService.subscribe(
        (nextState) => {
          if (mounted) {
            setState(nextState);
          }
        }
      );

    void initialiseCatalogue()
      .catch(
        reportCatalogueError
      );

    return () => {
      mounted = false;

      unsubscribe();
    };
  }, []);

  /* ====================================
     RETRY FAILED INITIALISATION
  ==================================== */

  const retry =
    useCallback(
      async (): Promise<boolean> => {
        try {
          await initialiseCatalogue();

          return true;
        } catch (error) {
          reportCatalogueError(error);

          return false;
        }
      },
      []
    );

  /* ====================================
     REFRESH CATALOGUE
  ==================================== */

  const refresh =
    useCallback(
      async (): Promise<boolean> => {
        try {
          await refreshCatalogue();

          return true;
        } catch (error) {
          reportCatalogueError(error);

          return false;
        }
      },
      []
    );

  /* ====================================
     SHARED CONTEXT VALUE
  ==================================== */

  const value =
    useMemo<CatalogueContextValue>(
      () => ({
        state,

        isReady:
          state.status === 'ready',

        isLoading:
          state.status === 'loading',

        hasError:
          state.status === 'error',

        error:
          state.error,

        assetCount:
          state.assetCount,

        collectionCount:
          state.collectionCount,

        retry,

        refresh,
      }),
      [
        state,
        retry,
        refresh,
      ]
    );

  /* ====================================
     APPLICATION RENDERING

     Catalogue loading must not prevent
     users accessing their projects,
     preferences or other studios.
  ==================================== */

  return (
    <CatalogueContext.Provider
      value={value}
    >
      {children}
    </CatalogueContext.Provider>
  );
}

/* ========================================
   CATALOGUE CONTEXT HOOK
======================================== */

export function useCatalogueContext():
  CatalogueContextValue {
  const context =
    useContext(CatalogueContext);

  if (!context) {
    throw new Error(
      'useCatalogueContext must be used within CatalogueProvider.'
    );
  }

  return context;
}

/* ========================================
   CATALOGUE STATUS HOOK
======================================== */

export function useCatalogueStatus() {
  const {
    state,
    isReady,
    isLoading,
    hasError,
    error,
  } = useCatalogueContext();

  return {
    status: state.status,

    provider: state.provider,

    loadedAt: state.loadedAt,

    isReady,

    isLoading,

    hasError,

    error,
  };
}

/* ========================================
   CATALOGUE AVAILABILITY HOOK
======================================== */

export function useCatalogueAvailability() {
  const {
    isReady,
    isLoading,
    hasError,
    assetCount,
    collectionCount,
  } = useCatalogueContext();

  return {
    isReady,

    isLoading,

    hasError,

    assetCount,

    collectionCount,

    hasAssets:
      assetCount > 0,

    hasCollections:
      collectionCount > 0,
  };
}

/* ========================================
   CATALOGUE ACTIONS HOOK
======================================== */

export function useCatalogueActions() {
  const {
    retry,
    refresh,
  } = useCatalogueContext();

  return {
    retry,

    refresh,
  };
}


import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
  DEFAULT_PREFERENCES,
  type StudioPreferences,
  type ThemeMode,
  type MeasurementUnit,
  type PerformanceMode,
  type ViewMode,
  type DesignMode,
} from '../types/studio';

/* ========================================
   NO BEIGE STUDIO
   Persistent User Preferences
======================================== */

interface PreferencesState {
  preferences: StudioPreferences;

  updatePreferences: (
    updates: Partial<StudioPreferences>
  ) => void;

  setTheme: (theme: ThemeMode) => void;

  setMeasurementUnit: (
    unit: MeasurementUnit
  ) => void;

  setCurrency: (currency: string) => void;

  setPerformanceMode: (
    mode: PerformanceMode
  ) => void;

  setDefaultView: (view: ViewMode) => void;

  setDefaultDesignMode: (
    mode: DesignMode
  ) => void;

  toggleReducedMotion: () => void;
  toggleLargeText: () => void;
  toggleAutosave: () => void;
  toggleGrid: () => void;
  toggleSnapToGrid: () => void;
  toggleMeasurements: () => void;

  resetPreferences: () => void;
}

/* ========================================
   PREFERENCES STORE
======================================== */

export const usePreferencesStore =
  create<PreferencesState>()(
    persist(
      (set) => ({
        preferences: {
          ...DEFAULT_PREFERENCES,
        },

        updatePreferences: (updates) =>
          set((state) => ({
            preferences: {
              ...state.preferences,
              ...updates,
            },
          })),

        setTheme: (theme) =>
          set((state) => ({
            preferences: {
              ...state.preferences,
              theme,
            },
          })),

        setMeasurementUnit: (measurementUnit) =>
          set((state) => ({
            preferences: {
              ...state.preferences,
              measurementUnit,
            },
          })),

        setCurrency: (currency) => {
          const normalised = currency
            .trim()
            .toUpperCase();

          if (!/^[A-Z]{3}$/.test(normalised)) {
            return;
          }

          set((state) => ({
            preferences: {
              ...state.preferences,
              currency: normalised,
            },
          }));
        },

        setPerformanceMode: (performanceMode) =>
          set((state) => ({
            preferences: {
              ...state.preferences,
              performanceMode,
            },
          })),

        setDefaultView: (defaultView) =>
          set((state) => ({
            preferences: {
              ...state.preferences,
              defaultView,
            },
          })),

        setDefaultDesignMode: (defaultDesignMode) =>
          set((state) => ({
            preferences: {
              ...state.preferences,
              defaultDesignMode,
            },
          })),

        toggleReducedMotion: () =>
          set((state) => ({
            preferences: {
              ...state.preferences,
              reducedMotion:
                !state.preferences.reducedMotion,
            },
          })),

        toggleLargeText: () =>
          set((state) => ({
            preferences: {
              ...state.preferences,
              largeText:
                !state.preferences.largeText,
            },
          })),

        toggleAutosave: () =>
          set((state) => ({
            preferences: {
              ...state.preferences,
              autosave:
                !state.preferences.autosave,
            },
          })),

        toggleGrid: () =>
          set((state) => ({
            preferences: {
              ...state.preferences,
              showGrid:
                !state.preferences.showGrid,
            },
          })),

        toggleSnapToGrid: () =>
          set((state) => ({
            preferences: {
              ...state.preferences,
              snapToGrid:
                !state.preferences.snapToGrid,
            },
          })),

        toggleMeasurements: () =>
          set((state) => ({
            preferences: {
              ...state.preferences,
              showMeasurements:
                !state.preferences.showMeasurements,
            },
          })),

        resetPreferences: () =>
          set({
            preferences: {
              ...DEFAULT_PREFERENCES,
            },
          }),
      }),

      {
        name: 'no-beige-studio-preferences',

        version: 1,

        partialize: (state) => ({
          preferences: state.preferences,
        }),

        merge: (persistedState, currentState) => {
          const saved = persistedState as
            | Partial<PreferencesState>
            | undefined;

          return {
            ...currentState,

            preferences: {
              ...DEFAULT_PREFERENCES,
              ...saved?.preferences,
            },
          };
        },
      }
    )
  );

/* ========================================
   THEME RESOLUTION
======================================== */

export function resolveTheme(
  theme: ThemeMode
): 'dark' | 'light' | 'contrast' {
  if (theme !== 'system') {
    return theme;
  }

  if (
    typeof window !== 'undefined' &&
    window.matchMedia(
      '(prefers-color-scheme: light)'
    ).matches
  ) {
    return 'light';
  }

  return 'dark';
}

/* ========================================
   APPLY ACCESSIBILITY PREFERENCES
======================================== */

export function applyPreferences(
  preferences: StudioPreferences
): void {
  if (typeof document === 'undefined') {
    return;
  }

  const root = document.documentElement;

  const theme = resolveTheme(
    preferences.theme
  );

  root.dataset.theme = theme;

  root.dataset.reducedMotion = String(
    preferences.reducedMotion
  );

  root.dataset.largeText = String(
    preferences.largeText
  );

  root.dataset.performanceMode =
    preferences.performanceMode;

  const themeColour = document.querySelector(
    'meta[name="theme-color"]'
  );

  const colours = {
    dark: '#101827',
    light: '#ffffff',
    contrast: '#000000',
  };

  themeColour?.setAttribute(
    'content',
    colours[theme]
  );
}

/* ========================================
   PREFERENCES INITIALISATION
======================================== */

export function initialisePreferences(): () => void {
  applyPreferences(
    usePreferencesStore.getState().preferences
  );

  const unsubscribe =
    usePreferencesStore.subscribe((state) => {
      applyPreferences(state.preferences);
    });

  if (typeof window === 'undefined') {
    return unsubscribe;
  }

  const systemTheme = window.matchMedia(
    '(prefers-color-scheme: light)'
  );

  const handleSystemThemeChange = () => {
    const { preferences } =
      usePreferencesStore.getState();

    if (preferences.theme === 'system') {
      applyPreferences(preferences);
    }
  };

  systemTheme.addEventListener(
    'change',
    handleSystemThemeChange
  );

  return () => {
    unsubscribe();

    systemTheme.removeEventListener(
      'change',
      handleSystemThemeChange
    );
  };
}

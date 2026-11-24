
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
  PROJECT_SCHEMA_VERSION,
  type Project,
  type CreateProjectInput,
  type ProjectStatus,
  type StudioId,
} from '../types/studio';

import { usePreferencesStore } from './preferencesStore';

/* ========================================
   NO BEIGE STUDIO
   Shared Project Management
======================================== */

type ProjectUpdates = Partial<
  Pick<
    Project,
    | 'name'
    | 'description'
    | 'category'
    | 'designMode'
    | 'status'
    | 'thumbnail'
    | 'measurementUnit'
    | 'currency'
    | 'budget'
  >
>;

interface ProjectState {
  projects: Project[];
  activeProjectId: string | null;

  createProject: (
    input: CreateProjectInput
  ) => Project;

  updateProject: (
    projectId: string,
    updates: ProjectUpdates
  ) => void;

  deleteProject: (
    projectId: string
  ) => void;

  duplicateProject: (
    projectId: string
  ) => Project | null;

  archiveProject: (
    projectId: string
  ) => void;

  restoreProject: (
    projectId: string
  ) => void;

  openProject: (
    projectId: string
  ) => void;

  closeProject: () => void;

  enableStudio: (
    projectId: string,
    studioId: StudioId
  ) => void;

  disableStudio: (
    projectId: string,
    studioId: StudioId
  ) => void;

  setProjectStatus: (
    projectId: string,
    status: ProjectStatus
  ) => void;

  getProject: (
    projectId: string
  ) => Project | undefined;

  getActiveProject: () => Project | undefined;
}

/* ========================================
   UTILITIES
======================================== */

function generateProjectId(): string {
  return crypto.randomUUID();
}

function currentTimestamp(): string {
  return new Date().toISOString();
}

function normaliseProjectName(
  name: string
): string {
  return name.trim().slice(0, 150) ||
    'Untitled Project';
}

function normaliseBudget(
  budget: number | null | undefined
): number | null {
  if (
    typeof budget !== 'number' ||
    !Number.isFinite(budget) ||
    budget < 0
  ) {
    return null;
  }

  return Math.round(budget * 100) / 100;
}

function normaliseCurrency(
  currency: string,
  fallback: string
): string {
  const value = currency.trim().toUpperCase();

  return /^[A-Z]{3}$/.test(value)
    ? value
    : fallback;
}

/* ========================================
   PROJECT STORE
======================================== */

export const useProjectStore =
  create<ProjectState>()(
    persist(
      (set, get) => ({
        projects: [],
        activeProjectId: null,

        /* --------------------------------
           CREATE PROJECT
        -------------------------------- */

        createProject: (input) => {
          const { preferences } =
            usePreferencesStore.getState();

          const timestamp = currentTimestamp();

          const project: Project = {
            id: generateProjectId(),

            name: normaliseProjectName(
              input.name
            ),

            description:
              input.description?.trim() ?? '',

            primaryStudio: input.primaryStudio,

            enabledStudios: [
              input.primaryStudio,
            ],

            category: input.category,
            designMode: input.designMode,

            status: 'draft',

            thumbnail: null,

            measurementUnit:
              input.measurementUnit ??
              preferences.measurementUnit,

            currency: normaliseCurrency(
              input.currency ??
                preferences.currency,
              preferences.currency
            ),

            budget: normaliseBudget(
              input.budget
            ),

            createdAt: timestamp,
            updatedAt: timestamp,
            lastOpenedAt: timestamp,

            schemaVersion:
              PROJECT_SCHEMA_VERSION,
          };

          set((state) => ({
            projects: [
              project,
              ...state.projects,
            ],

            activeProjectId: project.id,
          }));

          return project;
        },

        /* --------------------------------
           UPDATE PROJECT
        -------------------------------- */

        updateProject: (
          projectId,
          updates
        ) => {
          set((state) => ({
            projects: state.projects.map(
              (project) => {
                if (project.id !== projectId) {
                  return project;
                }

                const nextProject = {
                  ...project,
                  ...updates,

                  updatedAt:
                    currentTimestamp(),
                };

                if (updates.name !== undefined) {
                  nextProject.name =
                    normaliseProjectName(
                      updates.name
                    );
                }

                if (
                  updates.description !== undefined
                ) {
                  nextProject.description =
                    updates.description.trim();
                }

                if (
                  updates.budget !== undefined
                ) {
                  nextProject.budget =
                    normaliseBudget(
                      updates.budget
                    );
                }

                if (
                  updates.currency !== undefined
                ) {
                  nextProject.currency =
                    normaliseCurrency(
                      updates.currency,
                      project.currency
                    );
                }

                return nextProject;
              }
            ),

            activeProjectId:
              updates.status === 'archived' &&
              state.activeProjectId === projectId
                ? null
                : state.activeProjectId,
          }));
        },

        /* --------------------------------
           DELETE PROJECT
        -------------------------------- */

        deleteProject: (projectId) => {
          set((state) => ({
            projects: state.projects.filter(
              (project) =>
                project.id !== projectId
            ),

            activeProjectId:
              state.activeProjectId === projectId
                ? null
                : state.activeProjectId,
          }));
        },

        /* --------------------------------
           DUPLICATE PROJECT
        -------------------------------- */

        duplicateProject: (projectId) => {
          const original =
            get().getProject(projectId);

          if (!original) {
            return null;
          }

          const timestamp =
            currentTimestamp();

          const duplicate: Project = {
            ...original,

            id: generateProjectId(),

            name: normaliseProjectName(
              `${original.name.slice(0, 143)} (Copy)`
            ),

            enabledStudios: [
              ...original.enabledStudios,
            ],

            status: 'draft',

            createdAt: timestamp,
            updatedAt: timestamp,
            lastOpenedAt: timestamp,
          };

          set((state) => ({
            projects: [
              duplicate,
              ...state.projects,
            ],
          }));

          return duplicate;
        },

        /* --------------------------------
           ARCHIVE AND RESTORE
        -------------------------------- */

        archiveProject: (projectId) => {
          get().updateProject(projectId, {
            status: 'archived',
          });
        },

        restoreProject: (projectId) => {
          const project =
            get().getProject(projectId);

          if (
            !project ||
            project.status !== 'archived'
          ) {
            return;
          }

          get().updateProject(projectId, {
            status: 'draft',
          });
        },

        /* --------------------------------
           ACTIVE PROJECT
        -------------------------------- */

        openProject: (projectId) => {
          const project =
            get().getProject(projectId);

          if (
            !project ||
            project.status === 'archived'
          ) {
            return;
          }

          set((state) => ({
            activeProjectId: projectId,

            projects: state.projects.map(
              (item) =>
                item.id === projectId
                  ? {
                      ...item,

                      lastOpenedAt:
                        currentTimestamp(),
                    }
                  : item
            ),
          }));
        },

        closeProject: () => {
          set({
            activeProjectId: null,
          });
        },

        /* --------------------------------
           CONNECTED STUDIOS
        -------------------------------- */

        enableStudio: (
          projectId,
          studioId
        ) => {
          set((state) => ({
            projects: state.projects.map(
              (project) => {
                if (
                  project.id !== projectId ||
                  project.enabledStudios.includes(
                    studioId
                  )
                ) {
                  return project;
                }

                return {
                  ...project,

                  enabledStudios: [
                    ...project.enabledStudios,
                    studioId,
                  ],

                  updatedAt:
                    currentTimestamp(),
                };
              }
            ),
          }));
        },

        disableStudio: (
          projectId,
          studioId
        ) => {
          set((state) => ({
            projects: state.projects.map(
              (project) => {
                if (
                  project.id !== projectId ||
                  project.primaryStudio === studioId ||
                  !project.enabledStudios.includes(
                    studioId
                  )
                ) {
                  return project;
                }

                return {
                  ...project,

                  enabledStudios:
                    project.enabledStudios.filter(
                      (id) => id !== studioId
                    ),

                  updatedAt:
                    currentTimestamp(),
                };
              }
            ),
          }));
        },

        /* --------------------------------
           PROJECT STATUS
        -------------------------------- */

        setProjectStatus: (
          projectId,
          status
        ) => {
          get().updateProject(projectId, {
            status,
          });
        },

        /* --------------------------------
           PROJECT LOOKUPS
        -------------------------------- */

        getProject: (projectId) =>
          get().projects.find(
            (project) =>
              project.id === projectId
          ),

        getActiveProject: () => {
          const { activeProjectId } = get();

          if (!activeProjectId) {
            return undefined;
          }

          return get().getProject(
            activeProjectId
          );
        },
      }),

      /* ----------------------------------
         PERSISTENT LOCAL STORAGE
      ---------------------------------- */

      {
        name: 'no-beige-studio-projects',

        version: 1,

        partialize: (state) => ({
          projects: state.projects,

          activeProjectId:
            state.activeProjectId,
        }),
      }
    )
  );

/* ========================================
   PROJECT SELECTORS
======================================== */

export function selectActiveProject(
  state: ProjectState
): Project | undefined {
  return state.projects.find(
    (project) =>
      project.id === state.activeProjectId
  );
}

export function selectAvailableProjects(
  state: ProjectState
): Project[] {
  return state.projects.filter(
    (project) =>
      project.status !== 'archived'
  );
}

export function selectArchivedProjects(
  state: ProjectState
): Project[] {
  return state.projects.filter(
    (project) =>
      project.status === 'archived'
  );
}

export function selectRecentProjects(
  state: ProjectState,
  limit = 6
): Project[] {
  return state.projects
    .filter(
      (project) =>
        project.status !== 'archived'
    )
    .sort(
      (a, b) =>
        new Date(b.lastOpenedAt).getTime() -
        new Date(a.lastOpenedAt).getTime()
    )
    .slice(0, limit);
}

export function selectStudioProjects(
  state: ProjectState,
  studioId: StudioId
): Project[] {
  return state.projects.filter(
    (project) =>
      project.status !== 'archived' &&
      project.enabledStudios.includes(
        studioId
      )
  );
}

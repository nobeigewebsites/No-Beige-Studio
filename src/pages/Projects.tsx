
import { useMemo, useState } from 'react';

import {
  Plus,
  Search,
  FolderOpen,
  Archive,
  LayoutGrid,
  List,
  SlidersHorizontal,
  X,
  ArrowUpRight,
  Clock3,
  Layers3,
  RotateCcw,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

import {
  STUDIOS,
  getStudio,
} from '../config/studios';

import {
  useProjectStore,
} from '../store/projectStore';

import type {
  Project,
  ProjectStatus,
  StudioId,
} from '../types/studio';

import ProjectCard from '../components/ProjectCard';
import CreateProjectDialog from '../components/CreateProjectDialog';

import {
  StudioIcon,
} from '../components/StudioCard';

import '../styles/projects.css';

/* ========================================
   NO BEIGE STUDIO
   Project Management Page
======================================== */

type ProjectView =
  | 'grid'
  | 'list';

type ProjectTab =
  | 'active'
  | 'archived'
  | 'all';

type ProjectSort =
  | 'recent'
  | 'updated'
  | 'newest'
  | 'oldest'
  | 'name-asc'
  | 'name-desc';

type StudioFilter =
  | StudioId
  | 'all';

type StatusFilter =
  | ProjectStatus
  | 'all';

const STATUS_LABELS: Record<ProjectStatus, string> = {
  draft: 'Draft',
  'in-progress': 'In Progress',
  completed: 'Completed',
  archived: 'Archived',
};

/* ========================================
   DATE FORMATTING
======================================== */

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Unknown date';
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

/* ========================================
   PROJECT LIST ROW
======================================== */

function ProjectListRow({
  project,
}: {
  project: Project;
}) {
  const navigate = useNavigate();

  const studio = getStudio(
    project.primaryStudio
  );

  const openProject = useProjectStore(
    (state) => state.openProject
  );

  const restoreProject = useProjectStore(
    (state) => state.restoreProject
  );

  const archiveProject = useProjectStore(
    (state) => state.archiveProject
  );

  const duplicateProject = useProjectStore(
    (state) => state.duplicateProject
  );

  const deleteProject = useProjectStore(
    (state) => state.deleteProject
  );

  const isArchived =
    project.status === 'archived';

  function handleOpen() {
    if (isArchived) return;

    openProject(project.id);

    navigate(studio.route);
  }

  function handleDelete() {
    if (
      window.confirm(
        `Permanently delete "${project.name}"? This cannot be undone.`
      )
    ) {
      deleteProject(project.id);
    }
  }

  return (
    <article className="project-list-row">

      <div
        className="project-list-preview"
        style={{
          background: studio.gradient,
          color: studio.colour,
        }}
      >
        <StudioIcon
          studioId={studio.id}
          size={30}
        />
      </div>

      <div className="project-list-information">
        <span
          className="project-list-studio"
          style={{
            color: studio.colour,
          }}
        >
          {studio.shortName}
        </span>

        <h3>{project.name}</h3>

        {project.description && (
          <p>{project.description}</p>
        )}
      </div>

      <div className="project-list-details">

        <span
          className={`project-list-status status-${project.status}`}
        >
          {STATUS_LABELS[project.status]}
        </span>

        <span className="project-list-meta">
          <Clock3
            size={15}
            aria-hidden="true"
          />

          {formatDate(project.updatedAt)}
        </span>

        <span className="project-list-meta">
          <Layers3
            size={15}
            aria-hidden="true"
          />

          {project.enabledStudios.length}{' '}
          {project.enabledStudios.length === 1
            ? 'studio'
            : 'studios'}
        </span>

      </div>

      <div className="project-list-actions">

        {isArchived ? (
          <button
            type="button"
            className="button button-secondary"
            onClick={() =>
              restoreProject(project.id)
            }
          >
            <RotateCcw size={16} />

            Restore
          </button>
        ) : (
          <button
            type="button"
            className="button button-primary"
            onClick={handleOpen}
          >
            Open

            <ArrowUpRight size={16} />
          </button>
        )}

        <select
          className="select project-action-select"
          aria-label={`More actions for ${project.name}`}
          value=""
          onChange={(event) => {
            const action = event.target.value;

            switch (action) {
              case 'duplicate':
                duplicateProject(project.id);
                break;

              case 'archive':
                archiveProject(project.id);
                break;

              case 'delete':
                handleDelete();
                break;
            }
          }}
        >
          <option value="">
            More actions
          </option>

          <option value="duplicate">
            Duplicate
          </option>

          {!isArchived && (
            <option value="archive">
              Archive
            </option>
          )}

          <option value="delete">
            Delete permanently
          </option>
        </select>

      </div>

    </article>
  );
}

/* ========================================
   PROJECT MANAGEMENT PAGE
======================================== */

export default function Projects() {
  const projects = useProjectStore(
    (state) => state.projects
  );

  const [createDialogOpen, setCreateDialogOpen] =
    useState(false);

  const [search, setSearch] =
    useState('');

  const [view, setView] =
    useState<ProjectView>('grid');

  const [tab, setTab] =
    useState<ProjectTab>('active');

  const [studioFilter, setStudioFilter] =
    useState<StudioFilter>('all');

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>('all');

  const [sort, setSort] =
    useState<ProjectSort>('recent');

  const [filtersOpen, setFiltersOpen] =
    useState(false);

  /* --------------------------------------
     PROJECT COUNTS
  -------------------------------------- */

  const activeCount = projects.filter(
    (project) =>
      project.status !== 'archived'
  ).length;

  const archivedCount = projects.filter(
    (project) =>
      project.status === 'archived'
  ).length;

  const completedCount = projects.filter(
    (project) =>
      project.status === 'completed'
  ).length;

  /* --------------------------------------
     SEARCH, FILTER AND SORT
  -------------------------------------- */

  const filteredProjects = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    const results = projects.filter(
      (project) => {
        if (
          tab === 'active' &&
          project.status === 'archived'
        ) {
          return false;
        }

        if (
          tab === 'archived' &&
          project.status !== 'archived'
        ) {
          return false;
        }

        if (
          studioFilter !== 'all' &&
          !project.enabledStudios.includes(
            studioFilter
          )
        ) {
          return false;
        }

        if (
          statusFilter !== 'all' &&
          project.status !== statusFilter
        ) {
          return false;
        }

        if (query) {
          const searchableText = [
            project.name,
            project.description,
            project.category,
            project.designMode,
            STATUS_LABELS[project.status],
            ...project.enabledStudios.map(
              (studioId) =>
                getStudio(studioId).name
            ),
          ]
            .join(' ')
            .toLowerCase();

          if (!searchableText.includes(query)) {
            return false;
          }
        }

        return true;
      }
    );

    return results.sort((a, b) => {
      switch (sort) {
        case 'updated':
          return (
            new Date(b.updatedAt).getTime() -
            new Date(a.updatedAt).getTime()
          );

        case 'newest':
          return (
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
          );

        case 'oldest':
          return (
            new Date(a.createdAt).getTime() -
            new Date(b.createdAt).getTime()
          );

        case 'name-asc':
          return a.name.localeCompare(
            b.name,
            undefined,
            {
              sensitivity: 'base',
              numeric: true,
            }
          );

        case 'name-desc':
          return b.name.localeCompare(
            a.name,
            undefined,
            {
              sensitivity: 'base',
              numeric: true,
            }
          );

        case 'recent':
        default:
          return (
            new Date(b.lastOpenedAt).getTime() -
            new Date(a.lastOpenedAt).getTime()
          );
      }
    });
  }, [
    projects,
    search,
    tab,
    studioFilter,
    statusFilter,
    sort,
  ]);

  const hasActiveFilters =
    search.trim() !== '' ||
    studioFilter !== 'all' ||
    statusFilter !== 'all';

  function clearFilters() {
    setSearch('');
    setStudioFilter('all');
    setStatusFilter('all');
  }

  function changeTab(nextTab: ProjectTab) {
    setTab(nextTab);
    setStatusFilter('all');
  }

  /* --------------------------------------
     PAGE RENDER
  -------------------------------------- */

  return (
    <div className="page-container projects-page">

      {/* Page heading */}

      <header className="page-heading">
        <div>
          <div className="projects-eyebrow">
            YOUR CREATIVE WORKSPACE
          </div>

          <h1 className="page-title">
            My Projects
          </h1>

          <p className="page-description">
            Every idea, every design and every
            extraordinary creation. All in one place.
          </p>
        </div>

        <button
          type="button"
          className="button button-primary"
          onClick={() =>
            setCreateDialogOpen(true)
          }
        >
          <Plus size={20} />

          New Project
        </button>
      </header>

      {/* Project overview */}

      <section
        className="projects-overview"
        aria-label="Project statistics"
      >
        <div className="projects-overview-card">
          <FolderOpen
            size={25}
            style={{
              color: 'var(--cyan)',
            }}
            aria-hidden="true"
          />

          <div>
            <span>Total Projects</span>

            <strong>
              {projects.length}
            </strong>
          </div>
        </div>

        <div className="projects-overview-card">
          <Layers3
            size={25}
            style={{
              color: 'var(--purple)',
            }}
            aria-hidden="true"
          />

          <div>
            <span>Current Projects</span>

            <strong>{activeCount}</strong>
          </div>
        </div>

        <div className="projects-overview-card">
          <FolderOpen
            size={25}
            style={{
              color: 'var(--lime)',
            }}
            aria-hidden="true"
          />

          <div>
            <span>Completed</span>

            <strong>{completedCount}</strong>
          </div>
        </div>

        <div className="projects-overview-card">
          <Archive
            size={25}
            style={{
              color: 'var(--orange)',
            }}
            aria-hidden="true"
          />

          <div>
            <span>Archived</span>

            <strong>{archivedCount}</strong>
          </div>
        </div>
      </section>

      {/* Project controls */}

      <section
        className="projects-controls"
        aria-label="Project search and filters"
      >

        <div className="projects-toolbar">

          <div
            className="projects-tabs"
            role="group"
            aria-label="Project collection"
          >
            <button
              type="button"
              className={`projects-tab ${
                tab === 'active'
                  ? 'projects-tab-active'
                  : ''
              }`}
              aria-pressed={tab === 'active'}
              onClick={() => changeTab('active')}
            >
              Current

              <span>{activeCount}</span>
            </button>

            <button
              type="button"
              className={`projects-tab ${
                tab === 'archived'
                  ? 'projects-tab-active'
                  : ''
              }`}
              aria-pressed={tab === 'archived'}
              onClick={() => changeTab('archived')}
            >
              Archived

              <span>{archivedCount}</span>
            </button>

            <button
              type="button"
              className={`projects-tab ${
                tab === 'all'
                  ? 'projects-tab-active'
                  : ''
              }`}
              aria-pressed={tab === 'all'}
              onClick={() => changeTab('all')}
            >
              All

              <span>{projects.length}</span>
            </button>
          </div>

          <div
            className="projects-view-switch"
            role="group"
            aria-label="Project display mode"
          >
            <button
              type="button"
              className={`icon-button ${
                view === 'grid'
                  ? 'view-switch-active'
                  : ''
              }`}
              aria-label="Grid view"
              aria-pressed={view === 'grid'}
              title="Grid view"
              onClick={() => setView('grid')}
            >
              <LayoutGrid size={20} />
            </button>

            <button
              type="button"
              className={`icon-button ${
                view === 'list'
                  ? 'view-switch-active'
                  : ''
              }`}
              aria-label="List view"
              aria-pressed={view === 'list'}
              title="List view"
              onClick={() => setView('list')}
            >
              <List size={21} />
            </button>
          </div>

        </div>

        {/* Search and sorting */}

        <div className="projects-search-toolbar">

          <div className="projects-search">
            <Search
              size={19}
              aria-hidden="true"
            />

            <input
              type="search"
              aria-label="Search projects"
              placeholder="Search your projects..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

            {search && (
              <button
                type="button"
                className="icon-button"
                aria-label="Clear project search"
                onClick={() => setSearch('')}
              >
                <X size={17} />
              </button>
            )}
          </div>

          <select
            className="select projects-sort"
            aria-label="Sort projects"
            value={sort}
            onChange={(event) =>
              setSort(
                event.target.value as ProjectSort
              )
            }
          >
            <option value="recent">
              Recently opened
            </option>

            <option value="updated">
              Recently edited
            </option>

            <option value="newest">
              Newest first
            </option>

            <option value="oldest">
              Oldest first
            </option>

            <option value="name-asc">
              Name: A–Z
            </option>

            <option value="name-desc">
              Name: Z–A
            </option>
          </select>

          <button
            type="button"
            className={`button button-secondary ${
              filtersOpen
                ? 'filter-button-active'
                : ''
            }`}
            aria-expanded={filtersOpen}
            aria-controls="project-filter-panel"
            onClick={() =>
              setFiltersOpen(!filtersOpen)
            }
          >
            <SlidersHorizontal size={18} />

            Filters

            {(studioFilter !== 'all' ||
              statusFilter !== 'all') && (
              <span className="filter-count">
                {Number(studioFilter !== 'all') +
                  Number(statusFilter !== 'all')}
              </span>
            )}
          </button>

        </div>

        {/* Advanced filters */}

        {filtersOpen && (
          <div
            id="project-filter-panel"
            className="projects-filter-panel"
          >

            <div className="form-group">
              <label
                htmlFor="project-studio-filter"
                className="form-label"
              >
                Design studio
              </label>

              <select
                id="project-studio-filter"
                className="select"
                value={studioFilter}
                onChange={(event) =>
                  setStudioFilter(
                    event.target.value as StudioFilter
                  )
                }
              >
                <option value="all">
                  All studios
                </option>

                {STUDIOS.map((studio) => (
                  <option
                    key={studio.id}
                    value={studio.id}
                  >
                    {studio.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label
                htmlFor="project-status-filter"
                className="form-label"
              >
                Project status
              </label>

              <select
                id="project-status-filter"
                className="select"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as StatusFilter
                  )
                }
              >
                <option value="all">
                  All statuses
                </option>

                {tab !== 'archived' && (
                  <>
                    <option value="draft">
                      Draft
                    </option>

                    <option value="in-progress">
                      In Progress
                    </option>

                    <option value="completed">
                      Completed
                    </option>
                  </>
                )}

                {tab !== 'active' && (
                  <option value="archived">
                    Archived
                  </option>
                )}
              </select>
            </div>

            <button
              type="button"
              className="button button-ghost"
              onClick={clearFilters}
            >
              <RotateCcw size={16} />

              Reset Filters
            </button>

          </div>
        )}

      </section>

      {/* Results information */}

      <div className="projects-results-heading">
        <span
          role="status"
          aria-live="polite"
        >
          {filteredProjects.length}{' '}
          {filteredProjects.length === 1
            ? 'project'
            : 'projects'}

          {hasActiveFilters
            ? ' matching your filters'
            : ''}
        </span>

        {hasActiveFilters && (
          <button
            type="button"
            className="button button-ghost"
            onClick={clearFilters}
          >
            <X size={16} />

            Clear filters
          </button>
        )}
      </div>

      {/* Project results */}

      {filteredProjects.length > 0 ? (
        view === 'grid' ? (
          <div className="projects-card-grid">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
              />
            ))}
          </div>
        ) : (
          <div className="projects-list">
            {filteredProjects.map((project) => (
              <ProjectListRow
                key={project.id}
                project={project}
              />
            ))}
          </div>
        )
      ) : (
        <div className="empty-state projects-empty-state">

          <div className="projects-empty-icon">
            {hasActiveFilters ? (
              <Search
                size={42}
                strokeWidth={1.5}
                aria-hidden="true"
              />
            ) : tab === 'archived' ? (
              <Archive
                size={42}
                strokeWidth={1.5}
                aria-hidden="true"
              />
            ) : (
              <FolderOpen
                size={42}
                strokeWidth={1.5}
                aria-hidden="true"
              />
            )}
          </div>

          <h2>
            {hasActiveFilters
              ? 'No matching projects'
              : tab === 'archived'
                ? 'No archived projects'
                : 'Your next creation awaits'}
          </h2>

          <p>
            {hasActiveFilters
              ? 'Try changing your search or filters.'
              : tab === 'archived'
                ? 'Archived projects will appear here and can be restored whenever you need them.'
                : 'Create a project and start bringing your ideas to life across our five connected studios.'}
          </p>

          {hasActiveFilters ? (
            <button
              type="button"
              className="button button-secondary"
              onClick={clearFilters}
            >
              <RotateCcw size={17} />

              Clear Filters
            </button>
          ) : tab === 'archived' ? (
            <button
              type="button"
              className="button button-secondary"
              onClick={() => changeTab('active')}
            >
              View Current Projects
            </button>
          ) : (
            <button
              type="button"
              className="button button-primary"
              onClick={() =>
                setCreateDialogOpen(true)
              }
            >
              <Plus size={19} />

              Create New Project
            </button>
          )}

        </div>
      )}

      {/* Local storage information */}

      <footer className="projects-storage-note">
        <FolderOpen
          size={17}
          aria-hidden="true"
        />

        <p>
          Your project information is currently stored
          in this browser. Clearing browser data may
          remove locally saved projects.
        </p>
      </footer>

      {/* Project creation dialog */}

      <CreateProjectDialog
        open={createDialogOpen}
        onClose={() =>
          setCreateDialogOpen(false)
        }
      />

    </div>
  );
}


import { useNavigate } from 'react-router-dom';

import {
  ArrowUpRight,
  Clock3,
  Copy,
  Archive,
  ArchiveRestore,
  Trash2,
  Layers3,
} from 'lucide-react';

import type {
  Project,
  ProjectStatus,
} from '../types/studio';

import { getStudio } from '../config/studios';
import { useProjectStore } from '../store/projectStore';
import { StudioIcon } from './StudioCard';

/* ========================================
   NO BEIGE STUDIO
   Reusable Project Card
======================================== */

interface ProjectCardProps {
  project: Project;
  compact?: boolean;
}

const STATUS_LABELS: Record<ProjectStatus, string> = {
  draft: 'Draft',
  'in-progress': 'In Progress',
  completed: 'Completed',
  archived: 'Archived',
};

const STATUS_COLOURS: Record<ProjectStatus, string> = {
  draft: 'var(--text-muted)',
  'in-progress': 'var(--cyan)',
  completed: 'var(--lime)',
  archived: 'var(--orange)',
};

/* ========================================
   FORMATTING UTILITIES
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

function formatBudget(
  budget: number,
  currency: string
): string {
  try {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(budget);
  } catch {
    return `${currency} ${budget.toFixed(2)}`;
  }
}

/* ========================================
   PROJECT CARD
======================================== */

export default function ProjectCard({
  project,
  compact = false,
}: ProjectCardProps) {
  const navigate = useNavigate();

  const openProject = useProjectStore(
    (state) => state.openProject
  );

  const duplicateProject = useProjectStore(
    (state) => state.duplicateProject
  );

  const archiveProject = useProjectStore(
    (state) => state.archiveProject
  );

  const restoreProject = useProjectStore(
    (state) => state.restoreProject
  );

  const deleteProject = useProjectStore(
    (state) => state.deleteProject
  );

  const studio = getStudio(
    project.primaryStudio
  );

  const isArchived =
    project.status === 'archived';

  /* --------------------------------------
     PROJECT ACTIONS
  -------------------------------------- */

  function handleOpen() {
    if (isArchived) {
      return;
    }

    openProject(project.id);

    navigate(studio.route);
  }

  function handleDuplicate() {
    duplicateProject(project.id);
  }

  function handleArchive() {
    archiveProject(project.id);
  }

  function handleRestore() {
    restoreProject(project.id);
  }

  function handleDelete() {
    const confirmed = window.confirm(
      `Permanently delete "${project.name}"? This action cannot be undone.`
    );

    if (confirmed) {
      deleteProject(project.id);
    }
  }

  return (
    <article
      className={[
        'project-card',
        compact ? 'project-card-compact' : '',
        isArchived ? 'project-card-archived' : '',
      ].join(' ')}
      style={{
        borderTop: `3px solid ${studio.colour}`,
      }}
    >
      {/* Project preview */}

      <div
        className="project-card-visual"
        style={{
          background: studio.gradient,
        }}
      >
        {project.thumbnail && (
          <img
            src={project.thumbnail}
            alt=""
            className="project-card-image"
            loading="lazy"
            decoding="async"
            onError={(event) => {
              event.currentTarget.hidden = true;
            }}
          />
        )}

        <div
          className="project-preview-icon"
          style={{
            color: studio.colour,
          }}
        >
          <StudioIcon
            studioId={project.primaryStudio}
            size={42}
          />
        </div>

        <span
          className="project-status"
          style={{
            color: STATUS_COLOURS[project.status],
          }}
        >
          <span
            className="project-status-dot"
            aria-hidden="true"
          />

          {STATUS_LABELS[project.status]}
        </span>
      </div>

      {/* Project information */}

      <div className="project-card-content">
        <span
          className="project-studio-label"
          style={{
            color: studio.colour,
          }}
        >
          {studio.shortName}
        </span>

        <h3 className="project-card-title">
          {project.name}
        </h3>

        {!compact && project.description && (
          <p className="project-card-description">
            {project.description}
          </p>
        )}

        <div className="project-card-metadata">
          <span className="project-metadata-item">
            <Clock3
              size={14}
              aria-hidden="true"
            />

            Edited {formatDate(project.updatedAt)}
          </span>

          <span className="project-metadata-item">
            <Layers3
              size={14}
              aria-hidden="true"
            />

            {project.enabledStudios.length}{' '}
            {project.enabledStudios.length === 1
              ? 'studio'
              : 'studios'}
          </span>
        </div>

        {!compact && project.budget !== null && (
          <div className="project-budget">
            <span>Project budget</span>

            <strong>
              {formatBudget(
                project.budget,
                project.currency
              )}
            </strong>
          </div>
        )}

        {/* Connected studios */}

        {!compact && (
          <div
            className="project-connected-studios"
            aria-label="Connected design studios"
          >
            {project.enabledStudios.map(
              (studioId) => {
                const connectedStudio =
                  getStudio(studioId);

                return (
                  <span
                    key={studioId}
                    className="connected-studio-icon"
                    title={connectedStudio.name}
                    aria-label={connectedStudio.name}
                    style={{
                      color: connectedStudio.colour,
                    }}
                  >
                    <StudioIcon
                      studioId={studioId}
                      size={17}
                    />
                  </span>
                );
              }
            )}
          </div>
        )}

        {/* Project actions */}

        <div className="project-card-actions">
          {isArchived ? (
            <button
              type="button"
              className="button button-secondary"
              onClick={handleRestore}
            >
              <ArchiveRestore size={17} />

              Restore
            </button>
          ) : (
            <button
              type="button"
              className="button button-primary"
              onClick={handleOpen}
            >
              Open Project

              <ArrowUpRight size={17} />
            </button>
          )}

          <div className="project-secondary-actions">
            <button
              type="button"
              className="icon-button"
              title="Duplicate project"
              aria-label={`Duplicate ${project.name}`}
              onClick={handleDuplicate}
            >
              <Copy size={17} />
            </button>

            {!isArchived && (
              <button
                type="button"
                className="icon-button"
                title="Archive project"
                aria-label={`Archive ${project.name}`}
                onClick={handleArchive}
              >
                <Archive size={17} />
              </button>
            )}

            <button
              type="button"
              className="icon-button project-delete-button"
              title="Delete project"
              aria-label={`Delete ${project.name}`}
              onClick={handleDelete}
            >
              <Trash2 size={17} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}


import { useState } from 'react';
import { Link } from 'react-router-dom';

import {
  Building2,
  Sofa,
  Hammer,
  Trees,
  Palette,
  ArrowUpRight,
  Check,
} from 'lucide-react';

import type {
  StudioDefinition,
  StudioId,
} from '../types/studio';

/* ========================================
   NO BEIGE STUDIO
   Reusable Studio Card
======================================== */

const STUDIO_ICONS = {
  architecture: Building2,
  interior: Sofa,
  restoration: Hammer,
  landscape: Trees,
  creator: Palette,
};

interface StudioCardProps {
  studio: StudioDefinition;
  projectCount?: number;
  compact?: boolean;
}

/* ========================================
   STUDIO ICON
======================================== */

export function StudioIcon({
  studioId,
  size = 24,
}: {
  studioId: StudioId;
  size?: number;
}) {
  const Icon = STUDIO_ICONS[studioId];

  return (
    <Icon
      size={size}
      strokeWidth={1.7}
      aria-hidden="true"
    />
  );
}

/* ========================================
   STUDIO CARD
======================================== */

export default function StudioCard({
  studio,
  projectCount = 0,
  compact = false,
}: StudioCardProps) {
  const [imageFailed, setImageFailed] =
    useState(false);

  const imageUrl =
    `${import.meta.env.BASE_URL}${studio.image}`;

  return (
    <article
      className={[
        'studio-card',
        'studio-selection-card',
        compact ? 'studio-card-compact' : '',
      ].join(' ')}
      style={{
        borderTop: `3px solid ${studio.colour}`,
      }}
    >
      <Link
        to={studio.route}
        className="studio-card-link"
        aria-label={`Open ${studio.name}`}
      >
        {/* Studio visual */}

        <div
          className="studio-card-visual"
          style={{
            background: studio.gradient,
          }}
        >
          {!imageFailed && (
            <img
              src={imageUrl}
              alt=""
              loading="lazy"
              decoding="async"
              className="studio-card-image"
              onError={() => setImageFailed(true)}
            />
          )}

          <div className="studio-card-overlay" />

          <div
            className="studio-card-icon"
            style={{
              color: studio.colour,
            }}
          >
            <StudioIcon
              studioId={studio.id}
              size={34}
            />
          </div>

          <span className="studio-free-label">
            <Check
              size={13}
              aria-hidden="true"
            />

            Free to start
          </span>
        </div>

        {/* Studio information */}

        <div className="studio-card-content">
          <div className="studio-card-heading">
            <h2 className="studio-card-title">
              {studio.name}
            </h2>

            <ArrowUpRight
              size={21}
              className="studio-card-arrow"
              style={{
                color: studio.colour,
              }}
              aria-hidden="true"
            />
          </div>

          <p className="studio-card-description">
            {studio.description}
          </p>

          {!compact && (
            <p
              className="studio-card-tagline"
              style={{
                color: studio.colour,
              }}
            >
              {studio.tagline}
            </p>
          )}

          <div className="studio-card-footer">
            <span className="studio-project-count">
              {projectCount === 0
                ? 'No projects yet'
                : `${projectCount} ${
                    projectCount === 1
                      ? 'project'
                      : 'projects'
                  }`}
            </span>

            <span
              className="studio-open-label"
              style={{
                color: studio.colour,
              }}
            >
              Open Studio
              <ArrowUpRight
                size={15}
                aria-hidden="true"
              />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

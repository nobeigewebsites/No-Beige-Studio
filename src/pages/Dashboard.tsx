
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  Plus,
  ArrowRight,
  FolderOpen,
  Layers3,
  Sparkles,
  CheckCircle2,
  LibraryBig,
  Store,
  Palette,
  Globe2,
  Infinity as InfinityIcon,
  Accessibility,
  Clock3,
} from 'lucide-react';

import {
  STUDIOS,
  PLATFORM_PRINCIPLES,
} from '../config/studios';

import {
  useProjectStore,
} from '../store/projectStore';

import StudioCard from '../components/StudioCard';
import ProjectCard from '../components/ProjectCard';
import CreateProjectDialog from '../components/CreateProjectDialog';

import type { StudioId } from '../types/studio';

import '../styles/dashboard.css';

/* ========================================
   NO BEIGE STUDIO
   Main Dashboard
======================================== */

export default function Dashboard() {
  const [createDialogOpen, setCreateDialogOpen] =
    useState(false);

  const projects = useProjectStore(
    (state) => state.projects
  );

  /* --------------------------------------
     PROJECT STATISTICS
  -------------------------------------- */

  const activeProjects = useMemo(
    () =>
      projects.filter(
        (project) =>
          project.status !== 'archived'
      ),
    [projects]
  );

  const completedProjects = useMemo(
    () =>
      projects.filter(
        (project) =>
          project.status === 'completed'
      ),
    [projects]
  );

  const recentProjects = useMemo(
    () =>
      [...activeProjects]
        .sort(
          (a, b) =>
            new Date(b.lastOpenedAt).getTime() -
            new Date(a.lastOpenedAt).getTime()
        )
        .slice(0, 4),
    [activeProjects]
  );

  const connectedStudioCount = useMemo(
    () =>
      new Set(
        activeProjects.flatMap(
          (project) => project.enabledStudios
        )
      ).size,
    [activeProjects]
  );

  function getStudioProjectCount(
    studioId: StudioId
  ): number {
    return activeProjects.filter(
      (project) =>
        project.enabledStudios.includes(
          studioId
        )
    ).length;
  }

  return (
    <div className="page-container dashboard-page">

      {/* ==================================
          HERO
      ================================== */}

      <section className="dashboard-hero">
        <div
          className="dashboard-hero-decoration"
          aria-hidden="true"
        />

        <div className="dashboard-hero-content">

          <div className="dashboard-eyebrow">
            <Sparkles size={16} aria-hidden="true" />

            YOUR WORLD. YOUR DESIGN.
          </div>

          <h1 className="dashboard-hero-title">
            Design Without
            <span> Limits.</span>
          </h1>

          <p className="dashboard-hero-description">
            Imagine it. Design it. Build it.
            Restore it. Reinvent it.
            Five connected creative studios,
            one extraordinary workspace.
          </p>

          <div className="dashboard-hero-actions">
            <button
              type="button"
              className="button button-primary"
              onClick={() =>
                setCreateDialogOpen(true)
              }
            >
              <Plus size={21} />

              Create New Project
            </button>

            <Link
              to="/projects"
              className="button button-secondary"
            >
              <FolderOpen size={19} />

              My Projects
            </Link>
          </div>

          <div className="dashboard-hero-note">
            <CheckCircle2
              size={16}
              aria-hidden="true"
            />

            Free to create. Free to save.
            Upgrade only when you need more.
          </div>

        </div>

        <div
          className="dashboard-hero-art"
          aria-hidden="true"
        >
          <div className="hero-orbit hero-orbit-one" />
          <div className="hero-orbit hero-orbit-two" />
          <div className="hero-orbit hero-orbit-three" />

          <div className="hero-art-centre">
            <Layers3 size={78} strokeWidth={1} />
          </div>

          <div className="hero-floating-icon hero-icon-one">
            <Palette size={30} />
          </div>

          <div className="hero-floating-icon hero-icon-two">
            <Sparkles size={30} />
          </div>

          <div className="hero-floating-icon hero-icon-three">
            <Globe2 size={30} />
          </div>
        </div>
      </section>

      {/* ==================================
          WORKSPACE OVERVIEW
      ================================== */}

      <section
        className="dashboard-statistics"
        aria-label="Workspace overview"
      >

        <article className="dashboard-stat-card">
          <div className="stat-icon stat-icon-cyan">
            <FolderOpen size={24} />
          </div>

          <div className="stat-content">
            <span className="stat-label">
              My Projects
            </span>

            <strong className="stat-value">
              {activeProjects.length}
            </strong>

            <span className="stat-description">
              Your creative workspace
            </span>
          </div>
        </article>

        <article className="dashboard-stat-card">
          <div className="stat-icon stat-icon-purple">
            <Layers3 size={24} />
          </div>

          <div className="stat-content">
            <span className="stat-label">
              Studios Used
            </span>

            <strong className="stat-value">
              {connectedStudioCount}
              <small> / {STUDIOS.length}</small>
            </strong>

            <span className="stat-description">
              Connected creative tools
            </span>
          </div>
        </article>

        <article className="dashboard-stat-card">
          <div className="stat-icon stat-icon-lime">
            <CheckCircle2 size={24} />
          </div>

          <div className="stat-content">
            <span className="stat-label">
              Completed Projects
            </span>

            <strong className="stat-value">
              {completedProjects.length}
            </strong>

            <span className="stat-description">
              Ideas brought to life
            </span>
          </div>
        </article>

        <article className="dashboard-stat-card">
          <div className="stat-icon stat-icon-pink">
            <InfinityIcon size={26} />
          </div>

          <div className="stat-content">
            <span className="stat-label">
              Your Plan
            </span>

            <strong className="stat-value stat-plan">
              Free Forever
            </strong>

            <span className="stat-description">
              Creativity belongs to everyone
            </span>
          </div>
        </article>

      </section>

      {/* ==================================
          FIVE DESIGN STUDIOS
      ================================== */}

      <section className="dashboard-section">

        <div className="section-header">
          <div>
            <div className="dashboard-section-eyebrow">
              EXPLORE YOUR CREATIVITY
            </div>

            <h2 className="section-title">
              Choose Your Studio
            </h2>

            <p className="section-description">
              Five specialist environments.
              One connected design experience.
            </p>
          </div>

          <span className="dashboard-section-note">
            <Layers3 size={16} aria-hidden="true" />

            All studios connected
          </span>
        </div>

        <div className="dashboard-studio-grid">
          {STUDIOS.map((studio) => (
            <StudioCard
              key={studio.id}
              studio={studio}
              projectCount={
                getStudioProjectCount(studio.id)
              }
            />
          ))}
        </div>

      </section>

      {/* ==================================
          RECENT PROJECTS
      ================================== */}

      <section className="dashboard-section">

        <div className="section-header">
          <div>
            <div className="dashboard-section-eyebrow">
              PICK UP WHERE YOU LEFT OFF
            </div>

            <h2 className="section-title">
              Recent Projects
            </h2>

            <p className="section-description">
              Continue creating something extraordinary.
            </p>
          </div>

          <Link
            to="/projects"
            className="button button-ghost"
          >
            View All Projects

            <ArrowRight size={17} />
          </Link>
        </div>

        {recentProjects.length > 0 ? (
          <div className="dashboard-project-grid">
            {recentProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                compact
              />
            ))}
          </div>
        ) : (
          <div className="empty-state dashboard-empty-projects">

            <div className="dashboard-empty-icon">
              <FolderOpen
                size={42}
                strokeWidth={1.4}
                aria-hidden="true"
              />
            </div>

            <h3>Your next masterpiece starts here.</h3>

            <p>
              You haven't created any projects yet.
              Choose a studio and bring your first
              idea to life.
            </p>

            <button
              type="button"
              className="button button-primary"
              onClick={() =>
                setCreateDialogOpen(true)
              }
            >
              <Plus size={19} />

              Create Your First Project
            </button>

          </div>
        )}

      </section>

      {/* ==================================
          DISCOVER AND CREATE
      ================================== */}

      <section className="dashboard-section">

        <div className="section-header">
          <div>
            <div className="dashboard-section-eyebrow">
              MORE POSSIBILITIES
            </div>

            <h2 className="section-title">
              Discover. Create. Share.
            </h2>

            <p className="section-description">
              Explore the resources behind
              your next extraordinary design.
            </p>
          </div>
        </div>

        <div className="dashboard-discovery-grid">

          <Link
            to="/catalogue"
            className="dashboard-discovery-card discovery-cyan"
          >
            <div className="discovery-icon">
              <LibraryBig size={32} />
            </div>

            <div className="discovery-content">
              <h3>The Catalogue</h3>

              <p>
                Explore furniture, materials,
                architectural elements, plants
                and decorative objects from
                different periods and styles.
              </p>

              <span className="discovery-link">
                Explore Catalogue
                <ArrowRight size={17} />
              </span>
            </div>
          </Link>

          <Link
            to="/marketplace"
            className="dashboard-discovery-card discovery-pink"
          >
            <div className="discovery-icon">
              <Store size={32} />
            </div>

            <div className="discovery-content">
              <h3>Creator Marketplace</h3>

              <p>
                A space for original creations,
                independent designers and
                extraordinary design assets.
              </p>

              <span className="discovery-link">
                Discover Marketplace
                <ArrowRight size={17} />
              </span>
            </div>
          </Link>

          <Link
            to="/studio/creator"
            className="dashboard-discovery-card discovery-purple"
          >
            <div className="discovery-icon">
              <Palette size={32} />
            </div>

            <div className="discovery-content">
              <h3>Make It Your Own</h3>

              <p>
                Create original furniture,
                decorative objects and materials
                instead of settling for what
                already exists.
              </p>

              <span className="discovery-link">
                Open Creator Studio
                <ArrowRight size={17} />
              </span>
            </div>
          </Link>

        </div>

      </section>

      {/* ==================================
          PLATFORM PHILOSOPHY
      ================================== */}

      <section className="dashboard-philosophy">

        <div className="philosophy-heading">
          <div className="philosophy-icon">
            <Sparkles size={30} />
          </div>

          <div>
            <h2>
              Creativity shouldn't come with
              unnecessary restrictions.
            </h2>

            <p>
              {PLATFORM_PRINCIPLES.pricingMotto}
            </p>
          </div>
        </div>

        <div className="philosophy-grid">

          <div className="philosophy-item">
            <InfinityIcon
              size={23}
              aria-hidden="true"
            />

            <div>
              <strong>Free Forever</strong>

              <span>
                Meaningful creative tools,
                without a mandatory subscription.
              </span>
            </div>
          </div>

          <div className="philosophy-item">
            <Accessibility
              size={23}
              aria-hidden="true"
            />

            <div>
              <strong>Accessible by Design</strong>

              <span>
                Different abilities, devices
                and ways of creating.
              </span>
            </div>
          </div>

          <div className="philosophy-item">
            <Globe2
              size={23}
              aria-hidden="true"
            />

            <div>
              <strong>Browser First</strong>

              <span>
                Designed to work across devices,
                without complicated installations.
              </span>
            </div>
          </div>

          <div className="philosophy-item">
            <Clock3
              size={23}
              aria-hidden="true"
            />

            <div>
              <strong>Create at Your Pace</strong>

              <span>
                Your projects, your ideas
                and your creative journey.
              </span>
            </div>
          </div>

        </div>

        <Link
          to="/pricing"
          className="button button-secondary"
        >
          Explore Plans & Upgrades

          <ArrowRight size={17} />
        </Link>

      </section>

      {/* ==================================
          DASHBOARD FOOTER
      ================================== */}

      <footer className="dashboard-footer">
        <span>
          © {new Date().getFullYear()} NO BEIGE STUDIO
        </span>

        <span>
          Design Without Limits.
        </span>
      </footer>

      {/* ==================================
          PROJECT CREATION
      ================================== */}

      <CreateProjectDialog
        open={createDialogOpen}
        onClose={() =>
          setCreateDialogOpen(false)
        }
      />

    </div>
  );
}

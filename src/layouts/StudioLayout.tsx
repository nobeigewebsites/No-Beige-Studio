
import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

import {
  LayoutDashboard,
  FolderOpen,
  Building2,
  Sofa,
  Hammer,
  Trees,
  Palette,
  LibraryBig,
  Store,
  Settings,
  CreditCard,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

const mainNavigation = [
  {
    label: 'Dashboard',
    path: '/',
    icon: LayoutDashboard,
    colour: '#00D5E8',
  },
  {
    label: 'My Projects',
    path: '/projects',
    icon: FolderOpen,
    colour: '#FF9B36',
  },
];

const studioNavigation = [
  {
    label: 'Architecture',
    path: '/studio/architecture',
    icon: Building2,
    colour: '#00D5E8',
  },
  {
    label: 'Interior Design',
    path: '/studio/interior',
    icon: Sofa,
    colour: '#FF9B36',
  },
  {
    label: 'Restoration',
    path: '/studio/restoration',
    icon: Hammer,
    colour: '#B18AFF',
  },
  {
    label: 'Landscape',
    path: '/studio/landscape',
    icon: Trees,
    colour: '#A9E52C',
  },
  {
    label: 'Creator Studio',
    path: '/studio/creator',
    icon: Palette,
    colour: '#FF3D8D',
  },
];

const libraryNavigation = [
  {
    label: 'Catalogue',
    path: '/catalogue',
    icon: LibraryBig,
    colour: '#00D5E8',
  },
  {
    label: 'Marketplace',
    path: '/marketplace',
    icon: Store,
    colour: '#FF3D8D',
  },
];

const accountNavigation = [
  {
    label: 'Plans & Upgrades',
    path: '/pricing',
    icon: CreditCard,
    colour: '#A9E52C',
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: Settings,
    colour: '#B18AFF',
  },
];

type NavigationItem = (typeof mainNavigation)[number];

export default function StudioLayout() {
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
        document.getElementById('mobile-menu-toggle')?.focus();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [mobileOpen]);

  const allNavigation = [
    ...mainNavigation,
    ...studioNavigation,
    ...libraryNavigation,
    ...accountNavigation,
  ];

  const currentPage =
    allNavigation.find(
      (item) => item.path === location.pathname
    )?.label ?? 'Studio';

  function renderNavigation(
    items: NavigationItem[],
    heading: string
  ) {
    return (
      <section
        className="navigation-section"
        aria-label={heading}
      >
        <h2 className="navigation-heading">
          {heading}
        </h2>

        {items.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              aria-label={item.label}
              title={item.label}
              className={({ isActive }) =>
                `navigation-link ${
                  isActive ? 'navigation-link-active' : ''
                }`
              }
            >
              <span
                className="navigation-icon"
                style={{ color: item.colour }}
              >
                <Icon size={20} aria-hidden="true" />
              </span>

              <span className="navigation-label">
                {item.label}
              </span>

              <ChevronRight
                size={14}
                className="navigation-arrow"
                aria-hidden="true"
              />
            </NavLink>
          );
        })}
      </section>
    );
  }

  return (
    <div
      className={[
        'studio-shell',
        collapsed ? 'sidebar-collapsed' : '',
        mobileOpen ? 'mobile-menu-open' : '',
      ].join(' ')}
    >
      <a href="#main-content" className="skip-link"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById('main-content')?.focus();
        }}
      >
        Skip to main content
      </a>

      {mobileOpen && (
        <button
          type="button"
          className="mobile-overlay"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        id="studio-sidebar"
        className="studio-sidebar"
        aria-label="Studio sidebar"
      >
        <div className="sidebar-brand">
          <NavLink
            to="/"
            className="brand-link"
            aria-label="NO BEIGE STUDIO home"
          >
            <div className="brand-symbol" aria-hidden="true">
              NB
            </div>

            <div className="brand-text">
              <span className="brand-name">
                NO BEIGE
              </span>

              <span className="brand-studio">
                STUDIO
              </span>
            </div>
          </NavLink>

          <button
            type="button"
            className="mobile-close-button icon-button"
            aria-label="Close navigation"
            onClick={() => {
              setMobileOpen(false);
              document.getElementById('mobile-menu-toggle')?.focus();
            }}
          >
            <X size={22} />
          </button>
        </div>

        <nav
          className="sidebar-navigation"
          aria-label="Main navigation"
        >
          {renderNavigation(
            mainNavigation,
            'WORKSPACE'
          )}

          {renderNavigation(
            studioNavigation,
            'DESIGN STUDIOS'
          )}

          {renderNavigation(
            libraryNavigation,
            'DISCOVER'
          )}

          {renderNavigation(
            accountNavigation,
            'PREFERENCES'
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="membership-card">
            <Sparkles
              size={19}
              className="membership-icon"
              aria-hidden="true"
            />

            <div className="membership-text">
              <strong>Free Forever</strong>
              <span>Creativity without limits.</span>
            </div>
          </div>

          <button
            type="button"
            className="collapse-button"
            aria-label={
              collapsed
                ? 'Expand sidebar'
                : 'Collapse sidebar'
            }
            aria-expanded={!collapsed}
            aria-controls="studio-sidebar"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <PanelLeftOpen size={19} />
            ) : (
              <PanelLeftClose size={19} />
            )}

            <span className="navigation-label">
              Collapse sidebar
            </span>
          </button>
        </div>
      </aside>

      <div className="studio-main">
        <header className="studio-header">
          <div className="header-left">
            <button
              id="mobile-menu-toggle"
              type="button"
              className="mobile-menu-button icon-button"
              aria-label="Open navigation"
              aria-expanded={mobileOpen}
              aria-controls="studio-sidebar"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <Menu size={24} />
            </button>

            <div className="header-breadcrumb">
              <span className="breadcrumb-brand">
                Studio
              </span>

              <ChevronRight
                size={15}
                aria-hidden="true"
              />

              <span className="breadcrumb-current">
                {currentPage}
              </span>
            </div>
          </div>

          <div className="header-right">
            <span className="header-plan">
              <span className="plan-indicator" />
              Free Forever
            </span>

            <NavLink
              to="/settings"
              className="icon-button header-settings"
              aria-label="Open settings"
              title="Settings"
            >
              <Settings size={21} />
            </NavLink>
          </div>
        </header>

        <main
          id="main-content"
          className="studio-content"
          tabIndex={-1}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

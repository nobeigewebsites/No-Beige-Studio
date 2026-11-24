
import { Navigate, Route, Routes } from 'react-router-dom';

import StudioLayout from './layouts/StudioLayout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Catalogue from './pages/Catalogue';
import Marketplace from './pages/Marketplace';
import Settings from './pages/Settings';
import Pricing from './pages/Pricing';

import ArchitectureStudio from './studios/ArchitectureStudio';
import InteriorStudio from './studios/InteriorStudio';
import RestorationStudio from './studios/RestorationStudio';
import LandscapeStudio from './studios/LandscapeStudio';
import CreatorStudio from './studios/CreatorStudio';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<StudioLayout />}>

        {/* Main workspace */}

        <Route index element={<Dashboard />} />
        <Route path="projects" element={<Projects />} />
        <Route path="catalogue" element={<Catalogue />} />
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="settings" element={<Settings />} />
        <Route path="pricing" element={<Pricing />} />

        {/* Connected design studios */}

        <Route
          path="studio/architecture"
          element={<ArchitectureStudio />}
        />

        <Route
          path="studio/interior"
          element={<InteriorStudio />}
        />

        <Route
          path="studio/restoration"
          element={<RestorationStudio />}
        />

        <Route
          path="studio/landscape"
          element={<LandscapeStudio />}
        />

        <Route
          path="studio/creator"
          element={<CreatorStudio />}
        />

        {/* Unknown routes */}

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Route>
    </Routes>
  );
}

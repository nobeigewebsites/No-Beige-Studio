
import { useEffect, type ReactNode } from 'react';

import {
  initialisePreferences,
} from '../store/preferencesStore';

/* ========================================
   NO BEIGE STUDIO
   Application Preferences Provider
======================================== */

interface PreferencesProviderProps {
  children: ReactNode;
}

export default function PreferencesProvider({
  children,
}: PreferencesProviderProps) {
  useEffect(() => {
    const cleanup = initialisePreferences();

    return cleanup;
  }, []);

  return <>{children}</>;
}

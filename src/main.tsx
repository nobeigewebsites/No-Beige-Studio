
import React from 'react';

import ReactDOM from 'react-dom/client';

import {
  HashRouter,
} from 'react-router-dom';

import App from './App';

import PreferencesProvider from './components/PreferencesProvider';

import CatalogueProvider from './components/CatalogueProvider';

import './styles/global.css';

import './styles/components.css';

/* ========================================
   NO BEIGE STUDIO
   Application Entry Point

   Global preferences.
   Universal catalogue.
   Application routing.
   Shared application lifecycle.
======================================== */

const rootElement =
  document.getElementById('root');

if (!rootElement) {
  throw new Error(
    'NO BEIGE STUDIO could not locate the application root.'
  );
}

/* ========================================
   APPLICATION INITIALISATION
======================================== */

const root =
  ReactDOM.createRoot(
    rootElement
  );

root.render(
  <React.StrictMode>

    <PreferencesProvider>

      <CatalogueProvider>

        <HashRouter>

          <App />

        </HashRouter>

      </CatalogueProvider>

    </PreferencesProvider>

  </React.StrictMode>
);

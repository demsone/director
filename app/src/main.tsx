import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';
import './styles.css';
import { AppProvider } from './store';
import { Shell } from './components/Shell';
import DirectorFeedback from './pages/DirectorFeedback';
import DirectorCompare from './pages/DirectorCompare';
import Library, { DARKROOM, DESIGN_STUDIO } from './pages/Library';
import RecordDetail from './pages/RecordDetail';
import CompareLibrary from './pages/CompareLibrary';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Prompts from './pages/Prompts';
import Settings from './pages/Settings';

const router = createBrowserRouter([
  {
    element: <Shell />,
    children: [
      { index: true, element: <Navigate to="/director" replace /> },
      { path: 'director', element: <DirectorFeedback /> },
      { path: 'director/compare', element: <DirectorCompare /> },
      { path: 'darkroom', element: <Library config={DARKROOM} /> },
      { path: 'darkroom/:id', element: <RecordDetail origin={{ backLabel: 'Back to Darkroom', backTo: '/darkroom' }} /> },
      { path: 'design-studio', element: <Library config={DESIGN_STUDIO} /> },
      { path: 'design-studio/:id', element: <RecordDetail origin={{ backLabel: 'Back to Design Studio', backTo: '/design-studio' }} /> },
      { path: 'compare', element: <CompareLibrary /> },
      { path: 'compare/:id', element: <RecordDetail origin={{ backLabel: 'Back to Compare', backTo: '/compare' }} /> },
      { path: 'projects', element: <Projects /> },
      { path: 'projects/:id', element: <ProjectDetail /> },
      {
        path: 'projects/:pid/records/:id',
        element: <RecordDetail origin={{ backLabel: 'Back to project', backTo: (p) => `/projects/${p.pid}?tab=feedback` }} />,
      },
      { path: 'prompts', element: <Prompts /> },
      { path: 'settings', element: <Navigate to="/settings/models" replace /> },
      { path: 'settings/:section', element: <Settings /> },
      { path: '*', element: <Navigate to="/director" replace /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  </StrictMode>,
);
